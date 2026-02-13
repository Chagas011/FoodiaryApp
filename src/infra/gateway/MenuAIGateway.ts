import { generateMenuPrompt } from "@/ai/prompts/generateMenuPrompt";
import { Profile } from "@/application/entites/Profile";
import { Injectable } from "@/kernel/decorators/Injectable";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

export const foodSchema = z.object({
  food: z.string(),
  quantity: z.string(),
  calories: z.number(),
  protein: z.number(),
  carbohydrates: z.number(),
  fats: z.number(),
});

export const mealSchema = z.object({
  name: z.string(),
  foods: z.array(foodSchema),
  total: z.object({
    calories: z.number(),
    protein: z.number(),
    carbohydrates: z.number(),
    fats: z.number(),
  }),
});

export const daySchema = z.object({
  day: z.string(),
  meals: z.array(mealSchema),
  dailyTotal: z.object({
    calories: z.number(),
    protein: z.number(),
    carbohydrates: z.number(),
    fats: z.number(),
  }),
});

export const menuSchema = z.object({
  week: z.array(daySchema),
});
export type MenuAIResponse = z.infer<typeof menuSchema>;

@Injectable()
export class MenuAIGateway {
  private readonly client = new OpenAI();

  async generateMenu({
    goal,
    profile,
  }: MenuAIGateway.MenuInput): Promise<MenuAIGateway.MenuResult> {
    const response = await this.client.chat.completions.create({
      model: "gpt-4.1-nano",
      response_format: zodResponseFormat(menuSchema, "menu"),
      messages: [
        {
          role: "system",
          content: generateMenuPrompt({ goal, profile }),
        },
      ],
    });

    const json = response.choices[0].message.content;

    if (!json) {
      throw new Error("Failed processing Menu");
    }

    const { success, data, error } = menuSchema.safeParse(JSON.parse(json));

    if (!success) {
      console.log(error);
      throw new Error("Failed processing Menu");
    }
    return data;
  }
}

export namespace MenuAIGateway {
  export type MenuInput = {
    goal: GoalIA;
    profile: ProfileIA;
  };
  export type GoalIA = {
    calories: number;
    carbohydrates: number;
    proteins: number;
    fats: number;
  };
  export type ProfileIA = {
    name: string;
    birthDate: string;
    gender: Profile.Gender;
    height: number;
    weight: number;
    activityLevel: Profile.ActivityLevel;
    goal: Profile.Goal;
  };

  export type MenuResult = MenuAIResponse;
}
