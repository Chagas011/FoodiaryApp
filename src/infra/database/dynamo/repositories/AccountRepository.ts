import { Account } from "@/application/entites/Account";
import { dynamoClient } from "@/infra/clients/dynamoClient";
import { Injectable } from "@/kernel/decorators/Injectable";
import { AppConfig } from "@/shared/config/AppConfig";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { AccountItem } from "../items/AccountItem";

@Injectable()
export class AccountRepository {
  constructor(private readonly appConfig: AppConfig) {}

  async findEmail(email: string): Promise<Account | null> {
    const command = new QueryCommand({
      TableName: this.appConfig.db.dynamodb.mainTable,
      IndexName: "GS1",
      Limit: 1,
      KeyConditionExpression: "#GS1PK = :GS1PK AND #GS1SK = :GS1SK",
      ExpressionAttributeNames: {
        "#GS1PK": "GS1PK",
        "#GS1SK": "GS1SK",
      },
      ExpressionAttributeValues: {
        ":GS1PK": AccountItem.getGS1PK(email),
        ":GS1SK": AccountItem.getGS1SK(email),
      },
    });

    const { Items = [] } = await dynamoClient.send(command);
    const account = Items[0] as AccountItem.ItemTypes | undefined;

    if (!account) {
      return null;
    }
    return AccountItem.toEntity(account);
  }

  async create(account: Account): Promise<void> {
    const accountItem = AccountItem.fromEntity(account);

    const command = new PutCommand({
      TableName: this.appConfig.db.dynamodb.mainTable,
      Item: accountItem.toItem(),
    });

    await dynamoClient.send(command);
  }
}
