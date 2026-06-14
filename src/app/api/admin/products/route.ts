import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { auth } from "@/auth";

type RequestBody = Record<string, unknown>;

type ComponentType =
  | "CPU"
  | "Case"
  | "Cooling"
  | "Mainboard"
  | "PSU"
  | "RAM"
  | "SSD"
  | "VGA";

type ComponentInsertRow = {
  id: number | string;
  slug: string;
};

const componentTypes = new Set<ComponentType>([
  "CPU",
  "Case",
  "Cooling",
  "Mainboard",
  "PSU",
  "RAM",
  "SSD",
  "VGA",
]);

export async function POST(request: Request) {
  const session = await auth();

  if (session?.user.role !== "admin") {
    return NextResponse.json(
      { ok: false, message: "Không có quyền admin." },
      { status: 403 },
    );
  }

  try {
    const body = (await request.json()) as RequestBody;
    const kind = getString(body, "kind");

    if (kind === "pc") {
      const slug = await createUniqueSlug("products", body, "title");

      await sql`
        INSERT INTO products (
          title,
          slug,
          price_vnd,
          old_price_vnd,
          discount_label,
          warranty,
          image_url,
          promo,
          category,
          quantity,
          is_featured,
          is_active,
          sort_order
        )
        VALUES (
          ${requireString(body, "title")},
          ${slug},
          ${requireInteger(body, "priceVnd")},
          ${optionalInteger(body, "oldPriceVnd")},
          ${optionalString(body, "discountLabel")},
          ${optionalString(body, "warranty")},
          ${requireString(body, "imageUrl")},
          ${optionalString(body, "promo")},
          ${requireString(body, "category")},
          ${requireInteger(body, "quantity")},
          ${getBoolean(body, "isFeatured")},
          true,
          ${optionalInteger(body, "sortOrder") ?? 0}
        );
      `;

      return createdResponse(slug);
    }

    if (kind === "monitor") {
      const slug = await createUniqueSlug("monitors", body, "name");

      await sql`
        INSERT INTO monitors (
          name,
          slug,
          category,
          brand,
          price_vnd,
          old_price_vnd,
          discount_label,
          warranty,
          image_url,
          quantity,
          size_inches,
          resolution,
          panel_type,
          refresh_rate_hz,
          response_time_ms,
          brightness_nits,
          color_gamut,
          ports,
          adaptive_sync,
          is_active,
          sort_order
        )
        VALUES (
          ${requireString(body, "name")},
          ${slug},
          ${requireString(body, "category")},
          ${requireString(body, "brand")},
          ${requireInteger(body, "priceVnd")},
          ${optionalInteger(body, "oldPriceVnd")},
          ${optionalString(body, "discountLabel")},
          ${optionalString(body, "warranty")},
          ${requireString(body, "imageUrl")},
          ${requireInteger(body, "quantity")},
          ${requireNumber(body, "sizeInches")},
          ${requireString(body, "resolution")},
          ${requireString(body, "panelType")},
          ${requireInteger(body, "refreshRateHz")},
          ${requireNumber(body, "responseTimeMs")},
          ${requireInteger(body, "brightnessNits")},
          ${requireString(body, "colorGamut")},
          ${requireString(body, "ports")},
          ${requireString(body, "adaptiveSync")},
          true,
          ${optionalInteger(body, "sortOrder") ?? 0}
        );
      `;

      return createdResponse(slug);
    }

    if (kind === "component") {
      const type = requireComponentType(body);
      const slug = await createUniqueSlug("components", body, "name");
      const { rows } = await sql<ComponentInsertRow>`
        INSERT INTO components (
          name,
          slug,
          type,
          brand,
          price_vnd,
          image_url,
          is_active
        )
        VALUES (
          ${requireString(body, "name")},
          ${slug},
          ${type},
          ${optionalString(body, "brand")},
          ${requireInteger(body, "priceVnd")},
          ${optionalString(body, "imageUrl")},
          true
        )
        RETURNING id, slug;
      `;

      try {
        await insertComponentDetail(rows[0].id, type, body);
      } catch (error) {
        await sql`
          DELETE FROM components
          WHERE id = ${rows[0].id};
        `;
        throw error;
      }

      return createdResponse(rows[0].slug);
    }

    return NextResponse.json(
      { ok: false, message: "Loại sản phẩm không hợp lệ." },
      { status: 400 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Không thể thêm sản phẩm.";

    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const session = await auth();

  if (session?.user.role !== "admin") {
    return NextResponse.json(
      { ok: false, message: "Không có quyền admin." },
      { status: 403 },
    );
  }

  try {
    const body = (await request.json()) as RequestBody;
    const kind = requireString(body, "kind");
    const slug = requireString(body, "slug");

    if (kind === "pc") {
      const { rowCount } = await sql`
        DELETE FROM products
        WHERE slug = ${slug};
      `;

      return deletedResponse(rowCount ?? 0);
    }

    if (kind === "monitor") {
      const { rowCount } = await sql`
        DELETE FROM monitors
        WHERE slug = ${slug};
      `;

      return deletedResponse(rowCount ?? 0);
    }

    if (kind === "component") {
      const { rows } = await sql<{ id: number | string }>`
        SELECT id
        FROM components
        WHERE slug = ${slug}
        LIMIT 1;
      `;
      const component = rows[0];

      if (!component) {
        return deletedResponse(0);
      }

      await sql`
        DELETE FROM product_parts
        WHERE component_id = ${component.id};
      `;
      const { rowCount } = await sql`
        DELETE FROM components
        WHERE id = ${component.id};
      `;

      return deletedResponse(rowCount ?? 0);
    }

    return NextResponse.json(
      { ok: false, message: "Loại sản phẩm không hợp lệ." },
      { status: 400 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Không thể xoá sản phẩm.";

    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}

async function insertComponentDetail(
  componentId: number | string,
  type: ComponentType,
  body: RequestBody,
) {
  const quantity = requireInteger(body, "quantity");

  switch (type) {
    case "CPU":
      await sql`
        INSERT INTO cpu_details (
          component_id,
          socket,
          core_count,
          thread_count,
          base_clock_ghz,
          boost_clock_ghz,
          tdp_watts,
          integrated_graphics,
          quantity
        )
        VALUES (
          ${componentId},
          ${requireString(body, "socket")},
          ${requireInteger(body, "coreCount")},
          ${requireInteger(body, "threadCount")},
          ${requireNumber(body, "baseClockGhz")},
          ${requireNumber(body, "boostClockGhz")},
          ${requireInteger(body, "tdpWatts")},
          ${getBoolean(body, "integratedGraphics")},
          ${quantity}
        );
      `;
      return;

    case "Case":
      await sql`
        INSERT INTO case_details (
          component_id,
          form_factor,
          color,
          side_panel,
          fan_count,
          supports_motherboard,
          quantity
        )
        VALUES (
          ${componentId},
          ${requireString(body, "formFactor")},
          ${requireString(body, "color")},
          ${requireString(body, "sidePanel")},
          ${requireInteger(body, "fanCount")},
          ${requireString(body, "supportsMotherboard")},
          ${quantity}
        );
      `;
      return;

    case "Cooling":
      await sql`
        INSERT INTO cooling_details (
          component_id,
          cooling_type,
          fan_size_mm,
          radiator_size_mm,
          height_mm,
          socket_support,
          quantity
        )
        VALUES (
          ${componentId},
          ${requireString(body, "coolingType")},
          ${requireInteger(body, "fanSizeMm")},
          ${optionalInteger(body, "radiatorSizeMm")},
          ${optionalInteger(body, "heightMm")},
          ${requireString(body, "socketSupport")},
          ${quantity}
        );
      `;
      return;

    case "Mainboard":
      await sql`
        INSERT INTO mainboard_details (
          component_id,
          chipset,
          socket,
          form_factor,
          memory_type,
          memory_slots,
          max_memory_gb,
          wifi,
          quantity
        )
        VALUES (
          ${componentId},
          ${requireString(body, "chipset")},
          ${requireString(body, "socket")},
          ${requireString(body, "formFactor")},
          ${requireString(body, "memoryType")},
          ${requireInteger(body, "memorySlots")},
          ${requireInteger(body, "maxMemoryGb")},
          ${getBoolean(body, "wifi")},
          ${quantity}
        );
      `;
      return;

    case "PSU":
      await sql`
        INSERT INTO psu_details (
          component_id,
          wattage,
          efficiency_rating,
          modular_type,
          form_factor,
          quantity
        )
        VALUES (
          ${componentId},
          ${requireInteger(body, "wattage")},
          ${requireString(body, "efficiencyRating")},
          ${requireString(body, "modularType")},
          ${requireString(body, "formFactor")},
          ${quantity}
        );
      `;
      return;

    case "RAM":
      await sql`
        INSERT INTO ram_details (
          component_id,
          capacity_gb,
          memory_type,
          bus_speed_mhz,
          module_count,
          has_rgb,
          quantity
        )
        VALUES (
          ${componentId},
          ${requireInteger(body, "capacityGb")},
          ${requireString(body, "memoryType")},
          ${requireInteger(body, "busSpeedMhz")},
          ${requireInteger(body, "moduleCount")},
          ${getBoolean(body, "hasRgb")},
          ${quantity}
        );
      `;
      return;

    case "SSD":
      await sql`
        INSERT INTO ssd_details (
          component_id,
          capacity_gb,
          interface_type,
          form_factor,
          generation,
          read_speed_mbps,
          write_speed_mbps,
          quantity
        )
        VALUES (
          ${componentId},
          ${requireInteger(body, "capacityGb")},
          ${requireString(body, "interfaceType")},
          ${requireString(body, "formFactor")},
          ${requireString(body, "generation")},
          ${requireInteger(body, "readSpeedMbps")},
          ${requireInteger(body, "writeSpeedMbps")},
          ${quantity}
        );
      `;
      return;

    case "VGA":
      await sql`
        INSERT INTO vga_details (
          component_id,
          gpu_chipset,
          cuda_cores,
          stream_processors,
          vram_gb,
          vram_type,
          base_clock_mhz,
          boost_clock_mhz,
          recommended_psu_watts,
          quantity
        )
        VALUES (
          ${componentId},
          ${requireString(body, "gpuChipset")},
          ${optionalInteger(body, "cudaCores")},
          ${optionalInteger(body, "streamProcessors")},
          ${requireInteger(body, "vramGb")},
          ${requireString(body, "vramType")},
          ${requireInteger(body, "baseClockMhz")},
          ${requireInteger(body, "boostClockMhz")},
          ${requireInteger(body, "recommendedPsuWatts")},
          ${quantity}
        );
      `;
      return;
  }
}

async function createUniqueSlug(
  table: "components" | "monitors" | "products",
  body: RequestBody,
  fallbackKey: string,
) {
  const preferredSlug = optionalString(body, "slug");
  const baseSlug = slugify(preferredSlug || requireString(body, fallbackKey));
  let slug = baseSlug;
  let suffix = 2;

  while (await slugExists(table, slug)) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

async function slugExists(
  table: "components" | "monitors" | "products",
  slug: string,
) {
  if (table === "products") {
    const { rows } = await sql<{ exists: boolean }>`
      SELECT EXISTS(SELECT 1 FROM products WHERE slug = ${slug}) AS exists;
    `;
    return rows[0]?.exists ?? false;
  }

  if (table === "monitors") {
    const { rows } = await sql<{ exists: boolean }>`
      SELECT EXISTS(SELECT 1 FROM monitors WHERE slug = ${slug}) AS exists;
    `;
    return rows[0]?.exists ?? false;
  }

  const { rows } = await sql<{ exists: boolean }>`
    SELECT EXISTS(SELECT 1 FROM components WHERE slug = ${slug}) AS exists;
  `;
  return rows[0]?.exists ?? false;
}

function createdResponse(slug: string) {
  revalidateAdminProductPages();

  return NextResponse.json({
    ok: true,
    slug,
    message: "Đã thêm sản phẩm mới.",
  });
}

function deletedResponse(rowCount: number) {
  if (rowCount < 1) {
    return NextResponse.json(
      { ok: false, message: "Không tìm thấy sản phẩm cần xoá." },
      { status: 404 },
    );
  }

  revalidateAdminProductPages();

  return NextResponse.json({
    ok: true,
    message: "Đã xoá sản phẩm.",
  });
}

function revalidateAdminProductPages() {
  revalidatePath("/admin/dashboard/edit");
  revalidatePath("/admin/dashboard");
}

function requireComponentType(body: RequestBody): ComponentType {
  const type = getString(body, "type");

  if (!componentTypes.has(type as ComponentType)) {
    throw new Error("Loại linh kiện không hợp lệ.");
  }

  return type as ComponentType;
}

function requireString(body: RequestBody, key: string) {
  const value = getString(body, key);

  if (!value) {
    throw new Error(`Thiếu trường ${key}.`);
  }

  return value;
}

function optionalString(body: RequestBody, key: string) {
  const value = getString(body, key);
  return value || null;
}

function getString(body: RequestBody, key: string) {
  const value = body[key];

  return typeof value === "string" ? value.trim() : "";
}

function requireInteger(body: RequestBody, key: string) {
  const value = parseNumber(body, key);

  if (!Number.isFinite(value)) {
    throw new Error(`Trường ${key} không hợp lệ.`);
  }

  return Math.max(0, Math.round(value));
}

function optionalInteger(body: RequestBody, key: string) {
  const value = parseNumber(body, key);

  if (!Number.isFinite(value)) {
    return null;
  }

  return Math.max(0, Math.round(value));
}

function requireNumber(body: RequestBody, key: string) {
  const value = parseNumber(body, key);

  if (!Number.isFinite(value)) {
    throw new Error(`Trường ${key} không hợp lệ.`);
  }

  return Math.max(0, value);
}

function parseNumber(body: RequestBody, key: string) {
  const value = body[key];

  if (typeof value === "number") {
    return value;
  }

  if (typeof value !== "string" || !value.trim()) {
    return Number.NaN;
  }

  return Number(value);
}

function getBoolean(body: RequestBody, key: string) {
  const value = body[key];

  return value === true || value === "true" || value === "on";
}

function slugify(value: string) {
  const slug = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || `san-pham-${Date.now()}`;
}
