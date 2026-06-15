import { NextResponse } from "next/server";

import { validateStockItems } from "../../../lib/stockValidation";

type StockRequestBody = {
  items?: Array<{
    id?: string;
    itemType?: "product" | "component" | "monitor" | "custom";
    name?: string;
    quantity?: number;
  }>;
};

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as StockRequestBody;

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { ok: false, message: "Giỏ hàng đang trống." },
        { status: 400 },
      );
    }

    const result = await validateStockItems(
      body.items.map((item) => ({
        id: String(item.id ?? ""),
        itemType: item.itemType ?? "product",
        name: String(item.name ?? ""),
        quantity: Math.max(1, Math.round(Number(item.quantity) || 1)),
      })),
    );

    if (!result.ok) {
      return NextResponse.json(
        {
          ok: false,
          message: "Không đủ tồn kho, vui lòng thử lại.",
          issues: result.issues,
        },
        { status: 409 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "Không thể kiểm tra tồn kho lúc này. Vui lòng thử lại sau.",
      },
      { status: 500 },
    );
  }
}
