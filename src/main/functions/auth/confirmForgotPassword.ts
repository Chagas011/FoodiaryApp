import "reflect-metadata";

import { ConfirmForgotPasswordController } from "@/application/controllers/auth/ConfirmForgotPasswordController";
import { lambdaHttpAdapter } from "@/main/adapter/lambdaHttpAdapter";

export const handler = lambdaHttpAdapter(ConfirmForgotPasswordController);
