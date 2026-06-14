import { notFound } from "next/navigation";

import {
  fetchComponents,
  fetchMonitors,
  fetchProducts,
} from "../../lib/data";
import { ListProductContent } from "../ListProductContent";

type ListProductPageProps = {
  params: Promise<{
    type: string;
  }>;
  searchParams: Promise<{
    category?: string;
    q?: string;
    type?: string;
  }>;
};

const allowedTypes = ["pc", "component", "monitor"] as const;
type ListProductType = (typeof allowedTypes)[number];

export default async function ListProductPage({
  params,
  searchParams,
}: ListProductPageProps) {
  const { type } = await params;
  const { category, q } = await searchParams;

  if (!isListProductType(type)) {
    notFound();
  }

  const [products, components, monitors] = await Promise.all([
    type === "pc" ? fetchProducts(100) : Promise.resolve([]),
    type === "component" ? fetchComponents(100) : Promise.resolve([]),
    type === "monitor" ? fetchMonitors(100) : Promise.resolve([]),
  ]);

  return (
    <ListProductContent
      components={components}
      initialCategory={category}
      initialQuery={q}
      monitors={monitors}
      products={products}
      type={type}
    />
  );
}

function isListProductType(type: string): type is ListProductType {
  return allowedTypes.includes(type as ListProductType);
}
