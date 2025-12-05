import { AuthGateway } from "@/infra/gateway/AuthGateway";
import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class SignInUseCase {
  constructor(private readonly authGateway: AuthGateway) {}

  async execute({
    email,
    password,
  }: SignInUseCase.Input): Promise<SignInUseCase.OutPut> {
    const { accessToken, refreshToken } = await this.authGateway.singnIn({
      email,
      password,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}

export namespace SignInUseCase {
  export type Input = {
    email: string;
    password: string;
  };

  export type OutPut = {
    accessToken: string;
    refreshToken: string;
  };
}
