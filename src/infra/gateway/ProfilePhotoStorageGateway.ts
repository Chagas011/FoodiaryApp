import { Injectable } from "@/kernel/decorators/Injectable";
import { AppConfig } from "@/shared/config/AppConfig";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { randomUUID } from "node:crypto";
import { s3Client } from "../clients/s3Client";

@Injectable()
export class ProfilePhotoStorageGateway {
  constructor(private readonly config: AppConfig) {}
  static generateInputFileKey({
    accountId,
  }: ProfilePhotoStorageGateway.GenerateInputFileKey): string {
    const extension = "jpeg";
    const fileName = `${randomUUID()}.${extension}`;

    return `profiles/${accountId}/${fileName}`;
  }

  getFileURL(fileKey: string) {
    const cdn = this.config.cdn.profilesCDN;

    return `https://${cdn}/${fileKey}`;
  }
  async createPOST({
    file,
    filekey,
    accountId,
  }: ProfilePhotoStorageGateway.CreatePOSTParams): Promise<ProfilePhotoStorageGateway.CreatePOSTResult> {
    const bucket = this.config.storage.profilesBucket;
    const contentType = "image/jpeg";

    const { fields, url } = await createPresignedPost(s3Client, {
      Bucket: bucket,
      Key: filekey,
      Expires: 5 * 60,
      Conditions: [
        { bucket },
        ["eq", "$key", filekey],
        ["eq", "$Content-Type", contentType],
        ["content-length-range", file.size, file.size],
      ],

      Fields: {
        "x-amz-meta-accountid": accountId,
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

export namespace ProfilePhotoStorageGateway {
  export type GenerateInputFileKey = {
    accountId: string;
  };

  export type CreatePOSTParams = {
    accountId: string;
    filekey: string;
    file: {
      size: number;
      type: "PICTURE";
    };
  };

  export type CreatePOSTResult = {
    uploadSignature: string;
  };
  export type GetFileMetadataParams = {
    fileKey: string;
  };

  export type GetFileMetadataResult = {
    accountId: string;
    mealId: string;
  };
}
