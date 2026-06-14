"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type CreateKind = "component" | "monitor" | "pc";
type ComponentType =
  | "CPU"
  | "Case"
  | "Cooling"
  | "Mainboard"
  | "PSU"
  | "RAM"
  | "SSD"
  | "VGA";

type AdminCreateProductFormProps = {
  kind: CreateKind;
};

const componentTypes: ComponentType[] = [
  "CPU",
  "Mainboard",
  "RAM",
  "SSD",
  "VGA",
  "PSU",
  "Case",
  "Cooling",
];

export function AdminCreateProductForm({ kind }: AdminCreateProductFormProps) {
  const router = useRouter();
  const [componentType, setComponentType] = useState<ComponentType>("CPU");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setIsSubmitting(true);
    setStatus("");

    const formData = new FormData(form);
    const body = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...body, kind }),
      });
      const result = (await response.json()) as {
        message?: string;
        ok?: boolean;
      };

      if (!response.ok || !result.ok) {
        setStatus(result.message ?? "Không thể thêm sản phẩm.");
        return;
      }

      setStatus(result.message ?? "Đã thêm sản phẩm mới.");
      form.reset();
      setComponentType("CPU");
      router.refresh();
    } catch {
      setStatus("Không thể kết nối để thêm sản phẩm.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="admin-create-form" onSubmit={handleSubmit}>
      {kind === "pc" ? <PcFields /> : null}
      {kind === "monitor" ? <MonitorFields /> : null}
      {kind === "component" ? (
        <ComponentFields
          componentType={componentType}
          onTypeChange={setComponentType}
        />
      ) : null}

      {status ? <p className="admin-form-status">{status}</p> : null}

      <button className="admin-create-button" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Đang lưu..." : "Lưu sản phẩm"}
      </button>
    </form>
  );
}

function PcFields() {
  return (
    <>
      <SectionTitle title="Thông tin PC" />
      <TextField label="Tên PC" name="title" required />
      <TextField label="Slug" name="slug" />
      <SelectField
        label="Danh mục"
        name="category"
        options={["PC Gaming", "PC Văn phòng", "PC Đồ họa", "PC Mini"]}
      />
      <NumberField label="Giá" name="priceVnd" required />
      <NumberField label="Giá cũ" name="oldPriceVnd" />
      <NumberField label="Tồn kho" name="quantity" required />
      <NumberField label="Thứ tự" name="sortOrder" />
      <TextField label="Nhãn giảm giá" name="discountLabel" />
      <TextField label="Bảo hành" name="warranty" />
      <TextField label="Ảnh" name="imageUrl" required />
      <TextareaField label="Khuyến mãi" name="promo" />
      <CheckboxField label="Sản phẩm nổi bật" name="isFeatured" />
    </>
  );
}

function MonitorFields() {
  return (
    <>
      <SectionTitle title="Thông tin màn hình" />
      <TextField label="Tên màn hình" name="name" required />
      <TextField label="Slug" name="slug" />
      <TextField label="Thương hiệu" name="brand" required />
      <SelectField
        label="Danh mục"
        name="category"
        options={["Gaming", "Văn phòng", "Đồ họa"]}
      />
      <NumberField label="Giá" name="priceVnd" required />
      <NumberField label="Giá cũ" name="oldPriceVnd" />
      <NumberField label="Tồn kho" name="quantity" required />
      <NumberField label="Thứ tự" name="sortOrder" />
      <TextField label="Nhãn giảm giá" name="discountLabel" />
      <TextField label="Bảo hành" name="warranty" />
      <TextField label="Ảnh" name="imageUrl" required />
      <NumberField label="Kích thước inch" name="sizeInches" step="0.1" required />
      <TextField label="Độ phân giải" name="resolution" required />
      <TextField label="Tấm nền" name="panelType" required />
      <NumberField label="Tần số quét Hz" name="refreshRateHz" required />
      <NumberField
        label="Thời gian phản hồi ms"
        name="responseTimeMs"
        step="0.1"
        required
      />
      <NumberField label="Độ sáng nits" name="brightnessNits" required />
      <TextField label="Dải màu" name="colorGamut" required />
      <TextField label="Cổng kết nối" name="ports" required />
      <TextField label="Đồng bộ hình ảnh" name="adaptiveSync" required />
    </>
  );
}

function ComponentFields({
  componentType,
  onTypeChange,
}: {
  componentType: ComponentType;
  onTypeChange: (type: ComponentType) => void;
}) {
  return (
    <>
      <SectionTitle title="Thông tin linh kiện" />
      <TextField label="Tên linh kiện" name="name" required />
      <TextField label="Slug" name="slug" />
      <SelectField
        label="Loại linh kiện"
        name="type"
        onChange={(value) => onTypeChange(value as ComponentType)}
        options={componentTypes}
      />
      <TextField label="Thương hiệu" name="brand" />
      <NumberField label="Giá" name="priceVnd" required />
      <NumberField label="Tồn kho" name="quantity" required />
      <TextField label="Ảnh" name="imageUrl" />

      <SectionTitle title={`Thông số ${componentType}`} />
      {componentType === "CPU" ? <CpuFields /> : null}
      {componentType === "Mainboard" ? <MainboardFields /> : null}
      {componentType === "RAM" ? <RamFields /> : null}
      {componentType === "SSD" ? <SsdFields /> : null}
      {componentType === "VGA" ? <VgaFields /> : null}
      {componentType === "PSU" ? <PsuFields /> : null}
      {componentType === "Case" ? <CaseFields /> : null}
      {componentType === "Cooling" ? <CoolingFields /> : null}
    </>
  );
}

