import { Controller } from "@/application/contracts/Controller";

import { Meal } from "@/application/entites/Meal";
import { GetMealByIdUseCase } from "@/application/useCases/meals/GetMealByIdUseCase";
import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class GetMealByIdController extends Controller<
  "private",
  GetMealByIdController.Response
> {
  constructor(private readonly getMealByIdUseCase: GetMealByIdUseCase) {
    super();
  }

  protected override async handle({
    accountId,
    params,
  }: Controller.Request<
    "private",
    Record<string, unknown>,
    GetMealByIdController.Params
  >): Promise<Controller.Response<GetMealByIdController.Response>> {
    const { meal } = await this.getMealByIdUseCase.execute({
      accountId,
      mealId: params.mealId,
    });

    return {
      statusCode: 200,
      body: { meal },
    };
  }
}

export namespace GetMealByIdController {
  export type Params = {
    mealId: string;
  };
  export type Response = {
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
