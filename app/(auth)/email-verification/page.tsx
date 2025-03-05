import { validateUser } from "@/auth";
import { Metadata } from "next";


import { redirect } from "next/navigation";
import EmailVerificationForm from "./emailVerficationForm";

export const metadata: Metadata = {
  title: "RGPH | Email Verification",
  description: "RGPH Email Verification Page",
};

export default async function Page() {
  const { user } = await validateUser();
  if (!user) redirect("/login");
  if (user.isEmailVerified) redirect("/");
  return (
    <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
      <div className="space-y-1 text-center">
        <h1 className="text-3xl font-bold text-primary">Verify Your Email</h1>
        <p className="text-muted-foreground">
          Code has been sent to {user?.email} to be able to continue.
        </p>
      </div>
      <EmailVerificationForm userEmail={user.email} />
    </div>
  );
}