import { ResouceNotFound } from "@/application/errors/application/ResourceNotFound";
import { GoalRepository } from "@/infra/database/dynamo/repositories/GoalRepository";
import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class UpdateGoalUseCase {
  constructor(private readonly goalRepository: GoalRepository) {}

  async execute({
    accountId,
    calories,
    carbohydrates,
    fats,
    proteins,
  }: UpdateGoalUseCase.Input): Promise<UpdateGoalUseCase.Output> {
    const goal = await this.goalRepository.findByAccountId(accountId);

    if (!goal) {
      throw new ResouceNotFound();
    }

    goal.calories = calories;
    goal.carbohydrates = carbohydrates;
    goal.fats = fats;
    goal.proteins = proteins;

    await this.goalRepository.save(goal);
  }
}

export namespace UpdateGoalUseCase {
  export type Input = {
    accountId: string;
    calories: number;
    carbohydrates: number;
    proteins: number;
    fats: number;
  };

  export type Output = void;
}
