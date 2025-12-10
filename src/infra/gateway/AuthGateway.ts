import { InvalidRefreshToken } from "@/application/errors/application/InvalidRefreshToken";
import { Injectable } from "@/kernel/decorators/Injectable";
import { AppConfig } from "@/shared/config/AppConfig";
import {
  AdminDeleteUserCommand,
  ConfirmForgotPasswordCommand,
  ForgotPasswordCommand,
  GetTokensFromRefreshTokenCommand,
  InitiateAuthCommand,
  RefreshTokenReuseException,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { createHmac } from "node:crypto";
import { cognitoClient } from "../clients/cognitoClient";

@Injectable()
export class AuthGateway {
  constructor(private readonly appConfig: AppConfig) {}
  async singnUp({
    email,
    password,
    internalId,
  }: AuthGateway.SignUpParams): Promise<AuthGateway.SignUpResult> {
    const command = new SignUpCommand({
      ClientId: this.appConfig.auth.cognito.clientId,
      Username: email,
      Password: password,
      UserAttributes: [
        {
          Name: "custom:internalId",
          Value: internalId,
        },
      ],
      SecretHash: this.getSecretHash(email),
    });

    const { UserSub: externalId } = await cognitoClient.send(command);

    if (!externalId) {
      throw new Error(`Cannot signup user: ${email}`);
    }
    return { externalId };
  }

  async singnIn({
    email,
    password,
  }: AuthGateway.SignInParams): Promise<AuthGateway.SignInResult> {
    const command = new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: this.appConfig.auth.cognito.clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        SECRET_HASH: this.getSecretHash(email),
      },
    });

    const { AuthenticationResult } = await cognitoClient.send(command);

    if (
      !AuthenticationResult?.RefreshToken ||
      !AuthenticationResult.AccessToken
    ) {
      throw new Error(`Cannot authenticate user: ${email}`);
    }

    return {
      accessToken: AuthenticationResult.AccessToken,
      refreshToken: AuthenticationResult.RefreshToken,
    };
  }

  async refreshToken({
    refreshToken,
  }: AuthGateway.RefreshTokenParams): Promise<AuthGateway.RefreshTokenResult> {
    try {
      const command = new GetTokensFromRefreshTokenCommand({
        ClientId: this.appConfig.auth.cognito.clientId,
        RefreshToken: refreshToken,
        ClientSecret: this.appConfig.auth.cognito.clientSecret,
      });

      const { AuthenticationResult } = await cognitoClient.send(command);
      if (
        !AuthenticationResult?.RefreshToken ||
        !AuthenticationResult.AccessToken
      ) {
        throw new Error("Cannot Refresh Autenticate");
      }
      return {
        accessToken: AuthenticationResult?.AccessToken,
        refreshToken: AuthenticationResult?.RefreshToken,
      };
    } catch (error) {
      if (error instanceof RefreshTokenReuseException) {
        throw new InvalidRefreshToken();
      }
      throw error;
    }
  }

  async forgotPassword({
    email,
  }: AuthGateway.ForgotPasswordParams): Promise<void> {
    const command = new ForgotPasswordCommand({
      ClientId: this.appConfig.auth.cognito.clientId,
      Username: email,
      SecretHash: this.getSecretHash(email),
    });

    await cognitoClient.send(command);
  }

  async confirmForgotPassword({
    confirmationCode,
    email,
    password,
  }: AuthGateway.ConfirmForgotPasswordParams): Promise<void> {
    const command = new ConfirmForgotPasswordCommand({
      ClientId: this.appConfig.auth.cognito.clientId,
      Username: email,
      SecretHash: this.getSecretHash(email),
      ConfirmationCode: confirmationCode,
      Password: password,
    });

    await cognitoClient.send(command);
  }

  async deleteUser({ externalId }: AuthGateway.DeleteUserParams) {
    const command = new AdminDeleteUserCommand({
      UserPoolId: this.appConfig.auth.cognito.userPoolId,
      Username: externalId,
    });

    await cognitoClient.send(command);
  }

  private getSecretHash(email: string) {
    const secret = this.appConfig.auth.cognito.clientSecret;
    const clientId = this.appConfig.auth.cognito.clientId;
    return createHmac("SHA256", secret)
      .update(`${email}${clientId}`)
      .digest("base64");
  }
}

export namespace AuthGateway {
  export type SignUpParams = {
    email: string;
    password: string;
    internalId: string;
  };

  export type SignUpResult = {
    externalId: string;
  };

  export type SignInParams = {
    email: string;
    password: string;
  };

  export type SignInResult = {
    accessToken: string;
    refreshToken: string;
  };
  export type RefreshTokenResult = {
    accessToken: string;
    refreshToken: string;
  };

  export type ForgotPasswordParams = {
    email: string;
  };

  export type ConfirmForgotPasswordParams = {
    confirmationCode: string;
    email: string;
    password: string;
  };

  export type DeleteUserParams = {
    externalId: string;
  };
  export type RefreshTokenParams = {
    refreshToken: string;
  };
}
