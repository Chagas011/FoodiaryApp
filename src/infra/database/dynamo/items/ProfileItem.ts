import { Profile } from "@/application/entites/Profile";

export class ProfileItem {
  static readonly type = "Profile";
  private readonly keys: ProfileItem.Keys;
  constructor(private readonly attr: ProfileItem.Attributes) {
    this.keys = {
      PK: ProfileItem.getPK(this.attr.accountId),
      SK: ProfileItem.getSK(this.attr.accountId),
    };
  }
  toItem(): ProfileItem.ItemTypes {
    return {
      ...this.keys,
      ...this.attr,
      type: ProfileItem.type,
    };
  }

  static fromEntity(profile: Profile) {
    return new ProfileItem({
      ...profile,
      createdAt: profile.createdAt.toISOString(),
      birthDate: profile.createdAt.toISOString(),
    });
  }

  static toEntity(profileItem: ProfileItem.ItemTypes) {
    return new Profile({
      accountId: profileItem.accountId,
      activityLevel: profileItem.activityLevel,
      birthDate: new Date(profileItem.birthDate),
      gender: profileItem.gender,
      height: profileItem.height,
      weight: profileItem.weight,
      name: profileItem.name,
      goal: profileItem.goal,
      createdAt: new Date(profileItem.createdAt),
    });
  }

  static getPK(accountId: string): ProfileItem.Keys["PK"] {
    return `ACCOUNT#${accountId}`;
  }
  static getSK(accountId: string): ProfileItem.Keys["SK"] {
    return `ACCOUNT#${accountId}#PROFILE`;
  }
}

export namespace ProfileItem {
  export type Keys = {
    PK: `ACCOUNT#${string}`;
    SK: `ACCOUNT#${string}#PROFILE`;
  };

  export type Attributes = {
    accountId: string;
    name: string;
    birthDate: string;
    gender: Profile.Gender;
    height: number;
    weight: number;
    goal: Profile.Goal;
    activityLevel: Profile.ActivityLevel;
    createdAt: string;
  };

  export type ItemTypes = Keys &
    Attributes & {
      type: "Profile";
    };
}
