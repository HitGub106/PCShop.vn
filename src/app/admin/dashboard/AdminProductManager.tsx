"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { ComponentItem, MonitorItem, Product } from "@/app/lib/data";

type ProductType = "pc" | "component" | "monitor";

type AdminProductManagerProps = {
  components: ComponentItem[];
  monitors: MonitorItem[];
  products: Product[];
};

const productTypes: Array<{
  createPath: string;
  label: string;
  title: string;
  value: ProductType;
}> = [
  {
    createPath: "/admin/dashboard/create_pc",
    label: "PC",
    title: "Danh sách PC",
    value: "pc",
  },
  {
    createPath: "/admin/dashboard/create_component",
    label: "Linh kiện",
    title: "Danh sách linh kiện",
    value: "component",
  },
  {
    createPath: "/admin/dashboard/create_monitor",
    label: "Màn hình",
    title: "Danh sách màn hình",
    value: "monitor",
  },
];

export function AdminProductManager({
  components,
  monitors,
  products,
}: AdminProductManagerProps) {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<ProductType>("pc");
  const [deletingSlug, setDeletingSlug] = useState("");
  const [status, setStatus] = useState("");

  const currentType = useMemo(
    () => productTypes.find((type) => type.value === selectedType) ?? productTypes[0],
    [selectedType],
  );

  function handleCreateProduct() {
    router.push(currentType.createPath);
  }

  async function handleDeleteProduct(
    kind: ProductType,
    slug: string,
    name: string,
  ) {
    const confirmed = window.confirm(`Xoá "${name}" khỏi danh sách?`);

    if (!confirmed) {
      return;
    }

    setDeletingSlug(slug);
    setStatus("");

    try {
      const response = await fetch("/api/admin/products", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ kind, slug }),
      });
      const result = (await response.json()) as {
        message?: string;
        ok?: boolean;
      };

      if (!response.ok || !result.ok) {
        setStatus(result.message ?? "Không thể xoá sản phẩm.");
        return;
      }

      setStatus(result.message ?? "Đã xoá sản phẩm.");
      router.refresh();
    } catch {
      setStatus("Không thể kết nối để xoá sản phẩm.");
    } finally {
      setDeletingSlug("");
    }
  }

  return (
    <div className="admin-products">
      <div className="admin-products-header">
        <label className="admin-product-type">
          <span>Cập nhật sản phẩm</span>
          <select
            onChange={(event) => setSelectedType(event.target.value as ProductType)}
            value={selectedType}
          >
            {productTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </label>

        <button
          className="admin-create-button"
          onClick={handleCreateProduct}
          type="button"
        >
          Thêm sản phẩm
        </button>
      </div>

      <h1 className="admin-products-title">{currentType.title}</h1>
      {status ? <p className="admin-table-status">{status}</p> : null}

      <div className="admin-table-wrap">
        {selectedType === "pc" ? (
          <PcTable
            deletingSlug={deletingSlug}
            onDelete={handleDeleteProduct}
            products={products}
          />
        ) : null}
        {selectedType === "component" ? (
          <ComponentTable
            components={components}
            deletingSlug={deletingSlug}
            onDelete={handleDeleteProduct}
          />
        ) : null}
        {selectedType === "monitor" ? (
          <MonitorTable
            deletingSlug={deletingSlug}
            monitors={monitors}
            onDelete={handleDeleteProduct}
          />
        ) : null}
      </div>
    </div>
  );
}

function PcTable({
  deletingSlug,
  onDelete,
  products,
}: {
  deletingSlug: string;
  onDelete: (kind: ProductType, slug: string, name: string) => void;
  products: Product[];
}) {
  if (products.length === 0) {
    return <EmptyTable />;
  }

  return (
    <table className="admin-product-table">
      <thead>
        <tr>
          <th>Tên sản phẩm</th>
          <th>Danh mục</th>
          <th>Giá</th>
          <th>Tồn kho</th>
          <th>Bảo hành</th>
          <th>Khuyến mãi</th>
          <th className="admin-action-head">Xoá</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.slug}>
            <td>{product.title}</td>
            <td>{product.category}</td>
            <td>{product.price}</td>
            <td>{product.quantity}</td>
            <td>{product.warranty || "-"}</td>
            <td>{product.promo || "-"}</td>
            <td className="admin-action-cell">
              <DeleteButton
                disabled={deletingSlug === product.slug}
                label={`Xoá ${product.title}`}
                onClick={() => onDelete("pc", product.slug, product.title)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ComponentTable({
  components,
  deletingSlug,
  onDelete,
}: {
  components: ComponentItem[];
  deletingSlug: string;
  onDelete: (kind: ProductType, slug: string, name: string) => void;
}) {
  if (components.length === 0) {
    return <EmptyTable />;
  }

  return (
    <table className="admin-product-table">
      <thead>
        <tr>
          <th>Tên linh kiện</th>
          <th>Loại</th>
          <th>Thương hiệu</th>
          <th>Giá</th>
          <th>Tồn kho</th>
          <th>Thông số</th>
          <th className="admin-action-head">Xoá</th>
        </tr>
      </thead>
      <tbody>
        {components.map((component) => (
          <tr key={component.slug}>
            <td>{component.name}</td>
            <td>{component.type}</td>
            <td>{component.brand || "-"}</td>
            <td>{component.price || "-"}</td>
            <td>{component.quantity}</td>
            <td>{formatSpecs(component.specs)}</td>
            <td className="admin-action-cell">
              <DeleteButton
                disabled={deletingSlug === component.slug}
                label={`Xoá ${component.name}`}
                onClick={() =>
                  onDelete("component", component.slug, component.name)
                }
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function MonitorTable({
  deletingSlug,
  monitors,
  onDelete,
}: {
  deletingSlug: string;
  monitors: MonitorItem[];
  onDelete: (kind: ProductType, slug: string, name: string) => void;
}) {
  if (monitors.length === 0) {
    return <EmptyTable />;
  }

  return (
    <table className="admin-product-table">
      <thead>
        <tr>
          <th>Tên màn hình</th>
          <th>Danh mục</th>
          <th>Thương hiệu</th>
          <th>Giá</th>
          <th>Tồn kho</th>
          <th>Bảo hành</th>
          <th className="admin-action-head">Xoá</th>
        </tr>
      </thead>
      <tbody>
        {monitors.map((monitor) => (
          <tr key={monitor.slug}>
            <td>{monitor.name}</td>
            <td>{monitor.category}</td>
            <td>{monitor.brand}</td>
            <td>{monitor.price}</td>
            <td>{monitor.quantity}</td>
            <td>{monitor.warranty || "-"}</td>
            <td className="admin-action-cell">
              <DeleteButton
                disabled={deletingSlug === monitor.slug}
                label={`Xoá ${monitor.name}`}
                onClick={() => onDelete("monitor", monitor.slug, monitor.name)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function EmptyTable() {
  return <p className="admin-empty-table">Chưa có sản phẩm trong danh sách này.</p>;
}

function DeleteButton({
  disabled,
  label,
  onClick,
}: {
  disabled: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      className="admin-delete-button"
      disabled={disabled}
      onClick={onClick}
      title={label}
      type="button"
    >
      <span className="admin-trash-icon" aria-hidden="true">
        <span />
      </span>
    </button>
  );
}

function formatSpecs(specs: ComponentItem["specs"]) {
  if (specs.length === 0) {
    return "-";
  }

  return specs
    .slice(0, 3)
    .map((spec) => `${spec.label}: ${spec.value}`)
    .join(", ");
}
