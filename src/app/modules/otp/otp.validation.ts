import z from "zod";

export const sendOTPZodSchema = z.object({
  email: z.string().email(),
});

export const verifyOTPZodSchema = z.object({
  email: z.string().email(),
  otp: z.string(),
});
