import bcrypt from "bcryptjs";
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ ok: false, message: "Không được phép." }, { status: 403 });
  }

  const hashed = await bcrypt.hash("123456", 10);

  await sql`
    INSERT INTO users (full_name, phone, address, email, password, role)
    VALUES ('Admin', '0000000000', 'Hà Nội', 'admin@email.com', ${hashed}, 'admin')
    ON CONFLICT (email) DO NOTHING;
  `;

  return NextResponse.json({
    ok: true,
    message: "Seed admin thành công.",
  });
}