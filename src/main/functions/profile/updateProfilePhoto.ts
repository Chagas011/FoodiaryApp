import "reflect-metadata";

import { UpdateProfilePhotoController } from "@/application/controllers/profile/UpdateProfilePhotoController";
import { lambdaHttpAdapter } from "@/main/adapter/lambdaHttpAdapter";

export const handler = lambdaHttpAdapter(UpdateProfilePhotoController);
