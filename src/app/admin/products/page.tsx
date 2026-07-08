"use client";

import { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { products as defaultProducts } from "@/lib/products";

export default function AdminProductsPage() {
  const { customProducts, deletedProductIds, addProduct, updateProduct, deleteProduct } = useAdmin();
  const [editing, setEditing] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  const allProducts = [...defaultProducts.filter((p) => !deletedProductIds.includes(p.id)), ...customProducts];

  const emptyProduct = {
    id: "",
    name: "",
    slug: "",
    description: "",
    price: 0,
    originalPrice: 0,
    images: [""],
    category: "electronics",
    subcategory: "",
    rating: 4.5,
    reviews: 0,
    inStock: true,
    features: [""],
    specifications: {},
  };

  const [form, setForm] = useState<any>({ ...emptyProduct });

  const resetForm = () => {
    setForm({ ...emptyProduct, id: Date.now().toString(), slug: "" });
    setEditing(null);
  };

  const openEdit = (p: any) => {
    setForm({ ...p });
    setEditing(p);
    setShowForm(true);
  };

  const openAdd = () => {
    resetForm();
    setShowForm(true);
  };

  const handleSave = () => {
    const product = {
      ...form,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
    };
    if (editing) {
      updateProduct(product);
    } else {
      addProduct({ ...product, id: Date.now().toString(), slug: form.name.toLowerCase().replace(/\s+/g, "-") });
    }
    setShowForm(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this product?")) deleteProduct(id);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm mt-1">{allProducts.length} total products</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors text-sm"
        >
          + Add Product
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-10 pb-10 overflow-y-auto" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">{editing ? "Edit Product" : "Add Product"}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Original Price ($)</label>
                  <input type="number" step="0.01" value={form.originalPrice || ""} onChange={(e) => setForm({ ...form, originalPrice: e.target.value || 0 })} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="electronics">Electronics</option>
                    <option value="fashion">Fashion</option>
                    <option value="home-garden">Home & Garden</option>
                    <option value="sports">Sports</option>
                    <option value="beauty">Beauty & Health</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
                  <input value={form.subcategory} onChange={(e) => setForm({ ...form, subcategory: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Images</label>
                  <div className="flex gap-2 mb-2">
                    <label className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg px-4 py-3 cursor-pointer hover:border-blue-400 transition-colors text-sm text-gray-500">
                      <span>+ Upload from computer</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            const dataUrl = ev.target?.result as string;
                            setForm({ ...form, images: [...form.images, dataUrl] });
                          };
                          reader.readAsDataURL(file);
                        }
                        e.target.value = "";
                      }} />
                    </label>
                  </div>
                  {form.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(form.images as string[]).map((img, i) => (
                        <div key={i} className="relative group">
                          <img src={img} alt="" className="w-16 h-16 rounded-lg object-cover border border-gray-200" />
                          <button
                            onClick={() => setForm({ ...form, images: (form.images as string[]).filter((_, idx) => idx !== i) })}
                            className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <details className="text-xs text-gray-400">
                    <summary className="cursor-pointer hover:text-gray-600">Or paste image URLs (one per line)</summary>
                    <textarea value={(form.images as string[]).filter((u) => u.startsWith("http")).join("\n")} onChange={(e) => {
                      const urls = e.target.value.split("\n").filter(Boolean);
                      const existing = (form.images as string[]).filter((u) => !u.startsWith("http"));
                      setForm({ ...form, images: [...existing, ...urls] });
                    }} rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1" />
                  </details>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Features (one per line)</label>
                  <textarea value={form.features.join("\n")} onChange={(e) => setForm({ ...form, features: e.target.value.split("\n").filter(Boolean) })} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })} className="accent-blue-600" />
                  <label className="text-sm font-medium text-gray-700">In Stock</label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
              <button onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors">
                {editing ? "Update Product" : "Add Product"}
              </button>
              <button onClick={() => setShowForm(false)} className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Product</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Category</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Price</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Stock</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Source</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allProducts.map((p) => {
                const isCustom = customProducts.some((c) => c.id === p.id);
                return (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 truncate max-w-[250px]">{p.name}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500 capitalize">{p.category}</td>
                    <td className="px-4 py-3 font-medium">${p.price.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.inStock ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                        {p.inStock ? "In Stock" : "Out"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs ${isCustom ? "text-blue-500" : "text-gray-400"}`}>
                        {isCustom ? "Custom" : "Default"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => openEdit(p)} className="text-blue-600 hover:text-blue-700 text-sm font-medium">Edit</button>
                        <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-600 text-sm font-medium">Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
