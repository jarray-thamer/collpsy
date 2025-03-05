"use server";

import prismadb from "@/lib/prisma";
import { isRedirectError } from "next/dist/client/components/redirect";
import bcrypt from "bcrypt";
export async function confirmPasswordReset(
  { password, confirmPassword }: { password: string; confirmPassword: string },
  token: string | string[]
): Promise<{
  error?: string;
  msg?: string;
}> {
  const currentTime = new Date(); // Current date and time
  try {
    const user = await prismadb.user.findFirst({
      where: {
        resetPasswordToken: Array.isArray(token) ? token[0] : token,
      },
      select: { id: true, resetPasswordTokenExpiresAt: true },
    });

    if (!user) {
      return { error: "Invalid token." };
    }
    if (
      user &&
      user.resetPasswordTokenExpiresAt &&
      user.resetPasswordTokenExpiresAt.getTime() < currentTime.getTime()
    ) {
      return { error: "Token expired." };
    }

    if (password !== confirmPassword) {
      return { error: "Passwords do not match." };
    }
    await prismadb.user.update({
      where: { id: user.id },
      data: {
        hashedPassword: await bcrypt.hash(password, 10),
        resetPasswordToken: null,
        resetPasswordTokenExpiresAt: null,
      },
    });
    return { msg: "Password reset confirmed." };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("Error confirming password reset:", error);
    return { error: "An error occurred while confirming the password reset." };
  }
}