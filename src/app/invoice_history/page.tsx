import { sql } from "@vercel/postgres";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

type InvoiceHistoryRow = {
  invoice_code: string;
  created_at: Date | string;
  status: string | null;
  item_slug: string;
  item_type: string;
  item_name: string;
  unit_price_vnd: number | string | null;
  quantity: number | string | null;
  line_total_vnd: number | string | null;
};

const currencyFormatter = new Intl.NumberFormat("vi-VN");

export const dynamic = "force-dynamic";

export default async function InvoiceHistoryPage() {
  const session = await auth();

  if (!session?.user.id) {
    redirect("/login");
  }

  if (session.user.role !== "user") {
    redirect("/");
  }

  const rows = await fetchInvoiceHistory(session.user.id);

  return (
    <section className="container invoice-history-page">
      <div className="invoice-history-heading">
        <div>
          <p>Lịch sử mua hàng</p>
          <span>Các mặt hàng đã đặt theo từng hóa đơn của bạn.</span>
        </div>
      </div>

      {rows.length > 0 ? (
        <div className="invoice-history-table-wrap">
          <table className="invoice-history-table">
            <thead>
              <tr>
                <th>Mã hóa đơn</th>
                <th>Ngày đặt</th>
                <th>Sản phẩm</th>
                <th>Loại</th>
                <th>Đơn giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={`${row.invoice_code}-${row.item_slug}`}>
                  <td>
                    <span className="invoice-history-code">
                      {row.invoice_code}
                    </span>
                  </td>
                  <td>{formatDate(row.created_at)}</td>
                  <td>
                    <strong className="invoice-history-product">
                      {row.item_name}
                    </strong>
                  </td>
                  <td>{formatItemType(row.item_type)}</td>
                  <td>{formatVnd(Number(row.unit_price_vnd ?? 0))}</td>
                  <td>{Number(row.quantity ?? 0)}</td>
                  <td>{formatVnd(Number(row.line_total_vnd ?? 0))}</td>
                  <td>
                    <span className="invoice-history-status">
                      {formatStatus(row.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="invoice-history-empty">Bạn chưa có đơn hàng nào.</p>
      )}
    </section>
  );
}

async function fetchInvoiceHistory(userId: string) {
  const { rows } = await sql<InvoiceHistoryRow>`
    SELECT
      invoices.invoice_code,
      invoices.created_at,
      invoices.status,
      invoice_details.item_slug,
      invoice_details.item_type,
      invoice_details.item_name,
      invoice_details.unit_price_vnd,
      invoice_details.quantity,
      invoice_details.line_total_vnd
    FROM invoices
    INNER JOIN invoice_details
      ON invoice_details.invoice_id = invoices.id
    WHERE invoices.user_id = ${userId}
    ORDER BY invoices.created_at DESC, invoices.id DESC, invoice_details.item_name ASC;
  `;

  return rows;
}

function formatVnd(value: number) {
  return `${currencyFormatter.format(value)} VND`;
}

function formatDate(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function formatItemType(value: string) {
  switch (value) {
    case "product":
      return "PC";
    case "component":
      return "Linh kiện";
    case "monitor":
      return "Màn hình";
    case "custom":
      return "Tùy chỉnh";
    default:
      return value;
  }
}

function formatStatus(value: string | null) {
  switch (value) {
    case "pending":
      return "Đang xử lý";
    case "paid":
      return "Đã thanh toán";
    case "completed":
      return "Hoàn tất";
    case "cancelled":
      return "Đã hủy";
    default:
      return value ?? "";
  }
}
