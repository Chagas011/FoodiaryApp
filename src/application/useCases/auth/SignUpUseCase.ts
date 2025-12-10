import { Account } from "@/application/entites/Account";
import { Goal } from "@/application/entites/Goal";
import { Profile } from "@/application/entites/Profile";
import { EmailAlreadyInUse } from "@/application/errors/application/EmailAlreadyInUse";
import { GoalCalculator } from "@/application/services/GoalCalculator";
import { AccountRepository } from "@/infra/database/dynamo/repositories/AccountRepository";
import { SignUpUnitOfWork } from "@/infra/database/dynamo/uow/SignUpUnitOfWork";
import { AuthGateway } from "@/infra/gateway/AuthGateway";
import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class SignUpUseCase {
  constructor(
    private readonly authGateway: AuthGateway,
    private readonly accountRepository: AccountRepository,

    private readonly signUpUow: SignUpUnitOfWork,
  ) {}

  async execute({
    account: { email, password },
    profile: {
      activityLevel,
      birthDate,
      gender,
      height,
      name,
      weight,
      goal: goalInfo,
    },
  }: SignUpUseCase.Input): Promise<SignUpUseCase.OutPut> {
    const emailAlreadyExist = await this.accountRepository.findEmail(email);
    if (emailAlreadyExist) {
      throw new EmailAlreadyInUse();
    }

    const account = new Account({ email });
    const profile = new Profile({
      accountId: account.id,
      activityLevel,
      birthDate,
      gender,
      height,
      name,
      weight,
      goal: goalInfo,
    });
    const { calories, carbohydrates, fats, proteins } =
      GoalCalculator.calculate(profile);

    const goal = new Goal({
      accountId: account.id,
      calories,
      carbohydrates,
      fats,
      proteins,
    });
    const { externalId } = await this.authGateway.singnUp({
      email,
      password,
      internalId: account.id,
    });
    try {
      account.externalId = externalId;

      await this.signUpUow.run({
        account,
        goal,
        profile,
      });

      const { accessToken, refreshToken } = await this.authGateway.singnIn({
        email,
        password,
      });

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      await this.authGateway.deleteUser({ externalId });
      throw error;
    }
  }
}

export namespace SignUpUseCase {
  export type Input = {
    account: {
      email: string;
      password: string;
    };

    profile: {
      name: string;
      birthDate: Date;
      gender: Profile.Gender;
      height: number;
      weight: number;
      goal: Profile.Goal;
      activityLevel: Profile.ActivityLevel;
    };
  };

  export type OutPut = {
    accessToken: string;
    refreshToken: string;
  };
}
