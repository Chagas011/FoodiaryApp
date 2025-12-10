import { Goal } from "@/application/entites/Goal";
import { dynamoClient } from "@/infra/clients/dynamoClient";
import { Injectable } from "@/kernel/decorators/Injectable";
import { AppConfig } from "@/shared/config/AppConfig";
import { PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb";
import { GoalItem } from "../items/GoalItem";

@Injectable()
export class GoalRepository {
  constructor(private readonly appConfig: AppConfig) {}

  getPutCommandInput(goal: Goal): PutCommandInput {
    const goalItem = GoalItem.fromEntity(goal);
    return {
      TableName: this.appConfig.db.dynamodb.mainTable,
      Item: goalItem.toItem(),
    };
  }

  async create(goal: Goal): Promise<void> {
    const command = new PutCommand(this.getPutCommandInput(goal));

    await dynamoClient.send(command);
  }
}
