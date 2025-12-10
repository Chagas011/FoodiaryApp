import { Profile } from "@/application/entites/Profile";
import { dynamoClient } from "@/infra/clients/dynamoClient";
import { Injectable } from "@/kernel/decorators/Injectable";
import { AppConfig } from "@/shared/config/AppConfig";
import { PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb";
import { ProfileItem } from "../items/ProfileItem";

@Injectable()
export class ProfileRepository {
  constructor(private readonly appConfig: AppConfig) {}

  getPutCommandInput(profile: Profile): PutCommandInput {
    const profileItem = ProfileItem.fromEntity(profile);
    return {
      TableName: this.appConfig.db.dynamodb.mainTable,
      Item: profileItem.toItem(),
    };
  }

  async create(profile: Profile): Promise<void> {
    const command = new PutCommand(this.getPutCommandInput(profile));

    await dynamoClient.send(command);
  }
}
