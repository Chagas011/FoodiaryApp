import { Goal } from "@/application/entites/Goal";
import { dynamoClient } from "@/infra/clients/dynamoClient";
import { Injectable } from "@/kernel/decorators/Injectable";
import { AppConfig } from "@/shared/config/AppConfig";
import {
  GetCommand,
  PutCommand,
  PutCommandInput,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { GoalItem } from "../items/GoalItem";

@Injectable()
export class GoalRepository {
  constructor(private readonly config: AppConfig) {}

  getPutCommandInput(goal: Goal): PutCommandInput {
    const goalItem = GoalItem.fromEntity(goal);
    return {
      TableName: this.config.db.dynamodb.mainTable,
      Item: goalItem.toItem(),
    };
  }

  async create(goal: Goal): Promise<void> {
    const command = new PutCommand(this.getPutCommandInput(goal));

    await dynamoClient.send(command);
  }

  async findByAccountId(accountId: string): Promise<Goal | null> {
    const command = new GetCommand({
      TableName: this.config.db.dynamodb.mainTable,
      Key: {
        PK: GoalItem.getPK(accountId),
        SK: GoalItem.getSK(accountId),
      },
    });
    const { Item: goalItem } = await dynamoClient.send(command);

    if (!goalItem) {
      return null;
    }

    return GoalItem.toEntity(goalItem as GoalItem.ItemTypes);
  }

  async save(goal: Goal) {
    const goalItem = GoalItem.fromEntity(goal).toItem();
    const command = new UpdateCommand({
      TableName: this.config.db.dynamodb.mainTable,
      Key: {
        PK: goalItem.PK,
        SK: goalItem.SK,
      },
      UpdateExpression:
        "SET #calories = :calories, #carbohydrates = :carbohydrates, #proteins = :proteins, #fats = :fats",

      ExpressionAttributeNames: {
        "#calories": "calories",
        "#carbohydrates": "carbohydrates",
        "#proteins": "proteins",
        "#fats": "fats",
      },
      ExpressionAttributeValues: {
        ":calories": goalItem.calories,
        ":carbohydrates": goalItem.carbohydrates,
        ":proteins": goalItem.proteins,
        ":fats": goalItem.fats,
      },

      ReturnValues: "NONE",
    });

    await dynamoClient.send(command);
  }
}
