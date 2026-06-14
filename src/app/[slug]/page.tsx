import { notFound } from "next/navigation";
import {
  fetchComponentBySlug,
  fetchMonitorBySlug,
  fetchProductBySlug,
} from "../lib/data";
import { ProductDetailActions } from "../ProductDetailActions";

type DetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function DetailPage({ params }: DetailPageProps) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

  if (product) {
    return (
      <section className="container product-detail-page">
        <div className="product-detail-box">
          <div
            className="product-detail-image"
            aria-label={product.title}
            role="img"
            style={{ backgroundImage: `url(${product.image})` }}
          />

          <div className="product-detail-summary">
            <p className="product-detail-category">{product.category}</p>
            <h1>{product.title}</h1>

            <div className="product-detail-price">
              <span>Giá</span>
              <strong>{product.price}</strong>
            </div>

            {product.oldPrice || product.discount ? (
              <div className="product-detail-discount">
                {product.oldPrice ? <span>{product.oldPrice}</span> : null}
                {product.discount ? <strong>{product.discount}</strong> : null}
              </div>
            ) : null}

            {product.warranty ? (
              <p className="product-detail-warranty">
                Bảo hành: <strong>{product.warranty}</strong>
              </p>
            ) : null}

            {product.promo ? (
              <p className="product-detail-promo">{product.promo}</p>
            ) : null}

            <ProductDetailActions
              id={product.slug}
              image={product.image}
              itemType="product"
              name={product.title}
              price={product.price}
            />
          </div>
        </div>

        <section className="product-detail-specs">
          <div className="section-component-heading">
            <div>
              <p>Thông tin chi tiết</p>
            </div>
          </div>

          {product.components.length > 0 ? (
            <div className="product-detail-component-list">
              {product.components.map((component) => (
                <article
                  className="product-detail-component"
                  key={`${component.type}-${component.name}`}
                >
                  <div>
                    <span>{component.type}</span>
                    <h2>{component.name}</h2>
                  </div>
                  {component.specs.length > 0 ? (
                    <dl>
                      {component.specs.map((spec) => (
                        <div key={spec.label}>
                          <dt>{spec.label}</dt>
                          <dd>{spec.value}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : (
                    <p>Chưa có thông số chi tiết.</p>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <p className="product-detail-empty">
              Sản phẩm này chưa có linh kiện chi tiết.
            </p>
          )}
        </section>
      </section>
    );
  }

  const component = await fetchComponentBySlug(slug);

  if (component) {
    return (
    <section className="container product-detail-page">
      <div className="product-detail-box">
        <div
          className="product-detail-image"
          aria-label={component.name}
          role="img"
          style={{ backgroundImage: `url(${component.image})` }}
        />

        <div className="product-detail-summary">
          <p className="product-detail-category">{component.type}</p>
          <h1>{component.name}</h1>

          <div className="product-detail-price">
            <span>Giá</span>
            <strong>{component.price || "Liên hệ"}</strong>
          </div>

          <p className="product-detail-warranty">
            Thương hiệu: <strong>{component.brand}</strong>
          </p>

          <ProductDetailActions
            id={component.slug}
            image={component.image}
            itemType="component"
            name={component.name}
            price={component.price}
          />
        </div>
      </div>

      <section className="product-detail-specs">
        <div className="section-component-heading">
          <div>
            <p>Thông tin chi tiết</p>
          </div>
        </div>

        <div className="product-detail-component-list">
          <article
            className="product-detail-component"
            key={`${component.type}-${component.name}`}
          >
            <div>
              <span>{component.type}</span>
              <h2>{component.name}</h2>
            </div>
            {component.specs.length > 0 ? (
              <dl>
                {component.specs.map((spec) => (
                  <div key={spec.label}>
                    <dt>{spec.label}</dt>
                    <dd>{spec.value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p>Chưa có thông số chi tiết.</p>
            )}
          </article>
        </div>
      </section>
    </section>
    );
  }

  const monitor = await fetchMonitorBySlug(slug);

  if (!monitor) {
    notFound();
  }

  return (
    <section className="container product-detail-page">
      <div className="product-detail-box">
        <div
          className="product-detail-image"
          aria-label={monitor.name}
          role="img"
          style={{ backgroundImage: `url(${monitor.image})` }}
        />

        <div className="product-detail-summary">
          <p className="product-detail-category">{monitor.type}</p>
          <h1>{monitor.name}</h1>

          <div className="product-detail-price">
            <span>Giá</span>
            <strong>{monitor.price || "Liên hệ"}</strong>
          </div>

          {monitor.oldPrice || monitor.discount ? (
            <div className="product-detail-discount">
              {monitor.oldPrice ? <span>{monitor.oldPrice}</span> : null}
              {monitor.discount ? <strong>{monitor.discount}</strong> : null}
            </div>
          ) : null}

          <p className="product-detail-warranty">
            Thương hiệu: <strong>{monitor.brand}</strong>
          </p>

          {monitor.warranty ? (
            <p className="product-detail-warranty">
              Bảo hành: <strong>{monitor.warranty}</strong>
            </p>
          ) : null}

          <ProductDetailActions
            id={monitor.slug}
            image={monitor.image}
            itemType="monitor"
            name={monitor.name}
            price={monitor.price}
          />
        </div>
      </div>

      <section className="product-detail-specs">
        <div className="section-component-heading">
          <div>
            <p>Thông tin chi tiết</p>
          </div>
        </div>

        <div className="product-detail-component-list">
          <article
            className="product-detail-component"
            key={`${monitor.type}-${monitor.name}`}
          >
            <div>
              <span>{monitor.type}</span>
              <h2>{monitor.name}</h2>
            </div>
            {monitor.specs.length > 0 ? (
              <dl>
                {monitor.specs.map((spec) => (
                  <div key={spec.label}>
                    <dt>{spec.label}</dt>
                    <dd>{spec.value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p>Chưa có thông số chi tiết.</p>
            )}
          </article>
        </div>
      </section>
    </section>
  );
}
