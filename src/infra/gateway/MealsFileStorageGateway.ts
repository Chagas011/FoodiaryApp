import { Meal } from "@/application/entites/Meal";
import { Injectable } from "@/kernel/decorators/Injectable";
import { AppConfig } from "@/shared/config/AppConfig";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { randomUUID } from "node:crypto";
import { s3Client } from "../clients/s3Client";

@Injectable()
export class MealsFileStorageGateway {
  constructor(private readonly config: AppConfig) {}
  static generateInputFileKey({
    accountId,
    inputType,
  }: MealsFileStorageGateway.GenerateInputFileKey): string {
    const extension = inputType === Meal.Input.AUDIO ? "m4a" : "jpeg";
    const fileName = `${randomUUID()}.${extension}`;

    return `${accountId}/${fileName}`;
  }

  async createPOST({
    file,
    mealId,
  }: MealsFileStorageGateway.CreatePOSTParams): Promise<MealsFileStorageGateway.CreatePOSTResult> {
    const bucket = this.config.storage.mealsBucket;
    const contentType =
      file.inputType === Meal.Input.AUDIO ? "audio/m4a" : "image/jpeg";

    const { fields, url } = await createPresignedPost(s3Client, {
      Bucket: bucket,
      Key: file.key,
      Expires: 5 * 60,
      Conditions: [
        { bucket },
        ["eq", "$key", file.key],
        ["eq", "$Content-Type", contentType],
        ["content-length-range", file.size, file.size],
      ],

      Fields: {
        "x-amz-meta-mealid": mealId,
      },
    });

    const uploadSignature = Buffer.from(
      JSON.stringify({
        fields: {
          ...fields,
          "Content-Type": contentType,
        },
        url,
      }),
    ).toString("base64");

    return { uploadSignature };
  }
}

export namespace MealsFileStorageGateway {
  export type GenerateInputFileKey = {
    accountId: string;
    inputType: Meal.Input;
  };

  export type CreatePOSTParams = {
    mealId: string;
    file: {
      key: string;
      size: number;
      inputType: Meal.Input;
    };
  };

  export type CreatePOSTResult = {
    uploadSignature: string;
  };
}
