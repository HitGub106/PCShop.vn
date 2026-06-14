"use client";

import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore } from "react";

import {
  cartUpdatedEvent,
  getCartQuantity,
  readCartItems,
} from "./lib/cartStorage";

export function CartHeaderLink() {
  const quantity = useSyncExternalStore(
    subscribeToCart,
    getCartSnapshot,
    getServerCartSnapshot,
  );

  return (
    <Link href="/cart" className="cart-button">
      <span className="cart-icon-wrap" aria-hidden="true">
        <Image alt="" height={18} src="/cart.png" width={18} />
        {quantity > 0 ? (
          <strong className="cart-badge">{quantity > 99 ? "99+" : quantity}</strong>
        ) : null}
      </span>
      Giỏ hàng
    </Link>
  );
}

function subscribeToCart(onStoreChange: () => void) {
  window.addEventListener(cartUpdatedEvent, onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener(cartUpdatedEvent, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getCartSnapshot() {
  return getCartQuantity(readCartItems());
}

function getServerCartSnapshot() {
  return 0;
}
