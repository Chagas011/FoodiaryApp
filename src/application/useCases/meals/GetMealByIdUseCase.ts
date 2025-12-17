import { Meal } from "@/application/entites/Meal";
import { ResouceNotFound } from "@/application/errors/application/ResourceNotFound";
import { MealRepository } from "@/infra/database/dynamo/repositories/MealRepository";
import { MealsFileStorageGateway } from "@/infra/gateway/MealsFileStorageGateway";
import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class GetMealByIdUseCase {
  constructor(
    private readonly mealRepository: MealRepository,
    private readonly mealsFileStorageGateway: MealsFileStorageGateway,
  ) {}
  async execute({
    mealId,
    accountId,
  }: GetMealByIdUseCase.Input): Promise<GetMealByIdUseCase.Output> {
    const meal = await this.mealRepository.findById({
      accountId,
      mealId,
    });

    if (!meal) {
      throw new ResouceNotFound();
    }
    return {
      meal: {
        ...meal,
        inputFileURL: this.mealsFileStorageGateway.getFileURL(
          meal.inputFileKey,
        ),
      },
    };
  }
}

export namespace GetMealByIdUseCase {
  export type Input = {
    mealId: string;
    accountId: string;
  };

  export type Output = {
    meal: {
      id: string;
      status: Meal.Status;
      inputType: Meal.Input;
      inputFileURL: string;
      name: string;
      icon: string;
      foods: Meal.Food[];
      createdAt: Date;
    };
  };
}
