import { sql } from "@vercel/postgres";

type StockItemInput = {
  id: string;
  itemType?: "product" | "component" | "monitor" | "custom";
  name?: string;
  quantity: number;
};

type StockRow = {
  quantity: number | string | null;
};

export type StockIssue = {
  id: string;
  itemType: string;
  name: string;
  requestedQuantity: number;
  availableQuantity: number;
};

export type StockValidationResult = {
  ok: boolean;
  issues: StockIssue[];
};

export async function validateStockItems(
  items: StockItemInput[],
): Promise<StockValidationResult> {
  const stockItems = mergeStockItems(items);
  const issues: StockIssue[] = [];

  for (const item of stockItems) {
    if (item.itemType === "custom") {
      continue;
    }

    const availableQuantity = await getAvailableQuantity(item);

    if (availableQuantity < item.quantity) {
      issues.push({
        id: item.id,
        itemType: item.itemType ?? "product",
        name: item.name ?? item.id,
        requestedQuantity: item.quantity,
        availableQuantity,
      });
    }
  }

  return {
    ok: issues.length === 0,
    issues,
  };
}

function mergeStockItems(items: StockItemInput[]) {
  const mergedItems = new Map<string, StockItemInput>();

  for (const item of items) {
    const id = String(item.id ?? "").trim();
    const itemType = item.itemType ?? "product";

    if (!id) {
      continue;
    }

    const key = `${itemType}:${id}`;
    const quantity = Math.max(1, Math.round(Number(item.quantity) || 1));
    const currentItem = mergedItems.get(key);

    if (currentItem) {
      currentItem.quantity += quantity;
    } else {
      mergedItems.set(key, {
        id,
        itemType,
        name: item.name,
        quantity,
      });
    }
  }

  return Array.from(mergedItems.values());
}

async function getAvailableQuantity(item: StockItemInput) {
  if (item.itemType === "monitor") {
    const { rows } = await sql<StockRow>`
      SELECT quantity
      FROM monitors
      WHERE slug = ${item.id}
        AND is_active = true
      LIMIT 1;
    `;

    return Number(rows[0]?.quantity ?? 0);
  }

  if (item.itemType === "component") {
    const { rows } = await sql<StockRow>`
      SELECT
        CASE components.type
          WHEN 'CPU' THEN cpu_details.quantity
          WHEN 'Case' THEN case_details.quantity
          WHEN 'Cooling' THEN cooling_details.quantity
          WHEN 'Mainboard' THEN mainboard_details.quantity
          WHEN 'PSU' THEN psu_details.quantity
          WHEN 'RAM' THEN ram_details.quantity
          WHEN 'SSD' THEN ssd_details.quantity
          WHEN 'VGA' THEN vga_details.quantity
          ELSE NULL
        END AS quantity
      FROM components
      LEFT JOIN cpu_details
        ON cpu_details.component_id = components.id
      LEFT JOIN case_details
        ON case_details.component_id = components.id
      LEFT JOIN cooling_details
        ON cooling_details.component_id = components.id
      LEFT JOIN mainboard_details
        ON mainboard_details.component_id = components.id
      LEFT JOIN psu_details
        ON psu_details.component_id = components.id
      LEFT JOIN ram_details
        ON ram_details.component_id = components.id
      LEFT JOIN ssd_details
        ON ssd_details.component_id = components.id
      LEFT JOIN vga_details
        ON vga_details.component_id = components.id
      WHERE components.slug = ${item.id}
        AND components.is_active = true
      LIMIT 1;
    `;

    return Number(rows[0]?.quantity ?? 0);
  }

  const { rows } = await sql<StockRow>`
    SELECT quantity
    FROM products
    WHERE slug = ${item.id}
      AND is_active = true
    LIMIT 1;
  `;

  return Number(rows[0]?.quantity ?? 0);
}
