import { AuthGateway } from "@/infra/gateway/AuthGateway";
import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class ForgotPasswordUseCase {
  constructor(private readonly authGateway: AuthGateway) {}

  async execute({
    email,
  }: ForgotPasswordUseCase.Input): Promise<ForgotPasswordUseCase.OutPut> {
    await this.authGateway.forgotPassword({
      email,
    });
  }
}

export namespace ForgotPasswordUseCase {
  export type Input = {
    email: string;
  };
  export type OutPut = void;
}
