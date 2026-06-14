import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { auth } from "@/auth";
import { AccountMenu } from "./AccountMenu";
import { CartHeaderLink } from "./CartHeaderLink";
import { CartToast } from "./CartToast";
import { HeaderSearch } from "./HeaderSearch";

const topLinks = [
  "Hệ thống showroom",
  "Bán hàng trực tuyến",
  "Tư vấn build PC",
];

const quickCategories = [
  { icon: "/pc.png", label: "PC Gaming", href: "/list_product/pc" },
  { icon: "/pc_component.png", label: "Linh kiện máy tính", href: "/list_product/component" },
  { icon: "/monitor.png", label: "Màn hình", href: "/list_product/monitor" },
  { icon: "/pc.png", label: "PC Văn phòng", href: "/list_product/pc?category=PC%20Văn%20phòng" },
];

const menuSections = [
  {
    title: "PC",
    href: "/list_product/pc",
    items: [
      { label: "PC Gaming", category: "PC Gaming" },
      { label: "PC Văn phòng", category: "PC Văn phòng" },
      { label: "PC Đồ họa", category: "PC Đồ họa" },
      { label: "Mini PC", category: "PC Mini" },
    ],
  },
  {
    title: "Linh kiện máy tính",
    href: "/list_product/component",
    items: [
      { label: "CPU", category: "CPU" },
      { label: "RAM", category: "RAM" },
      { label: "Mainboard", category: "Mainboard" },
      { label: "VGA", category: "VGA" },
      { label: "SSD", category: "SSD" },
      { label: "PSU", category: "PSU" },
      { label: "Case", category: "Case" },
      { label: "Cooling", category: "Cooling" },
    ],
  },
  {
    title: "Màn hình máy tính",
    href: "/list_product/monitor",
    items: [
      { label: "Màn hình gaming", category: "Gaming" },
      { label: "Màn hình đồ họa", category: "Đồ hoạ" },
      { label: "Màn hình văn phòng", category: "Văn phòng" },
    ],
  },
];

type ShopLayoutShellProps = {
  children: ReactNode;
};

export async function ShopLayoutShell({ children }: ShopLayoutShellProps) {
  const session = await auth();
  const userName = session?.user.fullName || session?.user.name;

  return (
    <div className="shop-shell">
      <header className="site-header">
        <div className="topbar">
          <div className="container topbar-inner">
            <nav className="topbar-links" aria-label="Liên kết nhanh">
              {topLinks.map((link, index) => (
                <Link
                  href={
                    index === 0
                      ? "/showroom"
                      : index === 1
                        ? "/policy"
                        : "/build_pc"
                  }
                  key={link}
                >
                  {link}
                </Link>
              ))}
            </nav>
            {userName ? (
              <div className="account-links">
                <AccountMenu userName={userName} />
              </div>
            ) : (
              <div className="account-links">
                <Link href="/register">Đăng ký</Link>
                <span aria-hidden="true">|</span>
                <Link href="/login">Đăng nhập</Link>
              </div>
            )}
          </div>
        </div>

        <div className="container header-main">
          <Link className="brand" href="/" aria-label="Trang chủ PCshop">
            <Image
              alt="PCshop"
              height={56}
              priority
              src="/logo.png"
              width={174}
              style={{ width: "250px", height: "auto" }}
            />
          </Link>

          <HeaderSearch />

          <div className="header-actions">
            <a href="tel:0986552233" className="hotline">
              <span aria-hidden="true">
                <Image alt="" height={18} src="/phone.png" width={18} />
              </span>
              <strong>098.655.2233</strong>
            </a>
            <Link href="/build_pc" className="build-button">
              <span aria-hidden="true">
                <Image alt="" height={18} src="/pc.png" width={18} />
              </span>
              Xây dựng cấu hình
            </Link>
            <CartHeaderLink />
          </div>
        </div>

        <div className="category-strip">
          <div className="container category-strip-inner">
            <div className="category-dropdown">
              <button
                type="button"
                className="category-menu"
                aria-haspopup="menu"
              >
                <span aria-hidden="true">☰</span>
                Danh mục sản phẩm
              </button>
              <div className="category-dropdown-panel" role="menu">
                {menuSections.map((section) => (
                  <div className="dropdown-group" key={section.title}>
                    <Link
                      href={section.href}
                      className="dropdown-title"
                      role="menuitem"
                    >
                      <span aria-hidden="true">▸</span>
                      {section.title}
                    </Link>
                    <div className="dropdown-items">
                      {section.items.map((item) => (
                        <Link
                          href={`${section.href}?category=${encodeURIComponent(item.category)}`}
                          key={item.label}
                          role="menuitem"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <nav className="category-shortcuts" aria-label="Danh mục nổi bật">
              {quickCategories.map((category) =>
                category.href.startsWith("/") ? (
                  <Link href={category.href} key={category.label}>
                    <span aria-hidden="true">
                      <Image
                        alt=""
                        height={18}
                        src={category.icon}
                        width={18}
                      />
                    </span>
                    {category.label}
                  </Link>
                ) : (
                  <a href={category.href} key={category.label}>
                    <span aria-hidden="true">
                      <Image
                        alt=""
                        height={18}
                        src={category.icon}
                        width={18}
                      />
                    </span>
                    {category.label}
                  </a>
                ),
              )}
            </nav>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <strong>PC shop</strong>
            <p>
              Cửa hàng PC và linh kiện dành cho game thủ, creator và doanh
              nghiệp cần cấu hình ổn định.
            </p>
          </div>
          <div>
            <span>Showroom</span>
            <p>Ha Noi - Ho Chi Minh</p>
            <p>Mở cửa 8:30 - 20:00 hằng ngày</p>
          </div>
          <div>
            <span>Hỗ trợ nhanh</span>
            <Link href="tell:0988888888">Hotline: 098.888.8888</Link>
            <br/>
            <Link href="http://zalo.me/0904092586">Zalo tư vấn build PC</Link>
          </div>
          <div>
            <span>Chính sách</span>
            <Link href="/policy">Chính Sách Bảo Mật</Link>
            <br/>
            <Link href="/policy">Quy Định Bảo Hành</Link>
            <br/>
            <Link href="/policy">Chính Sách Đổi Trả</Link>
          </div>
        </div>
      </footer>
      <CartToast />
    </div>
  );
}
