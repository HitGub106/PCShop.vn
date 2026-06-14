import { sql } from "@vercel/postgres";

export type Product = {
  slug: string;
  title: string;
  category: string;
  quantity: number;
  price: string;
  oldPrice: string;
  discount: string;
  warranty: string;
  image: string;
  specs: string[];
  promo: string;
};

export type ComponentSpec = {
  label: string;
  value: string;
};

export type ComponentItem = {
  slug: string;
  name: string;
  type: string;
  brand: string;
  quantity: number;
  price: string;
  image: string;
  specs: ComponentSpec[];
};

export type MonitorItem = {
  slug: string;
  name: string;
  type: string;
  category: string;
  brand: string;
  quantity: number;
  price: string;
  oldPrice: string;
  discount: string;
  warranty: string;
  image: string;
  specs: ComponentSpec[];
};

export type ProductDetail = Product & {
  category: string;
  components: ComponentItem[];
};

type ProductRow = {
  slug: string;
  title: string;
  category: string;
  quantity: number | string | null;
  price_vnd: number | string;
  old_price_vnd: number | string | null;
  discount_label: string | null;
  warranty: string | null;
  image_url: string;
  promo: string | null;
  specs: string[] | null;
};

type ProductDetailRow = {
  id: number | string;
  slug: string;
  title: string;
  price_vnd: number | string;
  old_price_vnd: number | string | null;
  discount_label: string | null;
  warranty: string | null;
  image_url: string;
  promo: string | null;
  category: string;
  quantity: number | string | null;
};

type ComponentRow = {
  slug: string;
  name: string;
  type: string;
  brand: string | null;
  quantity: number | string | null;
  price_vnd: number | string | null;
  image_url: string | null;
  cpu_socket: string | null;
  cpu_core_count: number | null;
  cpu_thread_count: number | null;
  cpu_base_clock_ghz: number | string | null;
  cpu_boost_clock_ghz: number | string | null;
  cpu_tdp_watts: number | null;
  cpu_integrated_graphics: boolean | null;
  case_form_factor: string | null;
  case_color: string | null;
  case_side_panel: string | null;
  case_fan_count: number | null;
  case_supports_motherboard: string | null;
  cooling_type: string | null;
  cooling_fan_size_mm: number | null;
  cooling_radiator_size_mm: number | null;
  cooling_height_mm: number | null;
  cooling_socket_support: string | null;
  mainboard_chipset: string | null;
  mainboard_socket: string | null;
  mainboard_form_factor: string | null;
  mainboard_memory_type: string | null;
  mainboard_memory_slots: number | null;
  mainboard_max_memory_gb: number | null;
  mainboard_wifi: boolean | null;
  psu_wattage: number | null;
  psu_efficiency_rating: string | null;
  psu_modular_type: string | null;
  psu_form_factor: string | null;
  ram_capacity_gb: number | null;
  ram_memory_type: string | null;
  ram_bus_speed_mhz: number | null;
  ram_module_count: number | null;
  ram_has_rgb: boolean | null;
  ssd_capacity_gb: number | null;
  ssd_interface_type: string | null;
  ssd_form_factor: string | null;
  ssd_generation: string | null;
  ssd_read_speed_mbps: number | null;
  ssd_write_speed_mbps: number | null;
  vga_gpu_chipset: string | null;
  vga_cuda_cores: number | null;
  vga_stream_processors: number | null;
  vga_vram_gb: number | null;
  vga_vram_type: string | null;
  vga_base_clock_mhz: number | null;
  vga_boost_clock_mhz: number | null;
  vga_recommended_psu_watts: number | null;
};

type MonitorRow = {
  slug: string;
  name: string;
  category: string | null;
  brand: string;
  quantity: number | string | null;
  price_vnd: number | string;
  old_price_vnd: number | string | null;
  discount_label: string | null;
  warranty: string | null;
  image_url: string;
  size_inches: number | string;
  resolution: string;
  panel_type: string;
  refresh_rate_hz: number;
  response_time_ms: number | string;
  brightness_nits: number;
  color_gamut: string;
  ports: string;
  adaptive_sync: string;
};

const currencyFormatter = new Intl.NumberFormat("vi-VN");

