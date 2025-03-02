import { validateUser } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const { user } = await validateUser();
  if (user?.isEmailVerified && user?.role === "PSY") redirect("/dashboard");
  if (user?.isEmailVerified && user?.role === "STUDENT") redirect("/");

  return (
    
        <div className="flex items-center justify-center w-full h-screen">{children}
       </div>
  
    
  );
};

export default AuthLayout;