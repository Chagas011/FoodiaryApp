import z from "zod";

export const confirmForgotPasswordSchema = z.object({
  email: z.email("Invalid Email").min(1, "Email is required"),
  password: z
    .string()
    .min(8, "password should be at least 8 characters long")
    .regex(
      /[A-Z]/,
      "The password should contain at least 1 uppercase character."
    )
    .regex(/[a-z]/, "The password must contain at least one lowercase letter.")
    .regex(/[0-9]/, "The password must contain at least one number.")
    .regex(
      /[^A-Za-z0-9]/,
      "The password must contain at least one special character."
    ),

  confirmationCode: z
    .string()
    .min(6, "confirmation code should be at least 6 characters long"),
});

export type ConfirmForgotPasswordBody = z.infer<
  typeof confirmForgotPasswordSchema
>;
