import { AuthGateway } from "@/infra/gateway/AuthGateway";
import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class ConfirmForgotPasswordUseCase {
  constructor(private readonly authGateway: AuthGateway) {}

  async execute({
    email,
    confirmationCode,
    password,
  }: ConfirmForgotPasswordUseCase.Input): Promise<ConfirmForgotPasswordUseCase.OutPut> {
    await this.authGateway.confirmForgotPassword({
      confirmationCode,
      email,
      password,
    });
  }
}

export namespace ConfirmForgotPasswordUseCase {
  export type Input = {
    confirmationCode: string;
    email: string;
    password: string;
  };
  export type OutPut = void;
}
