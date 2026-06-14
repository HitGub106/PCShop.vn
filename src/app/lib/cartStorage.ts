export type CartItem = {
  id: string;
  image: string;
  itemType: "product" | "component" | "monitor" | "custom";
  name: string;
  price: number;
  quantity: number;
};

export type AddCartItemInput = Omit<CartItem, "quantity"> & {
  quantity?: number;
};

export const cartStorageKey = "pcprime_cart";
export const cartUpdatedEvent = "pcprime:cart-updated";
export const cartItemAddedEvent = "pcprime:cart-item-added";

export function formatCartPrice(value: number) {
  return `${new Intl.NumberFormat("vi-VN").format(value)} VND`;
}

export function parseCartPrice(value: string) {
  const amount = Number(value.replace(/[^\d]/g, ""));

  return Number.isFinite(amount) ? amount : 0;
}

export function parseCartItems(rawValue: string | null): CartItem[] {
  try {
    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue) as CartItem[];

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue
      .map((item) => ({
        id: String(item.id),
        image: String(item.image ?? ""),
        itemType: item.itemType ?? "product",
        name: String(item.name ?? ""),
        price: Number(item.price) || 0,
        quantity: Math.max(1, Number(item.quantity) || 1),
      }))
      .filter((item) => item.id && item.name);
  } catch {
    return [];
  }
}

export function readCartItems(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  return parseCartItems(window.localStorage.getItem(cartStorageKey));
}

export function getCartQuantity(items = readCartItems()) {
  return items.reduce((total, item) => total + item.quantity, 0);
}

function notifyCartUpdated(items: CartItem[]) {
  window.dispatchEvent(
    new CustomEvent(cartUpdatedEvent, {
      detail: {
        quantity: getCartQuantity(items),
      },
    }),
  );
}

export function writeCartItems(items: CartItem[]) {
  window.localStorage.setItem(cartStorageKey, JSON.stringify(items));
  notifyCartUpdated(items);
}

export function addCartItem(input: AddCartItemInput) {
  const items = readCartItems();
  const existingItem = items.find((item) => item.id === input.id);

  if (existingItem) {
    existingItem.quantity += input.quantity ?? 1;
  } else {
    items.push({
      ...input,
      quantity: input.quantity ?? 1,
    });
  }

  writeCartItems(items);
  window.dispatchEvent(
    new CustomEvent(cartItemAddedEvent, {
      detail: {
        itemName: input.name,
        quantity: getCartQuantity(items),
      },
    }),
  );

  return items;
}
