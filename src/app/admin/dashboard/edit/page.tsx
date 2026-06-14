import { fetchComponents, fetchMonitors, fetchProducts } from "@/app/lib/data";
import { AdminProductManager } from "../AdminProductManager";

export default async function AdminEditProductPage() {
  const [products, components, monitors] = await Promise.all([
    fetchProducts(100),
    fetchComponents(100),
    fetchMonitors(100),
  ]);

  return (
    <AdminProductManager
      components={components}
      monitors={monitors}
      products={products}
    />
  );
}
