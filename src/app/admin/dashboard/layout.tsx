import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AdminSidebar } from "./AdminSidebar";

export default async function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (session?.user.role !== "admin") {
    redirect("/admin");
  }

  return (
    <section className="admin-standalone admin-dashboard">
      <AdminSidebar />
      <main className="admin-main">{children}</main>
    </section>
  );
}
