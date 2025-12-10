import { dynamoClient } from "@/infra/clients/dynamoClient";
import { AccountItem } from "@/infra/database/dynamo/items/AccountItem";
import { GoalItem } from "@/infra/database/dynamo/items/GoalItem";
import { ProfileItem } from "@/infra/database/dynamo/items/ProfileItem";
import { Injectable } from "@/kernel/decorators/Injectable";
import { AppConfig } from "@/shared/config/AppConfig";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { Profile } from "../entites/Profile";
import { ResouceNotFound } from "../errors/application/ResourceNotFound";

@Injectable()
export class GetProfileAndGoalQuery {
  constructor(private readonly config: AppConfig) {}
  async execute({
    accountId,
  }: GetProfileAndGoalQuery.Input): Promise<GetProfileAndGoalQuery.OutPut> {
    const command = new QueryCommand({
      TableName: this.config.db.dynamodb.mainTable,
      Limit: 2,
      ProjectionExpression:
        "#PK, #SK, #name, #birthDate, #gender, #height, #weight, #calories, #proteins, #carbohydrates, #fats, #type",
      KeyConditionExpression: "#PK = :PK AND begins_with(#SK, :SK)",
      ExpressionAttributeNames: {
        "#PK": "PK",
        "#SK": "SK",
        "#name": "name",
        "#birthDate": "birthDate",
        "#gender": "gender",
        "#height": "height",
        "#weight": "weight",
        "#calories": "calories",
        "#proteins": "proteins",
        "#carbohydrates": "carbohydrates",
        "#fats": "fats",
        "#type": "type",
      },
      ExpressionAttributeValues: {
        ":PK": AccountItem.getPK(accountId),
        ":SK": `${AccountItem.getPK(accountId)}#`,
      },
    });

    const { Items = [] } = await dynamoClient.send(command);
    const profile = Items.find(
      (item): item is GetProfileAndGoalQuery.ProfileItemType =>
        item.type === ProfileItem.type,
    );
    const goal = Items.find(
      (item): item is GetProfileAndGoalQuery.GoalItemType =>
        item.type === GoalItem.type,
    );

    if (!profile || !goal) {
      throw new ResouceNotFound();
    }

    return {
      profile: {
        birthDate: profile.birthDate,
        gender: profile.gender,
        height: profile.height,
        name: profile.name,
        weight: profile.weight,
      },
      goal: {
        calories: goal.calories,
        carbohydrates: goal.carbohydrates,
        fats: goal.fats,
        proteins: goal.proteins,
      },
    };
  }
}

export namespace GetProfileAndGoalQuery {
  export type Input = {
    accountId: string;
  };

  export type ProfileItemType = {
    name: string;
    birthDate: string;
    gender: Profile.Gender;
    height: number;
    weight: number;
  };

  export type GoalItemType = {
    calories: number;
    carbohydrates: number;
    proteins: number;
    fats: number;
  };

  export type OutPut = {
    profile: {
      name: string;
      birthDate: string;
      gender: Profile.Gender;
      height: number;
      weight: number;
    };
    goal: {
      calories: number;
      carbohydrates: number;
      proteins: number;
      fats: number;
    };
  };
}
