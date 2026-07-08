# متجر دروب شيبينغ - ShopPro

## المشروع
متجر إلكتروني متكامل للدروب شيبينغ مبني بـ Next.js 16 + TypeScript + Tailwind CSS.

## التشغيل
```bash
cd C:\Users\tamer\Desktop\dropship-store
npm install
npm run dev
```

ثم افتح `http://localhost:3000`

## هيكل المتجر
| المسار | الصفحة |
|--------|--------|
| `/` | الرئيسية |
| `/products` | كل المنتجات |
| `/products/[slug]` | تفاصيل المنتج |
| `/cart` | سلة التسوق |
| `/checkout` | الدفع |
| `/about` | من نحن |
| `/contact` | اتصل بنا |

## الملفات الرئيسية
- `src/lib/products.ts` - بيانات 18 منتج
- `src/context/CartContext.tsx` - إدارة السلة (localStorage)
- `src/components/` - المكونات
- `src/app/` - الصفحات
- `next.config.ts` - إعدادات الصور والـ remote patterns

## المميزات المضافة
- ✅ عربة تسوق كامل (localStorage)
- ✅ كود خصم: `SAVE10` (خصم 10%)
- ✅ شحن مجاني للطلبات فوق $50
- ✅ 6 أقسام: Electronics, Fashion, Home & Garden, Sports, Beauty, Accessories
- ✅ تصميم متجاوب
- ✅ Toast عند إضافة منتج

## ملاحظات
- الصور من `picsum.photos` - استبدلها بصور حقيقية
- بيانات الدفع تجريبية - تحتاج ربط Stripe/PayPal
- المنتجات نموذجية - استبدلها بمنتجات المورد

## نشر الموقع
```bash
npm run build
```
ثم ارفع مجلد `.next` و `public` على Vercel أو أي host.
