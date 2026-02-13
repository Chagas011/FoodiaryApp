import "reflect-metadata";

import { CreateMenuController } from "@/application/controllers/accounts/CreateMenuController";
import { lambdaHttpAdapter } from "@/main/adapter/lambdaHttpAdapter";

export const handler = lambdaHttpAdapter(CreateMenuController);
