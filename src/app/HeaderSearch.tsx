"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

type SearchType = "pc" | "component" | "monitor";

const searchTypes: Array<{
  label: string;
  value: SearchType;
}> = [
  { label: "PC", value: "pc" },
  { label: "Linh kiện PC", value: "component" },
  { label: "Màn hình", value: "monitor" },
];

export function HeaderSearch() {
  const router = useRouter();
  const [type, setType] = useState<SearchType>("pc");
  const [query, setQuery] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams();
    const trimmedQuery = query.trim();

    if (trimmedQuery) {
      params.set("q", trimmedQuery);
    }

    params.set("type", type);

    router.push(`/list_product/${type}?${params.toString()}`);
  }

  return (
    <form className="search-box" onSubmit={handleSubmit}>
      <select
        aria-label="Chọn danh mục"
        onChange={(event) => setType(event.target.value as SearchType)}
        value={type}
      >
        {searchTypes.map((searchType) => (
          <option key={searchType.value} value={searchType.value}>
            {searchType.label}
          </option>
        ))}
      </select>
      <input
        aria-label="Tìm kiếm sản phẩm"
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Tìm kiếm sản phẩm..."
        value={query}
      />
      <button type="submit" aria-label="Tìm kiếm">
        <span aria-hidden="true">⌕</span>
      </button>
    </form>
  );
}
