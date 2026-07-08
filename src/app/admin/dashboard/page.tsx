"use client";

import Link from "next/link";
import { useAdmin } from "@/context/AdminContext";

export default function AdminDashboard() {
  const { allProducts, orders } = useAdmin();
  const totalProducts = allProducts.length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "pending" || !o.status).length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: "Total Products", value: totalProducts, color: "bg-blue-500", icon: "📦" },
          { label: "Total Orders", value: totalOrders, color: "bg-green-500", icon: "🛒" },
          { label: "Pending Orders", value: pendingOrders, color: "bg-yellow-500", icon: "⏳" },
          { label: "Revenue", value: `$${totalRevenue.toFixed(2)}`, color: "bg-purple-500", icon: "💰" },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{card.icon}</span>
              <span className={`${card.color} w-3 h-3 rounded-full`} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{card.value}</p>
            <p className="text-sm text-gray-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/admin/products"
              className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
            >
              + Add New Product
            </Link>
            <Link
              href="/admin/orders"
              className="block w-full text-center bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 rounded-lg transition-colors"
            >
              View Orders
            </Link>
            <Link
              href="/"
              className="block w-full text-center border border-gray-300 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              View Storefront
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h2>
          {orders.length === 0 ? (
            <p className="text-gray-400 text-sm py-8 text-center">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">#{order.id}</p>
                    <p className="text-xs text-gray-500">{order.customer?.name || "Guest"}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    order.status === "delivered" ? "bg-green-100 text-green-600" :
                    order.status === "shipped" ? "bg-blue-100 text-blue-600" :
                    "bg-yellow-100 text-yellow-600"
                  }`}>
                    {order.status || "pending"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
