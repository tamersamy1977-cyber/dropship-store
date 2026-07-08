"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/products";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice, shipping, grandTotal, totalItems } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const product = (e as CustomEvent).detail as Product;
      const cartEvent = new CustomEvent("open-add-to-cart", { detail: product });
      window.dispatchEvent(cartEvent);
    };
    window.addEventListener("add-to-cart", handler);
    return () => window.removeEventListener("add-to-cart", handler);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={closeCart} />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-rose-100">
            <h2 className="text-lg font-semibold text-gray-900">
              سلة التسوق ({totalItems})
            </h2>
            <button onClick={closeCart} className="p-1 text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                <p className="text-gray-500 font-medium">سلتك فارغة</p>
                <p className="text-gray-400 text-sm mt-1">أضيفي بعض المنتجات للبدء!</p>
                <Link
                  href="/products"
                  onClick={closeCart}
                  className="mt-4 bg-gradient-to-r from-rose-600 to-rose-500 text-white px-6 py-2 rounded-xl text-sm font-medium hover:from-rose-700 hover:to-rose-600 transition-all shadow-sm"
                >
                  تصفحي المنتجات
                </Link>
              </div>
            ) : (
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item.product.id} className="flex gap-4 bg-rose-50/50 rounded-xl p-3">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white flex-shrink-0">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{item.product.name}</h3>
                      <p className="text-sm font-semibold text-rose-600 mt-1">{formatPrice(item.product.price)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-200 text-sm"
                        >
                          -
                        </button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-200 text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-rose-100 p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">المجموع الفرعي</span>
                <span className="font-medium">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">الشحن</span>
                <span className="font-medium">{shipping === 0 ? "مجاني" : formatPrice(shipping)}</span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-gray-400">الشحن مجاني للطلبات فوق 50$</p>
              )}
              <div className="flex justify-between text-base font-bold border-t border-rose-100 pt-3">
                <span>الإجمالي</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="block w-full bg-gradient-to-r from-rose-600 to-rose-500 text-white text-center font-medium py-3 rounded-xl hover:from-rose-700 hover:to-rose-600 transition-all shadow-sm"
              >
                إتمام الشراء
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
