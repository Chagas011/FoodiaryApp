import { Account } from "@/application/entites/Account";

export class AccountItem {
  private readonly type = "Account";
  private readonly keys: AccountItem.Keys;
  constructor(private readonly attr: AccountItem.Attributes) {
    this.keys = {
      PK: AccountItem.getPK(this.attr.id),
      SK: AccountItem.getSK(this.attr.id),
      GS1PK: AccountItem.getGS1PK(this.attr.email),
      GS1SK: AccountItem.getGS1SK(this.attr.email),
    };
  }
  toItem(): AccountItem.ItemTypes {
    return {
      ...this.keys,
      ...this.attr,
      type: this.type,
    };
  }

  static fromEntity(account: Account) {
    return new AccountItem({
      ...account,
      createdAt: account.createdAt.toISOString(),
    });
  }

  static toEntity(accountItem: AccountItem.ItemTypes) {
    return new Account({
      id: accountItem.id,
      email: accountItem.email,
      externalId: accountItem.externalId,
      createdAt: new Date(accountItem.createdAt),
    });
  }

  static getPK(accountId: string): AccountItem.Keys["PK"] {
    return `ACCOUNT#${accountId}`;
  }
  static getSK(accountId: string): AccountItem.Keys["SK"] {
    return `ACCOUNT#${accountId}`;
  }

  static getGS1PK(email: string): AccountItem.Keys["GS1PK"] {
    return `ACCOUNT#${email}`;
  }
  static getGS1SK(email: string): AccountItem.Keys["GS1SK"] {
    return `ACCOUNT#${email}`;
  }
}

export namespace AccountItem {
  export type Keys = {
    PK: `ACCOUNT#${string}`;
    SK: `ACCOUNT#${string}`;
    GS1PK: `ACCOUNT#${string}`;
    GS1SK: `ACCOUNT#${string}`;
  };

  export type Attributes = {
    id: string;
    email: string;
    externalId: string | undefined;
    createdAt: string;
  };

  export type ItemTypes = Keys &
    Attributes & {
      type: "Account";
    };
}
