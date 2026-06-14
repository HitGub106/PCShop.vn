import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type SeedComponent = {
  name: string;
  slug: string;
  type: string;
  brand?: string;
};

type CpuDetail = {
  socket: string;
  coreCount: number;
  threadCount: number;
  baseClockGhz: number;
  boostClockGhz: number;
  tdpWatts: number;
  integratedGraphics: boolean;
};

type CaseDetail = {
  formFactor: string;
  color: string;
  sidePanel: string;
  fanCount: number;
  supportsMotherboard: string;
};

type CoolingDetail = {
  coolingType: string;
  fanSizeMm: number;
  radiatorSizeMm?: number;
  heightMm?: number;
  socketSupport: string;
};

type MainboardDetail = {
  chipset: string;
  socket: string;
  formFactor: string;
  memoryType: string;
  memorySlots: number;
  maxMemoryGb: number;
  wifi: boolean;
};

type PsuDetail = {
  wattage: number;
  efficiencyRating: string;
  modularType: string;
  formFactor: string;
};

type RamDetail = {
  capacityGb: number;
  memoryType: string;
  busSpeedMhz: number;
  moduleCount: number;
  hasRgb: boolean;
};

type SsdDetail = {
  capacityGb: number;
  interfaceType: string;
  formFactor: string;
  generation: string;
  readSpeedMbps: number;
  writeSpeedMbps: number;
};

type VgaDetail = {
  gpuChipset: string;
  cudaCores?: number;
  streamProcessors?: number;
  vramGb: number;
  vramType: string;
  baseClockMhz: number;
  boostClockMhz: number;
  recommendedPsuWatts: number;
};

type SeedMonitor = {
  name: string;
  slug: string;
  brand: string;
  priceVnd: number;
  oldPriceVnd: number;
  discountLabel: string;
  warranty: string;
  imageUrl: string;
  sizeInches: number;
  resolution: string;
  panelType: string;
  refreshRateHz: number;
  responseTimeMs: number;
  brightnessNits: number;
  colorGamut: string;
  ports: string;
  adaptiveSync: string;
  sortOrder: number;
};

type SeedProduct = {
  title: string;
  slug: string;
  priceVnd: number;
  oldPriceVnd: number;
  discountLabel: string;
  warranty: string;
  imageUrl: string;
  promo: string;
  category: string;
  sortOrder: number;
  components: SeedComponent[];
};

