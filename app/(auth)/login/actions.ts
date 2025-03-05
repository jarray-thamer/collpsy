"use server";

import { lucia } from "@/auth";
import prismadb from "@/lib/prisma";
import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { SignInData, SignInSchema } from "@/validations/signInSchema";

export async function login(
  credentials: SignInData
): Promise<{ error?: string }> {
  try {
    const { email, password } = SignInSchema.parse(credentials);
    const databaseUser = await prismadb.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
    });
    if (!databaseUser) return { error: "Email doesn't exist." };
    const isPasswordValid = await bcrypt.compare(
      password,
      databaseUser.hashedPassword
    );
    if (!isPasswordValid) return { error: "Incorrect password." };
    const session = await lucia.createSession(databaseUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    return redirect("/");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("An error occurred while logging in:", error);
    return { error: "An error occurred while logging in. Please try again." };
  }
}