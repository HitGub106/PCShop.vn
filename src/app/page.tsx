import Image from "next/image";
import { ProductCard } from "./ProductCard";

const heroSlides = [
  { src: "/hero1.jpg", label: "Banner khuyến mại PC 1" },
  { src: "/hero2.jpg", label: "Banner khuyến mại PC 2" },
  { src: "/hero3.jpg", label: "Banner khuyến mại PC 3" },
];

const topLinks = [
  "Hệ thống showroom",
  "Bán hàng trực tuyến",
  "Tư vấn build PC",
];

const quickCategories = [
  { icon: "/pc.png", label: "PC Gaming" },
  { icon: "/pc_component.png", label: "Linh kiện máy tính" },
  { icon: "/monitor.png", label: "Màn hình" },
  { icon: "/pc.png", label: "PC Workstation" },
];

const menuSections = [
  {
    title: "PC Gaming",
    items: ["PC gaming giá rẻ", "PC gaming cao cấp", "PC stream game" ],
  },
  {
    title: "PC Workstation 2D 3D",
    items: ["PC editing", "PC văn phòng"],
  },
  {
    title: "Linh kiện máy tính",
    items: ["CPU Intel / AMD", "Mainboard", "RAM", "VGA - Card màn hình"],
  },
  {
    title: "Màn hình máy tính",
    items: ["Màn hình gaming", "Màn hình đồ họa", "Màn hình văn phòng"],
  },
];

const products = [
  {
    title: "PC Nova Gaming i5 12400F - RTX 4060 8GB",
    price: "18.990.000 VND",
    oldPrice: "21.490.000 VND",
    discount: "-12%",
    warranty: "36 tháng",
    image:
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=700&q=80",
    specs: [
      "Intel Core i5 12400F, 6 nhân 12 luồng",
      "Mainboard B760M DDR4",
      "RAM 16GB bus 3200MHz",
      "SSD NVMe 512GB Gen 4",
      "Nguồn 650W 80 Plus",
    ],
    promo: "Tặng gói tối ưu Windows và vệ sinh miễn phí 12 tháng",
  },
  {
    title: "PC AMD Creator Ryzen 7 5700X - RTX 3050 6GB",
    price: "15.980.000 VND",
    oldPrice: "17.990.000 VND",
    discount: "-11%",
    warranty: "36 tháng",
    image:
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=700&q=80",
    specs: [
      "AMD Ryzen 7 5700X, 8 nhân 16 luồng",
      "Mainboard B550M",
      "RAM 16GB DDR4 RGB",
      "SSD NVMe 500GB",
      "Tản nhiệt khí tower",
    ],
    promo: "Nâng cấp SSD 1TB chỉ thêm 990K trong tuần này",
  },
  {
    title: "PC Ultra White i5 14400F - RX 7600 OC",
    price: "19.860.000 VND",
    oldPrice: "21.990.000 VND",
    discount: "-10%",
    warranty: "36 tháng",
    image:
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=700&q=80",
    specs: [
      "Intel Core i5 14400F, 10 nhân 16 luồng",
      "Mainboard B760M",
      "RAM 16GB DDR5",
      "VGA Radeon RX 7600 8GB",
      "Case trắng 4 fan ARGB",
    ],
    promo: "Tặng bản quyền Office và voucher giảm 500K cho màn hình",
  },
  {
    title: "PC Mini Studio Ryzen 5 7500F - RTX 4060",
    price: "22.490.000 VND",
    oldPrice: "24.990.000 VND",
    discount: "-10%",
    warranty: "36 tháng",
    image:
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=700&q=80",
    specs: [
      "AMD Ryzen 5 7500F AM5",
      "Mainboard B650I Wi-Fi",
      "RAM 32GB DDR5",
      "SSD NVMe 1TB",
      "Case ITX nhỏ gọn",
    ],
    promo: "Miễn phí lắp đặt tản nhiệt nước AIO khi nâng cấp",
  },
];

const componentDeals = [
  {
    title: "CPU Intel Core i5 13400F",
    price: "4.290.000 VND",
    image:
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=500&q=80",
  },
  {
    title: "Mainboard B760M Wi-Fi DDR5",
    price: "3.190.000 VND",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=80",
  },
  {
    title: "VGA RTX 4060 8GB OC",
    price: "8.990.000 VND",
    image:
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=500&q=80",
  },
  {
    title: "RAM RGB 16GB DDR4",
    price: "890.000 VND",
    image:
      "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=500&q=80",
  },
];

const services = [
  "Bảo hành 1 đổi 1 trong 15 ngày",
  "Lắp máy và test ổn định miễn phí",
  "Giao hàng toàn quốc, đóng gói kỹ càng",
  "Tư vấn build PC theo game và phần mềm",
];

