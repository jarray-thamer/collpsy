import {z} from "zod"
import { requiredString } from "./shared"

export const signUpSchema = z.object({
    email: requiredString.regex(
        /^[a-zA-Z0-9._%+-]+@(hotmail\.com|gmail\.com)$/, 
        "Email must be a valid @gmail.com or @hotmail.com address"
    ),
    password: requiredString.min(8, 'Password must be at least 8 characters long'),
    confirmPassword: requiredString.min(8, 'Password must be at least 8 characters long'),
    firstName: requiredString.max(8, "Max character limit is 8"),
    lastName: requiredString.max(8, "Max character limit is 8"),
    avatar: z.string().url().optional().or(z.literal('')),
    birthDate: z.date().optional(),
    phoneNumber: z.string()
        .length(8, "Phone number must be exactly 8 digits"), 
    city: z.string().optional(),
    role: z.enum(["STUDENT", "PSY"]),
});

export type SignUpData = z.infer<typeof signUpSchema>;