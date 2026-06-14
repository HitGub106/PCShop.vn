"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import {
  type FieldErrors,
  type RegisterInput,
  validateRegister,
  hasFieldErrors,
} from "../lib/authValidation";

type AuthResponse = {
  ok: boolean;
  message?: string;
  fieldErrors?: FieldErrors<RegisterInput>;
};

const initialValues: RegisterInput = {
  fullName: "",
  phone: "",
  address: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function RegisterPage() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FieldErrors<RegisterInput>>({});
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateValue(name: keyof RegisterInput, value: string) {
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

    const nextErrors = validateRegister(values);

    if (hasFieldErrors(nextErrors)) {
      setErrors(nextErrors);
      setStatus("Vui lòng kiểm tra lại thông tin đăng ký.");
      return;
    }

    setIsSubmitting(true);
    setStatus("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const result = (await response.json()) as AuthResponse;

      if (!response.ok || !result.ok) {
        setErrors(result.fieldErrors ?? {});
        setStatus(result.message ?? "Đăng ký không thành công.");
        return;
      }

      setValues(initialValues);
      setErrors({});
      setStatus(result.message ?? "Đăng ký thành công.");
    } catch {
      setStatus("Không thể đăng ký lúc này. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="container auth-page">
      <div className="auth-panel auth-panel--wide">
        <div className="auth-copy">
          <p>Đăng ký</p>
          <span>Tạo tài khoản trong hệ thống.</span>
        </div>

        <form
          className="auth-form auth-form--grid"
          noValidate
          onSubmit={handleSubmit}
        >
          <label>
            Họ và tên
            <input
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={
                errors.fullName ? "register-full-name-error" : undefined
              }
              name="fullName"
              onChange={(event) => updateValue("fullName", event.target.value)}
              placeholder="Nguyễn Văn A"
              type="text"
              value={values.fullName}
            />
            {errors.fullName ? (
              <span className="auth-error" id="register-full-name-error">
                {errors.fullName}
              </span>
            ) : null}
          </label>

          <label>
            Số điện thoại
            <input
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "register-phone-error" : undefined}
              name="phone"
              onChange={(event) => updateValue("phone", event.target.value)}
              placeholder="0987654321"
              type="tel"
              value={values.phone}
            />
            {errors.phone ? (
              <span className="auth-error" id="register-phone-error">
                {errors.phone}
              </span>
            ) : null}
          </label>

          <label className="auth-field-full">
            Địa chỉ
            <input
              aria-invalid={Boolean(errors.address)}
              aria-describedby={
                errors.address ? "register-address-error" : undefined
              }
              name="address"
              onChange={(event) => updateValue("address", event.target.value)}
              placeholder="Số nhà, phường/xã, quận/huyện, tỉnh/thành"
              type="text"
              value={values.address}
            />
            {errors.address ? (
              <span className="auth-error" id="register-address-error">
                {errors.address}
              </span>
            ) : null}
          </label>

          <label>
            Email
            <input
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "register-email-error" : undefined}
              name="email"
              onChange={(event) => updateValue("email", event.target.value)}
              placeholder="email@example.com"
              type="email"
              value={values.email}
            />
            {errors.email ? (
              <span className="auth-error" id="register-email-error">
                {errors.email}
              </span>
            ) : null}
          </label>

          <label>
            Mật khẩu
            <input
              aria-invalid={Boolean(errors.password)}
              aria-describedby={
                errors.password ? "register-password-error" : undefined
              }
              name="password"
              onChange={(event) => updateValue("password", event.target.value)}
              placeholder="Nhập mật khẩu"
              type="password"
              value={values.password}
            />
            {errors.password ? (
              <span className="auth-error" id="register-password-error">
                {errors.password}
              </span>
            ) : null}
          </label>

          <label className="auth-field-full">
            Nhập lại mật khẩu
            <input
              aria-invalid={Boolean(errors.confirmPassword)}
              aria-describedby={
                errors.confirmPassword
                  ? "register-confirm-password-error"
                  : undefined
              }
              name="confirmPassword"
              onChange={(event) =>
                updateValue("confirmPassword", event.target.value)
              }
              placeholder="Nhập lại mật khẩu"
              type="password"
              value={values.confirmPassword}
            />
            {errors.confirmPassword ? (
              <span className="auth-error" id="register-confirm-password-error">
                {errors.confirmPassword}
              </span>
            ) : null}
          </label>

          {status ? (
            <p className="auth-status auth-field-full">{status}</p>
          ) : null}

          <button className="auth-field-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
          </button>

          <p className="auth-field-full">
            Đã có tài khoản? <Link href="/login">Đăng nhập</Link>
          </p>
        </form>
      </div>
    </section>
  );
}
