import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">عن أثر ستور</h1>

      <div className="prose prose-gray max-w-none space-y-6">
        <p className="text-lg text-gray-600 leading-relaxed">
          مرحباً بكِ في <strong>أثر ستور</strong>، وجهتك الأولى للمنتجات الراقية بأسعار لا تقبل المنافسة. نحن متجر دروب شيبينغ مخصص لجلب أفضل المنتجات من جميع أنحاء العالم إليكِ.
        </p>

        <div className="bg-gradient-to-r from-rose-50 to-rose-100/50 rounded-2xl p-8 my-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">رسالتنا</h2>
          <p className="text-gray-600 leading-relaxed">
            رسالتنا بسيطة: توفير منتجات عالية الجودة بأسعار معقولة. نختار كل منتج بعناية لضمان مطابقته لمعاييرنا من حيث الجودة والقيمة ورضا العملاء.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">لماذا أثر ستور؟</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          {[
            {
              title: "منتجات عالية الجودة",
              desc: "كل منتج يتم اختياره وفحصه بعناية لضمان مطابقته لمعايير الجودة.",
            },
            {
              title: "أسعار تنافسية",
              desc: "بفضل العمل المباشر مع الموردين، نوفر لكِ أفضل الأسعار.",
            },
            {
              title: "شحن سريع",
              desc: "نتعاون مع شركات شحن موثوقة لضمان وصول طلباتكِ بسرعة.",
            },
            {
              title: "العميلة أولاً",
              desc: "رضاكِ هو أولويتنا. فريق الدعم متاح 24/7 لمساعدتكِ.",
            },
          ].map((item) => (
            <div key={item.title} className="border border-rose-100 rounded-2xl p-6 hover:shadow-md hover:shadow-rose-100/50 transition-shadow">
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">كيف يعمل المتجر؟</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
          {[
            { step: "1", title: "تصفحي", desc: "استعرضي مجموعتنا من المنتجات المختارة عبر أقسام متعددة." },
            { step: "2", title: "اطلبي", desc: "أضيفي المنتجات إلى سلتك وأتمي الطلب بكل أمان." },
            { step: "3", title: "استمتعي", desc: "استلمي طلبكِ بسرعة واستمتعي بمنتجاتكِ الجديدة!" },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-rose-600 to-rose-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3 shadow-md">
                {item.step}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 pt-8 border-t border-rose-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">مستعدة للتسوق؟</h2>
          <Link
            href="/products"
            className="inline-block bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-lg shadow-rose-200"
          >
            تصفحي المنتجات
          </Link>
        </div>
      </div>
    </div>
  );
}
