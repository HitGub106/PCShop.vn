import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AdminLoginForm } from "./AdminLoginForm";

export default async function AdminPage() {
  const session = await auth();

  if (session?.user.role === "admin") {
    redirect("/admin/dashboard/edit");
  }

  return (
    <section className="admin-standalone admin-login-page">
      <AdminLoginForm />
    </section>
  );
}
