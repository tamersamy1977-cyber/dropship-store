"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">اتصل بنا</h1>
      <p className="text-gray-500 mb-10 text-lg">نسعد بتواصلكِ معنا. فريق أثر ستور في خدمتكِ.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {sent ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
              <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-green-800 mb-1">تم إرسال الرسالة!</h3>
              <p className="text-green-600 text-sm">سنتواصل معكِ خلال 24 ساعة.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الموضوع</label>
                <input
                  type="text"
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الرسالة</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-sm"
              >
                إرسال الرسالة
              </button>
            </form>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-rose-50/50 rounded-2xl p-5">
            <h3 className="font-semibold text-gray-900 mb-1">البريد الإلكتروني</h3>
            <p className="text-sm text-gray-500">support@atharstore.com</p>
          </div>
          <div className="bg-rose-50/50 rounded-2xl p-5">
            <h3 className="font-semibold text-gray-900 mb-1">وقت الاستجابة</h3>
            <p className="text-sm text-gray-500">نرد عادةً خلال 24 ساعة.</p>
          </div>
          <div className="bg-rose-50/50 rounded-2xl p-5">
            <h3 className="font-semibold text-gray-900 mb-1">الدردشة المباشرة</h3>
            <p className="text-sm text-gray-500">قريباً!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
