import { Meal } from "@/application/entites/Meal";

export class MealItem {
  static readonly type = "Meal";
  private readonly keys: MealItem.Keys;
  constructor(private readonly attr: MealItem.Attributes) {
    this.keys = {
      PK: MealItem.getPK({ accountId: attr.accountId, mealId: attr.id }),
      SK: MealItem.getSK({ accountId: attr.accountId, mealId: attr.id }),
      GS1PK: MealItem.getGS1PK({
        accountId: this.attr.accountId,
        createdAt: new Date(this.attr.createdAt),
      }),
      GS1SK: MealItem.getGS1SK(this.attr.id),
    };
  }
  toItem(): MealItem.ItemTypes {
    return {
      ...this.keys,
      ...this.attr,
      type: MealItem.type,
    };
  }

  static fromEntity(meal: Meal) {
    return new MealItem({
      ...meal,
      createdAt: meal.createdAt.toISOString(),
    });
  }

  static toEntity(mealItem: MealItem.ItemTypes) {
    return new Meal({
      id: mealItem.id,
      accountId: mealItem.accountId,
      status: mealItem.status,
      attempts: mealItem.attempts,
      foods: mealItem.foods,
      icon: mealItem.icon,
      inputFileKey: mealItem.inputFileKey,
      inputType: mealItem.inputType,
      name: mealItem.name,
      createdAt: new Date(mealItem.createdAt),
    });
  }

  static getPK({ accountId, mealId }: MealItem.PKParams): MealItem.Keys["PK"] {
    return `ACCOUNT#${accountId}#MEAL#${mealId}`;
  }
  static getSK({ accountId, mealId }: MealItem.SKParams): MealItem.Keys["SK"] {
    return `ACCOUNT#${accountId}#MEAL#${mealId}`;
  }

  static getGS1PK({
    accountId,
    createdAt,
  }: MealItem.GS1PKParams): MealItem.Keys["GS1PK"] {
    const year = createdAt.getFullYear();
    const month = String(createdAt.getMonth() + 1).padStart(2, "0");
    const day = String(createdAt.getDate()).padStart(2, "0");
    return `MEALS#${accountId}#${year}-${month}-${day}`;
  }
  static getGS1SK(mealId: string): MealItem.Keys["GS1SK"] {
    return `MEAL#${mealId}`;
  }
}

export namespace MealItem {
  export type Keys = {
    PK: `ACCOUNT#${string}#MEAL#${string}`;
    SK: `ACCOUNT#${string}#MEAL#${string}`;
    GS1PK: `MEALS#${string}#${string}-${string}-${string}`;
    GS1SK: `MEAL#${string}`;
  };

  export type Attributes = {
    id: string;
    accountId: string;
    status: Meal.Status;
    attempts: number;
    inputType: Meal.Input;
    inputFileKey: string;
    name: string;
    icon: string;
    foods: Meal.Food[];
    createdAt: string;
  };

  export type ItemTypes = Keys &
    Attributes & {
      type: "Meal";
    };

  export type GS1PKParams = {
    accountId: string;
    createdAt: Date;
  };

  export type PKParams = {
    accountId: string;
    mealId: string;
  };

  export type SKParams = {
    accountId: string;
    mealId: string;
  };
}
