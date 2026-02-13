import { Menu } from "@/application/entites/Menu";
import { dynamoClient } from "@/infra/clients/dynamoClient";
import { Injectable } from "@/kernel/decorators/Injectable";
import { AppConfig } from "@/shared/config/AppConfig";
import {
  GetCommand,
  PutCommand,
  PutCommandInput,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { MenuItem } from "../items/MenuItem";

@Injectable()
export class MenuRepository {
  constructor(private readonly config: AppConfig) {}

  getPutCommandInput(menu: Menu): PutCommandInput {
    const item = MenuItem.fromEntity(menu);
    return {
      TableName: this.config.db.dynamodb.mainTable,
      Item: item.toItem(),
    };
  }

  async create(menu: Menu): Promise<void> {
    const command = new PutCommand(this.getPutCommandInput(menu));
    await dynamoClient.send(command);
  }

  async findById({
    menuId,
    accountId,
  }: MenuRepository.FindByIdParams): Promise<Menu | null> {
    const command = new GetCommand({
      TableName: this.config.db.dynamodb.mainTable,
      Key: {
        PK: MenuItem.getPK({ accountId, menuId }),
        SK: MenuItem.getSK({ accountId, menuId }),
      },
    });

    const { Item } = await dynamoClient.send(command);
    if (!Item) {
      return null;
    }

    return MenuItem.toEntity(Item as MenuItem.ItemTypes);
  }

  async save(menu: Menu) {
    const item = MenuItem.fromEntity(menu).toItem();

    const command = new UpdateCommand({
      TableName: this.config.db.dynamodb.mainTable,
      Key: {
        PK: item.PK,
        SK: item.SK,
      },
      UpdateExpression: `
        SET #status = :status,
            #attempts = :attempts,
            #name = :name,
            #week = :week
      `,
      ExpressionAttributeNames: {
        "#status": "status",
        "#attempts": "attempts",
        "#name": "name",
        "#week": "week",
      },
      ExpressionAttributeValues: {
        ":status": item.status,
        ":attempts": item.attempts,
        ":name": item.name,
        ":week": item.week,
      },
      ReturnValues: "NONE",
    });

    await dynamoClient.send(command);
  }
}

export namespace MenuRepository {
  export type FindByIdParams = {
    menuId: string;
    accountId: string;
  };
}
