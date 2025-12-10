import { Goal } from "@/application/entites/Goal";

export class GoalItem {
  static readonly type = "Goal";
  private readonly keys: GoalItem.Keys;
  constructor(private readonly attr: GoalItem.Attributes) {
    this.keys = {
      PK: GoalItem.getPK(this.attr.accountId),
      SK: GoalItem.getSK(this.attr.accountId),
    };
  }
  toItem(): GoalItem.ItemTypes {
    return {
      ...this.keys,
      ...this.attr,
      type: GoalItem.type,
    };
  }

  static fromEntity(goal: Goal) {
    return new GoalItem({
      ...goal,
      createdAt: goal.createdAt.toISOString(),
    });
  }

  static toEntity(goalItem: GoalItem.ItemTypes) {
    return new Goal({
      accountId: goalItem.accountId,
      calories: goalItem.calories,
      carbohydrates: goalItem.carbohydrates,
      fats: goalItem.fats,
      proteins: goalItem.proteins,
      createdAt: new Date(goalItem.createdAt),
    });
  }

  static getPK(accountId: string): GoalItem.Keys["PK"] {
    return `ACCOUNT#${accountId}`;
  }
  static getSK(accountId: string): GoalItem.Keys["SK"] {
    return `ACCOUNT#${accountId}#GOAL`;
  }
}

export namespace GoalItem {
  export type Keys = {
    PK: `ACCOUNT#${string}`;
    SK: `ACCOUNT#${string}#GOAL`;
  };

  export type Attributes = {
    accountId: string;
    calories: number;
    carbohydrates: number;
    proteins: number;
    fats: number;
    createdAt: string;
  };

  export type ItemTypes = Keys &
    Attributes & {
      type: "Goal";
    };
}
