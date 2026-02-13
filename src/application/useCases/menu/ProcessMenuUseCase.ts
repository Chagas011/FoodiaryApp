import { Menu } from "@/application/entites/Menu";
import { ResouceNotFound } from "@/application/errors/application/ResourceNotFound";
import { GetProfileAndGoalQuery } from "@/application/query/GetProfileAndGoalQuery";

import { MenuRepository } from "@/infra/database/dynamo/repositories/MenuRepository";
import { MenuAIGateway } from "@/infra/gateway/MenuAIGateway";

import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class ProcessMenuUseCase {
  constructor(
    private readonly menuRepository: MenuRepository,
    private readonly menuAIGateway: MenuAIGateway,
    private readonly getProfileAndGoalQuery: GetProfileAndGoalQuery,
  ) {}
  async execute({
    menuId,
    accountId,
  }: ProcessMenuUseCase.Input): Promise<ProcessMenuUseCase.Output> {
    const menu = await this.menuRepository.findById({
      accountId,
      menuId,
    });

    if (!menu) {
      throw new ResouceNotFound();
    }

    if (
      menu.status === Menu.Status.FAILED ||
      menu.status === Menu.Status.SUCCESS
    ) {
      return;
    }

    if (menu.status === Menu.Status.PROCESSING) {
      throw new Error(`Meal "${menuId}" is already being Processed`);
    }

    try {
      menu.status = Menu.Status.PROCESSING;
      menu.attempts += 1;
      await this.menuRepository.save(menu);
      const { goal, profile } = await this.getProfileAndGoalQuery.execute({
        accountId,
      });

      // processa com IA - gpt-4.1 nano
      const { week } = await this.menuAIGateway.generateMenu({
        goal,
        profile,
      });
      console.log("Chegou aqui");
      menu.status = Menu.Status.SUCCESS;
      menu.week = week;
      await this.menuRepository.save(menu);
    } catch (error) {
      menu.status =
        menu.attempts >= 2 ? Menu.Status.FAILED : Menu.Status.QUEUED;

      await this.menuRepository.save(menu);
      throw error;
    }
  }
}

export namespace ProcessMenuUseCase {
  export type Input = {
    menuId: string;
    accountId: string;
  };

  export type Output = void;
}
