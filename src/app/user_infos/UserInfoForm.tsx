"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import {
  type FieldErrors,
  type UserInfoInput,
  hasFieldErrors,
  validateUserInfo,
} from "../lib/authValidation";

type UserInfoResponse = {
  ok: boolean;
  message?: string;
  fieldErrors?: FieldErrors<UserInfoInput>;
};

type UserInfoFormProps = {
  initialValues: UserInfoInput;
};

export function UserInfoForm({ initialValues }: UserInfoFormProps) {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FieldErrors<UserInfoInput>>({});
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateValue(name: keyof UserInfoInput, value: string) {
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

    const nextErrors = validateUserInfo(values);

    if (hasFieldErrors(nextErrors)) {
      setErrors(nextErrors);
      setStatus("Vui lòng kiểm tra lại thông tin hồ sơ.");
      return;
    }

    setIsSubmitting(true);
    setStatus("");

    try {
      const response = await fetch("/api/user_infos", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const result = (await response.json()) as UserInfoResponse;

      if (!response.ok || !result.ok) {
        setErrors(result.fieldErrors ?? {});
        setStatus(result.message ?? "Không thể lưu hồ sơ.");
        return;
      }

      setErrors({});
      setStatus(result.message ?? "Đã lưu thay đổi hồ sơ.");
      router.refresh();
    } catch {
      setStatus("Không thể lưu hồ sơ lúc này. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="auth-form auth-form--grid" noValidate onSubmit={handleSubmit}>
      <label>
        Họ và tên
        <input
          aria-invalid={Boolean(errors.fullName)}
          aria-describedby={errors.fullName ? "user-full-name-error" : undefined}
          name="fullName"
          onChange={(event) => updateValue("fullName", event.target.value)}
          placeholder="Nguyễn Văn A"
          type="text"
          value={values.fullName}
        />
        {errors.fullName ? (
          <span className="auth-error" id="user-full-name-error">
            {errors.fullName}
          </span>
        ) : null}
      </label>

      <label>
        Số điện thoại
        <input
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? "user-phone-error" : undefined}
          name="phone"
          onChange={(event) => updateValue("phone", event.target.value)}
          placeholder="0987654321"
          type="tel"
          value={values.phone}
        />
        {errors.phone ? (
          <span className="auth-error" id="user-phone-error">
            {errors.phone}
          </span>
        ) : null}
      </label>

      <label className="auth-field-full">
        Địa chỉ
        <input
          aria-invalid={Boolean(errors.address)}
          aria-describedby={errors.address ? "user-address-error" : undefined}
          name="address"
          onChange={(event) => updateValue("address", event.target.value)}
          placeholder="Số nhà, phường/xã, quận/huyện, tỉnh/thành"
          type="text"
          value={values.address}
        />
        {errors.address ? (
          <span className="auth-error" id="user-address-error">
            {errors.address}
          </span>
        ) : null}
      </label>

      <label className="auth-field-full">
        Email
        <input
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "user-email-error" : undefined}
          name="email"
          onChange={(event) => updateValue("email", event.target.value)}
          placeholder="email@example.com"
          type="email"
          value={values.email}
        />
        {errors.email ? (
          <span className="auth-error" id="user-email-error">
            {errors.email}
          </span>
        ) : null}
      </label>

      {status ? <p className="auth-status auth-field-full">{status}</p> : null}

      <button className="auth-field-full" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
      </button>
    </form>
  );
}
