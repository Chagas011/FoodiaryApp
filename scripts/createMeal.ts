import { promises as fs } from "fs";
import path from "path";

const API_URL = "https://u4vwiigkih.execute-api.us-east-1.amazonaws.com/meals";
const TOKEN =
  "eyJraWQiOiJuS08yMUNRXC9FNzhjbFhIQjFWMERLTEhsRzlRRG1idHpBeXE5UTIzY2Ywbz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJlNGY4MjQ5OC1mMDgxLTcwMTEtMWYyYy0wODE1N2NmNzkyMzIiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9wQnRlU0JjMVUiLCJjbGllbnRfaWQiOiI3azltOXZtbm82ZjFpaW5qN2VzM2l0a2JuZSIsIm9yaWdpbl9qdGkiOiJjMmRjMDM4NC01NDgwLTRkMWUtYTZmNy01NjU0OWExYzJlNTgiLCJpbnRlcm5hbElkIjoiMzZjeXVKUjVjM2FGWVRQam5Ra1dPNWVGeENlIiwiZXZlbnRfaWQiOiJiMTNlNjEwNC04M2I3LTRhZjUtYjQ2OC1mODMzYmIxODkzMmUiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNzY1NTUzMDAxLCJleHAiOjE3NjU1OTYyMDEsImlhdCI6MTc2NTU1MzAwMiwianRpIjoiOTBkOTk5NzQtZjY1My00MzA0LTlhNWMtMzUzYzI1ZjEzYzNiIiwidXNlcm5hbWUiOiJlNGY4MjQ5OC1mMDgxLTcwMTEtMWYyYy0wODE1N2NmNzkyMzIifQ.KkuNPHP7C8H-iw4a5X3oiF_29U9qOE1WqMhU9KNFwGaybKJHJPEmWcZ3SBW7tSSBlrM0G-tGyDhXsZHAcZCfMHtz4xS0mt53zyW0A5RSvJt48RlOqNPkirkqGhEAOmKaOhr6yVJZkAn2_VwxtoU9C8kB1HCkR72rEBrPROE1_Rav5MrZMHHiAhTn2URoBfJ07W_K_wBwguqebBwmQS7-YJWQoJR1sm32Q98_cFKExcjNtakN4xCFlmgweTK5ccyQAmbaO88xNi2xkxN5-OMLyumTkUnDA6ZQGzKlK8HpPb_DZ4-6WHQoQM2l-sz_ELKvnwhWVFQYNCkFwWpf2Xooug";

interface IPresignResponse {
  uploadSignature: string;
}

interface IPresignDecoded {
  url: string;
  fields: Record<string, string>;
}

async function readFile(
  filePath: string,
  type: "audio/m4a" | "image/jpeg",
): Promise<{
  data: Buffer;
  size: number;
  type: string;
}> {
  console.log(`🔍 Reading file from disk: ${filePath}`);
  const data = await fs.readFile(filePath);
  return {
    data,
    size: data.length,
    type,
  };
}

async function createMeal(
  fileType: string,
  fileSize: number,
): Promise<IPresignDecoded> {
  console.log(
    `🚀 Requesting presigned POST for ${fileSize} bytes of type ${fileType}`,
  );
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ file: { type: fileType, size: fileSize } }),
  });

  if (!res.ok) {
    throw new Error(
      `Failed to get presigned POST: ${res.status} ${res.statusText}`,
    );
  }

  const json = (await res.json()) as IPresignResponse;
  const decoded = JSON.parse(
    Buffer.from(json.uploadSignature, "base64").toString("utf-8"),
  ) as IPresignDecoded;

  console.log("✅ Received presigned POST data");
  return decoded;
}

function buildFormData(
  fields: Record<string, string>,
  fileData: Buffer,
  filename: string,
  fileType: string,
): FormData {
  console.log(
    `📦 Building FormData with ${Object.keys(fields).length} fields and file ${filename}`,
  );
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    form.append(key, value);
  }
  const blob = new Blob([fileData], { type: fileType });

  form.append("file", blob, filename);
  return form;
}

async function uploadToS3(url: string, form: FormData): Promise<void> {
  console.log(`📤 Uploading to S3 at ${url}`);
  const res = await fetch(url, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `S3 upload failed: ${res.status} ${res.statusText} — ${text}`,
    );
  }

  console.log("🎉 Upload completed successfully");
}

async function uploadFile(
  filePath: string,
  fileType: "audio/m4a" | "image/jpeg",
): Promise<void> {
  try {
    const { data, size, type } = await readFile(filePath, fileType);
    const { url, fields } = await createMeal(type, size);
    const form = buildFormData(fields, data, path.basename(filePath), type);
    await uploadToS3(url, form);
  } catch (err) {
    console.error("❌ Error during uploadFile:", err);
    throw err;
  }
}

uploadFile(path.resolve(__dirname, "assets", "eu.jpeg"), "image/jpeg").catch(
  () => process.exit(1),
);
