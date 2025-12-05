import z from "zod";

export const forgotPasswordSchema = z.object({
  email: z.email("Invalid Email").min(1, "Email is required"),
});

export type ForgotPasswordBody = z.infer<typeof forgotPasswordSchema>;