function formatVnd(value: number | string | null) {
  if (value === null) {
    return "";
  }

  const amount = typeof value === "number" ? value : Number(value);

  return `${currencyFormatter.format(amount)} VND`;
}

function formatBoolean(value: boolean | null) {
  if (value === null) {
    return "";
  }

  return value ? "Có" : "Không";
}

function createSpec(label: string, value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  return {
    label,
    value: String(value),
  };
}

function createUnitSpec(
  label: string,
  value: string | number | null | undefined,
  unit: string,
) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  return createSpec(label, `${value}${unit}`);
}

function createPairSpec(
  label: string,
  first: string | number | null | undefined,
  second: string | number | null | undefined,
  separator: string,
) {
  if (
    first === null ||
    first === undefined ||
    first === "" ||
    second === null ||
    second === undefined ||
    second === ""
  ) {
    return null;
  }

  return createSpec(label, `${first}${separator}${second}`);
}

function getComponentImage(type: string) {
  const images: Record<string, string> = {
    CPU: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=500&q=80",
    Mainboard:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=80",
    RAM: "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=500&q=80",
    SSD: "https://images.unsplash.com/photo-1597138804456-e7dca7f59d44?auto=format&fit=crop&w=500&q=80",
    VGA: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=500&q=80",
    PSU: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=500&q=80",
    Case: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=500&q=80",
    Cooling:
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=500&q=80",
  };

  return images[type] ?? "/pc_component.png";
}

function getComponentSpecs(component: ComponentRow): ComponentSpec[] {
  const specsByType: Record<string, Array<ComponentSpec | null>> = {
    CPU: [
      createSpec("Socket", component.cpu_socket),
      createPairSpec(
        "Nhân / luồng",
        component.cpu_core_count,
        component.cpu_thread_count,
        " / ",
      ),
      createUnitSpec("Xung cơ bản", component.cpu_base_clock_ghz, " GHz"),
      createUnitSpec("Xung boost", component.cpu_boost_clock_ghz, " GHz"),
      createUnitSpec("TDP", component.cpu_tdp_watts, "W"),
      createSpec("iGPU", formatBoolean(component.cpu_integrated_graphics)),
    ],
    Case: [
      createSpec("Form factor", component.case_form_factor),
      createSpec("Màu", component.case_color),
      createSpec("Hông case", component.case_side_panel),
      createSpec("Số fan", component.case_fan_count),
      createSpec("Hỗ trợ main", component.case_supports_motherboard),
    ],
    Cooling: [
      createSpec("Kiểu tản", component.cooling_type),
      createUnitSpec("Fan", component.cooling_fan_size_mm, "mm"),
      createUnitSpec("Radiator", component.cooling_radiator_size_mm, "mm"),
      createUnitSpec("Chiều cao", component.cooling_height_mm, "mm"),
      createSpec("Socket", component.cooling_socket_support),
    ],
    Mainboard: [
      createSpec("Chipset", component.mainboard_chipset),
      createSpec("Socket", component.mainboard_socket),
      createSpec("Kích thước", component.mainboard_form_factor),
      createSpec("RAM hỗ trợ", component.mainboard_memory_type),
      createSpec("Khe RAM", component.mainboard_memory_slots),
      createUnitSpec("RAM tối đa", component.mainboard_max_memory_gb, "GB"),
      createSpec("Wi-Fi", formatBoolean(component.mainboard_wifi)),
    ],
    PSU: [
      createUnitSpec("Công suất", component.psu_wattage, "W"),
      createSpec("Chuẩn", component.psu_efficiency_rating),
      createSpec("Dây nguồn", component.psu_modular_type),
      createSpec("Form factor", component.psu_form_factor),
    ],
    RAM: [
      createUnitSpec("Dung lượng", component.ram_capacity_gb, "GB"),
      createSpec("Loại RAM", component.ram_memory_type),
      createUnitSpec("Bus", component.ram_bus_speed_mhz, "MHz"),
      createSpec("Số thanh", component.ram_module_count),
      createSpec("RGB", formatBoolean(component.ram_has_rgb)),
    ],
    SSD: [
      createUnitSpec("Dung lượng", component.ssd_capacity_gb, "GB"),
      createSpec("Giao tiếp", component.ssd_interface_type),
      createSpec("Form factor", component.ssd_form_factor),
      createSpec("Chuẩn", component.ssd_generation),
      createUnitSpec("Đọc", component.ssd_read_speed_mbps, "MB/s"),
      createUnitSpec("Ghi", component.ssd_write_speed_mbps, "MB/s"),
    ],
    VGA: [
      createSpec("GPU", component.vga_gpu_chipset),
      createSpec("CUDA cores", component.vga_cuda_cores),
      createSpec("Stream processors", component.vga_stream_processors),
      createPairSpec(
        "VRAM",
        component.vga_vram_gb,
        component.vga_vram_type,
        "GB ",
      ),
      createUnitSpec("Base clock", component.vga_base_clock_mhz, "MHz"),
      createUnitSpec("Boost clock", component.vga_boost_clock_mhz, "MHz"),
      createUnitSpec("PSU đề xuất", component.vga_recommended_psu_watts, "W"),
    ],
  };

  return (specsByType[component.type] ?? []).filter(
    (spec): spec is ComponentSpec => Boolean(spec),
  );
}

