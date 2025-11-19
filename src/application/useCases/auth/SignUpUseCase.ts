import { Account } from "@/application/entites/Account";
import { AccountRepository } from "@/infra/database/dynamo/repositories/AccountRepository";
import { AuthGateway } from "@/infra/gateway/AuthGateway";
import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class SignUpUseCase {
  constructor(
    private readonly authGateway: AuthGateway,
    private readonly accountRepository: AccountRepository
  ) {}

  async execute({
    email,
    password,
  }: SignUpUseCase.Input): Promise<SignUpUseCase.OutPut> {
    const { externalId } = await this.authGateway.singnUp({
      email,
      password,
    });

    const account = new Account({ externalId, email });
    await this.accountRepository.create(account);

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

export namespace SignUpUseCase {
  export type Input = {
    email: string;
    password: string;
  };

  export type OutPut = {
    accessToken: string;
    refreshToken: string;
  };
}