const seedProducts: SeedProduct[] = [
  {
    title: "PC Nova Gaming i5 12400F - RTX 4060 8GB",
    slug: "pc-nova-gaming-i5-12400f-rtx-4060-8gb",
    priceVnd: 18990000,
    oldPriceVnd: 21490000,
    discountLabel: "-12%",
    warranty: "36 tháng",
    imageUrl:
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=700&q=80",
    promo: "Tặng gói tối ưu Windows và vệ sinh miễn phí 12 tháng",
    category: "PC Gaming",
    sortOrder: 1,
    components: [
      {
        name: "Intel Core i5 12400F, 6 nhân 12 luồng",
        slug: "intel-core-i5-12400f",
        type: "CPU",
        brand: "Intel",
      },
      {
        name: "Mainboard B760M DDR4",
        slug: "mainboard-b760m-ddr4",
        type: "Mainboard",
      },
      {
        name: "RAM 16GB bus 3200MHz",
        slug: "ram-16gb-bus-3200mhz",
        type: "RAM",
      },
      {
        name: "SSD NVMe 512GB Gen 4",
        slug: "ssd-nvme-512gb-gen-4",
        type: "SSD",
      },
      {
        name: "Nguồn 650W 80 Plus",
        slug: "nguon-650w-80-plus",
        type: "PSU",
      },
    ],
  },
  {
    title: "PC AMD Creator Ryzen 7 5700X - RTX 3050 6GB",
    slug: "pc-amd-creator-ryzen-7-5700x-rtx-3050-6gb",
    priceVnd: 15980000,
    oldPriceVnd: 17990000,
    discountLabel: "-11%",
    warranty: "36 tháng",
    imageUrl:
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=700&q=80",
    promo: "Nâng cấp SSD 1TB chỉ thêm 990K trong tuần này",
    category: "PC Đồ họa",
    sortOrder: 2,
    components: [
      {
        name: "AMD Ryzen 7 5700X, 8 nhân 16 luồng",
        slug: "amd-ryzen-7-5700x",
        type: "CPU",
        brand: "AMD",
      },
      {
        name: "Mainboard B550M",
        slug: "mainboard-b550m",
        type: "Mainboard",
      },
      {
        name: "RAM 16GB DDR4 RGB",
        slug: "ram-16gb-ddr4-rgb",
        type: "RAM",
      },
      {
        name: "SSD NVMe 500GB",
        slug: "ssd-nvme-500gb",
        type: "SSD",
      },
      {
        name: "Tản nhiệt khí tower",
        slug: "tan-nhiet-khi-tower",
        type: "Cooling",
      },
    ],
  },
  {
    title: "PC Ultra White i5 14400F - RX 7600 OC",
    slug: "pc-ultra-white-i5-14400f-rx-7600-oc",
    priceVnd: 19860000,
    oldPriceVnd: 21990000,
    discountLabel: "-10%",
    warranty: "36 tháng",
    imageUrl:
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=700&q=80",
    promo: "Tặng bản quyền Office và voucher giảm 500K cho màn hình",
    category: "PC Gaming",
    sortOrder: 3,
    components: [
      {
        name: "Intel Core i5 14400F, 10 nhân 16 luồng",
        slug: "intel-core-i5-14400f",
        type: "CPU",
        brand: "Intel",
      },
      {
        name: "Mainboard B760M",
        slug: "mainboard-b760m",
        type: "Mainboard",
      },
      {
        name: "RAM 16GB DDR5",
        slug: "ram-16gb-ddr5",
        type: "RAM",
      },
      {
        name: "VGA Radeon RX 7600 8GB",
        slug: "vga-radeon-rx-7600-8gb",
        type: "VGA",
        brand: "AMD",
      },
      {
        name: "Case trắng 4 fan ARGB",
        slug: "case-trang-4-fan-argb",
        type: "Case",
      },
    ],
  },
  {
    title: "PC Mini Studio Ryzen 5 7500F - RTX 4060",
    slug: "pc-mini-studio-ryzen-5-7500f-rtx-4060",
    priceVnd: 22490000,
    oldPriceVnd: 24990000,
    discountLabel: "-10%",
    warranty: "36 tháng",
    imageUrl:
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=700&q=80",
    promo: "Miễn phí lắp đặt tản nhiệt nước AIO khi nâng cấp",
    category: "PC Gaming",
    sortOrder: 4,
    components: [
      {
        name: "AMD Ryzen 5 7500F AM5",
        slug: "amd-ryzen-5-7500f-am5",
        type: "CPU",
        brand: "AMD",
      },
      {
        name: "Mainboard B650I Wi-Fi",
        slug: "mainboard-b650i-wi-fi",
        type: "Mainboard",
      },
      {
        name: "RAM 32GB DDR5",
        slug: "ram-32gb-ddr5",
        type: "RAM",
      },
      {
        name: "SSD NVMe 1TB",
        slug: "ssd-nvme-1tb",
        type: "SSD",
      },
      {
        name: "Case ITX nhỏ gọn",
        slug: "case-itx-nho-gon",
        type: "Case",
      },
    ],
  },
];

