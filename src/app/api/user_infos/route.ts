import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import {
  hasFieldErrors,
  normalizeEmail,
  validateUserInfo,
  type UserInfoInput,
} from "../../lib/authValidation";

export const dynamic = "force-dynamic";

export async function PUT(request: Request) {
  const session = await auth();

  if (!session?.user.id) {
    return NextResponse.json(
      { ok: false, message: "Vui lòng đăng nhập để cập nhật hồ sơ." },
      { status: 401 },
    );
  }

  try {
    const rawBody = (await request.json()) as Partial<UserInfoInput>;
    const body: UserInfoInput = {
      fullName: String(rawBody.fullName ?? ""),
      phone: String(rawBody.phone ?? ""),
      address: String(rawBody.address ?? ""),
      email: String(rawBody.email ?? ""),
    };
    const errors = validateUserInfo(body);

    if (hasFieldErrors(errors)) {
      return NextResponse.json(
        {
          ok: false,
          fieldErrors: errors,
          message: "Vui lòng kiểm tra lại thông tin hồ sơ.",
        },
        { status: 400 },
      );
    }

    const { rows } = await sql`
      UPDATE users
      SET
        full_name = ${body.fullName.trim()},
        phone = ${body.phone.trim()},
        address = ${body.address.trim()},
        email = ${normalizeEmail(body.email)}
      WHERE id = ${session.user.id}
      RETURNING id;
    `;

    if (rows.length === 0) {
      return NextResponse.json(
        { ok: false, message: "Không tìm thấy tài khoản." },
        { status: 404 },
      );
    }

    revalidatePath("/", "layout");
    revalidatePath("/user_infos");

    return NextResponse.json({
      ok: true,
      message: "Đã lưu thay đổi hồ sơ.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";

    if (message.includes("users_email_key")) {
      return NextResponse.json(
        {
          ok: false,
          fieldErrors: {
            email: "Email này đã được sử dụng.",
          },
          message: "Email này đã được sử dụng.",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        ok: false,
        message: "Không thể cập nhật hồ sơ lúc này. Vui lòng thử lại sau.",
      },
      { status: 500 },
    );
  }
}
