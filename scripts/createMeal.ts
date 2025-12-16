import { promises as fs } from "fs";
import path from "path";

const API_URL = "https://u4vwiigkih.execute-api.us-east-1.amazonaws.com/meals";
const TOKEN =
  "eyJraWQiOiJuS08yMUNRXC9FNzhjbFhIQjFWMERLTEhsRzlRRG1idHpBeXE5UTIzY2Ywbz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJlNGY4MjQ5OC1mMDgxLTcwMTEtMWYyYy0wODE1N2NmNzkyMzIiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9wQnRlU0JjMVUiLCJjbGllbnRfaWQiOiI3azltOXZtbm82ZjFpaW5qN2VzM2l0a2JuZSIsIm9yaWdpbl9qdGkiOiJmYThlNWI5Ni1mNTA5LTRlMTMtOGJhMC1hZGJhOTQ3MzcyZjciLCJpbnRlcm5hbElkIjoiMzZjeXVKUjVjM2FGWVRQam5Ra1dPNWVGeENlIiwiZXZlbnRfaWQiOiI2YWYwZmZiMC1lMGY0LTQ2OWUtODY1YS0wZmE1MDFiYzA5NWUiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNzY1OTAyMjQzLCJleHAiOjE3NjU5NDU0NDMsImlhdCI6MTc2NTkwMjI0MywianRpIjoiYzY1NTRiMDQtN2IwYy00YzhiLWIwYmYtYTU1NjQ5OTYwZTYxIiwidXNlcm5hbWUiOiJlNGY4MjQ5OC1mMDgxLTcwMTEtMWYyYy0wODE1N2NmNzkyMzIifQ.bMM1oGDaa9Pd8SL_3EupWQp3hALKOZpPvH4LK4gSXQnUgHjf0yJpQzaJePqSxvo2DYTqB0DOuyqpyRwV1ygOJ_A-qb0ToxXfZMNrkRAqELlNCeQKtTT7FvUsZJY7uy2LtMImYK-YtxXfwX5YocmPBdTyelIAlG4avfpyNk-R1ysQwcP3gRJauuXsgZYD1iOMeWEgqAbHYQ8_zWl2shvc_faUp81Ven9xUugsucuR5kMPWc2giimW7sOMhDg5aIGu2myPOHfVvuI4uqK7C6dOfT6tFBlvJnWONwzzg_0BwXbLBQ4BkhPtEFh98kaltzqlXjJt2C0mn-BdsvaQZOnjkA";
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
