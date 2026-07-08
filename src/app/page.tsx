"use client";

import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { categories, formatPrice } from "@/lib/products";
import { useAdmin } from "@/context/AdminContext";

export default function Home() {
  const { allProducts } = useAdmin();
  const featured = allProducts.filter((p) => p.rating >= 4.6).slice(0, 4);
  const bestsellers = allProducts.filter((p) => p.reviews > 2000).slice(0, 4);
  const newArrivals = [...allProducts].reverse().slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-white to-rose-100">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-rose-200/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-rose-300/20 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-rose-300/40 rounded-full animate-float" />
          <div className="absolute top-1/4 right-1/3 w-3 h-3 bg-rose-400/30 rounded-full animate-float" style={{ animationDelay: "1s" }} />
          <div className="absolute bottom-1/3 right-1/4 w-5 h-5 bg-rose-200/40 rounded-full animate-float" style={{ animationDelay: "2s" }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-rose-100/80 backdrop-blur-sm text-rose-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
              تشكيلة ربيع 2026
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              تسوقي بأناقة مع{" "}
              <span className="bg-gradient-to-r from-rose-600 to-rose-400 bg-clip-text text-transparent">أثر</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              منتجات مختارة بعناية لتعزيز أناقتكِ وجمالكِ. جودة عالية، تصاميم عصرية، وأسعار تناسب الجميع. اكتشفي الفرق مع أثر ستور.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-rose-200 hover:shadow-rose-300 text-lg"
              >
                تسوقي الآن
              </Link>
              <Link
                href="/products?category=fashion"
                className="bg-white hover:bg-rose-50 text-gray-800 font-semibold px-8 py-3.5 rounded-xl transition-all border border-rose-200 shadow-sm text-lg"
              >
                تشكيلات الأزياء
              </Link>
            </div>
            <div className="flex items-center gap-8 mt-10 pt-8 border-t border-rose-100">
              <div className="text-center">
                <p className="text-2xl font-bold text-rose-600">+500</p>
                <p className="text-xs text-gray-500 mt-1">منتج متنوع</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-rose-600">+10k</p>
                <p className="text-xs text-gray-500 mt-1">عميل سعيد</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-rose-600">شحن</p>
                <p className="text-xs text-gray-500 mt-1">مجاني +50$</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-rose-600 text-sm font-medium tracking-widest uppercase">الأقسام</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">تسوقي حسب القسم</h2>
            <p className="text-gray-500 max-w-xl mx-auto">اكتشفي مجموعتنا المختارة من المنتجات عالية الجودة عبر أقسام متنوعة.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.slice(0, 6).map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group bg-rose-50/50 rounded-2xl border border-rose-100 p-6 text-center hover:bg-rose-50 hover:border-rose-200 hover:shadow-md hover:shadow-rose-100/50 transition-all"
              >
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:rotate-6 transition-transform">
                  {cat.id === "electronics" && "📱"}
                  {cat.id === "fashion" && "👗"}
                  {cat.id === "home-garden" && "🏠"}
                  {cat.id === "sports" && "⚽"}
                  {cat.id === "beauty" && "💄"}
                  {cat.id === "accessories" && "👜"}
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">{cat.name}</h3>
                <p className="text-xs text-rose-400 mt-1">{cat.count} منتج</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-rose-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-rose-600 text-sm font-medium tracking-widest uppercase">مختارات</span>
              <h2 className="text-3xl font-bold text-gray-900 mt-2">أفضل المنتجات</h2>
              <p className="text-gray-500 mt-2">منتجاتنا الأعلى تقييماً والمحبوبة من العملاء.</p>
            </div>
            <Link href="/products" className="text-rose-600 hover:text-rose-700 font-medium text-sm hidden sm:block">
              عرض الكل ←
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-rose-600 text-sm font-medium tracking-widest uppercase">جديد</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">وصل حديثاً</h2>
            <p className="text-gray-500 max-w-xl mx-auto">أحدث المنتجات المضافة إلى مجموعتنا — كوني أول من يقتنيها.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-lg shadow-rose-200"
            >
              استعرضي جميع المنتجات
            </Link>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="py-12 bg-rose-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: "🚚", title: "شحن مجاني", desc: "للطلبات فوق 50$" },
              { icon: "🔒", title: "دفع آمن", desc: "معلوماتك محمية" },
              { icon: "↩️", title: "إرجاع سهل", desc: "خلال 30 يوم" },
              { icon: "💬", title: "دعم 24/7", desc: "فريقنا هنا لمساعدتك" },
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

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-rose-600 to-rose-500">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">انضمي إلى نشرتنا البريدية</h2>
          <p className="text-rose-100 mb-8">احصلي على عروض حصرية وتنبيهات بأحدث المنتجات أولاً بأول.</p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="بريدك الإلكتروني"
              className="flex-1 px-5 py-3 rounded-xl border-0 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 bg-white/20 backdrop-blur-sm text-white placeholder:text-rose-200"
            />
            <button className="bg-white text-rose-600 font-semibold px-6 py-3 rounded-xl hover:bg-rose-50 transition-colors shadow-lg">
              اشتراك
            </button>
          </div>
        </div>
      </section>

      {/* Instagram / Social */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-rose-600 text-sm font-medium tracking-widest uppercase">تابعينا</span>
          <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">@atharstore</h2>
          <p className="text-gray-500 max-w-md mx-auto mb-8">شاركينا تجربتك مع أثر ستور باستخدام هاشتاج #أثر_ستور</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square rounded-2xl bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center text-4xl group cursor-pointer relative overflow-hidden">
                <div className="absolute inset-0 bg-rose-600/0 group-hover:bg-rose-600/20 transition-all flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-2xl">❤️</span>
                </div>
                📸
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
