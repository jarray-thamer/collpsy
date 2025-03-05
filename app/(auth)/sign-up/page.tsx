import { validateUser } from "@/auth";
import SignUpForm from "./signUpForm";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Page () {
 const {user} = await validateUser();
 if (user?.isEmailVerified) redirect("/");
 if (!user?.isEmailVerified && user) redirect("/email-verification");
    
    return (
      <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
      <div className="space-y-1 text-center">
        <h1 className="text-3xl font-bold text-primary">Sign up to Collpsy</h1>
        <p className="text-muted-foreground">
          A web application to facilitate the Slimen labyth in 2025
        </p>
      </div>
      <div className="space-y-5">
        <SignUpForm />
        <Link href="/login" className="block text-center hover:underline">
          Already have an account? Log in
        </Link>
      </div>
    </div>
    );
}

