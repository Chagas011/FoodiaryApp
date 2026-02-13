import { Menu } from "@/application/entites/Menu";

export class MenuItem {
  static readonly type = "Menu";
  private readonly keys: MenuItem.Keys;

  constructor(private readonly attr: MenuItem.Attributes) {
    this.keys = {
      PK: MenuItem.getPK({ accountId: attr.accountId, menuId: attr.id }),
      SK: MenuItem.getSK({ accountId: attr.accountId, menuId: attr.id }),
      GS1PK: MenuItem.getGS1PK({
        accountId: attr.accountId,
        createdAt: new Date(attr.createdAt),
      }),
      GS1SK: MenuItem.getGS1SK(attr.id),
    };
  }

  toItem(): MenuItem.ItemTypes {
    return {
      ...this.keys,
      ...this.attr,
      type: MenuItem.type,
    };
  }

  static fromEntity(menu: Menu) {
    return new MenuItem({
      ...menu,
      createdAt: menu.createdAt.toISOString(),
    });
  }

  static toEntity(item: MenuItem.ItemTypes) {
    return new Menu({
      id: item.id,
      accountId: item.accountId,
      status: item.status,
      attempts: item.attempts,
      name: item.name,
      week: item.week,
      createdAt: new Date(item.createdAt),
    });
  }

  static getPK({ accountId, menuId }: MenuItem.PKParams) {
    return `ACCOUNT#${accountId}#MENU#${menuId}` as const;
  }

  static getSK({ accountId, menuId }: MenuItem.SKParams) {
    return `ACCOUNT#${accountId}#MENU#${menuId}` as const;
  }

  static getGS1PK({
    accountId,
    createdAt,
  }: MenuItem.GS1PKParams): MenuItem.Keys["GS1PK"] {
    const year = createdAt.getFullYear();
    const month = String(createdAt.getMonth() + 1).padStart(2, "0");
    const day = String(createdAt.getDate()).padStart(2, "0");
    return `MENUS#${accountId}#${year}-${month}-${day}`;
  }

  static getGS1SK(menuId: string) {
    return `MENU#${menuId}` as const;
  }
}
export namespace MenuItem {
  export type Keys = {
    PK: `ACCOUNT#${string}#MENU#${string}`;
    SK: `ACCOUNT#${string}#MENU#${string}`;
    GS1PK: `MENUS#${string}#${string}-${string}`;
    GS1SK: `MENU#${string}`;
  };

  export type Attributes = {
    id: string;
    accountId: string;
    status: Menu.Status;
    attempts: number;
    name: string;
    week: Menu.DayPlan[];
    createdAt: string;
  };

  export type ItemTypes = Keys &
    Attributes & {
      type: "Menu";
    };

  export type PKParams = {
    accountId: string;
    menuId: string;
  };

  export type SKParams = PKParams;

  export type GS1PKParams = {
    accountId: string;
    createdAt: Date;
  };
}
