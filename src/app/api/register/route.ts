import bcrypt from "bcryptjs";
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

import {
  hasFieldErrors,
  normalizeEmail,
  validateRegister,
  type RegisterInput,
} from "../../lib/authValidation";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RegisterInput;
    const errors = validateRegister(body);

    if (hasFieldErrors(errors)) {
      return NextResponse.json(
        {
          ok: false,
          fieldErrors: errors,
          message: "Vui lòng kiểm tra lại thông tin đăng ký.",
        },
        { status: 400 },
      );
    }

    const email = normalizeEmail(body.email);
    const passwordHash = await bcrypt.hash(body.password, 10);

    await sql`
      INSERT INTO users (
        full_name,
        phone,
        address,
        email,
        password
      )
      VALUES (
        ${body.fullName.trim()},
        ${body.phone.trim()},
        ${body.address.trim()},
        ${email},
        ${passwordHash}
      );
    `;

    return NextResponse.json({
      ok: true,
      message: "Đăng ký thành công. Bạn có thể đăng nhập.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";

    if (message.includes("users_email_key")) {
      return NextResponse.json(
        {
          ok: false,
          fieldErrors: {
            email: "Email này đã được đăng ký.",
          },
          message: "Email này đã được đăng ký.",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        ok: false,
        message: "Không thể đăng ký lúc này. Vui lòng thử lại sau.",
      },
      { status: 500 },
    );
  }
}
