"use client";

import { useAdmin } from "@/context/AdminContext";

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useAdmin();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-600";
      case "shipped": return "bg-blue-100 text-blue-600";
      case "cancelled": return "bg-red-100 text-red-600";
      default: return "bg-yellow-100 text-yellow-600";
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 text-sm mt-1">{orders.length} total orders</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-400 text-lg">No orders yet.</p>
          <p className="text-gray-400 text-sm mt-1">Orders will appear here after customers checkout.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Order #</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Customer</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Items</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Total</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">#{order.id}</td>
                    <td className="px-4 py-3">
                      <p className="text-gray-900">{order.customer?.name || "Guest"}</p>
                      <p className="text-gray-400 text-xs">{order.customer?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{order.itemsCount || order.items?.length || 0}</td>
                    <td className="px-4 py-3 font-medium">${(order.total || 0).toFixed(2)}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {order.date ? new Date(order.date).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusColor(order.status || "pending")}`}>
                        {order.status || "pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <select
                        value={order.status || "pending"}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="text-xs border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
