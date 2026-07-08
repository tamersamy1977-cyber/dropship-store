"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-white rounded-2xl border border-rose-100 overflow-hidden hover:shadow-lg hover:shadow-rose-100/50 hover:border-rose-200 transition-all duration-300 flex flex-col"
    >
      <div className="relative aspect-square bg-rose-50/50 overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {product.originalPrice && (
          <div className="absolute top-3 right-3 bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
          </div>
        )}
        <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="bg-white/90 backdrop-blur-sm text-rose-600 text-xs font-medium px-3 py-1 rounded-full shadow-sm">
            إضافة إلى السلة
          </span>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-rose-400 font-medium mb-1">{product.category}</p>
        <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-rose-600 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mb-2" dir="ltr">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-xs text-gray-400 mr-1">({product.reviews})</span>
        </div>
        <div className="mt-auto flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            window.dispatchEvent(new CustomEvent("add-to-cart", { detail: product }));
          }}
          className="mt-3 w-full bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white text-sm font-medium py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md hover:shadow-rose-200"
        >
          أضف إلى السلة
        </button>
      </div>
    </Link>
  );
}