export default function Home() {
  return (
    <main className="shop-shell">
      <header className="site-header">
        <div className="topbar">
          <div className="container topbar-inner">
            <nav className="topbar-links" aria-label="Liên kết nhanh">
              {topLinks.map((link) => (
                <a href="#" key={link}>
                  {link}
                </a>
              ))}
            </nav>
            <div className="account-links">
              <a href="#">Đăng ký</a>
              <span aria-hidden="true">|</span>
              <a href="#">Đăng nhập</a>
            </div>
          </div>
        </div>

        <div className="container header-main">
          <a className="brand" href="#" aria-label="Trang chủ PCPrime">
            <Image alt="PCPrime" height={56} priority src="/logo.png" width={174} style={{ width: '250px', height: 'auto' }}/>
          </a>

          <form className="search-box">
            <select aria-label="Chọn danh mục">
              <option>Tất cả danh mục</option>
              <option>PC Gaming</option>
              <option>Linh kiện PC</option>
              <option>Màn hình</option>
            </select>
            <input aria-label="Tìm kiếm sản phẩm" placeholder="Tìm kiếm sản phẩm..." />
            <button type="submit" aria-label="Tìm kiếm">
              <span aria-hidden="true">⌕</span>
            </button>
          </form>

          <div className="header-actions">
            <a href="tel:0986552233" className="hotline">
              <span aria-hidden="true">
                <Image alt="" height={18} src="/phone.png" width={18} />
              </span>
              <strong>098.655.2233</strong>
            </a>
            <button type="button" className="build-button">
              <span aria-hidden="true">
                <Image alt="" height={18} src="/pc.png" width={18} />
              </span>
              Xây dựng cấu hình
            </button>
            <button type="button" className="cart-button">
              <span aria-hidden="true">
                <Image alt="" height={18} src="/cart.png" width={18} />
              </span>
              Giỏ hàng
            </button>
          </div>
        </div>

        <div className="category-strip">
          <div className="container category-strip-inner">
            <div className="category-dropdown">
              <button type="button" className="category-menu" aria-haspopup="menu">
                <span aria-hidden="true">☰</span>
                Danh mục sản phẩm
              </button>
              <div className="category-dropdown-panel" role="menu">
                {menuSections.map((section) => (
                  <div className="dropdown-group" key={section.title}>
                    <a href="#" className="dropdown-title" role="menuitem">
                      <span aria-hidden="true">▸</span>
                      {section.title}
                    </a>
                    <div className="dropdown-items">
                      {section.items.map((item) => (
                        <a href="#" key={item} role="menuitem">
                          {item}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <nav className="category-shortcuts" aria-label="Danh mục nổi bật">
              {quickCategories.map((category) => (
                <a href="#" key={category.label}>
                  <span aria-hidden="true">
                    <Image alt="" height={18} src={category.icon} width={18} />
                  </span>
                  {category.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <section className="container hero-layout" aria-label="Khu vực khuyến mại">
        <div className="hero-content">
          <section className="hero-banner" aria-label="Banner khuyến mại tự động">
            <div className="hero-slider">
              {heroSlides.map((slide, index) => (
                <div className="hero-slide" key={slide.src}>
                  <Image
                    alt={slide.label}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 1220px) 100vw, 1220px"
                    src={slide.src}
                  />
                </div>
              ))}
            </div>
            <div className="hero-dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </section>

        </div>
      </section>

      <section className="container service-row" aria-label="Chính sách dịch vụ">
        {services.map((service) => (
          <div className="service-item" key={service}>
            <span aria-hidden="true">✓</span>
            {service}
          </div>
        ))}
      </section>

      <section className="container product-section" id="hot-deals">
        <div className="section-heading">
          <div>
            <p>Hot sale</p>
          <h2 >Deal PC bán chạy mỗi ngày</h2>
          </div>
          <div className="section-tabs" aria-label="Bộ lọc deal">
            <button type="button" className="active">
              PC Gaming
            </button>
            <button type="button">PC Đồ họa</button>
            <button type="button">PC Văn phòng</button>
          </div>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.title} product={product} />
          ))}
        </div>
      </section>

      <section className="container builder-section">
        <div className="builder-copy">
          <p>Cần cấu hình riêng?</p>
          <h2>Chọn nhu cầu, shop gợi ý bộ máy phù hợp</h2>
          <span>
            Game eSports, AAA, livestream, render 3D hay máy văn phòng số
            lượng lớn.
          </span>
        </div>
        <div className="builder-options" aria-label="Nhu cầu build PC">
          {["Chơi game", "Đồ họa 2D/3D", "Render video", "Máy văn phòng"].map(
            (option) => (
              <button type="button" key={option}>
                {option}
              </button>
            ),
          )}
        </div>
      </section>

      <section className="container component-section" id="components">
        <div className="section-heading">
          <div>
            <p>Linh kiện máy tính</p>
            <h2>Hàng mới về trong ngày</h2>
          </div>
          <a href="#">Xem tất cả</a>
        </div>
        <div className="component-grid">
          {componentDeals.map((deal) => (
            <article className="component-card" key={deal.title}>
              <div
                className="component-media"
                role="img"
                aria-label={deal.title}
                style={{ backgroundImage: `url(${deal.image})` }}
              />
              <div>
                <h3>{deal.title}</h3>
                <strong>{deal.price}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <strong>PC PRIME</strong>
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
            <p>Hotline: 098.655.2233</p>
            <p>Zalo tư vấn build PC</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