const seedMonitors: SeedMonitor[] = [
  {
    name: "ASUS TUF Gaming VG249Q3A 24 inch FHD 180Hz",
    slug: "asus-tuf-gaming-vg249q3a-24-inch-fhd-180hz",
    brand: "ASUS",
    priceVnd: 3290000,
    oldPriceVnd: 3890000,
    discountLabel: "-15%",
    warranty: "36 thang",
    imageUrl: "/monitor.png",
    sizeInches: 24,
    resolution: "1920 x 1080",
    panelType: "IPS",
    refreshRateHz: 180,
    responseTimeMs: 1,
    brightnessNits: 250,
    colorGamut: "99% sRGB",
    ports: "2 x HDMI 2.0, 1 x DisplayPort 1.2, Audio out",
    adaptiveSync: "FreeSync Premium",
    sortOrder: 1,
  },
  {
    name: "LG UltraGear 27GS75Q-B 27 inch QHD 180Hz",
    slug: "lg-ultragear-27gs75q-b-27-inch-qhd-180hz",
    brand: "LG",
    priceVnd: 5790000,
    oldPriceVnd: 6490000,
    discountLabel: "-11%",
    warranty: "24 thang",
    imageUrl: "/monitor.png",
    sizeInches: 27,
    resolution: "2560 x 1440",
    panelType: "IPS",
    refreshRateHz: 180,
    responseTimeMs: 1,
    brightnessNits: 300,
    colorGamut: "99% sRGB",
    ports: "2 x HDMI 2.0, 1 x DisplayPort 1.4, Headphone out",
    adaptiveSync: "G-Sync Compatible, FreeSync",
    sortOrder: 2,
  },
  {
    name: "Dell UltraSharp U2724D 27 inch QHD 120Hz",
    slug: "dell-ultrasharp-u2724d-27-inch-qhd-120hz",
    brand: "Dell",
    priceVnd: 8890000,
    oldPriceVnd: 9490000,
    discountLabel: "-6%",
    warranty: "36 thang",
    imageUrl: "/monitor.png",
    sizeInches: 27,
    resolution: "2560 x 1440",
    panelType: "IPS Black",
    refreshRateHz: 120,
    responseTimeMs: 5,
    brightnessNits: 350,
    colorGamut: "100% sRGB, 98% DCI-P3",
    ports: "HDMI, DisplayPort, USB-C hub, USB-A",
    adaptiveSync: "No",
    sortOrder: 3,
  },
  {
    name: "Samsung Odyssey G5 G55C 32 inch QHD 165Hz",
    slug: "samsung-odyssey-g5-g55c-32-inch-qhd-165hz",
    brand: "Samsung",
    priceVnd: 6990000,
    oldPriceVnd: 7890000,
    discountLabel: "-11%",
    warranty: "24 thang",
    imageUrl: "/monitor.png",
    sizeInches: 32,
    resolution: "2560 x 1440",
    panelType: "VA Curved",
    refreshRateHz: 165,
    responseTimeMs: 1,
    brightnessNits: 300,
    colorGamut: "HDR10",
    ports: "1 x HDMI 2.0, 1 x DisplayPort 1.2, Headphone out",
    adaptiveSync: "FreeSync Premium",
    sortOrder: 4,
  },
  {
    name: "MSI Modern MD272UPSW 27 inch 4K 60Hz",
    slug: "msi-modern-md272upsw-27-inch-4k-60hz",
    brand: "MSI",
    priceVnd: 7590000,
    oldPriceVnd: 8290000,
    discountLabel: "-8%",
    warranty: "36 thang",
    imageUrl: "/monitor.png",
    sizeInches: 27,
    resolution: "3840 x 2160",
    panelType: "IPS",
    refreshRateHz: 60,
    responseTimeMs: 4,
    brightnessNits: 300,
    colorGamut: "95% DCI-P3",
    ports: "HDMI, DisplayPort, USB-C 65W, USB hub",
    adaptiveSync: "Adaptive-Sync",
    sortOrder: 5,
  },
];

const cpuDetails: Record<string, CpuDetail> = {
  "intel-core-i5-12400f": {
    socket: "LGA1700",
    coreCount: 6,
    threadCount: 12,
    baseClockGhz: 2.5,
    boostClockGhz: 4.4,
    tdpWatts: 65,
    integratedGraphics: false,
  },
  "amd-ryzen-7-5700x": {
    socket: "AM4",
    coreCount: 8,
    threadCount: 16,
    baseClockGhz: 3.4,
    boostClockGhz: 4.6,
    tdpWatts: 65,
    integratedGraphics: false,
  },
  "intel-core-i5-14400f": {
    socket: "LGA1700",
    coreCount: 10,
    threadCount: 16,
    baseClockGhz: 2.5,
    boostClockGhz: 4.7,
    tdpWatts: 65,
    integratedGraphics: false,
  },
  "amd-ryzen-5-7500f-am5": {
    socket: "AM5",
    coreCount: 6,
    threadCount: 12,
    baseClockGhz: 3.7,
    boostClockGhz: 5,
    tdpWatts: 65,
    integratedGraphics: false,
  },
};

const caseDetails: Record<string, CaseDetail> = {
  "case-trang-4-fan-argb": {
    formFactor: "Mid Tower",
    color: "White",
    sidePanel: "Tempered Glass",
    fanCount: 4,
    supportsMotherboard: "ATX, Micro-ATX, Mini-ITX",
  },
  "case-itx-nho-gon": {
    formFactor: "Mini-ITX",
    color: "Black",
    sidePanel: "Mesh",
    fanCount: 2,
    supportsMotherboard: "Mini-ITX",
  },
};

