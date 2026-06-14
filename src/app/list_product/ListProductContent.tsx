"use client";

import { useMemo, useState } from "react";

import { ComponentCard } from "../ComponentCard";
import { MonitorCard } from "../MonitorCard";
import { ProductCard } from "../ProductCard";
import { parseCartPrice } from "../lib/cartStorage";
import type { ComponentItem, MonitorItem, Product } from "../lib/data";

type ListProductType = "pc" | "component" | "monitor";

type ListProductContentProps = {
  components: ComponentItem[];
  initialCategory?: string;
  initialQuery?: string;
  monitors: MonitorItem[];
  products: Product[];
  type: ListProductType;
};

const pcCategories = ["PC Gaming", "PC Văn phòng", "PC Đồ họa", "PC Mini"];
const componentCategories = [
  "CPU",
  "RAM",
  "Mainboard",
  "VGA",
  "SSD",
  "PSU",
  "Case",
  "Cooling",
];
const monitorCategories = ["Gaming", "Văn phòng", "Đồ hoạ"];

export function ListProductContent({
  components,
  initialCategory,
  initialQuery,
  monitors,
  products,
  type,
}: ListProductContentProps) {
  const categoryOptions = getCategoryOptions(type);
  const [selectedCategory, setSelectedCategory] = useState(
    getInitialCategory(categoryOptions, initialCategory, initialQuery),
  );
  const searchQuery = initialQuery?.trim() ?? "";
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const brandOptions = useMemo(
    () => getBrandOptions(type, components, monitors),
    [components, monitors, type],
  );

  const filteredProducts = useMemo(
    () =>
      products.filter((product) =>
        matchesSearch(productSearchText(product), searchQuery) &&
        matchesCommonFilters(
            getProductCategory(product),
            parseCartPrice(product.price),
            selectedCategory,
            minPrice,
            maxPrice,
          ),
      ),
    [maxPrice, minPrice, products, searchQuery, selectedCategory],
  );

  const filteredComponents = useMemo(
    () =>
      components.filter((component) => {
        const matchesBrand =
          selectedBrands.length === 0 ||
          selectedBrands.includes(component.brand);

        return (
          matchesBrand &&
          matchesSearch(componentSearchText(component), searchQuery) &&
          matchesCommonFilters(
            component.type,
            parseCartPrice(component.price),
            selectedCategory,
            minPrice,
            maxPrice,
          )
        );
      }),
    [
      components,
      maxPrice,
      minPrice,
      searchQuery,
      selectedBrands,
      selectedCategory,
    ],
  );

  const filteredMonitors = useMemo(
    () =>
      monitors.filter((monitor) => {
        const matchesBrand =
          selectedBrands.length === 0 ||
          selectedBrands.includes(monitor.brand);

        return (
          matchesBrand &&
          matchesSearch(monitorSearchText(monitor), searchQuery) &&
          matchesCommonFilters(
            monitor.category,
            parseCartPrice(monitor.price),
            selectedCategory,
            minPrice,
            maxPrice,
          )
        );
      }),
    [maxPrice, minPrice, monitors, searchQuery, selectedBrands, selectedCategory],
  );

  function toggleBrand(brand: string) {
    setSelectedBrands((currentBrands) =>
      currentBrands.includes(brand)
        ? currentBrands.filter((currentBrand) => currentBrand !== brand)
        : [...currentBrands, brand],
    );
  }

  function resetFilters() {
    setSelectedCategory(categoryOptions[0]);
    setMinPrice("");
    setMaxPrice("");
    setSelectedBrands([]);
  }

  const title = getPageTitle(type);
  const filteredCount =
    type === "pc"
      ? filteredProducts.length
      : type === "component"
        ? filteredComponents.length
        : filteredMonitors.length;

  return (
    <section className="container list-product-page">
      <aside className="list-filter-panel" aria-label="Bộ lọc sản phẩm">
        <div className="list-filter-heading">
          <h1>{title}</h1>
          <span>{filteredCount} sản phẩm</span>
          {searchQuery ? <em>Từ khóa: {searchQuery}</em> : null}
        </div>

        <div className="filter-group">
          <p>Chọn loại</p>
          <div className="filter-options">
            {categoryOptions.map((category) => (
              <label key={category}>
                <input
                  checked={selectedCategory === category}
                  name="category"
                  onChange={() => setSelectedCategory(category)}
                  type="radio"
                />
                {category}
              </label>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <p>Khoảng giá</p>
          <div className="price-filter-row">
            <input
              inputMode="numeric"
              onChange={(event) => setMinPrice(event.target.value)}
              placeholder="Từ, ví dụ 3000"
              type="number"
              value={minPrice}
            />
            <input
              inputMode="numeric"
              onChange={(event) => setMaxPrice(event.target.value)}
              placeholder="Đến, ví dụ 10000"
              type="number"
              value={maxPrice}
            />
          </div>
          <span className="price-filter-hint">
            Nhập theo nghìn đồng: 3000 = 3.000.000 VND
          </span>
        </div>

        {type !== "pc" ? (
          <div className="filter-group">
            <p>Thương hiệu</p>
            <div className="filter-options">
              {brandOptions.map((brand) => (
                <label key={brand}>
                  <input
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    type="checkbox"
                  />
                  {brand}
                </label>
              ))}
            </div>
          </div>
        ) : null}

        <button
          className="filter-reset-button"
          onClick={resetFilters}
          type="button"
        >
          Xóa lọc
        </button>
      </aside>

      <div className="list-product-results">
        {type === "pc" ? (
          filteredProducts.length > 0 ? (
            <div className="product-grid component-product-grid list-product-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          ) : (
            <EmptyList />
          )
        ) : null}

        {type === "component" ? (
          filteredComponents.length > 0 ? (
            <div className="product-grid component-product-grid list-product-grid">
              {filteredComponents.map((component) => (
                <ComponentCard key={component.slug} component={component} />
              ))}
            </div>
          ) : (
            <EmptyList />
          )
        ) : null}

        {type === "monitor" ? (
          filteredMonitors.length > 0 ? (
            <div className="product-grid component-product-grid list-product-grid">
              {filteredMonitors.map((monitor) => (
                <MonitorCard key={monitor.slug} monitor={monitor} />
              ))}
            </div>
          ) : (
            <EmptyList />
          )
        ) : null}
      </div>
    </section>
  );
}

function EmptyList() {
  return <p className="list-product-empty">Không có sản phẩm phù hợp.</p>;
}

function getCategoryOptions(type: ListProductType) {
  if (type === "pc") {
    return pcCategories;
  }

  if (type === "component") {
    return componentCategories;
  }

  return monitorCategories;
}

function getInitialCategory(
  categoryOptions: string[],
  initialCategory?: string,
  initialQuery?: string,
) {
  if (!initialCategory && initialQuery?.trim()) {
    return "";
  }

  if (!initialCategory) {
    return categoryOptions[0];
  }

  return (
    categoryOptions.find(
      (category) => normalizeCategory(category) === normalizeCategory(initialCategory),
    ) ?? categoryOptions[0]
  );
}

function getPageTitle(type: ListProductType) {
  if (type === "pc") {
    return "Danh sách PC";
  }

  if (type === "component") {
    return "Danh sách linh kiện";
  }

  return "Danh sách màn hình";
}

function getBrandOptions(
  type: ListProductType,
  components: ComponentItem[],
  monitors: MonitorItem[],
) {
  const brands =
    type === "component"
      ? components.map((component) => component.brand)
      : monitors.map((monitor) => monitor.brand);

  return Array.from(new Set(brands.filter(Boolean))).sort((first, second) =>
    first.localeCompare(second),
  );
}

function matchesCommonFilters(
  itemCategory: string,
  itemPrice: number,
  selectedCategory: string,
  minPrice: string,
  maxPrice: string,
) {
  const min = normalizeFilterPrice(minPrice);
  const max = maxPrice ? normalizeFilterPrice(maxPrice) : Number.POSITIVE_INFINITY;

  return (
    (!selectedCategory ||
      normalizeCategory(itemCategory) === normalizeCategory(selectedCategory)) &&
    itemPrice >= min &&
    itemPrice <= max
  );
}

function matchesSearch(searchText: string, searchQuery: string) {
  if (!searchQuery) {
    return true;
  }

  return normalizeSearchText(searchText).includes(normalizeSearchText(searchQuery));
}

function normalizeFilterPrice(value: string) {
  const amount = Number(value);

  if (!Number.isFinite(amount) || amount <= 0) {
    return 0;
  }

  return amount * 1000;
}

function getProductCategory(product: Product) {
  const title = product.title.toLowerCase();

  if (title.includes("mini")) {
    return "PC Mini";
  }

  return product.category;
}

function productSearchText(product: Product) {
  return [
    product.title,
    product.category,
    product.price,
    product.warranty,
    product.promo,
    ...product.specs,
  ].join(" ");
}

function componentSearchText(component: ComponentItem) {
  return [
    component.name,
    component.type,
    component.brand,
    component.price,
    ...component.specs.flatMap((spec) => [spec.label, spec.value]),
  ].join(" ");
}

function monitorSearchText(monitor: MonitorItem) {
  return [
    monitor.name,
    monitor.type,
    monitor.category,
    monitor.brand,
    monitor.price,
    monitor.warranty,
    ...monitor.specs.flatMap((spec) => [spec.label, spec.value]),
  ].join(" ");
}

function normalizeCategory(value: string) {
  return normalizeSearchText(value);
}

function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}
