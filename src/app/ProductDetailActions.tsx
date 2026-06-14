"use client";

import { useRouter } from "next/navigation";

import { addCartItem, parseCartPrice } from "./lib/cartStorage";
import type { CartItem } from "./lib/cartStorage";

type ProductDetailActionsProps = {
  id: string;
  image: string;
  itemType: CartItem["itemType"];
  name: string;
  price: string;
};

export function ProductDetailActions({
  id,
  image,
  itemType,
  name,
  price,
}: ProductDetailActionsProps) {
  const router = useRouter();

  function addCurrentItemToCart() {
    addCartItem({
      id,
      image,
      itemType,
      name,
      price: parseCartPrice(price),
    });
  }

  function handleOrderNow() {
    addCurrentItemToCart();
    router.push("/cart");
  }

  return (
    <div className="product-detail-actions">
      <button type="button" className="order-button" onClick={handleOrderNow}>
        Đặt hàng
      </button>
      <button
        type="button"
        className="cart-detail-button"
        onClick={addCurrentItemToCart}
      >
        Thêm vào giỏ
      </button>
    </div>
  );
}