function mapComponentRow(component: ComponentRow): ComponentItem {
  return {
    slug: component.slug,
    name: component.name,
    type: component.type,
    brand: component.brand ?? component.type,
    quantity: Number(component.quantity ?? 0),
    price: formatVnd(component.price_vnd),
    image: component.image_url ?? getComponentImage(component.type),
    specs: getComponentSpecs(component),
  };
}

function mapMonitorRow(monitor: MonitorRow): MonitorItem {
  return {
    slug: monitor.slug,
    name: monitor.name,
    type: "Monitor",
    category: monitor.category ?? "Văn phòng",
    brand: monitor.brand,
    quantity: Number(monitor.quantity ?? 0),
    price: formatVnd(monitor.price_vnd),
    oldPrice: formatVnd(monitor.old_price_vnd),
    discount: monitor.discount_label ?? "",
    warranty: monitor.warranty ?? "",
    image: monitor.image_url.trim(),
    specs: [
      createUnitSpec("Kích thước", monitor.size_inches, " inch"),
      createSpec("Độ phân giải", monitor.resolution),
      createSpec("Tấm nền", monitor.panel_type),
      createUnitSpec("Tần số quét", monitor.refresh_rate_hz, "Hz"),
      createUnitSpec("Phản hồi", monitor.response_time_ms, "ms"),
      createUnitSpec("Độ sáng", monitor.brightness_nits, " nits"),
      createSpec("Màu sắc", monitor.color_gamut),
      createSpec("Cổng kết nối", monitor.ports),
      createSpec("Đồng bộ", monitor.adaptive_sync),
    ].filter((spec): spec is ComponentSpec => Boolean(spec)),
  };
}

export async function fetchProducts(limit = 4): Promise<Product[]> {
  const productLimit = Math.max(1, limit);
  const { rows } = await sql<ProductRow>`
    SELECT
      products.slug,
      products.title,
      products.category,
      products.quantity,
      products.price_vnd,
      products.old_price_vnd,
      products.discount_label,
      products.warranty,
      products.image_url,
      products.promo,
      array_agg(components.name ORDER BY product_parts.sort_order)
        FILTER (WHERE components.id IS NOT NULL) AS specs
    FROM products
    LEFT JOIN product_parts
      ON product_parts.product_id = products.id
    LEFT JOIN components
      ON components.id = product_parts.component_id
      AND components.is_active = true
    WHERE products.is_active = true
    GROUP BY products.id
    ORDER BY products.is_featured DESC, products.sort_order ASC, products.created_at DESC
    LIMIT ${productLimit};
  `;

  return rows.map((product) => ({
    slug: product.slug,
    title: product.title,
    category: product.category,
    quantity: Number(product.quantity ?? 0),
    price: formatVnd(product.price_vnd),
    oldPrice: formatVnd(product.old_price_vnd),
    discount: product.discount_label ?? "",
    warranty: product.warranty ?? "",
    image: product.image_url,
    specs: product.specs ?? [],
    promo: product.promo ?? "",
  }));
}

