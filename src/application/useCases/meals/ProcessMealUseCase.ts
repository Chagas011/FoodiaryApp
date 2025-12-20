import { Meal } from "@/application/entites/Meal";
import { ResouceNotFound } from "@/application/errors/application/ResourceNotFound";
import { MealRepository } from "@/infra/database/dynamo/repositories/MealRepository";
import { MealsAIGateway } from "@/infra/gateway/MealsAIGateway";
import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class ProcessMealUseCase {
  constructor(
    private readonly mealRepository: MealRepository,
    private readonly mealsAIGateway: MealsAIGateway,
  ) {}
  async execute({
    mealId,
    accountId,
  }: ProcessMealUseCase.Input): Promise<ProcessMealUseCase.Output> {
    const meal = await this.mealRepository.findById({
      accountId,
      mealId,
    });

    if (!meal) {
      throw new ResouceNotFound();
    }
    if (meal.status === Meal.Status.UPLOADING) {
      throw new Error(`Meal "${mealId}" is still uploading`);
    }

    if (
      meal.status === Meal.Status.FAILED ||
      meal.status === Meal.Status.SUCCESS
    ) {
      return;
    }

    if (meal.status === Meal.Status.PROCESSING) {
      throw new Error(`Meal "${mealId}" is already being Processed`);
    }

    try {
      meal.status = Meal.Status.PROCESSING;
      meal.attempts += 1;
      await this.mealRepository.save(meal);

      // processa com IA - gpt-4.1 nano
      const { name, icon, foods } = await this.mealsAIGateway.processMeal({
        meal,
      });
      meal.status = Meal.Status.SUCCESS;

      meal.name = name;
      meal.icon = icon;
      meal.foods = foods;
      await this.mealRepository.save(meal);
    } catch (error) {
      meal.status =
        meal.attempts >= 2 ? Meal.Status.FAILED : Meal.Status.QUEUED;

      await this.mealRepository.save(meal);
      throw error;
    }
  }
}

export namespace ProcessMealUseCase {
  export type Input = {
    mealId: string;
    accountId: string;
  };

  export type Output = void;
}
