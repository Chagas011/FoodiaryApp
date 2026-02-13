import KSUID from "ksuid";

export class Menu {
  readonly id: string;
  readonly accountId: string;

  status: Menu.Status;
  attempts: number;

  name: string;
  week: Menu.DayPlan[];

  readonly createdAt: Date;

  constructor(attr: Menu.Attributes) {
    this.id = attr.id ?? KSUID.randomSync().string;
    this.accountId = attr.accountId;

    this.status = attr.status;
    this.attempts = attr.attempts ?? 0;

    this.name = attr.name ?? "";
    this.week = attr.week ?? [];

    this.createdAt = attr.createdAt ?? new Date();
  }
}

export namespace Menu {
  export type Attributes = {
    id?: string;
    accountId: string;
    status: Menu.Status;
    attempts?: number;

    name?: string;
    week?: DayPlan[];

    createdAt?: Date;
    updatedAt?: Date;
  };

  export enum Status {
    UPLOADING = "UPLOADING",
    QUEUED = "QUEUED",
    PROCESSING = "PROCESSING",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED",
  }

  export type DayPlan = {
    day: string;
    meals: Meal[];
    dailyTotal: MacroTotals;
  };

  export type Meal = {
    name: string;
    foods: Food[];
    total: MacroTotals;
  };

  export type Food = {
    food: string;
    quantity: string;
    calories: number;
    protein: number;
    carbohydrates: number;
    fats: number;
  };

  export type MacroTotals = {
    calories: number;
    protein: number;
    carbohydrates: number;
    fats: number;
  };
}
