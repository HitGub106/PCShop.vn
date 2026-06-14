"use client";

import Image from "next/image";
import { useMemo, useState, useSyncExternalStore } from "react";

import {
  cartStorageKey,
  cartUpdatedEvent,
  type CartItem,
  formatCartPrice,
  parseCartItems,
  writeCartItems,
} from "../lib/cartStorage";

type BuyerInfo = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  note: string;
};

type BuyerErrors = Partial<Record<keyof BuyerInfo, string>>;

type OrderResponse = {
  ok: boolean;
  invoiceCode?: string;
  message?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type CartContentProps = {
  initialBuyerInfo: BuyerInfo;
};

export function CartContent({ initialBuyerInfo }: CartContentProps) {
  const cartSnapshot = useSyncExternalStore(
    subscribeToCart,
    getCartSnapshot,
    getServerCartSnapshot,
  );
  const items = useMemo(() => parseCartItems(cartSnapshot), [cartSnapshot]);
  const [buyerInfo, setBuyerInfo] = useState(initialBuyerInfo);
  const [errors, setErrors] = useState<BuyerErrors>({});
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [orderStatus, setOrderStatus] = useState("");

  const totalPrice = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items],
  );

  function updateItems(nextItems: CartItem[]) {
    writeCartItems(nextItems);
  }

  function updateQuantity(itemId: string, value: string) {
    const quantity = Math.max(1, Number(value) || 1);

    updateItems(
      items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity,
            }
          : item,
      ),
    );
  }

  function removeItem(itemId: string) {
    updateItems(items.filter((item) => item.id !== itemId));
  }

  function updateBuyerInfo(name: keyof BuyerInfo, value: string) {
    setBuyerInfo((currentInfo) => ({
      ...currentInfo,
      [name]: value,
    }));
    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: undefined,
    }));
    setOrderStatus("");
  }

  function handleSubmitOrder() {
    const nextErrors = validateBuyerInfo(buyerInfo);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setOrderStatus("Vui lòng kiểm tra lại thông tin người mua.");
      return;
    }

    if (items.length === 0) {
      setOrderStatus("Giỏ hàng đang trống.");
      return;
    }

    setErrors({});
    setOrderStatus("");
    setIsPaymentOpen(true);
  }

  async function handleCompletePayment() {
    setIsSavingOrder(true);
    setOrderStatus("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          buyerInfo,
          items,
        }),
      });
      const result = (await response.json()) as OrderResponse;

      if (!response.ok || !result.ok) {
        setOrderStatus(result.message ?? "Không thể lưu đơn hàng.");
        return;
      }

      writeCartItems([]);
      setBuyerInfo(initialBuyerInfo);
      setIsPaymentOpen(false);
      setOrderStatus(
        result.invoiceCode
          ? `Đặt hàng thành công. Mã hóa đơn: ${result.invoiceCode}`
          : "Đặt hàng thành công.",
      );
    } catch {
      setOrderStatus("Không thể lưu đơn hàng lúc này. Vui lòng thử lại sau.");
    } finally {
      setIsSavingOrder(false);
    }
  }

  return (
    <section className="container cart-page">
      <div className="section-component-heading">
        <div>
          <p>Giỏ hàng</p>
        </div>
      </div>

      <div className="cart-panel">
        <div className="cart-list" aria-label="Danh sách sản phẩm trong giỏ">
          <div className="cart-row cart-row--head">
            <span>Sản phẩm</span>
            <span>Tên</span>
            <span>Giá</span>
            <span>Số lượng</span>
            <span>Tổng</span>
            <span>Xóa</span>
          </div>

          {items.length > 0 ? (
            items.map((item) => (
              <div className="cart-row" key={item.id}>
                <div
                  className="cart-item-image"
                  aria-label={item.name}
                  role="img"
                  style={{ backgroundImage: `url(${item.image})` }}
                />
                <strong>{item.name}</strong>
                <span>{formatCartPrice(item.price)}</span>
                <input
                  aria-label={`Số lượng ${item.name}`}
                  min={1}
                  onChange={(event) =>
                    updateQuantity(item.id, event.target.value)
                  }
                  type="number"
                  value={item.quantity}
                />
                <strong>{formatCartPrice(item.price * item.quantity)}</strong>
                <button
                  aria-label={`Xóa ${item.name}`}
                  className="cart-remove-button"
                  onClick={() => removeItem(item.id)}
                  type="button"
                >
                  ×
                </button>
              </div>
            ))
          ) : (
            <p className="cart-empty">Giỏ hàng đang trống.</p>
          )}

          <div className="cart-total-row">
            <span>Tổng tiền</span>
            <strong>{formatCartPrice(totalPrice)}</strong>
          </div>
        </div>

        <form className="buyer-form" noValidate>
          <h2>Thông tin người mua</h2>

          <label>
            Họ tên
            <input
              aria-invalid={Boolean(errors.fullName)}
              name="fullName"
              onChange={(event) =>
                updateBuyerInfo("fullName", event.target.value)
              }
              placeholder="Nguyễn Văn A"
              type="text"
              value={buyerInfo.fullName}
            />
            {errors.fullName ? (
              <span className="auth-error">{errors.fullName}</span>
            ) : null}
          </label>

          <label>
            SĐT
            <input
              aria-invalid={Boolean(errors.phone)}
              name="phone"
              onChange={(event) => updateBuyerInfo("phone", event.target.value)}
              placeholder="0987654321"
              type="tel"
              value={buyerInfo.phone}
            />
            {errors.phone ? (
              <span className="auth-error">{errors.phone}</span>
            ) : null}
          </label>

          <label>
            Email
            <input
              aria-invalid={Boolean(errors.email)}
              name="email"
              onChange={(event) => updateBuyerInfo("email", event.target.value)}
              placeholder="email@example.com"
              type="email"
              value={buyerInfo.email}
            />
            {errors.email ? (
              <span className="auth-error">{errors.email}</span>
            ) : null}
          </label>

          <label>
            Địa chỉ
            <input
              aria-invalid={Boolean(errors.address)}
              name="address"
              onChange={(event) =>
                updateBuyerInfo("address", event.target.value)
              }
              placeholder="Số nhà, phường/xã, quận/huyện, tỉnh/thành"
              type="text"
              value={buyerInfo.address}
            />
            {errors.address ? (
              <span className="auth-error">{errors.address}</span>
            ) : null}
          </label>

          <label className="buyer-note">
            Ghi chú
            <textarea
              name="note"
              onChange={(event) => updateBuyerInfo("note", event.target.value)}
              placeholder="Ghi chú thêm cho đơn hàng nếu có"
              rows={4}
              value={buyerInfo.note}
            />
          </label>

          {orderStatus ? (
            <p className="auth-status auth-field-full">{orderStatus}</p>
          ) : null}

          <button
            className="order-button"
            disabled={items.length === 0}
            onClick={handleSubmitOrder}
            type="button"
          >
            Đặt hàng
          </button>
        </form>
      </div>

      {isPaymentOpen ? (
        <div className="payment-modal" role="dialog" aria-modal="true">
          <div className="payment-box">
            <h2>Quét mã thanh toán</h2>
            <Image alt="Mã QR thanh toán" height={240} src="/qr.svg" width={240} />
            <button
              className="order-button"
              disabled={isSavingOrder}
              onClick={handleCompletePayment}
              type="button"
            >
              {isSavingOrder ? "Đang lưu hóa đơn..." : "Hoàn tất"}
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function validateBuyerInfo(values: BuyerInfo) {
  const errors: BuyerErrors = {};
  const phoneDigits = values.phone.replace(/\D/g, "");

  if (!values.fullName.trim()) {
    errors.fullName = "Vui lòng nhập họ tên.";
  } else if (values.fullName.trim().length < 2) {
    errors.fullName = "Họ tên quá ngắn.";
  }

  if (!values.phone.trim()) {
    errors.phone = "Vui lòng nhập số điện thoại.";
  } else if (phoneDigits.length < 9 || phoneDigits.length > 11) {
    errors.phone = "Số điện thoại cần từ 9 đến 11 chữ số.";
  }

  if (!values.email.trim()) {
    errors.email = "Vui lòng nhập email.";
  } else if (!emailPattern.test(values.email.trim())) {
    errors.email = "Email không đúng định dạng.";
  }

  if (!values.address.trim()) {
    errors.address = "Vui lòng nhập địa chỉ.";
  } else if (values.address.trim().length < 5) {
    errors.address = "Địa chỉ quá ngắn.";
  }

  return errors;
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
  return window.localStorage.getItem(cartStorageKey) ?? "[]";
}

function getServerCartSnapshot() {
  return "[]";
}