const coolingDetails: Record<string, CoolingDetail> = {
  "tan-nhiet-khi-tower": {
    coolingType: "Air",
    fanSizeMm: 120,
    heightMm: 155,
    socketSupport: "AM4, AM5, LGA1700",
  },
};

const mainboardDetails: Record<string, MainboardDetail> = {
  "mainboard-b760m-ddr4": {
    chipset: "B760",
    socket: "LGA1700",
    formFactor: "Micro-ATX",
    memoryType: "DDR4",
    memorySlots: 4,
    maxMemoryGb: 128,
    wifi: false,
  },
  "mainboard-b550m": {
    chipset: "B550",
    socket: "AM4",
    formFactor: "Micro-ATX",
    memoryType: "DDR4",
    memorySlots: 4,
    maxMemoryGb: 128,
    wifi: false,
  },
  "mainboard-b760m": {
    chipset: "B760",
    socket: "LGA1700",
    formFactor: "Micro-ATX",
    memoryType: "DDR5",
    memorySlots: 4,
    maxMemoryGb: 192,
    wifi: false,
  },
  "mainboard-b650i-wi-fi": {
    chipset: "B650",
    socket: "AM5",
    formFactor: "Mini-ITX",
    memoryType: "DDR5",
    memorySlots: 2,
    maxMemoryGb: 96,
    wifi: true,
  },
};

const psuDetails: Record<string, PsuDetail> = {
  "nguon-650w-80-plus": {
    wattage: 650,
    efficiencyRating: "80 Plus Bronze",
    modularType: "Non-modular",
    formFactor: "ATX",
  },
};

const ramDetails: Record<string, RamDetail> = {
  "ram-16gb-bus-3200mhz": {
    capacityGb: 16,
    memoryType: "DDR4",
    busSpeedMhz: 3200,
    moduleCount: 2,
    hasRgb: false,
  },
  "ram-16gb-ddr4-rgb": {
    capacityGb: 16,
    memoryType: "DDR4",
    busSpeedMhz: 3200,
    moduleCount: 2,
    hasRgb: true,
  },
  "ram-16gb-ddr5": {
    capacityGb: 16,
    memoryType: "DDR5",
    busSpeedMhz: 5600,
    moduleCount: 2,
    hasRgb: false,
  },
  "ram-32gb-ddr5": {
    capacityGb: 32,
    memoryType: "DDR5",
    busSpeedMhz: 6000,
    moduleCount: 2,
    hasRgb: false,
  },
};

const ssdDetails: Record<string, SsdDetail> = {
  "ssd-nvme-512gb-gen-4": {
    capacityGb: 512,
    interfaceType: "NVMe",
    formFactor: "M.2 2280",
    generation: "PCIe Gen 4",
    readSpeedMbps: 5000,
    writeSpeedMbps: 3500,
  },
  "ssd-nvme-500gb": {
    capacityGb: 500,
    interfaceType: "NVMe",
    formFactor: "M.2 2280",
    generation: "PCIe Gen 3",
    readSpeedMbps: 3500,
    writeSpeedMbps: 3000,
  },
  "ssd-nvme-1tb": {
    capacityGb: 1024,
    interfaceType: "NVMe",
    formFactor: "M.2 2280",
    generation: "PCIe Gen 4",
    readSpeedMbps: 7000,
    writeSpeedMbps: 5000,
  },
};

const vgaDetails: Record<string, VgaDetail> = {
  "vga-radeon-rx-7600-8gb": {
    gpuChipset: "Radeon RX 7600",
    streamProcessors: 2048,
    vramGb: 8,
    vramType: "GDDR6",
    baseClockMhz: 1720,
    boostClockMhz: 2655,
    recommendedPsuWatts: 550,
  },
};

