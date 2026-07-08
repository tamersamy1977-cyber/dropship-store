"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/products";
import { useState } from "react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, shipping, grandTotal, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === "save10") {
      setPromoApplied(true);
    }
  };

  const discount = promoApplied ? totalPrice * 0.1 : 0;
  const finalTotal = totalPrice + shipping - discount;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-300 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">سلتك فارغة</h1>
        <p className="text-gray-500 mb-8">لم تُضيفي أي منتجات بعد.</p>
        <Link
          href="/products"
          className="inline-block bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-sm"
        >
          ابدئي التسوق
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">سلة التسوق</h1>
        <button
          onClick={clearCart}
          className="text-sm text-red-500 hover:text-red-600 font-medium"
        >
          تفريغ السلة
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.product.id} className="flex gap-4 bg-white rounded-2xl border border-rose-100 p-4">
              <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-rose-50/50 flex-shrink-0">
                <Image
                  src={item.product.images[0]}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${item.product.slug}`}
                  className="text-base font-semibold text-gray-900 hover:text-rose-600 transition-colors"
                >
                  {item.product.name}
                </Link>
                <p className="text-sm text-gray-500 mt-0.5">{item.product.category}</p>
                <p className="text-lg font-bold text-rose-600 mt-2">{formatPrice(item.product.price)}</p>
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
                <div className="flex items-center border border-gray-300 rounded-xl">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="px-3 py-1.5 text-gray-600 hover:bg-gray-50 text-sm"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 font-medium text-gray-900 border-x border-gray-300 text-sm min-w-[36px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="px-3 py-1.5 text-gray-600 hover:bg-gray-50 text-sm"
                  >
                    +
                  </button>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {formatPrice(item.product.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-rose-100 p-6 h-fit sticky top-24">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">ملخص الطلب</h2>

          <div className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="كود الخصم"
                className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <button
                onClick={handleApplyPromo}
                className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                تطبيق
              </button>
            </div>
            {promoApplied && (
              <p className="text-sm text-green-600 mt-2">تم تطبيق الكود! خصم 10%</p>
            )}
            <p className="text-xs text-gray-400 mt-1">جربي كود: SAVE10</p>
          </div>

          <div className="space-y-3 border-t border-rose-100 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">المجموع الفرعي</span>
              <span className="font-medium text-gray-900">{formatPrice(totalPrice)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600">الخصم</span>
                <span className="font-medium text-green-600">-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">الشحن</span>
              <span className="font-medium text-gray-900">{shipping === 0 ? "مجاني" : formatPrice(shipping)}</span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-gray-400">الشحن مجاني للطلبات فوق 50$</p>
            )}
            <div className="flex justify-between text-lg font-bold border-t border-rose-100 pt-3">
              <span>الإجمالي</span>
              <span>{formatPrice(finalTotal)}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="block w-full bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white text-center font-semibold py-3 rounded-xl transition-all shadow-sm mt-6"
          >
            إتمام الشراء
          </Link>

          <Link
            href="/products"
            className="block w-full text-center text-sm text-gray-500 hover:text-rose-600 mt-3 transition-colors"
          >
            ← متابعة التسوق
          </Link>
        </div>
      </div>
    </div>
  );
}
