import { sql } from "@vercel/postgres";

import { auth } from "@/auth";
import { CartContent } from "./CartContent";

type UserBuyerRow = {
  address: string | null;
  email: string | null;
  full_name: string | null;
  phone: string | null;
};

const emptyBuyerInfo = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  note: "",
};

export default async function CartPage() {
  const session = await auth();
  const initialBuyerInfo = await getInitialBuyerInfo(session?.user.id);

  return <CartContent initialBuyerInfo={initialBuyerInfo} />;
}

async function getInitialBuyerInfo(userId?: string) {
  if (!userId) {
    return emptyBuyerInfo;
  }

  const { rows } = await sql<UserBuyerRow>`
    SELECT full_name, phone, address, email
    FROM users
    WHERE id = ${userId}
    LIMIT 1;
  `;
  const user = rows[0];

  if (!user) {
    return emptyBuyerInfo;
  }

  return {
    fullName: user.full_name ?? "",
    phone: user.phone ?? "",
    email: user.email ?? "",
    address: user.address ?? "",
    note: "",
  };
}
