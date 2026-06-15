"use client";

import { useState, type FormEvent } from "react";

type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type FieldErrors = Partial<Record<keyof ChangePasswordInput, string>>;

type ChangePasswordResponse = {
  ok: boolean;
  message?: string;
  fieldErrors?: FieldErrors;
};

const initialValues: ChangePasswordInput = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

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

export function ChangePasswordForm() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateValue(name: keyof ChangePasswordInput, value: string) {
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

    const nextErrors = validateChangePassword(values);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatus("Vui lòng kiểm tra lại thông tin đổi mật khẩu.");
      return;
    }

    setIsSubmitting(true);
    setStatus("");

    try {
      const response = await fetch("/api/change_pass", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const result = (await response.json()) as ChangePasswordResponse;

      if (!response.ok || !result.ok) {
        setErrors(result.fieldErrors ?? {});
        setStatus(result.message ?? "Không thể đổi mật khẩu.");
        return;
      }

      setValues(initialValues);
      setErrors({});
      setStatus(result.message ?? "Đã đổi mật khẩu thành công.");
    } catch {
      setStatus("Không thể đổi mật khẩu lúc này. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="auth-form" noValidate onSubmit={handleSubmit}>
      <label>
        Mật khẩu cũ
        <input
          aria-invalid={Boolean(errors.currentPassword)}
          aria-describedby={
            errors.currentPassword ? "current-password-error" : undefined
          }
          name="currentPassword"
          onChange={(event) =>
            updateValue("currentPassword", event.target.value)
          }
          placeholder="Nhập mật khẩu cũ"
          type="password"
          value={values.currentPassword}
        />
        {errors.currentPassword ? (
          <span className="auth-error" id="current-password-error">
            {errors.currentPassword}
          </span>
        ) : null}
      </label>

      <label>
        Mật khẩu mới
        <input
          aria-invalid={Boolean(errors.newPassword)}
          aria-describedby={errors.newPassword ? "new-password-error" : undefined}
          name="newPassword"
          onChange={(event) => updateValue("newPassword", event.target.value)}
          placeholder="Nhập mật khẩu mới"
          type="password"
          value={values.newPassword}
        />
        {errors.newPassword ? (
          <span className="auth-error" id="new-password-error">
            {errors.newPassword}
          </span>
        ) : null}
      </label>

      <label>
        Nhập lại mật khẩu mới
        <input
          aria-invalid={Boolean(errors.confirmPassword)}
          aria-describedby={
            errors.confirmPassword ? "confirm-password-error" : undefined
          }
          name="confirmPassword"
          onChange={(event) =>
            updateValue("confirmPassword", event.target.value)
          }
          placeholder="Nhập lại mật khẩu mới"
          type="password"
          value={values.confirmPassword}
        />
        {errors.confirmPassword ? (
          <span className="auth-error" id="confirm-password-error">
            {errors.confirmPassword}
          </span>
        ) : null}
      </label>

      {status ? <p className="auth-status">{status}</p> : null}

      <button disabled={isSubmitting} type="submit">
        {isSubmitting ? "Đang xác nhận..." : "Xác nhận"}
      </button>
    </form>
  );
}
