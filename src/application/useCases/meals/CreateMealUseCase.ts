import { Meal } from "@/application/entites/Meal";
import { MealRepository } from "@/infra/database/dynamo/repositories/MealRepository";
import { MealsFileStorageGateway } from "@/infra/gateway/MealsFileStorageGateway";
import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class CreateMealUseCase {
  constructor(
    private readonly mealRepository: MealRepository,
    private readonly mealsFileStorageGateway: MealsFileStorageGateway,
  ) {}

  async execute({
    accountId,
    file,
  }: CreateMealUseCase.Input): Promise<CreateMealUseCase.Output> {
    const inputFileKey = MealsFileStorageGateway.generateInputFileKey({
      accountId,
      inputType: file.type,
    });

    const meal = new Meal({
      accountId,
      inputFileKey,
      inputType: file.type,
      status: Meal.Status.UPLOADING,
    });

    const [, { uploadSignature }] = await Promise.all([
      this.mealRepository.create(meal),
      this.mealsFileStorageGateway.createPOST({
        file: {
          inputType: file.type,
          key: inputFileKey,
          size: file.size,
        },
        mealId: meal.id,
        accountId: accountId,
      }),
    ]);

    return {
      mealId: meal.id,
      uploadSignature,
    };
  }
}

export namespace CreateMealUseCase {
  export type Input = {
    accountId: string;
    file: {
      type: Meal.Input;
      size: number;
    };
  };

  export type Output = {
    mealId: string;
    uploadSignature: string;
  };
}
