import { Controller } from "@/application/contracts/Controller";

import { Injectable } from "@/kernel/decorators/Injectable";

import { CreateMenuUseCase } from "@/application/useCases/menu/CreateMenuUseCase";

@Injectable()
export class CreateMenuController extends Controller<
  "private",
  CreateMenuController.Response
> {
  constructor(private readonly createMenuUseCase: CreateMenuUseCase) {
    super();
  }
  protected override async handle({
    accountId,
  }: Controller.Request<"private">): Promise<
    Controller.Response<CreateMenuController.Response>
  > {
    const { menuId } = await this.createMenuUseCase.execute({
      accountId,
    });
    return {
      statusCode: 200,
      body: {
        menuId,
      },
    };
  }
}

export namespace CreateMenuController {
  export type Response = {
    menuId: string;
  };
}
