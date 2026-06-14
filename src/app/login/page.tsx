"use client";

import Link from "next/link";
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

export default function LoginPage() {
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
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
        redirectTo: "/",
      });

      if (!result?.ok) {
        setErrors({
          password: "Email hoặc mật khẩu không đúng.",
        });
        setStatus("Email hoặc mật khẩu không đúng.");
        return;
      }

      setErrors({});
      router.push("/");
      router.refresh();
    } catch {
      setStatus("Không thể đăng nhập lúc này. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="container auth-page">
      <div className="auth-panel">
        <div className="auth-copy">
          <p>Đăng nhập</p>
          <span>Theo dõi đơn hàng, thêm vào giỏ và mua nhanh hơn.</span>
        </div>

        <form className="auth-form" noValidate onSubmit={handleSubmit}>
          <label>
            Email
            <input
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "login-email-error" : undefined}
              name="email"
              onChange={(event) => updateValue("email", event.target.value)}
              placeholder="email@example.com"
              type="email"
              value={values.email}
            />
            {errors.email ? (
              <span className="auth-error" id="login-email-error">
                {errors.email}
              </span>
            ) : null}
          </label>

          <label>
            Mật khẩu
            <input
              aria-invalid={Boolean(errors.password)}
              aria-describedby={
                errors.password ? "login-password-error" : undefined
              }
              name="password"
              onChange={(event) => updateValue("password", event.target.value)}
              placeholder="Nhập mật khẩu"
              type="password"
              value={values.password}
            />
            {errors.password ? (
              <span className="auth-error" id="login-password-error">
                {errors.password}
              </span>
            ) : null}
          </label>

          {status ? <p className="auth-status">{status}</p> : null}

          <button disabled={isSubmitting} type="submit">
            {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          <p>
            Chưa có tài khoản? <Link href="/register">Đăng ký ngay</Link>
          </p>
        </form>
      </div>
    </section>
  );
}
