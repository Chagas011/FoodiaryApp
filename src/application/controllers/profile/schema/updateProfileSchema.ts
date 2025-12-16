import { Profile } from "@/application/entites/Profile";
import z from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  birthDate: z.coerce.date({
    error: "BirthDate is required",
  }),
  gender: z.enum(Profile.Gender),
  height: z.number().min(1, "height is required"),
  weight: z.number().min(1, "weight is required"),
});

export type UpdateProfileBody = z.infer<typeof updateProfileSchema>;
