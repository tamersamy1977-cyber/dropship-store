import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">About ShopPro</h1>

      <div className="prose prose-gray max-w-none space-y-6">
        <p className="text-lg text-gray-600 leading-relaxed">
          Welcome to ShopPro, your premier destination for quality products at unbeatable prices. We are a dedicated dropshipping store committed to bringing you the best products from around the world.
        </p>

        <div className="bg-blue-50 rounded-2xl p-8 my-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            Our mission is simple: to provide access to high-quality products without the premium price tag. We carefully curate each item in our catalog to ensure it meets our standards for quality, value, and customer satisfaction.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Why Choose Us?</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          {[
            {
              title: "Quality Products",
              desc: "Every product is carefully selected and vetted to ensure it meets our quality standards.",
            },
            {
              title: "Competitive Prices",
              desc: "By working directly with suppliers, we pass the savings directly to you.",
            },
            {
              title: "Fast Shipping",
              desc: "We partner with reliable shipping carriers to ensure your orders arrive quickly.",
            },
            {
              title: "Customer First",
              desc: "Your satisfaction is our priority. Our support team is available 24/7 to help.",
            },
          ].map((item) => (
            <div key={item.title} className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">How It Works</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
          {[
            { step: "1", title: "Browse", desc: "Explore our catalog of curated products across multiple categories." },
            { step: "2", title: "Order", desc: "Add items to your cart and checkout securely in minutes." },
            { step: "3", title: "Enjoy", desc: "Receive your order fast and enjoy your new products!" },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                {item.step}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Shopping?</h2>
          <Link
            href="/products"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
