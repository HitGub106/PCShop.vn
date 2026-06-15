export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = LoginInput & {
  fullName: string;
  phone: string;
  address: string;
  confirmPassword: string;
};

export type UserInfoInput = {
  fullName: string;
  phone: string;
  address: string;
  email: string;
};

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function validateLogin(values: LoginInput): FieldErrors<LoginInput> {
  const errors: FieldErrors<LoginInput> = {};
  const email = normalizeEmail(values.email);

  if (!email) {
    errors.email = "Vui lòng nhập email.";
  } else if (!emailPattern.test(email)) {
    errors.email = "Email không đúng định dạng.";
  }

  if (!values.password) {
    errors.password = "Vui lòng nhập mật khẩu.";
  } else if (values.password.length < 6) {
    errors.password = "Mật khẩu cần tối thiểu 6 ký tự.";
  }

  return errors;
}

export function validateRegister(
  values: RegisterInput,
): FieldErrors<RegisterInput> {
  const errors: FieldErrors<RegisterInput> = {};
  const loginErrors = validateLogin(values);
  const phoneDigits = values.phone.replace(/\D/g, "");

  if (!values.fullName.trim()) {
    errors.fullName = "Vui lòng nhập họ và tên.";
  } else if (values.fullName.trim().length < 2) {
    errors.fullName = "Họ và tên quá ngắn.";
  }

  if (!values.phone.trim()) {
    errors.phone = "Vui lòng nhập số điện thoại.";
  } else if (phoneDigits.length < 9 || phoneDigits.length > 11) {
    errors.phone = "Số điện thoại cần từ 9 đến 11 chữ số.";
  }

  if (!values.address.trim()) {
    errors.address = "Vui lòng nhập địa chỉ.";
  } else if (values.address.trim().length < 5) {
    errors.address = "Địa chỉ quá ngắn.";
  }

  if (loginErrors.email) {
    errors.email = loginErrors.email;
  }

  if (loginErrors.password) {
    errors.password = loginErrors.password;
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Vui lòng nhập lại mật khẩu.";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Mật khẩu nhập lại không khớp.";
  }

  return errors;
}

export function validateUserInfo(
  values: UserInfoInput,
): FieldErrors<UserInfoInput> {
  const errors: FieldErrors<UserInfoInput> = {};
  const email = normalizeEmail(values.email);
  const phoneDigits = values.phone.replace(/\D/g, "");

  if (!values.fullName.trim()) {
    errors.fullName = "Vui lòng nhập họ và tên.";
  } else if (values.fullName.trim().length < 2) {
    errors.fullName = "Họ và tên quá ngắn.";
  }

  if (!values.phone.trim()) {
    errors.phone = "Vui lòng nhập số điện thoại.";
  } else if (phoneDigits.length < 9 || phoneDigits.length > 11) {
    errors.phone = "Số điện thoại cần từ 9 đến 11 chữ số.";
  }

  if (!values.address.trim()) {
    errors.address = "Vui lòng nhập địa chỉ.";
  } else if (values.address.trim().length < 5) {
    errors.address = "Địa chỉ quá ngắn.";
  }

  if (!email) {
    errors.email = "Vui lòng nhập email.";
  } else if (!emailPattern.test(email)) {
    errors.email = "Email không đúng định dạng.";
  }

  return errors;
}

export function hasFieldErrors<T>(errors: FieldErrors<T>) {
  return Object.keys(errors).length > 0;
}
