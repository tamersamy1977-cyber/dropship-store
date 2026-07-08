"use client";

import { useEffect, useRef, useState } from "react";
import { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/products";

export default function AddToCartToast() {
  const { addItem } = useCart();
  const [show, setShow] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const p = (e as CustomEvent).detail as Product;
      setProduct(p);
      addItem(p);
      setShow(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        setShow(false);
        setProduct(null);
      }, 2500);
    };
    window.addEventListener("open-add-to-cart", handler);
    return () => {
      window.removeEventListener("open-add-to-cart", handler);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [addItem]);

  if (!show || !product) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 animate-slide-up">
      <div className="bg-gray-900 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 max-w-sm">
        <div className="bg-green-500 rounded-full p-1 flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{product.name}</p>
          <p className="text-xs text-gray-400">أُضيف إلى السلة · {formatPrice(product.price)}</p>
        </div>
      </div>
    </div>
  );
}
