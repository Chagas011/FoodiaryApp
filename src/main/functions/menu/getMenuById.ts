import "reflect-metadata";

import { GetMenuByIdController } from "@/application/controllers/accounts/GetMenuController";
import { lambdaHttpAdapter } from "@/main/adapter/lambdaHttpAdapter";

export const handler = lambdaHttpAdapter(GetMenuByIdController);
