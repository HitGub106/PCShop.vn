import Image from "next/image";
import { ComponentCarousel } from "./ComponentCarousel";
import { MonitorCarousel } from "./MonitorCarousel";
import { ProductCarousel } from "./ProductCarousel";
import { fetchComponents, fetchMonitors, fetchProducts } from "./lib/data";
import Link from "next/link";

export const dynamic = "force-dynamic";

const heroSlides = [
  { src: "/hero1.jpg", label: "Banner khuyến mại PC 1" },
  { src: "/hero2.jpg", label: "Banner khuyến mại PC 2" },
  { src: "/hero3.jpg", label: "Banner khuyến mại PC 3" },
];

const services = [
  "Bảo hành 1 đổi 1 trong 15 ngày",
  "Lắp máy và test ổn định miễn phí",
  "Giao hàng toàn quốc, đóng gói kỹ càng",
  "Tư vấn build PC theo game và phần mềm",
];

export default async function Home() {
  const [products, components, monitors] = await Promise.all([
    fetchProducts(6),
    fetchComponents(6),
    fetchMonitors(6),
  ]);

  return (
    <>
      <section className="container hero-layout" aria-label="Khu vực khuyến mại">
        <div className="hero-content">
          <section
            className="hero-banner"
            aria-label="Banner khuyến mại tự động"
          >
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
            <h2>Deal hot mỗi ngày</h2>
          </div>
        </div>

        <ProductCarousel products={products} />
      </section>

      <section className="container component-product-section" id="components">
        <div className="section-component-heading">
          <div>
            <p>Linh kiện máy tính</p>
          </div>
        </div>

        <ComponentCarousel components={components} />
      </section>

      <section className="container component-product-section" id="monitors">
        <div className="section-component-heading">
          <div>
            <p>Màn hình máy tính</p>
          </div>
        </div>

        <MonitorCarousel monitors={monitors} />
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
              <Link type="button" key={option} href="/build_pc">
                {option}
              </Link>
            ),
          )}
        </div>
      </section>
    </>
  );
}
