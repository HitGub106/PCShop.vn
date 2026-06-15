import bcrypt from "bcryptjs";
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

import { auth } from "@/auth";

type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type FieldErrors = Partial<Record<keyof ChangePasswordInput, string>>;

type UserPasswordRow = {
  password: string;
};

export const dynamic = "force-dynamic";

function validateChangePassword(values: ChangePasswordInput) {
  const errors: FieldErrors = {};

  if (!values.currentPassword) {
    errors.currentPassword = "Vui lòng nhập mật khẩu cũ.";
  }

  if (!values.newPassword) {
    errors.newPassword = "Vui lòng nhập mật khẩu mới.";
  } else if (values.newPassword.length < 6) {
    errors.newPassword = "Mật khẩu mới cần tối thiểu 6 ký tự.";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Vui lòng nhập lại mật khẩu mới.";
  } else if (values.confirmPassword !== values.newPassword) {
    errors.confirmPassword = "Mật khẩu mới nhập lại không khớp.";
  }

  return errors;
}

export async function PUT(request: Request) {
  const session = await auth();

  if (!session?.user.id) {
    return NextResponse.json(
      { ok: false, message: "Vui lòng đăng nhập để đổi mật khẩu." },
      { status: 401 },
    );
  }

  if (session.user.role !== "user") {
    return NextResponse.json(
      { ok: false, message: "Chỉ tài khoản người dùng mới được đổi mật khẩu tại đây." },
      { status: 403 },
    );
  }

  try {
    const rawBody = (await request.json()) as Partial<ChangePasswordInput>;
    const body: ChangePasswordInput = {
      currentPassword: String(rawBody.currentPassword ?? ""),
      newPassword: String(rawBody.newPassword ?? ""),
      confirmPassword: String(rawBody.confirmPassword ?? ""),
    };
    const errors = validateChangePassword(body);

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        {
          ok: false,
          fieldErrors: errors,
          message: "Vui lòng kiểm tra lại thông tin đổi mật khẩu.",
        },
        { status: 400 },
      );
    }

    const { rows } = await sql<UserPasswordRow>`
      SELECT password
      FROM users
      WHERE id = ${session.user.id}
      LIMIT 1;
    `;
    const user = rows[0];

    if (!user) {
      return NextResponse.json(
        { ok: false, message: "Không tìm thấy tài khoản." },
        { status: 404 },
      );
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      body.currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        {
          ok: false,
          fieldErrors: {
            currentPassword: "Mật khẩu cũ không đúng.",
          },
          message: "Mật khẩu cũ không đúng.",
        },
        { status: 400 },
      );
    }

    const passwordHash = await bcrypt.hash(body.newPassword, 10);

    await sql`
      UPDATE users
      SET password = ${passwordHash}
      WHERE id = ${session.user.id};
    `;

    return NextResponse.json({
      ok: true,
      message: "Đã đổi mật khẩu thành công.",
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "Không thể đổi mật khẩu lúc này. Vui lòng thử lại sau.",
      },
      { status: 500 },
    );
  }
}
