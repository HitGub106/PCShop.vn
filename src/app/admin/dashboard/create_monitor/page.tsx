import { AdminCreateProductForm } from "../AdminCreateProductForm";

export default function CreateMonitorPage() {
  return (
    <div className="admin-create-page">
      <p>Cập nhật sản phẩm</p>
      <h1>Thêm màn hình</h1>
      <AdminCreateProductForm kind="monitor" />
    </div>
  );
}
