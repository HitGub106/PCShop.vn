"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState, type FormEvent } from "react";

import {
  type FieldErrors,
  type LoginInput,
  hasFieldErrors,
  validateLogin,
} from "../lib/authValidation";

const initialValues: LoginInput = {
  email: "",
  password: "",
};

export function AdminLoginForm() {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FieldErrors<LoginInput>>({});
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateValue(name: keyof LoginInput, value: string) {
    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: undefined,
    }));
    setStatus("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateLogin(values);

    if (hasFieldErrors(nextErrors)) {
      setErrors(nextErrors);
      setStatus("Vui lòng kiểm tra lại thông tin đăng nhập.");
      return;
    }

    setIsSubmitting(true);
    setStatus("");

    try {
      const result = await signIn("admin", {
        email: values.email,
        password: values.password,
        redirect: false,
        redirectTo: "/admin/dashboard/edit",
      });

      if (!result?.ok || result.error || result.code) {
        setErrors({
          email: "Email admin không đúng hoặc chưa có quyền admin.",
          password: "Mật khẩu không đúng hoặc tài khoản không có quyền admin.",
        });
        setStatus("Chỉ tài khoản có quyền admin mới đăng nhập được.");
        return;
      }

      router.push(result.url ?? "/admin/dashboard/edit");
      router.refresh();
    } catch {
      setStatus("Không thể đăng nhập admin lúc này. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="admin-login-form" noValidate onSubmit={handleSubmit}>
      <div>
        <h1>Admin Login</h1>
        <p>Đăng nhập bằng tài khoản có quyền admin.</p>
      </div>

      <label>
        Email
        <input
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "admin-email-error" : undefined}
          name="email"
          onChange={(event) => updateValue("email", event.target.value)}
          placeholder="admin@example.com"
          type="email"
          value={values.email}
        />
        {errors.email ? (
          <span className="auth-error" id="admin-email-error">
            {errors.email}
          </span>
        ) : null}
      </label>

      <label>
        Mật khẩu
        <input
          aria-invalid={Boolean(errors.password)}
          aria-describedby={
            errors.password ? "admin-password-error" : undefined
          }
          name="password"
          onChange={(event) => updateValue("password", event.target.value)}
          placeholder="Nhập mật khẩu"
          type="password"
          value={values.password}
        />
        {errors.password ? (
          <span className="auth-error" id="admin-password-error">
            {errors.password}
          </span>
        ) : null}
      </label>

      {status ? <p className="auth-status">{status}</p> : null}

      <button disabled={isSubmitting} type="submit">
        {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>
    </form>
  );
}
