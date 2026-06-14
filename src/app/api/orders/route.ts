import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

import { auth } from "@/auth";

type OrderItemInput = {
  id: string;
  image: string;
  itemType?: "product" | "component" | "monitor" | "custom";
  name: string;
  price: number;
  quantity: number;
};

type BuyerInfoInput = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  note?: string | null;
};

type OrderRequestBody = {
  buyerInfo: BuyerInfoInput;
  items: OrderItemInput[];
};

type InvoiceRow = {
  id: number | string;
  invoice_code: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const allowedItemTypes = new Set(["product", "component", "monitor", "custom"]);

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as OrderRequestBody;
    const validationMessage = validateOrder(body);

    if (validationMessage) {
      return NextResponse.json(
        {
          ok: false,
          message: validationMessage,
        },
        { status: 400 },
      );
    }

    const session = await auth();
    const userId = session?.user.id || null;
    const buyerInfo = body.buyerInfo;
    const items = body.items.map((item) => ({
      ...item,
      itemType:
        item.itemType && allowedItemTypes.has(item.itemType)
          ? item.itemType
          : "product",
      price: Math.max(0, Math.round(Number(item.price) || 0)),
      quantity: Math.max(1, Math.round(Number(item.quantity) || 1)),
    }));
    const totalAmount = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
    const invoiceCode = createInvoiceCode();

    const { rows } = await sql<InvoiceRow>`
      INSERT INTO invoices (
        invoice_code,
        user_id,
        buyer_full_name,
        buyer_phone,
        buyer_email,
        buyer_address,
        buyer_note,
        subtotal_vnd,
        total_amount_vnd,
        status
      )
      VALUES (
        ${invoiceCode},
        ${userId},
        ${buyerInfo.fullName.trim()},
        ${buyerInfo.phone.trim()},
        ${buyerInfo.email.trim().toLowerCase()},
        ${buyerInfo.address.trim()},
        ${buyerInfo.note?.trim() || null},
        ${totalAmount},
        ${totalAmount},
        'pending'
      )
      RETURNING id, invoice_code;
    `;
    const invoice = rows[0];

    for (const item of items) {
      await sql`
        INSERT INTO invoice_details (
          invoice_id,
          item_slug,
          item_type,
          item_name,
          image_url,
          unit_price_vnd,
          quantity,
          line_total_vnd
        )
        VALUES (
          ${invoice.id},
          ${item.id},
          ${item.itemType},
          ${item.name},
          ${item.image},
          ${item.price},
          ${item.quantity},
          ${item.price * item.quantity}
        );
      `;
    }

    return NextResponse.json({
      ok: true,
      invoiceCode: invoice.invoice_code,
      message: "Đặt hàng thành công.",
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "Không thể lưu hóa đơn lúc này. Vui lòng thử lại sau.",
      },
      { status: 500 },
    );
  }
}

function validateOrder(body: OrderRequestBody) {
  if (!body?.buyerInfo || !Array.isArray(body.items)) {
    return "Dữ liệu đặt hàng không hợp lệ.";
  }

  const { fullName, phone, email, address } = body.buyerInfo;
  const phoneDigits = String(phone ?? "").replace(/\D/g, "");

  if (!String(fullName ?? "").trim()) {
    return "Vui lòng nhập họ tên.";
  }

  if (phoneDigits.length < 9 || phoneDigits.length > 11) {
    return "Số điện thoại cần từ 9 đến 11 chữ số.";
  }

  if (!emailPattern.test(String(email ?? "").trim())) {
    return "Email không đúng định dạng.";
  }

  if (String(address ?? "").trim().length < 5) {
    return "Vui lòng nhập địa chỉ đầy đủ.";
  }

  if (body.items.length === 0) {
    return "Giỏ hàng đang trống.";
  }

  const hasInvalidItem = body.items.some(
    (item) =>
      !String(item.id ?? "").trim() ||
      !String(item.name ?? "").trim() ||
      !Number.isFinite(Number(item.price)) ||
      Number(item.price) < 0 ||
      !Number.isFinite(Number(item.quantity)) ||
      Number(item.quantity) < 1,
  );

  if (hasInvalidItem) {
    return "Sản phẩm trong giỏ hàng không hợp lệ.";
  }

  return "";
}

function createInvoiceCode() {
  const randomCode = Math.random().toString(36).slice(2, 8).toUpperCase();

  return `HD-${Date.now()}-${randomCode}`;
}