export async function fetchProductBySlug(
  slug: string,
): Promise<ProductDetail | null> {
  const { rows } = await sql<ProductDetailRow>`
    SELECT
      id,
      slug,
      title,
      price_vnd,
      old_price_vnd,
      discount_label,
      warranty,
      image_url,
      promo,
      category,
      quantity
    FROM products
    WHERE slug = ${slug}
      AND is_active = true
    LIMIT 1;
  `;

  const product = rows[0];

  if (!product) {
    return null;
  }

  const { rows: components } = await sql<ComponentRow>`
    SELECT
      components.slug,
      components.name,
      components.type,
      components.brand,
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
      END AS quantity,
      components.price_vnd,
      components.image_url,
      cpu_details.socket AS cpu_socket,
      cpu_details.core_count AS cpu_core_count,
      cpu_details.thread_count AS cpu_thread_count,
      cpu_details.base_clock_ghz AS cpu_base_clock_ghz,
      cpu_details.boost_clock_ghz AS cpu_boost_clock_ghz,
      cpu_details.tdp_watts AS cpu_tdp_watts,
      cpu_details.integrated_graphics AS cpu_integrated_graphics,
      case_details.form_factor AS case_form_factor,
      case_details.color AS case_color,
      case_details.side_panel AS case_side_panel,
      case_details.fan_count AS case_fan_count,
      case_details.supports_motherboard AS case_supports_motherboard,
      cooling_details.cooling_type,
      cooling_details.fan_size_mm AS cooling_fan_size_mm,
      cooling_details.radiator_size_mm AS cooling_radiator_size_mm,
      cooling_details.height_mm AS cooling_height_mm,
      cooling_details.socket_support AS cooling_socket_support,
      mainboard_details.chipset AS mainboard_chipset,
      mainboard_details.socket AS mainboard_socket,
      mainboard_details.form_factor AS mainboard_form_factor,
      mainboard_details.memory_type AS mainboard_memory_type,
      mainboard_details.memory_slots AS mainboard_memory_slots,
      mainboard_details.max_memory_gb AS mainboard_max_memory_gb,
      mainboard_details.wifi AS mainboard_wifi,
      psu_details.wattage AS psu_wattage,
      psu_details.efficiency_rating AS psu_efficiency_rating,
      psu_details.modular_type AS psu_modular_type,
      psu_details.form_factor AS psu_form_factor,
      ram_details.capacity_gb AS ram_capacity_gb,
      ram_details.memory_type AS ram_memory_type,
      ram_details.bus_speed_mhz AS ram_bus_speed_mhz,
      ram_details.module_count AS ram_module_count,
      ram_details.has_rgb AS ram_has_rgb,
      ssd_details.capacity_gb AS ssd_capacity_gb,
      ssd_details.interface_type AS ssd_interface_type,
      ssd_details.form_factor AS ssd_form_factor,
      ssd_details.generation AS ssd_generation,
      ssd_details.read_speed_mbps AS ssd_read_speed_mbps,
      ssd_details.write_speed_mbps AS ssd_write_speed_mbps,
      vga_details.gpu_chipset AS vga_gpu_chipset,
      vga_details.cuda_cores AS vga_cuda_cores,
      vga_details.stream_processors AS vga_stream_processors,
      vga_details.vram_gb AS vga_vram_gb,
      vga_details.vram_type AS vga_vram_type,
      vga_details.base_clock_mhz AS vga_base_clock_mhz,
      vga_details.boost_clock_mhz AS vga_boost_clock_mhz,
      vga_details.recommended_psu_watts AS vga_recommended_psu_watts
    FROM product_parts
    INNER JOIN components
      ON components.id = product_parts.component_id
      AND components.is_active = true
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
    WHERE product_parts.product_id = ${product.id}
    ORDER BY product_parts.sort_order ASC, components.id ASC;
  `;

  const componentItems = components.map(mapComponentRow);

  return {
    slug: product.slug,
    title: product.title,
    price: formatVnd(product.price_vnd),
    oldPrice: formatVnd(product.old_price_vnd),
    discount: product.discount_label ?? "",
    warranty: product.warranty ?? "",
    image: product.image_url,
    specs: componentItems.map((component) => component.name),
    promo: product.promo ?? "",
    category: product.category,
    quantity: Number(product.quantity ?? 0),
    components: componentItems,
  };
}

