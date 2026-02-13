import { Injectable } from "@/kernel/decorators/Injectable";
import { env } from "./env";

@Injectable()
export class AppConfig {
  readonly auth: AppConfig.Auth;
  readonly db: AppConfig.Database;
  readonly storage: AppConfig.Storage;
  readonly cdn: AppConfig.CDN;
  readonly queue: AppConfig.Queue;
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

    this.storage = {
      mealsBucket: env.MEALS_BUCKET,
      profilesBucket: env.PROFILES_BUCKET,
    };
    this.cdn = {
      mealsCDN: env.MEALS_CDN_DOMAIN_NAME,
      profilesCDN: env.PROFILES_CDN_DOMAIN_NAME,
    };
    this.queue = {
      mealsQueue: env.MEALS_QUEUE_URL,
      menusQueue: env.MENUS_QUEUE_URL,
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

  export type Storage = {
    mealsBucket: string;
    profilesBucket: string;
  };

  export type CDN = {
    mealsCDN: string;
    profilesCDN: string;
  };

  export type Queue = {
    mealsQueue: string;
    menusQueue: string;
  };
}
