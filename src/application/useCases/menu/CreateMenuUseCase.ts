import { Menu } from "@/application/entites/Menu";
import { MenuRepository } from "@/infra/database/dynamo/repositories/MenuRepository";
import { MenuQueueGateway } from "@/infra/gateway/MenuQueueGateway";
import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class CreateMenuUseCase {
  constructor(
    private readonly menuRepository: MenuRepository,
    private readonly menuQueueGateway: MenuQueueGateway,
  ) {}

  async execute({
    accountId,
  }: CreateMenuUseCase.Input): Promise<CreateMenuUseCase.Output> {
    const menu = new Menu({
      accountId,
      status: Menu.Status.QUEUED,
    });
    await this.menuRepository.create(menu);
    await this.menuQueueGateway.publish({
      accountId,
      menuId: menu.id,
    });
    return {
      menuId: menu.id,
    };
  }
}

export namespace CreateMenuUseCase {
  export type Input = {
    accountId: string;
  };

  export type Output = {
    menuId: string;
  };
}
