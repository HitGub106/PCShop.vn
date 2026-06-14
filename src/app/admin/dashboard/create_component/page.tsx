import { AdminCreateProductForm } from "../AdminCreateProductForm";

export default function CreateComponentPage() {
  return (
    <div className="admin-create-page">
      <p>Cập nhật sản phẩm</p>
      <h1>Thêm linh kiện</h1>
      <AdminCreateProductForm kind="component" />
    </div>
  );
}
