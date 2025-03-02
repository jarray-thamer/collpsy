import { validateUser } from "@/auth";
import SignUpForm from "./signUpForm";
import { redirect } from "next/navigation";

export default async function Page () {
 const {user} = await validateUser();
 if (user?.isEmailVerified) redirect("/");
 if (!user?.isEmailVerified && user) redirect("/email-verification");
    
    return (
     <div>
        <SignUpForm />
     </div>
    );
}

