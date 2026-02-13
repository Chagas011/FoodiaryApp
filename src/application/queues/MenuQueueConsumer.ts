import { MenuQueueGateway } from "@/infra/gateway/MenuQueueGateway";
import { Injectable } from "@/kernel/decorators/Injectable";
import { IQueueConsumer } from "../contracts/IQueueConsumer";
import { ProcessMenuUseCase } from "../useCases/menu/ProcessMenuUseCase";

@Injectable()
export class MenuQueueConsumer implements IQueueConsumer<MenuQueueGateway.Message> {
  constructor(private readonly processMenuUseCase: ProcessMenuUseCase) {}

  async process({
    accountId,
    menuId,
  }: MenuQueueGateway.Message): Promise<void> {
    await this.processMenuUseCase.execute({
      accountId,
      menuId,
    });
  }
}
