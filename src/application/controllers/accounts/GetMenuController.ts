import { Controller } from "@/application/contracts/Controller";
import { Menu } from "@/application/entites/Menu";
import { GetMenuByIdUseCase } from "@/application/useCases/menu/GetMenuByIdUseCase";

import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class GetMenuByIdController extends Controller<
  "private",
  GetMenuByIdController.Response
> {
  constructor(private readonly getMenuByIdUseCase: GetMenuByIdUseCase) {
    super();
  }

  protected override async handle({
    accountId,
    params,
  }: Controller.Request<
    "private",
    Record<string, unknown>,
    GetMenuByIdController.Params
  >): Promise<Controller.Response<GetMenuByIdController.Response>> {
    const { menu } = await this.getMenuByIdUseCase.execute({
      accountId,
      menuId: params.menuId,
    });

    return {
      statusCode: 200,
      body: { menu },
    };
  }
}

export namespace GetMenuByIdController {
  export type Params = {
    menuId: string;
  };
  export type Response = {
    menu: Menu;
  };
}
