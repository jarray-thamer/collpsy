"use server";

import prismadb from "@/lib/prisma";
import { isRedirectError } from "next/dist/client/components/redirect";
import crypto from "crypto";
import { compileForgetPasswordTemplate, sendMail } from "@/lib/mailer";

export async function forgotPassword({
  email,
}: {
  email: string;
}): Promise<{ error?: string; msg?: string }> {
  try {
    const currentTime = new Date(Date.now()); // Current date and time
    const fiveMin = 5 * 60 * 1000; // 5 minutes in milliseconds
    const oneHour = 1 * 60 * 60 * 1000; // 1 hour in milliseconds
    const resetUser = await prismadb.user.findFirst({
      where: {
        email: { equals: email, mode: "insensitive" },
      },
      select: { resetPasswordTokenExpiresAt: true },
    });
    if (!resetUser) return { error: "Email not found." };
    if (resetUser?.resetPasswordTokenExpiresAt) {
      if (
        resetUser?.resetPasswordTokenExpiresAt &&
        currentTime.getTime() <
          resetUser?.resetPasswordTokenExpiresAt?.getTime() - oneHour + fiveMin
      ) {
        return {
          error:
            "Password reset token has already been sent. wait 5 minutes to be able to reset your password.",
        };
      }
    }
    const resetToken = crypto.randomBytes(20).toString("hex");
    await prismadb.user.update({
      where: { email: email },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordTokenExpiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour
      },
    });

    await sendMail({
      to: email,
      subject: "Password Reset",
      body: compileForgetPasswordTemplate(resetToken),
    });

    return { msg: "Password reset email has been sent." };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("Error sending password reset email:", error);
    return {
      error: "An error occurred while sending the password reset email.",
    };
  }
}