import { AdminCreateProductForm } from "../AdminCreateProductForm";

export default function CreatePcPage() {
  return (
    <div className="admin-create-page">
      <p>Cập nhật sản phẩm</p>
      <h1>Thêm PC</h1>
      <AdminCreateProductForm kind="pc" />
    </div>
  );
}
