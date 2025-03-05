import { z } from "zod";
import { requiredString } from "./shared";

export const forgetPasswordSchema = z.object({
  email: requiredString.regex(
    /^[a-zA-Z0-9._%+-]+@(hotmail\.com|gmail\.com)$/, 
    "Email must be a valid @gmail.com or @hotmail.com address"
),
  });

  export type forgetPasswordData = z.infer<typeof forgetPasswordSchema>
  
  export const resetPasswordSchema = z.object({
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
  });
  
  export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;