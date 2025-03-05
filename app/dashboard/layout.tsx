import { validateUser } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashbaordLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const session = await validateUser();
    if (!session.user?.isEmailVerified) {
      redirect("/email-verification");
    }
    if (!session.user) redirect("/login");
    return <div>Welcome to collpsy Dashboard</div>
}