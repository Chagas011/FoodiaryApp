import z from "zod";

const MAX_FILE_IN_MBS = 10 * 1024 * 1024;
export const updateProfilePhotoSchema = z.object({
  file: z.object({
    type: z.enum(["image/jpeg"]),
    size: z
      .number()
      .min(1, "size is required")
      .max(MAX_FILE_IN_MBS, "The file should have up to 10MB"),
  }),
});

export type UpdateProfilePhotoBody = z.infer<typeof updateProfilePhotoSchema>;
