import { MealsQueueGateway } from "@/infra/gateway/MealsQueueGateway";
import { Injectable } from "@/kernel/decorators/Injectable";
import { IQueueConsumer } from "../contracts/IQueueConsumer";
import { ProcessMealUseCase } from "../useCases/meals/ProcessMealUseCase";

@Injectable()
export class MealsQueueConsumer implements IQueueConsumer<MealsQueueGateway.Message> {
  constructor(private readonly processMealUseCase: ProcessMealUseCase) {}

  async process({
    accountId,
    mealId,
  }: MealsQueueGateway.Message): Promise<void> {
    await this.processMealUseCase.execute({
      accountId,
      mealId,
    });
  }
}
