import { dynamoClient } from "@/infra/clients/dynamoClient";
import { MealItem } from "@/infra/database/dynamo/items/MealItem";
import { Injectable } from "@/kernel/decorators/Injectable";
import { AppConfig } from "@/shared/config/AppConfig";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { Meal } from "../entites/Meal";

@Injectable()
export class ListMealsByDayQuery {
  constructor(private readonly config: AppConfig) {}
  async execute({
    accountId,
    date,
  }: ListMealsByDayQuery.Input): Promise<ListMealsByDayQuery.Output> {
    const command = new QueryCommand({
      TableName: this.config.db.dynamodb.mainTable,
      IndexName: "GS1",
      ProjectionExpression: "#GS1PK, #id, #createdAt, #name, #icon, #foods",
      KeyConditionExpression: "#GS1PK = :GS1PK",
      ExpressionAttributeNames: {
        "#GS1PK": "GS1PK",
        "#id": "id",
        "#createdAt": "createdAt",
        "#name": "name",
        "#icon": "icon",
        "#foods": "foods",
      },
      ExpressionAttributeValues: {
        ":GS1PK": MealItem.getGS1PK({
          accountId,
          createdAt: date,
        }),
      },
    });

    const { Items = [] } = await dynamoClient.send(command);
    const items = Items as ListMealsByDayQuery.MealItemType[];
    const meals: ListMealsByDayQuery.Output["meals"] = items.map((item) => ({
      id: item.id,
      createdAt: item.createdAt,
      name: item.name,
      icon: item.icon,
      foods: item.foods,
    }));

    return { meals };
  }
}

export namespace ListMealsByDayQuery {
  export type Input = {
    accountId: string;
    date: Date;
  };

  export type MealItemType = {
    GS1PK: string;
    id: string;
    createdAt: string;
    name: string;
    icon: string;
    foods: Meal.Food[];
  };
  export type Output = {
    meals: {
      id: string;
      createdAt: string;
      name: string;
      icon: string;
      foods: Meal.Food[];
    }[];
  };
}
