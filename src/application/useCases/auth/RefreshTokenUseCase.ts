import { AuthGateway } from "@/infra/gateway/AuthGateway";
import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class RefreshTokenUseCase {
  constructor(private readonly authGateway: AuthGateway) {}

  async execute({
    refreshToken,
  }: RefreshTokenUseCase.Input): Promise<RefreshTokenUseCase.OutPut> {
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await this.authGateway.refreshToken({
        refreshToken,
      });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}

export namespace RefreshTokenUseCase {
  export type Input = {
    refreshToken: string;
  };

  export type OutPut = {
    accessToken: string;
    refreshToken: string;
  };
}