function CpuFields() {
  return (
    <>
      <TextField label="Socket" name="socket" required />
      <NumberField label="Số nhân" name="coreCount" required />
      <NumberField label="Số luồng" name="threadCount" required />
      <NumberField label="Xung cơ bản GHz" name="baseClockGhz" step="0.1" required />
      <NumberField label="Xung boost GHz" name="boostClockGhz" step="0.1" required />
      <NumberField label="TDP W" name="tdpWatts" required />
      <CheckboxField label="Có iGPU" name="integratedGraphics" />
    </>
  );
}

function MainboardFields() {
  return (
    <>
      <TextField label="Chipset" name="chipset" required />
      <TextField label="Socket" name="socket" required />
      <TextField label="Kích thước" name="formFactor" required />
      <TextField label="Loại RAM hỗ trợ" name="memoryType" required />
      <NumberField label="Khe RAM" name="memorySlots" required />
      <NumberField label="RAM tối đa GB" name="maxMemoryGb" required />
      <CheckboxField label="Có Wi-Fi" name="wifi" />
    </>
  );
}

function RamFields() {
  return (
    <>
      <NumberField label="Dung lượng GB" name="capacityGb" required />
      <TextField label="Loại RAM" name="memoryType" required />
      <NumberField label="Bus MHz" name="busSpeedMhz" required />
      <NumberField label="Số thanh" name="moduleCount" required />
      <CheckboxField label="Có RGB" name="hasRgb" />
    </>
  );
}

function SsdFields() {
  return (
    <>
      <NumberField label="Dung lượng GB" name="capacityGb" required />
      <TextField label="Giao tiếp" name="interfaceType" required />
      <TextField label="Form factor" name="formFactor" required />
      <TextField label="Thế hệ" name="generation" required />
      <NumberField label="Tốc độ đọc MB/s" name="readSpeedMbps" required />
      <NumberField label="Tốc độ ghi MB/s" name="writeSpeedMbps" required />
    </>
  );
}

function VgaFields() {
  return (
    <>
      <TextField label="GPU chipset" name="gpuChipset" required />
      <NumberField label="CUDA cores" name="cudaCores" />
      <NumberField label="Stream processors" name="streamProcessors" />
      <NumberField label="VRAM GB" name="vramGb" required />
      <TextField label="Loại VRAM" name="vramType" required />
      <NumberField label="Base clock MHz" name="baseClockMhz" required />
      <NumberField label="Boost clock MHz" name="boostClockMhz" required />
      <NumberField label="PSU đề xuất W" name="recommendedPsuWatts" required />
    </>
  );
}

function PsuFields() {
  return (
    <>
      <NumberField label="Công suất W" name="wattage" required />
      <TextField label="Chuẩn hiệu suất" name="efficiencyRating" required />
      <TextField label="Kiểu dây nguồn" name="modularType" required />
      <TextField label="Form factor" name="formFactor" required />
    </>
  );
}

function CaseFields() {
  return (
    <>
      <TextField label="Form factor" name="formFactor" required />
      <TextField label="Màu sắc" name="color" required />
      <TextField label="Hông case" name="sidePanel" required />
      <NumberField label="Số fan" name="fanCount" required />
      <TextField label="Hỗ trợ mainboard" name="supportsMotherboard" required />
    </>
  );
}

function CoolingFields() {
  return (
    <>
      <TextField label="Kiểu tản" name="coolingType" required />
      <NumberField label="Kích thước fan mm" name="fanSizeMm" required />
      <NumberField label="Radiator mm" name="radiatorSizeMm" />
      <NumberField label="Chiều cao mm" name="heightMm" />
      <TextField label="Socket hỗ trợ" name="socketSupport" required />
    </>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <h2 className="admin-form-section">{title}</h2>;
}

function TextField({
  label,
  name,
  required,
}: {
  label: string;
  name: string;
  required?: boolean;
}) {
  return (
    <label>
      {label}
      <input name={name} required={required} type="text" />
    </label>
  );
}

function TextareaField({ label, name }: { label: string; name: string }) {
  return (
    <label className="admin-field-full">
      {label}
      <textarea name={name} rows={3} />
    </label>
  );
}

function NumberField({
  label,
  name,
  required,
  step = "1",
}: {
  label: string;
  name: string;
  required?: boolean;
  step?: string;
}) {
  return (
    <label>
      {label}
      <input min="0" name={name} required={required} step={step} type="number" />
    </label>
  );
}

function SelectField({
  label,
  name,
  onChange,
  options,
}: {
  label: string;
  name: string;
  onChange?: (value: string) => void;
  options: string[];
}) {
  return (
    <label>
      {label}
      <select name={name} onChange={(event) => onChange?.(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function CheckboxField({ label, name }: { label: string; name: string }) {
  return (
    <label className="admin-checkbox-field">
      <input name={name} type="checkbox" />
      {label}
    </label>
  );
}
