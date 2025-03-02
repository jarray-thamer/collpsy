"use server";

import { lucia } from "@/auth";
import prismadb from "@/lib/prisma";
import { signUpSchema, SignUpData } from "@/validations/signUpSchema";
import { generateIdFromEntropySize } from "lucia";
import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { compileEmailVerificationTemplate, sendMail } from "@/lib/mailer";

export async function signUp(
  credentials: SignUpData
): Promise<{ error: string }> {
  try {
    
    const {  email, password, firstName, lastName, avatar, birthDate, phoneNumber, city, role } =
      signUpSchema.parse(credentials);

    const existingUser = await prismadb.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
    });

    if (existingUser) {
      return { error: "Email already exists." };
    }

    const userId = generateIdFromEntropySize(10);
    const hashedPassword = await bcrypt.hash(password, 10);
    const generateNumber = () => {
      return Math.floor(10000 + Math.random() * 90000); // Generates a number between 10000 and 99999
    };

// upload avatar in cloudinary and get the url


    const randomNumber = generateNumber().toString();
    await prismadb.user.create({
      data: {
        id: userId,
        email,
        firstName,
        lastName,
        avatar,
        birthDate,
        phoneNumber,
        city,
        role,
        hashedPassowrd: hashedPassword,
        isEmailVerified: false,
        verificationCodeExpiresAt: new Date(Date.now() + 60 * 60 * 1000), // Expires in 1 hour
        verificationCode: randomNumber,
        
      },
    });

    await sendMail({
      to: email,
      subject: "Email Verification",
      body: compileEmailVerificationTemplate(randomNumber),
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return redirect("/email-verification");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("An error occurred while signing up:", error);
    return { error: "An error occurred while signing up. Please try again." };
  }
}