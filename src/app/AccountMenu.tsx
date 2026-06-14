"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";

type AccountMenuProps = {
  userName: string;
};

export function AccountMenu({ userName }: AccountMenuProps) {
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
