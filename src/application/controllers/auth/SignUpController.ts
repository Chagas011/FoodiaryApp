import { Controller } from "@/application/contracts/Controller";

import { Injectable } from "@/kernel/decorators/Injectable";

import { SignUpUseCase } from "@/application/useCases/auth/SignUpUseCase";
import { Schema } from "@/kernel/decorators/Schema";
import { SignUpBody, signUpSchema } from "./schemas/signUpSchema";

@Injectable()
@Schema(signUpSchema)
export class SignUpController extends Controller<SignUpController.Response> {
  constructor(private readonly signUpUseCase: SignUpUseCase) {
    super();
  }
  protected override async handle({
    body,
  }: Controller.Request<SignUpBody>): Promise<
    Controller.Response<SignUpController.Response>
  > {
    const { account } = body;

    const { accessToken, refreshToken, email } =
      await this.signUpUseCase.execute(account);
    return {
      statusCode: 201,
      body: {
        accessToken,
        refreshToken,
        email,
      },
    };
  }
}

export namespace SignUpController {
  export type Response = {
    accessToken: string;
    refreshToken: string;
    email: string;
  };
}
