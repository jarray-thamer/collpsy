import { z } from "zod";

export const validationEmailCodeSchema = z.object({
    code: z
      .string()
      .trim()
      .min(5, "Verification code must be at least 5 characters long"),
  });
  
  export type ValidationEmailCodeData = z.infer<typeof validationEmailCodeSchema>;
  