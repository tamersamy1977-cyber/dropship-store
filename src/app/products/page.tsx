"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { categories } from "@/lib/products";
import { useAdmin } from "@/context/AdminContext";
import ProductCard from "@/components/ProductCard";

function ProductsContent() {
  const searchParams = useSearchParams();
  const { allProducts } = useAdmin();
  const categoryFilter = searchParams.get("category");
  const searchQuery = searchParams.get("search")?.toLowerCase();

  let filtered = allProducts;

  if (categoryFilter) {
    filtered = filtered.filter((p) => p.category === categoryFilter);
  }

  if (searchQuery) {
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery) ||
        p.description.toLowerCase().includes(searchQuery) ||
        p.category.toLowerCase().includes(searchQuery)
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {categoryFilter
            ? categories.find((c) => c.slug === categoryFilter)?.name || "المنتجات"
            : "جميع المنتجات"}
        </h1>
        <p className="text-gray-500 mt-2">{filtered.length} منتج</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-rose-100 p-5 sticky top-24">
            <h2 className="font-semibold text-gray-900 mb-4">الأقسام</h2>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products"
                  className={`block text-sm py-1.5 px-3 rounded-xl transition-colors ${
                    !categoryFilter
                      ? "bg-rose-50 text-rose-600 font-medium"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  الكل
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className={`block text-sm py-1.5 px-3 rounded-xl transition-colors ${
                      categoryFilter === cat.slug
                        ? "bg-rose-50 text-rose-600 font-medium"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {cat.name} <span className="text-gray-400">({cat.count})</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">لا توجد منتجات.</p>
              <Link href="/products" className="text-rose-600 hover:text-rose-700 font-medium mt-2 inline-block">
                إعادة تعيين الفلتر
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8"><p className="text-gray-500">جاري تحميل المنتجات...</p></div>}>
      <ProductsContent />
    </Suspense>
  );
}
