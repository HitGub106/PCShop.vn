import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { ChangePasswordForm } from "./ChangePasswordForm";

export const dynamic = "force-dynamic";

export default async function ChangePassPage() {
  const session = await auth();

  if (!session?.user.id) {
    redirect("/login");
  }

  if (session.user.role !== "user") {
    redirect("/");
  }

  return (
    <section className="container auth-page">
      <div className="auth-panel">
        <div className="auth-copy">
          <p>Đổi mật khẩu</p>
          <span>Cập nhật mật khẩu đăng nhập cho tài khoản của bạn.</span>
        </div>

        <ChangePasswordForm />
      </div>
    </section>
  );
}
