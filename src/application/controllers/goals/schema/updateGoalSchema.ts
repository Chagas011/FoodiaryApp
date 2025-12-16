import z from "zod";

export const updateGoalSchema = z.object({
  calories: z.number().min(1, "Calories is required"),
  carbohydrates: z.number().min(1, "carbohydrates is required"),
  proteins: z.number().min(1, "proteins is required"),
  fats: z.number().min(1, "fats is required"),
});

export type UpdateGoalBody = z.infer<typeof updateGoalSchema>;