export async function fetchComponents(limit = 4): Promise<ComponentItem[]> {
  const componentLimit = Math.max(1, limit);
  const { rows } = await sql<ComponentRow>`
    SELECT
      components.slug,
      components.name,
      components.type,
      components.brand,
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
      END AS quantity,
      components.price_vnd,
      components.image_url,
      cpu_details.socket AS cpu_socket,
      cpu_details.core_count AS cpu_core_count,
      cpu_details.thread_count AS cpu_thread_count,
      cpu_details.base_clock_ghz AS cpu_base_clock_ghz,
      cpu_details.boost_clock_ghz AS cpu_boost_clock_ghz,
      cpu_details.tdp_watts AS cpu_tdp_watts,
      cpu_details.integrated_graphics AS cpu_integrated_graphics,
      case_details.form_factor AS case_form_factor,
      case_details.color AS case_color,
      case_details.side_panel AS case_side_panel,
      case_details.fan_count AS case_fan_count,
      case_details.supports_motherboard AS case_supports_motherboard,
      cooling_details.cooling_type,
      cooling_details.fan_size_mm AS cooling_fan_size_mm,
      cooling_details.radiator_size_mm AS cooling_radiator_size_mm,
      cooling_details.height_mm AS cooling_height_mm,
      cooling_details.socket_support AS cooling_socket_support,
      mainboard_details.chipset AS mainboard_chipset,
      mainboard_details.socket AS mainboard_socket,
      mainboard_details.form_factor AS mainboard_form_factor,
      mainboard_details.memory_type AS mainboard_memory_type,
      mainboard_details.memory_slots AS mainboard_memory_slots,
      mainboard_details.max_memory_gb AS mainboard_max_memory_gb,
      mainboard_details.wifi AS mainboard_wifi,
      psu_details.wattage AS psu_wattage,
      psu_details.efficiency_rating AS psu_efficiency_rating,
      psu_details.modular_type AS psu_modular_type,
      psu_details.form_factor AS psu_form_factor,
      ram_details.capacity_gb AS ram_capacity_gb,
      ram_details.memory_type AS ram_memory_type,
      ram_details.bus_speed_mhz AS ram_bus_speed_mhz,
      ram_details.module_count AS ram_module_count,
      ram_details.has_rgb AS ram_has_rgb,
      ssd_details.capacity_gb AS ssd_capacity_gb,
      ssd_details.interface_type AS ssd_interface_type,
      ssd_details.form_factor AS ssd_form_factor,
      ssd_details.generation AS ssd_generation,
      ssd_details.read_speed_mbps AS ssd_read_speed_mbps,
      ssd_details.write_speed_mbps AS ssd_write_speed_mbps,
      vga_details.gpu_chipset AS vga_gpu_chipset,
      vga_details.cuda_cores AS vga_cuda_cores,
      vga_details.stream_processors AS vga_stream_processors,
      vga_details.vram_gb AS vga_vram_gb,
      vga_details.vram_type AS vga_vram_type,
      vga_details.base_clock_mhz AS vga_base_clock_mhz,
      vga_details.boost_clock_mhz AS vga_boost_clock_mhz,
      vga_details.recommended_psu_watts AS vga_recommended_psu_watts
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
    WHERE components.is_active = true
    ORDER BY components.id ASC
    LIMIT ${componentLimit};
  `;

  return rows.map(mapComponentRow);
}

