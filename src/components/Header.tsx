"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function Header() {
  const { totalItems, toggleCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-rose-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-rose-600 to-rose-400 bg-clip-text text-transparent">أثر</span>
            <span className="text-gray-900"> ستور</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-gray-700 hover:text-rose-600 transition-colors">
              الرئيسية
            </Link>
            <Link href="/products" className="text-sm font-medium text-gray-700 hover:text-rose-600 transition-colors">
              المنتجات
            </Link>
            <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-rose-600 transition-colors">
              عن المتجر
            </Link>
            <Link href="/contact" className="text-sm font-medium text-gray-700 hover:text-rose-600 transition-colors">
              اتصل بنا
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleCart}
              className="relative p-2 text-gray-700 hover:text-rose-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="md:hidden pb-4 border-t border-rose-100 pt-4">
            <div className="flex flex-col gap-3">
              <Link href="/" className="text-sm font-medium text-gray-700 hover:text-rose-600" onClick={() => setMenuOpen(false)}>الرئيسية</Link>
              <Link href="/products" className="text-sm font-medium text-gray-700 hover:text-rose-600" onClick={() => setMenuOpen(false)}>المنتجات</Link>
              <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-rose-600" onClick={() => setMenuOpen(false)}>عن المتجر</Link>
              <Link href="/contact" className="text-sm font-medium text-gray-700 hover:text-rose-600" onClick={() => setMenuOpen(false)}>اتصل بنا</Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
