import { Meal } from "@/application/entites/Meal";
import { dynamoClient } from "@/infra/clients/dynamoClient";
import { Injectable } from "@/kernel/decorators/Injectable";
import { AppConfig } from "@/shared/config/AppConfig";
import { PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb";
import { MealItem } from "../items/MealItem";

@Injectable()
export class MealRepository {
  constructor(private readonly appConfig: AppConfig) {}

  getPutCommandInput(meal: Meal): PutCommandInput {
    const mealItem = MealItem.fromEntity(meal);
    return {
      TableName: this.appConfig.db.dynamodb.mainTable,
      Item: mealItem.toItem(),
    };
  }

  async create(meal: Meal): Promise<void> {
    const command = new PutCommand(this.getPutCommandInput(meal));

    await dynamoClient.send(command);
  }
}
