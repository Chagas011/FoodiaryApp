import { Injectable } from "@/kernel/decorators/Injectable";
import { env } from "./env";

@Injectable()
export class AppConfig {
  readonly auth: AppConfig.Auth;
  readonly db: AppConfig.Database;
  constructor() {
    this.auth = {
      cognito: {
        clientId: env.COGNITO_CLIENT_ID,
        clientSecret: env.COGNITO_CLIENT_SECRET,
        userPoolId: env.COGNITO_POOL_ID,
      },
    };
    this.db = {
      dynamodb: {
        mainTable: env.MAIN_TABLE_NAME,
      },
    };
  }
}

export namespace AppConfig {
  export type Auth = {
    cognito: {
      clientId: string;
      clientSecret: string;
      userPoolId: string;
    };
  };

  export type Database = {
    dynamodb: {
      mainTable: string;
    };
  };
}
