import { Meal } from "@/application/entites/Meal";
import { dynamoClient } from "@/infra/clients/dynamoClient";
import { Injectable } from "@/kernel/decorators/Injectable";
import { AppConfig } from "@/shared/config/AppConfig";
import { GetCommand, PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb";
import { MealItem } from "../items/MealItem";

@Injectable()
export class MealRepository {
  constructor(private readonly config: AppConfig) {}

  getPutCommandInput(meal: Meal): PutCommandInput {
    const mealItem = MealItem.fromEntity(meal);
    return {
      TableName: this.config.db.dynamodb.mainTable,
      Item: mealItem.toItem(),
    };
  }

  async create(meal: Meal): Promise<void> {
    const command = new PutCommand(this.getPutCommandInput(meal));

    await dynamoClient.send(command);
  }

  async findById({
    mealId,
    accountId,
  }: MealRepository.FindByIdParams): Promise<Meal | null> {
    const command = new GetCommand({
      TableName: this.config.db.dynamodb.mainTable,
      Key: {
        PK: MealItem.getPK({ accountId, mealId }),
        SK: MealItem.getSK({ accountId, mealId }),
      },
    });
    const { Item: mealItem } = await dynamoClient.send(command);

    if (!mealItem) {
      return null;
    }

    return MealItem.toEntity(mealItem as MealItem.ItemTypes);
  }
}

export namespace MealRepository {
  export type FindByIdParams = {
    mealId: string;
    accountId: string;
  };
}