async function seedComponentDetail(
  componentId: number | string,
  component: SeedComponent,
) {
  switch (component.type) {
    case "CPU": {
      const detail = cpuDetails[component.slug];
      if (!detail) {
        return false;
      }

      await sql`
        INSERT INTO cpu_details (
          component_id,
          socket,
          core_count,
          thread_count,
          base_clock_ghz,
          boost_clock_ghz,
          tdp_watts,
          integrated_graphics
        )
        VALUES (
          ${componentId},
          ${detail.socket},
          ${detail.coreCount},
          ${detail.threadCount},
          ${detail.baseClockGhz},
          ${detail.boostClockGhz},
          ${detail.tdpWatts},
          ${detail.integratedGraphics}
        )
        ON CONFLICT (component_id) DO UPDATE SET
          socket = EXCLUDED.socket,
          core_count = EXCLUDED.core_count,
          thread_count = EXCLUDED.thread_count,
          base_clock_ghz = EXCLUDED.base_clock_ghz,
          boost_clock_ghz = EXCLUDED.boost_clock_ghz,
          tdp_watts = EXCLUDED.tdp_watts,
          integrated_graphics = EXCLUDED.integrated_graphics,
          updated_at = now();
      `;
      return true;
    }
    case "Case": {
      const detail = caseDetails[component.slug];
      if (!detail) {
        return false;
      }

      await sql`
        INSERT INTO case_details (
          component_id,
          form_factor,
          color,
          side_panel,
          fan_count,
          supports_motherboard
        )
        VALUES (
          ${componentId},
          ${detail.formFactor},
          ${detail.color},
          ${detail.sidePanel},
          ${detail.fanCount},
          ${detail.supportsMotherboard}
        )
        ON CONFLICT (component_id) DO UPDATE SET
          form_factor = EXCLUDED.form_factor,
          color = EXCLUDED.color,
          side_panel = EXCLUDED.side_panel,
          fan_count = EXCLUDED.fan_count,
          supports_motherboard = EXCLUDED.supports_motherboard,
          updated_at = now();
      `;
      return true;
    }
    case "Cooling": {
      const detail = coolingDetails[component.slug];
      if (!detail) {
        return false;
      }

      await sql`
        INSERT INTO cooling_details (
          component_id,
          cooling_type,
          fan_size_mm,
          radiator_size_mm,
          height_mm,
          socket_support
        )
        VALUES (
          ${componentId},
          ${detail.coolingType},
          ${detail.fanSizeMm},
          ${detail.radiatorSizeMm ?? null},
          ${detail.heightMm ?? null},
          ${detail.socketSupport}
        )
        ON CONFLICT (component_id) DO UPDATE SET
          cooling_type = EXCLUDED.cooling_type,
          fan_size_mm = EXCLUDED.fan_size_mm,
          radiator_size_mm = EXCLUDED.radiator_size_mm,
          height_mm = EXCLUDED.height_mm,
          socket_support = EXCLUDED.socket_support,
          updated_at = now();
      `;
      return true;
    }
    case "Mainboard": {
      const detail = mainboardDetails[component.slug];
      if (!detail) {
        return false;
      }

      await sql`
        INSERT INTO mainboard_details (
          component_id,
          chipset,
          socket,
          form_factor,
          memory_type,
          memory_slots,
          max_memory_gb,
          wifi
        )
        VALUES (
          ${componentId},
          ${detail.chipset},
          ${detail.socket},
          ${detail.formFactor},
          ${detail.memoryType},
          ${detail.memorySlots},
          ${detail.maxMemoryGb},
          ${detail.wifi}
        )
        ON CONFLICT (component_id) DO UPDATE SET
          chipset = EXCLUDED.chipset,
          socket = EXCLUDED.socket,
          form_factor = EXCLUDED.form_factor,
          memory_type = EXCLUDED.memory_type,
          memory_slots = EXCLUDED.memory_slots,
          max_memory_gb = EXCLUDED.max_memory_gb,
          wifi = EXCLUDED.wifi,
          updated_at = now();
      `;
      return true;
    }
    case "PSU": {
      const detail = psuDetails[component.slug];
      if (!detail) {
        return false;
      }

      await sql`
        INSERT INTO psu_details (
          component_id,
          wattage,
          efficiency_rating,
          modular_type,
          form_factor
        )
        VALUES (
          ${componentId},
          ${detail.wattage},
          ${detail.efficiencyRating},
          ${detail.modularType},
          ${detail.formFactor}
        )
        ON CONFLICT (component_id) DO UPDATE SET
          wattage = EXCLUDED.wattage,
          efficiency_rating = EXCLUDED.efficiency_rating,
          modular_type = EXCLUDED.modular_type,
          form_factor = EXCLUDED.form_factor,
          updated_at = now();
      `;
      return true;
    }
    case "RAM": {
      const detail = ramDetails[component.slug];
      if (!detail) {
        return false;
      }

      await sql`
        INSERT INTO ram_details (
          component_id,
          capacity_gb,
          memory_type,
          bus_speed_mhz,
          module_count,
          has_rgb
        )
        VALUES (
          ${componentId},
          ${detail.capacityGb},
          ${detail.memoryType},
          ${detail.busSpeedMhz},
          ${detail.moduleCount},
          ${detail.hasRgb}
        )
        ON CONFLICT (component_id) DO UPDATE SET
          capacity_gb = EXCLUDED.capacity_gb,
          memory_type = EXCLUDED.memory_type,
          bus_speed_mhz = EXCLUDED.bus_speed_mhz,
          module_count = EXCLUDED.module_count,
          has_rgb = EXCLUDED.has_rgb,
          updated_at = now();
      `;
      return true;
    }
    case "SSD": {
      const detail = ssdDetails[component.slug];
      if (!detail) {
        return false;
      }

      await sql`
        INSERT INTO ssd_details (
          component_id,
          capacity_gb,
          interface_type,
          form_factor,
          generation,
          read_speed_mbps,
          write_speed_mbps
        )
        VALUES (
          ${componentId},
          ${detail.capacityGb},
          ${detail.interfaceType},
          ${detail.formFactor},
          ${detail.generation},
          ${detail.readSpeedMbps},
          ${detail.writeSpeedMbps}
        )
        ON CONFLICT (component_id) DO UPDATE SET
          capacity_gb = EXCLUDED.capacity_gb,
          interface_type = EXCLUDED.interface_type,
          form_factor = EXCLUDED.form_factor,
          generation = EXCLUDED.generation,
          read_speed_mbps = EXCLUDED.read_speed_mbps,
          write_speed_mbps = EXCLUDED.write_speed_mbps,
          updated_at = now();
      `;
      return true;
    }
    case "VGA": {
      const detail = vgaDetails[component.slug];
      if (!detail) {
        return false;
      }

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
          recommended_psu_watts
        )
        VALUES (
          ${componentId},
          ${detail.gpuChipset},
          ${detail.cudaCores ?? null},
          ${detail.streamProcessors ?? null},
          ${detail.vramGb},
          ${detail.vramType},
          ${detail.baseClockMhz},
          ${detail.boostClockMhz},
          ${detail.recommendedPsuWatts}
        )
        ON CONFLICT (component_id) DO UPDATE SET
          gpu_chipset = EXCLUDED.gpu_chipset,
          cuda_cores = EXCLUDED.cuda_cores,
          stream_processors = EXCLUDED.stream_processors,
          vram_gb = EXCLUDED.vram_gb,
          vram_type = EXCLUDED.vram_type,
          base_clock_mhz = EXCLUDED.base_clock_mhz,
          boost_clock_mhz = EXCLUDED.boost_clock_mhz,
          recommended_psu_watts = EXCLUDED.recommended_psu_watts,
          updated_at = now();
      `;
      return true;
    }
    default:
      return false;
  }
}

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Seed route is disabled in production." },
      { status: 403 },
    );
  }

  try {
    await sql`
      DROP TABLE IF EXISTS product_specs;
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        price_vnd INTEGER NOT NULL,
        old_price_vnd INTEGER,
        discount_label TEXT,
        warranty TEXT,
        image_url TEXT NOT NULL,
        promo TEXT,
        category TEXT NOT NULL DEFAULT 'PC Gaming',
        is_featured BOOLEAN NOT NULL DEFAULT false,
        is_active BOOLEAN NOT NULL DEFAULT true,
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS components (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        type TEXT NOT NULL,
        brand TEXT,
        price_vnd INTEGER,
        image_url TEXT,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS cpu_details (
        component_id BIGINT PRIMARY KEY REFERENCES components(id) ON DELETE CASCADE,
        socket TEXT NOT NULL,
        core_count INTEGER NOT NULL,
        thread_count INTEGER NOT NULL,
        base_clock_ghz NUMERIC(4, 2) NOT NULL,
        boost_clock_ghz NUMERIC(4, 2) NOT NULL,
        tdp_watts INTEGER NOT NULL,
        integrated_graphics BOOLEAN NOT NULL DEFAULT false,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS case_details (
        component_id BIGINT PRIMARY KEY REFERENCES components(id) ON DELETE CASCADE,
        form_factor TEXT NOT NULL,
        color TEXT NOT NULL,
        side_panel TEXT NOT NULL,
        fan_count INTEGER NOT NULL,
        supports_motherboard TEXT NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS cooling_details (
        component_id BIGINT PRIMARY KEY REFERENCES components(id) ON DELETE CASCADE,
        cooling_type TEXT NOT NULL,
        fan_size_mm INTEGER NOT NULL,
        radiator_size_mm INTEGER,
        height_mm INTEGER,
        socket_support TEXT NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS mainboard_details (
        component_id BIGINT PRIMARY KEY REFERENCES components(id) ON DELETE CASCADE,
        chipset TEXT NOT NULL,
        socket TEXT NOT NULL,
        form_factor TEXT NOT NULL,
        memory_type TEXT NOT NULL,
        memory_slots INTEGER NOT NULL,
        max_memory_gb INTEGER NOT NULL,
        wifi BOOLEAN NOT NULL DEFAULT false,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS psu_details (
        component_id BIGINT PRIMARY KEY REFERENCES components(id) ON DELETE CASCADE,
        wattage INTEGER NOT NULL,
        efficiency_rating TEXT NOT NULL,
        modular_type TEXT NOT NULL,
        form_factor TEXT NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS ram_details (
        component_id BIGINT PRIMARY KEY REFERENCES components(id) ON DELETE CASCADE,
        capacity_gb INTEGER NOT NULL,
        memory_type TEXT NOT NULL,
        bus_speed_mhz INTEGER NOT NULL,
        module_count INTEGER NOT NULL,
        has_rgb BOOLEAN NOT NULL DEFAULT false,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS ssd_details (
        component_id BIGINT PRIMARY KEY REFERENCES components(id) ON DELETE CASCADE,
        capacity_gb INTEGER NOT NULL,
        interface_type TEXT NOT NULL,
        form_factor TEXT NOT NULL,
        generation TEXT NOT NULL,
        read_speed_mbps INTEGER NOT NULL,
        write_speed_mbps INTEGER NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS vga_details (
        component_id BIGINT PRIMARY KEY REFERENCES components(id) ON DELETE CASCADE,
        gpu_chipset TEXT NOT NULL,
        cuda_cores INTEGER,
        stream_processors INTEGER,
        vram_gb INTEGER NOT NULL,
        vram_type TEXT NOT NULL,
        base_clock_mhz INTEGER NOT NULL,
        boost_clock_mhz INTEGER NOT NULL,
        recommended_psu_watts INTEGER NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS monitors (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        brand TEXT NOT NULL,
        price_vnd INTEGER NOT NULL,
        old_price_vnd INTEGER,
        discount_label TEXT,
        warranty TEXT,
        image_url TEXT NOT NULL,
        size_inches NUMERIC(4, 1) NOT NULL,
        resolution TEXT NOT NULL,
        panel_type TEXT NOT NULL,
        refresh_rate_hz INTEGER NOT NULL,
        response_time_ms NUMERIC(4, 1) NOT NULL,
        brightness_nits INTEGER NOT NULL,
        color_gamut TEXT NOT NULL,
        ports TEXT NOT NULL,
        adaptive_sync TEXT NOT NULL,
        is_active BOOLEAN NOT NULL DEFAULT true,
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS product_parts (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        component_id BIGINT NOT NULL REFERENCES components(id),
        quantity INTEGER NOT NULL DEFAULT 1,
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        UNIQUE (product_id, component_id)
      );
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS product_parts_product_id_idx
      ON product_parts(product_id);
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS product_parts_component_id_idx
      ON product_parts(component_id);
    `;

    let componentCount = 0;
    let componentDetailCount = 0;
    let partCount = 0;
    let monitorCount = 0;

    for (const product of seedProducts) {
      const productResult = await sql<{ id: number | string }>`
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
          is_featured,
          is_active,
          sort_order
        )
        VALUES (
          ${product.title},
          ${product.slug},
          ${product.priceVnd},
          ${product.oldPriceVnd},
          ${product.discountLabel},
          ${product.warranty},
          ${product.imageUrl},
          ${product.promo},
          ${product.category},
          true,
          true,
          ${product.sortOrder}
        )
        ON CONFLICT (slug) DO UPDATE SET
          title = EXCLUDED.title,
          price_vnd = EXCLUDED.price_vnd,
          old_price_vnd = EXCLUDED.old_price_vnd,
          discount_label = EXCLUDED.discount_label,
          warranty = EXCLUDED.warranty,
          image_url = EXCLUDED.image_url,
          promo = EXCLUDED.promo,
          category = EXCLUDED.category,
          is_featured = EXCLUDED.is_featured,
          is_active = EXCLUDED.is_active,
          sort_order = EXCLUDED.sort_order,
          updated_at = now()
        RETURNING id;
      `;

      const productId = productResult.rows[0].id;

      await sql`
        DELETE FROM product_parts
        WHERE product_id = ${productId};
      `;

      for (const [index, component] of product.components.entries()) {
        const componentResult = await sql<{ id: number | string }>`
          INSERT INTO components (
            name,
            slug,
            type,
            brand,
            is_active
          )
          VALUES (
            ${component.name},
            ${component.slug},
            ${component.type},
            ${component.brand ?? null},
            true
          )
          ON CONFLICT (slug) DO UPDATE SET
            name = EXCLUDED.name,
            type = EXCLUDED.type,
            brand = EXCLUDED.brand,
            is_active = EXCLUDED.is_active,
            updated_at = now()
          RETURNING id;
        `;

        const componentId = componentResult.rows[0].id;
        componentCount += 1;
        const hasDetail = await seedComponentDetail(componentId, component);

        if (hasDetail) {
          componentDetailCount += 1;
        }

        await sql`
          INSERT INTO product_parts (
            product_id,
            component_id,
            quantity,
            sort_order
          )
          VALUES (
            ${productId},
            ${componentId},
            1,
            ${index + 1}
          )
          ON CONFLICT (product_id, component_id) DO UPDATE SET
            quantity = EXCLUDED.quantity,
            sort_order = EXCLUDED.sort_order;
        `;

        partCount += 1;
      }
    }

    for (const monitor of seedMonitors) {
      await sql`
        INSERT INTO monitors (
          name,
          slug,
          brand,
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
          adaptive_sync,
          is_active,
          sort_order
        )
        VALUES (
          ${monitor.name},
          ${monitor.slug},
          ${monitor.brand},
          ${monitor.priceVnd},
          ${monitor.oldPriceVnd},
          ${monitor.discountLabel},
          ${monitor.warranty},
          ${monitor.imageUrl},
          ${monitor.sizeInches},
          ${monitor.resolution},
          ${monitor.panelType},
          ${monitor.refreshRateHz},
          ${monitor.responseTimeMs},
          ${monitor.brightnessNits},
          ${monitor.colorGamut},
          ${monitor.ports},
          ${monitor.adaptiveSync},
          true,
          ${monitor.sortOrder}
        )
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          brand = EXCLUDED.brand,
          price_vnd = EXCLUDED.price_vnd,
          old_price_vnd = EXCLUDED.old_price_vnd,
          discount_label = EXCLUDED.discount_label,
          warranty = EXCLUDED.warranty,
          image_url = EXCLUDED.image_url,
          size_inches = EXCLUDED.size_inches,
          resolution = EXCLUDED.resolution,
          panel_type = EXCLUDED.panel_type,
          refresh_rate_hz = EXCLUDED.refresh_rate_hz,
          response_time_ms = EXCLUDED.response_time_ms,
          brightness_nits = EXCLUDED.brightness_nits,
          color_gamut = EXCLUDED.color_gamut,
          ports = EXCLUDED.ports,
          adaptive_sync = EXCLUDED.adaptive_sync,
          is_active = EXCLUDED.is_active,
          sort_order = EXCLUDED.sort_order,
          updated_at = now();
      `;

      monitorCount += 1;
    }

    return NextResponse.json({
      ok: true,
      message:
        "Created products, monitors, components, product_parts and component detail tables, then seeded data.",
      products: seedProducts.length,
      monitors: monitorCount,
      components: componentCount,
      componentDetails: componentDetailCount,
      productParts: partCount,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
