import { Profile } from "@/application/entites/Profile";
import { dynamoClient } from "@/infra/clients/dynamoClient";
import { Injectable } from "@/kernel/decorators/Injectable";
import { AppConfig } from "@/shared/config/AppConfig";
import {
  GetCommand,
  PutCommand,
  PutCommandInput,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { ProfileItem } from "../items/ProfileItem";

@Injectable()
export class ProfileRepository {
  constructor(private readonly config: AppConfig) {}

  getPutCommandInput(profile: Profile): PutCommandInput {
    const profileItem = ProfileItem.fromEntity(profile);
    return {
      TableName: this.config.db.dynamodb.mainTable,
      Item: profileItem.toItem(),
    };
  }

  async create(profile: Profile): Promise<void> {
    const command = new PutCommand(this.getPutCommandInput(profile));

    await dynamoClient.send(command);
  }

  async findByAccountId(accountId: string): Promise<Profile | null> {
    const command = new GetCommand({
      TableName: this.config.db.dynamodb.mainTable,
      Key: {
        PK: ProfileItem.getPK(accountId),
        SK: ProfileItem.getSK(accountId),
      },
    });
    const { Item: profileItem } = await dynamoClient.send(command);

    if (!profileItem) {
      return null;
    }

    return ProfileItem.toEntity(profileItem as ProfileItem.ItemTypes);
  }

  async save(profile: Profile) {
    const profileItem = ProfileItem.fromEntity(profile).toItem();
    const command = new UpdateCommand({
      TableName: this.config.db.dynamodb.mainTable,
      Key: {
        PK: profileItem.PK,
        SK: profileItem.SK,
      },
      UpdateExpression:
        "SET #name = :name, #birthDate = :birthDate, #gender = :gender, #weight = :weight, #height = :height",

      ExpressionAttributeNames: {
        "#name": "name",
        "#birthDate": "birthDate",
        "#gender": "gender",
        "#weight": "weight",
        "#height": "height",
      },
      ExpressionAttributeValues: {
        ":name": profileItem.name,
        ":birthDate": profileItem.birthDate,
        ":gender": profileItem.gender,
        ":weight": profileItem.weight,
        ":height": profileItem.height,
      },

      ReturnValues: "NONE",
    });

    await dynamoClient.send(command);
  }

  async updatePhoto({
    accountId,
    photoURL,
  }: ProfileRepository.InputUpdatePhoto) {
    const command = new UpdateCommand({
      TableName: this.config.db.dynamodb.mainTable,

      Key: {
        PK: ProfileItem.getPK(accountId),
        SK: ProfileItem.getSK(accountId),
      },
      UpdateExpression: "SET photoURL = :photoURL",

      ExpressionAttributeNames: {
        "#photoURL": "photoURL",
      },
      ExpressionAttributeValues: {
        ":photoURL": photoURL,
      },

      ReturnValues: "NONE",
    });

    await dynamoClient.send(command);
  }
}

export namespace ProfileRepository {
  export type InputUpdatePhoto = {
    accountId: string;
    photoURL: string;
  };
}
