import { getImagePrompt } from "@/ai/prompts/getImagePrompt";
import { Meal } from "@/application/entites/Meal";
import { Injectable } from "@/kernel/decorators/Injectable";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import z from "zod";
import { MealsFileStorageGateway } from "./MealsFileStorageGateway";

const mealSchema = z.object({
  name: z.string(),
  icon: z.string(),
  foods: z.array(
    z.object({
      name: z.string(),
      quantity: z.string(),
      calories: z.number(),
      carbohydrates: z.number(),
      fats: z.number(),
      proteins: z.number(),
    }),
  ),
});

@Injectable()
export class MealsAIGateway {
  constructor(
    private readonly mealsFileStorageGateway: MealsFileStorageGateway,
  ) {}
  private readonly client = new OpenAI();
  async processMeal({
    meal,
  }: MealsAIGateway.MealInput): Promise<MealsAIGateway.ProcessMealResult> {
    if (meal.inputType === Meal.Input.PICTURE) {
      const imageUrl = this.mealsFileStorageGateway.getFileURL(
        meal.inputFileKey,
      );
      const response = await this.client.chat.completions.create({
        model: "gpt-4.1-nano",
        response_format: zodResponseFormat(mealSchema, "meal"),
        messages: [
          {
            role: "system",
            content: getImagePrompt(),
          },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: imageUrl,
                  detail: "high",
                },
              },
              {
                type: "text",
                text: `Meal Date: ${meal.createdAt}`,
              },
            ],
          },
        ],
      });
      const json = response.choices[0].message.content;
      if (!json) {
        throw new Error("Failed processing meal " + meal.id);
      }

      const { success, data, error } = mealSchema.safeParse(JSON.parse(json));

      if (!success) {
        console.log(error);
        throw new Error("Failed processing meal " + meal.id);
      }

      return data;
    }

    return {
      foods: [],
      icon: "",
      name: "",
    };
  }
}

export namespace MealsAIGateway {
  export type MealInput = {
    meal: Meal;
  };
  export type ProcessMealResult = {
    name: string;
    icon: string;
    foods: Meal.Food[];
  };
}
