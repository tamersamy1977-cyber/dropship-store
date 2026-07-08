"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";
import { Product } from "@/lib/types";
import { products as defaultProducts } from "@/lib/products";

interface AdminProduct extends Product {
  _createdAt?: string;
}

interface AdminContextType {
  customProducts: AdminProduct[];
  deletedProductIds: string[];
  allProducts: AdminProduct[];
  getProductBySlug: (slug: string) => AdminProduct | undefined;
  addProduct: (p: AdminProduct) => void;
  updateProduct: (p: AdminProduct) => void;
  deleteProduct: (id: string) => void;
  orders: any[];
  addOrder: (o: any) => void;
  updateOrderStatus: (id: string, status: string) => void;
  isLoggedIn: boolean;
  login: (pass: string) => boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_PASSWORD = "admin123";

export function AdminProvider({ children }: { children: ReactNode }) {
  const [customProducts, setCustomProducts] = useState<AdminProduct[]>([]);
  const [deletedProductIds, setDeletedProductIds] = useState<string[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    try {
      const p = localStorage.getItem("admin_products");
      if (p) setCustomProducts(JSON.parse(p));
      const d = localStorage.getItem("admin_deleted_products");
      if (d) setDeletedProductIds(JSON.parse(d));
      const o = localStorage.getItem("admin_orders");
      if (o) setOrders(JSON.parse(o));
      const logged = localStorage.getItem("admin_logged");
      if (logged === "true") setIsLoggedIn(true);
    } catch {}
  }, []);

  const saveProducts = (items: AdminProduct[]) => {
    setCustomProducts(items);
    localStorage.setItem("admin_products", JSON.stringify(items));
  };

  const addProduct = (p: AdminProduct) => {
    saveProducts([...customProducts, { ...p, _createdAt: new Date().toISOString() }]);
  };

  const updateProduct = (p: AdminProduct) => {
    const exists = customProducts.some((x) => x.id === p.id);
    if (exists) {
      saveProducts(customProducts.map((x) => (x.id === p.id ? p : x)));
    } else {
      // first-time edit of a default product → copy into customProducts
      saveProducts([...customProducts, { ...p, _createdAt: new Date().toISOString() }]);
    }
  };

  const deleteProduct = (id: string) => {
    const isCustom = customProducts.some((x) => x.id === id);
    if (isCustom) {
      saveProducts(customProducts.filter((x) => x.id !== id));
    } else {
      setDeletedProductIds((prev) => {
        const updated = [...prev, id];
        localStorage.setItem("admin_deleted_products", JSON.stringify(updated));
        return updated;
      });
    }
  };

  const addOrder = (o: any) => {
    const updated = [o, ...orders];
    setOrders(updated);
    localStorage.setItem("admin_orders", JSON.stringify(updated));
  };

  const updateOrderStatus = (id: string, status: string) => {
    const updated = orders.map((o) => (o.id === id ? { ...o, status } : o));
    setOrders(updated);
    localStorage.setItem("admin_orders", JSON.stringify(updated));
  };

  const mergedProducts = useMemo(
    () => [...defaultProducts.filter((p) => !deletedProductIds.includes(p.id)), ...customProducts],
    [customProducts, deletedProductIds]
  );

  const getProductBySlugFn = (slug: string) =>
    mergedProducts.find((p) => p.slug === slug);

  const login = (pass: string) => {
    if (pass === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      localStorage.setItem("admin_logged", "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.setItem("admin_logged", "false");
  };

  return (
    <AdminContext.Provider
      value={{ customProducts, deletedProductIds, allProducts: mergedProducts, getProductBySlug: getProductBySlugFn, addProduct, updateProduct, deleteProduct, orders, addOrder, updateOrderStatus, isLoggedIn, login, logout }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
