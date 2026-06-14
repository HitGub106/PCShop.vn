"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const createRoutes = [
  "/admin/dashboard/create_pc",
  "/admin/dashboard/create_monitor",
  "/admin/dashboard/create_component",
];

export function AdminSidebar() {
  const pathname = usePathname();
  const isProductRoute =
    pathname === "/admin/dashboard" ||
    pathname === "/admin/dashboard/edit" ||
    createRoutes.includes(pathname);
  const isReportRoute = pathname === "/admin/dashboard/report";

  return (
    <nav className="admin-sidebar" aria-label="Admin navigation">
      <strong>Admin</strong>
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
