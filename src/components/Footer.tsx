import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">
              <span className="bg-gradient-to-r from-rose-400 to-rose-300 bg-clip-text text-transparent">أثر</span>
              <span className="text-white"> ستور</span>
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              وجهتك الأولى للمنتجات الراقية بأسعار لا تقبل المنافسة. شحن سريع لجميع أنحاء العالم.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-white transition-colors">جميع المنتجات</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">عن المتجر</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">اتصل بنا</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">الأقسام</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products?category=electronics" className="hover:text-white transition-colors">إلكترونيات</Link></li>
              <li><Link href="/products?category=fashion" className="hover:text-white transition-colors">أزياء</Link></li>
              <li><Link href="/products?category=home-garden" className="hover:text-white transition-colors">منزل وحديقة</Link></li>
              <li><Link href="/products?category=sports" className="hover:text-white transition-colors">رياضة</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">خدمة العملاء</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="hover:text-white transition-colors cursor-pointer">معلومات الشحن</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">الاستبدال والاسترجاع</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">الأسئلة الشائعة</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">سياسة الخصوصية</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} أثر ستور. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
