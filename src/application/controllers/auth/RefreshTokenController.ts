import { Controller } from "@/application/contracts/Controller";

import { Injectable } from "@/kernel/decorators/Injectable";

import { Schema } from "@/kernel/decorators/Schema";

import { RefreshTokenUseCase } from "@/application/useCases/auth/RefreshTokenUseCase";
import {
  RefreshTokenBody,
  refreshTokenSchema,
} from "./schemas/refreshTokenSchema";

@Injectable()
@Schema(refreshTokenSchema)
export class RefreshTokenController extends Controller<
  "private",
  RefreshTokenController.Response
> {
  constructor(private readonly refreshTokenUseCase: RefreshTokenUseCase) {
    super();
  }
  protected override async handle({
    body,
  }: Controller.Request<"private", RefreshTokenBody>): Promise<
    Controller.Response<RefreshTokenController.Response>
  > {
    const { refreshToken } = body;

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await this.refreshTokenUseCase.execute({
        refreshToken,
      });
    return {
      statusCode: 200,
      body: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    };
  }
}

export namespace RefreshTokenController {
  export type Response = {
    accessToken: string;
    refreshToken: string;
  };
}
