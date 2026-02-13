import { Menu } from "@/application/entites/Menu";
import { ResouceNotFound } from "@/application/errors/application/ResourceNotFound";
import { MenuRepository } from "@/infra/database/dynamo/repositories/MenuRepository";
import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class GetMenuByIdUseCase {
  constructor(private readonly menuRepository: MenuRepository) {}
  async execute({
    menuId,
    accountId,
  }: GetMenuByIdUseCase.Input): Promise<GetMenuByIdUseCase.Output> {
    const menu = await this.menuRepository.findById({
      accountId,
      menuId,
    });

    if (!menu) {
      throw new ResouceNotFound();
    }
    return {
      menu,
    };
  }
}

export namespace GetMenuByIdUseCase {
  export type Input = {
    menuId: string;
    accountId: string;
  };

  export type Output = {
    menu: Menu;
  };
}
