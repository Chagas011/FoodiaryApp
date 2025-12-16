import z from "zod";

export const listMealsByDaySchema = z.object({
  date: z.coerce.date({
    error: "date is required",
  }),
});
