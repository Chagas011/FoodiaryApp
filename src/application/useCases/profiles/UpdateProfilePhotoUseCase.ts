import { ProfileRepository } from "@/infra/database/dynamo/repositories/ProfileRepository";
import { ProfilePhotoStorageGateway } from "@/infra/gateway/ProfilePhotoStorageGateway";
import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class UpdateProfilePhotoUseCase {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly profilePhotoStorageGateway: ProfilePhotoStorageGateway,
  ) {}

  async execute({
    accountId,
    file,
  }: UpdateProfilePhotoUseCase.Input): Promise<UpdateProfilePhotoUseCase.Output> {
    const filekey = ProfilePhotoStorageGateway.generateInputFileKey({
      accountId,
    });
    const { uploadSignature } =
      await this.profilePhotoStorageGateway.createPOST({
        accountId,
        file,
        filekey,
      });

    await this.profileRepository.updatePhoto({
      accountId,
      photoURL: this.profilePhotoStorageGateway.getFileURL(filekey),
    });
    return {
      filekey,
      uploadSignature,
    };
  }
}

export namespace UpdateProfilePhotoUseCase {
  export type Input = {
    accountId: string;
    file: {
      type: "PICTURE";
      size: number;
    };
  };

  export type Output = {
    filekey: string;
    uploadSignature: string;
  };
}
