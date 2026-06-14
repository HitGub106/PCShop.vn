import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type SeedVga = {
  baseClockMhz: number;
  boostClockMhz: number;
  brand: string;
  cudaCores?: number;
  gpuChipset: string;
  imageUrl: string;
  name: string;
  priceVnd: number;
  quantity: number;
  recommendedPsuWatts: number;
  slug: string;
  streamProcessors?: number;
  vramGb: number;
  vramType: string;
};

const seedVgas: SeedVga[] = [
  {
    name: "ASUS Dual GeForce RTX 4060 OC 8GB",
    slug: "asus-dual-geforce-rtx-4060-oc-8gb",
    brand: "ASUS",
    priceVnd: 7890000,
    imageUrl: "/components/vga-amd.png",
    gpuChipset: "GeForce RTX 4060",
    cudaCores: 3072,
    vramGb: 8,
    vramType: "GDDR6",
    baseClockMhz: 1830,
    boostClockMhz: 2535,
    recommendedPsuWatts: 550,
    quantity: 142,
  },
  {
    name: "MSI GeForce RTX 4060 Ti Ventus 2X Black 8GB",
    slug: "msi-geforce-rtx-4060-ti-ventus-2x-black-8gb",
    brand: "MSI",
    priceVnd: 10990000,
    imageUrl: "/components/vga-amd.png",
    gpuChipset: "GeForce RTX 4060 Ti",
    cudaCores: 4352,
    vramGb: 8,
    vramType: "GDDR6",
    baseClockMhz: 2310,
    boostClockMhz: 2535,
    recommendedPsuWatts: 550,
    quantity: 128,
  },
  {
    name: "Gigabyte GeForce RTX 4070 Windforce OC 12GB",
    slug: "gigabyte-geforce-rtx-4070-windforce-oc-12gb",
    brand: "Gigabyte",
    priceVnd: 15990000,
    imageUrl: "/components/vga-amd.png",
    gpuChipset: "GeForce RTX 4070",
    cudaCores: 5888,
    vramGb: 12,
    vramType: "GDDR6X",
    baseClockMhz: 1920,
    boostClockMhz: 2490,
    recommendedPsuWatts: 650,
    quantity: 116,
  },
  {
    name: "Sapphire Pulse Radeon RX 7600 8GB",
    slug: "sapphire-pulse-radeon-rx-7600-8gb",
    brand: "Sapphire",
    priceVnd: 6790000,
    imageUrl: "/components/vga-amd.png",
    gpuChipset: "Radeon RX 7600",
    streamProcessors: 2048,
    vramGb: 8,
    vramType: "GDDR6",
    baseClockMhz: 2250,
    boostClockMhz: 2755,
    recommendedPsuWatts: 550,
    quantity: 167,
  },
  {
    name: "PowerColor Fighter Radeon RX 7700 XT 12GB",
    slug: "powercolor-fighter-radeon-rx-7700-xt-12gb",
    brand: "PowerColor",
    priceVnd: 12490000,
    imageUrl: "/components/vga-amd.png",
    gpuChipset: "Radeon RX 7700 XT",
    streamProcessors: 3456,
    vramGb: 12,
    vramType: "GDDR6",
    baseClockMhz: 1700,
    boostClockMhz: 2544,
    recommendedPsuWatts: 700,
    quantity: 135,
  },
  {
    name: "ASRock Challenger Radeon RX 7800 XT 16GB",
    slug: "asrock-challenger-radeon-rx-7800-xt-16gb",
    brand: "ASRock",
    priceVnd: 14990000,
    imageUrl: "/components/vga-amd.png",
    gpuChipset: "Radeon RX 7800 XT",
    streamProcessors: 3840,
    vramGb: 16,
    vramType: "GDDR6",
    baseClockMhz: 1800,
    boostClockMhz: 2520,
    recommendedPsuWatts: 750,
    quantity: 109,
  },
];

export async function GET() {
  try {
    let componentCount = 0;
    let detailCount = 0;

    for (const vga of seedVgas) {
      const { rows } = await sql<{ id: number | string }>`
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
          ${vga.name},
          ${vga.slug},
          'VGA',
          ${vga.brand},
          ${vga.priceVnd},
          ${vga.imageUrl},
          true
        )
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          type = EXCLUDED.type,
          brand = EXCLUDED.brand,
          price_vnd = EXCLUDED.price_vnd,
          image_url = EXCLUDED.image_url,
          is_active = EXCLUDED.is_active,
          updated_at = now()
        RETURNING id;
      `;
      const componentId = rows[0].id;
      componentCount += 1;

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
          ${vga.gpuChipset},
          ${vga.cudaCores ?? null},
          ${vga.streamProcessors ?? null},
          ${vga.vramGb},
          ${vga.vramType},
          ${vga.baseClockMhz},
          ${vga.boostClockMhz},
          ${vga.recommendedPsuWatts},
          ${vga.quantity}
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
          quantity = EXCLUDED.quantity,
          updated_at = now();
      `;
      detailCount += 1;
    }

    return NextResponse.json({
      ok: true,
      message: "Đã seed thêm 6 VGA vào components và vga_details.",
      components: componentCount,
      vgaDetails: detailCount,
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
