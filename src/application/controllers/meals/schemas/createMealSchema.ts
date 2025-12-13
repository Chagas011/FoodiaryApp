import z from "zod";

const MAX_FILE_IN_MBS = 10 * 1024 * 1024;
export const createMealSchema = z.object({
  file: z.object({
    type: z.enum(["audio/m4a", "image/jpeg"]),
    size: z
      .number()
      .min(1, "size is required")
      .max(MAX_FILE_IN_MBS, "The file should have up to 10MB"),
  }),
});

export type CreateMealBody = z.infer<typeof createMealSchema>;
