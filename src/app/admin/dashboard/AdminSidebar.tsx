"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";

const createRoutes = [
  "/admin/dashboard/create_pc",
  "/admin/dashboard/create_monitor",
  "/admin/dashboard/create_component",
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const isProductRoute =
    pathname === "/admin/dashboard" ||
    pathname === "/admin/dashboard/edit" ||
    createRoutes.includes(pathname);
  const isReportRoute = pathname === "/admin/dashboard/report";

  async function handleSignOut() {
    setIsSigningOut(true);
    await signOut({
      redirectTo: "/admin",
    });
  }

  return (
    <nav className="admin-sidebar" aria-label="Admin navigation">
      <div className="admin-sidebar-header">
        <strong>Admin</strong>
        <button
          className="admin-sidebar-signout"
          disabled={isSigningOut}
          onClick={handleSignOut}
          type="button"
        >
          {isSigningOut ? "Đang thoát..." : "Đăng xuất"}
        </button>
      </div>
      <Link
        className={isProductRoute ? "active" : undefined}
        href="/admin/dashboard/edit"
      >
        Cập nhật sản phẩm
      </Link>
      <Link
        className={isReportRoute ? "active" : undefined}
        href="/admin/dashboard/report"
      >
        Xem báo cáo
      </Link>
    </nav>
  );
}
