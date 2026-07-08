"use client";

import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { categories, formatPrice } from "@/lib/products";
import { useAdmin } from "@/context/AdminContext";

export default function Home() {
  const { allProducts } = useAdmin();
  const featured = allProducts.filter((p) => p.rating >= 4.6).slice(0, 4);
  const bestsellers = allProducts.filter((p) => p.reviews > 2000).slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Premium Products,{" "}
              <span className="text-blue-400">Unbeatable Prices</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
              Discover top-quality products from around the world with fast shipping and exceptional customer service. Your perfect find is just a click away.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-lg transition-colors text-lg"
              >
                Shop Now
              </Link>
              <Link
                href="/products?category=electronics"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-lg transition-colors text-lg backdrop-blur-sm border border-white/20"
              >
                Browse Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Browse our curated collection of high-quality products across popular categories.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.slice(0, 6).map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group bg-white rounded-xl border border-gray-200 p-6 text-center hover:shadow-md hover:border-blue-200 transition-all"
              >
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {cat.id === "electronics" && "📱"}
                  {cat.id === "fashion" && "👕"}
                  {cat.id === "home-garden" && "🏠"}
                  {cat.id === "sports" && "⚽"}
                  {cat.id === "beauty" && "💄"}
                  {cat.id === "accessories" && "🕶️"}
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">{cat.name}</h3>
                <p className="text-xs text-gray-400 mt-1">{cat.count} Products</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
              <p className="text-gray-500 mt-2">Top-rated products loved by customers worldwide.</p>
            </div>
            <Link href="/products" className="text-blue-600 hover:text-blue-700 font-medium text-sm hidden sm:block">
              View All &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Best Sellers</h2>
              <p className="text-gray-500 mt-2">Our most popular products this month.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestsellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/products"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: "🚚", title: "Free Shipping", desc: "On orders over $50" },
              { icon: "🔒", title: "Secure Payment", desc: "100% secure checkout" },
              { icon: "↩️", title: "Easy Returns", desc: "30-day return policy" },
              { icon: "💬", title: "24/7 Support", desc: "Always here to help" },
            ].map((item) => (
              <div key={item.title}>
                <div className="text-3xl mb-2">{item.icon}</div>
                <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
