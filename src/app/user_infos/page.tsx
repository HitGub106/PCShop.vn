import { sql } from "@vercel/postgres";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import type { UserInfoInput } from "../lib/authValidation";
import { UserInfoForm } from "./UserInfoForm";

type UserInfoRow = {
  full_name: string | null;
  phone: string | null;
  address: string | null;
  email: string | null;
};

export const dynamic = "force-dynamic";

export default async function UserInfosPage() {
  const session = await auth();

  if (!session?.user.id) {
    redirect("/login");
  }

  const { rows } = await sql<UserInfoRow>`
    SELECT full_name, phone, address, email
    FROM users
    WHERE id = ${session.user.id}
    LIMIT 1;
  `;
  const user = rows[0];

  if (!user) {
    redirect("/login");
  }

  const initialValues: UserInfoInput = {
    fullName: user.full_name ?? "",
    phone: user.phone ?? "",
    address: user.address ?? "",
    email: user.email ?? "",
  };

  return (
    <section className="container auth-page">
      <div className="auth-panel auth-panel--wide">
        <div className="auth-copy">
          <p>Hồ sơ</p>
          <span>Cập nhật thông tin tài khoản và địa chỉ nhận hàng.</span>
        </div>

        <UserInfoForm initialValues={initialValues} />
      </div>
    </section>
  );
}
