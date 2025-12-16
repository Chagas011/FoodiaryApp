import { Profile } from "@/application/entites/Profile";
import { ResouceNotFound } from "@/application/errors/application/ResourceNotFound";
import { ProfileRepository } from "@/infra/database/dynamo/repositories/ProfileRepository";
import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class UpdateProfileUseCase {
  constructor(private readonly profileRepository: ProfileRepository) {}
  async execute({
    accountId,
    birthDate,
    gender,
    height,
    name,
    weight,
  }: UpdateProfileUseCase.Input): Promise<UpdateProfileUseCase.Output> {
    const profile = await this.profileRepository.findByAccountId(accountId);

    if (!profile) {
      throw new ResouceNotFound();
    }
    profile.name = name;
    profile.birthDate = birthDate;
    profile.gender = gender;
    profile.height = height;
    profile.weight = weight;

    await this.profileRepository.save(profile);
  }
}

export namespace UpdateProfileUseCase {
  export type Input = {
    accountId: string;
    name: string;
    birthDate: Date;
    gender: Profile.Gender;
    height: number;
    weight: number;
  };

  export type Output = void;
}
