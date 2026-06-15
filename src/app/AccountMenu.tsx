"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState } from "react";

type AccountMenuProps = {
  userName: string;
  userRole: string;
};

export function AccountMenu({ userName, userRole }: AccountMenuProps) {
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);
    await signOut({
      redirectTo: "/",
    });
  }

  return (
    <div className="account-menu">
      <button className="account-menu-trigger" type="button">
        Xin chào, {userName}
      </button>

      <div className="account-menu-panel">
        <Link className="account-profile-link" href="/user_infos">
          Hồ sơ
        </Link>
        {userRole === "user" ? (
          <Link className="account-profile-link" href="/change_pass">
            Đổi mật khẩu
          </Link>
        ) : null}
        {userRole === "user" ? (
          <Link className="account-profile-link" href="/invoice_history">
            Lịch sử mua hàng
          </Link>
        ) : null}
        <button
          className="account-signout"
          disabled={isSigningOut}
          onClick={handleSignOut}
          type="button"
        >
          {isSigningOut ? "Đang đăng xuất..." : "Đăng xuất"}
        </button>
      </div>
    </div>
  );
}