export async function fetchComponentBySlug(
  slug: string,
): Promise<ComponentItem | null> {
  const { rows } = await sql<ComponentRow>`
    SELECT
      components.slug,
      components.name,
      components.type,
      components.brand,
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
      END AS quantity,
      components.price_vnd,
      components.image_url,
      cpu_details.socket AS cpu_socket,
      cpu_details.core_count AS cpu_core_count,
      cpu_details.thread_count AS cpu_thread_count,
      cpu_details.base_clock_ghz AS cpu_base_clock_ghz,
      cpu_details.boost_clock_ghz AS cpu_boost_clock_ghz,
      cpu_details.tdp_watts AS cpu_tdp_watts,
      cpu_details.integrated_graphics AS cpu_integrated_graphics,
      case_details.form_factor AS case_form_factor,
      case_details.color AS case_color,
      case_details.side_panel AS case_side_panel,
      case_details.fan_count AS case_fan_count,
      case_details.supports_motherboard AS case_supports_motherboard,
      cooling_details.cooling_type,
      cooling_details.fan_size_mm AS cooling_fan_size_mm,
      cooling_details.radiator_size_mm AS cooling_radiator_size_mm,
      cooling_details.height_mm AS cooling_height_mm,
      cooling_details.socket_support AS cooling_socket_support,
      mainboard_details.chipset AS mainboard_chipset,
      mainboard_details.socket AS mainboard_socket,
      mainboard_details.form_factor AS mainboard_form_factor,
      mainboard_details.memory_type AS mainboard_memory_type,
      mainboard_details.memory_slots AS mainboard_memory_slots,
      mainboard_details.max_memory_gb AS mainboard_max_memory_gb,
      mainboard_details.wifi AS mainboard_wifi,
      psu_details.wattage AS psu_wattage,
      psu_details.efficiency_rating AS psu_efficiency_rating,
      psu_details.modular_type AS psu_modular_type,
      psu_details.form_factor AS psu_form_factor,
      ram_details.capacity_gb AS ram_capacity_gb,
      ram_details.memory_type AS ram_memory_type,
      ram_details.bus_speed_mhz AS ram_bus_speed_mhz,
      ram_details.module_count AS ram_module_count,
      ram_details.has_rgb AS ram_has_rgb,
      ssd_details.capacity_gb AS ssd_capacity_gb,
      ssd_details.interface_type AS ssd_interface_type,
      ssd_details.form_factor AS ssd_form_factor,
      ssd_details.generation AS ssd_generation,
      ssd_details.read_speed_mbps AS ssd_read_speed_mbps,
      ssd_details.write_speed_mbps AS ssd_write_speed_mbps,
      vga_details.gpu_chipset AS vga_gpu_chipset,
      vga_details.cuda_cores AS vga_cuda_cores,
      vga_details.stream_processors AS vga_stream_processors,
      vga_details.vram_gb AS vga_vram_gb,
      vga_details.vram_type AS vga_vram_type,
      vga_details.base_clock_mhz AS vga_base_clock_mhz,
      vga_details.boost_clock_mhz AS vga_boost_clock_mhz,
      vga_details.recommended_psu_watts AS vga_recommended_psu_watts
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
    WHERE components.slug = ${slug}
      AND components.is_active = true
    LIMIT 1;
  `;

  const component = rows[0];

  return component ? mapComponentRow(component) : null;
}

export async function fetchMonitors(limit = 5): Promise<MonitorItem[]> {
  const monitorLimit = Math.max(1, limit);
  const { rows } = await sql<MonitorRow>`
    SELECT
      slug,
      name,
      category,
      brand,
      quantity,
      price_vnd,
      old_price_vnd,
      discount_label,
      warranty,
      image_url,
      size_inches,
      resolution,
      panel_type,
      refresh_rate_hz,
      response_time_ms,
      brightness_nits,
      color_gamut,
      ports,
      adaptive_sync
    FROM monitors
    WHERE is_active = true
    ORDER BY sort_order ASC, created_at DESC
    LIMIT ${monitorLimit};
  `;

  return rows.map(mapMonitorRow);
}

export async function fetchMonitorBySlug(
  slug: string,
): Promise<MonitorItem | null> {
  const { rows } = await sql<MonitorRow>`
    SELECT
      slug,
      name,
      category,
      brand,
      quantity,
      price_vnd,
      old_price_vnd,
      discount_label,
      warranty,
      image_url,
      size_inches,
      resolution,
      panel_type,
      refresh_rate_hz,
      response_time_ms,
      brightness_nits,
      color_gamut,
      ports,
      adaptive_sync
    FROM monitors
    WHERE slug = ${slug}
      AND is_active = true
    LIMIT 1;
  `;

  const monitor = rows[0];

  return monitor ? mapMonitorRow(monitor) : null;
}
