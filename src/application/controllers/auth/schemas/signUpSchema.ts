import { Profile } from "@/application/entites/Profile";
import z from "zod";

export const signUpSchema = z.object({
  account: z.object({
    email: z.email("Invalid Email").min(1, "Email is required"),
    password: z
      .string()
      .min(8, "password should be at least 8 characters long")
      .regex(
        /[A-Z]/,
        "The password should contain at least 1 uppercase character.",
      )
      .regex(
        /[a-z]/,
        "The password must contain at least one lowercase letter.",
      )
      .regex(/[0-9]/, "The password must contain at least one number.")
      .regex(
        /[^A-Za-z0-9]/,
        "The password must contain at least one special character.",
      ),
  }),

  profile: z.object({
    name: z.string().min(1, "Name is required"),
    birthDate: z.coerce.date({
      error: "BirthDate is required",
    }),
    gender: z.enum(Profile.Gender),
    height: z.number().min(1, "height is required"),
    weight: z.number().min(1, "weight is required"),
    goal: z.enum(Profile.Goal),
    activityLevel: z.enum(Profile.ActivityLevel),
  }),
});

export type SignUpBody = z.infer<typeof signUpSchema>;
