import { Controller } from "@/application/contracts/Controller";

import { UpdateProfilePhotoUseCase } from "@/application/useCases/profiles/UpdateProfilePhotoUseCase";
import { Injectable } from "@/kernel/decorators/Injectable";
import { Schema } from "@/kernel/decorators/Schema";
import {
  UpdateProfilePhotoBody,
  updateProfilePhotoSchema,
} from "./schema/updateProfilePhotoSchema";

@Injectable()
@Schema(updateProfilePhotoSchema)
export class UpdateProfilePhotoController extends Controller<
  "private",
  UpdateProfilePhotoController.Response
> {
  constructor(
    private readonly updateProfilePhotoUseCase: UpdateProfilePhotoUseCase,
  ) {
    super();
  }

  protected override async handle({
    accountId,
    body,
  }: Controller.Request<"private", UpdateProfilePhotoBody>): Promise<
    Controller.Response<UpdateProfilePhotoController.Response>
  > {
    const { file } = body;

    const { filekey, uploadSignature } =
      await this.updateProfilePhotoUseCase.execute({
        accountId,
        file: {
          size: file.size,
          type: "PICTURE",
        },
      });

    return {
      statusCode: 201,
      body: {
        filekey,
        uploadSignature,
      },
    };
  }
}

export namespace UpdateProfilePhotoController {
  export type Response = {
    filekey: string;
    uploadSignature: string;
  };
}
