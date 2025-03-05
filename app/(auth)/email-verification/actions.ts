"use server";

import { compileEmailVerificationTemplate, sendMail } from "@/lib/mailer";
import prismadb from "@/lib/prisma";

import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";

export async function resendVerificationEmailCode(userEmail: string): Promise<{
  error?: string;
  resendMsg?: string;
}> {
  try {
    const currentTime = new Date(); // Current date and time
    const fiveMin = 5 * 60 * 1000; // 5 minutes in milliseconds
    const oneHour = 1 * 60 * 60 * 1000; // 1 hour in milliseconds

    const verification = await prismadb.user.findFirst({
      where: { email: { equals: userEmail, mode: "insensitive" } },
      select: { verificationCodeExpiresAt: true, verificationCode: true },
    });

    // Ensure verification exists
    if (verification?.verificationCodeExpiresAt) {
      const expiresAt = new Date(verification.verificationCodeExpiresAt); // Convert to Date object

      // Check if the current time is greater than the expiration time plus 5 minutes
      if (currentTime.getTime() > expiresAt.getTime() - oneHour + fiveMin) {
        const generateNumber = () => {
          return Math.floor(10000 + Math.random() * 90000); // Generates a number between 10000 and 99999
        };
        const randomNumber = generateNumber().toString();

        await prismadb.user.update({
          where: {
            email: userEmail,
          },
          data: {
            verificationCode: randomNumber,
            verificationCodeExpiresAt: new Date(Date.now() + 60 * 60 * 1000), // Set to 1 hour from now
          },
        });

        await sendMail({
          to: userEmail,
          subject: "Email Verification",
          body: compileEmailVerificationTemplate(randomNumber),
        });

        return { resendMsg: "Verification email code has been resent." };
      } else {
        return {
          error:
            "Wait at least 5 minutes to be able to resend the email verification code.",
        };
      }
    }

    return { error: "Something went wrong." };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(
      "An error occurred while resending the verification email code:",
      error
    );
    return {
      error:
        "An error occurred while resending the verification email code. Please try again.",
    };
  }
}

export async function verifyEmail(
  code: string,
  userEmail: string
): Promise<{ error: string }> {
  try {
    const verification = await prismadb.user.findFirst({
      where: { email: { equals: userEmail, mode: "insensitive" } },
      select: { verificationCode: true, verificationCodeExpiresAt: true },
    });
    if (verification?.verificationCodeExpiresAt) {
      if (verification?.verificationCode === code) {
        if (verification?.verificationCodeExpiresAt > new Date()) {
          await prismadb.user.update({
            where: {
              email: userEmail,
            },
            data: {
              isEmailVerified: true,
              verificationCode: null,
              verificationCodeExpiresAt: null,
            },
          });

          return redirect("/dashboard");
        } else {
          return { error: "Verification code has expired." };
        }
      } else {
        return { error: "Verification code not correct." };
      }
    }
    return { error: "Verification code not found." };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("An error occurred while verifying the email:", error);
    return {
      error: "An error occurred while verifying the email. Please try again.",
    };
  }
}