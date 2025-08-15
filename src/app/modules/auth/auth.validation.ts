import z from "zod";

export const forgotPasswordZodSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordZodSchema = z.object({
  id: z.string(),
  newPassword: z.string(),
});
