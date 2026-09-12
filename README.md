# البوتيك — متجر إلكتروني (ملابس، مكياج، عطور، شنط، أحذية)

متجر إلكتروني كامل مبني بـ **React + Firebase**، فيه:

- تصفح المنتجات مع الألوان والمقاسات والأسعار
- سلة تسوق وصفحة إتمام شراء تجمع (الاسم، الهاتف، المدينة، العنوان)
- حسابات مستخدمين (تسجيل / دخول) للزبائن
- **حساب أدمن منفصل تماماً**: الزبون العادي ما يقدر أبداً يضيف/يعدّل/يحذف منتجات، حتى لو حاول من كود المتصفح مباشرة — لأن الحماية موجودة داخل قواعد Firebase نفسها (`firestore.rules`) مش بس بإخفاء الأزرار
- لوحة تحكم للأدمن لإدارة المنتجات، متابعة الطلبات، وقراءة رسائل التواصل
- جاهز للنشر التلقائي عبر GitHub Actions إلى Firebase Hosting

---

## 1) إعداد مشروع Firebase (مرة واحدة فقط)

1. ادخلي إلى https://console.firebase.google.com وأنشئي مشروع جديد.
2. من القائمة الجانبية فعّلي الخدمات التالية:
   - **Authentication** → Sign-in method → فعّلي "Email/Password"
   - **Firestore Database** → أنشئي قاعدة بيانات (اختاري وضع "production")
   - **Storage** → لتخزين صور المنتجات
   - **Hosting** (اختياري إذا بدك تستخدمي Firebase Hosting)
3. من **Project settings → General → Your apps**، أضيفي تطبيق ويب (</> Web) وانسخي بيانات الإعداد (apiKey, authDomain... الخ).
4. انسخي ملف `.env.example` باسم `.env` والصقي فيه القيم يلي نسختيها.

## 2) رفع قواعد الحماية

من مجلد المشروع، وبعد تثبيت أدوات Firebase:

```bash
npm install -g firebase-tools
firebase login
firebase init   # اختاري المشروع يلي أنشأتيه، واختاري firestore و storage و hosting
firebase deploy --only firestore:rules,storage:rules
```

هاي القواعد (`firestore.rules`) هي يلي بتضمن إنه:
- أي شخص (حتى بدون تسجيل دخول) يقدر يشوف المنتجات ويرسل رسالة تواصل.
- بس المستخدم المسجّل يقدر يعمل طلب شراء، وما يشوف إلا طلباته هو.
- **فقط** حساب فيه `role: "admin"` بقاعدة بيانات Firestore يقدر يضيف/يعدّل/يحذف منتجات، أو يشوف كل الطلبات والرسائل.

## 3) تشغيل المشروع محلياً

```bash
npm install
npm run dev
```

افتحي الرابط يلي بيظهر (عادة http://localhost:5173).

## 4) طريقة تحويل حساب إلى "أدمن" (مالك المتجر)

هاي الخطوة **يدوية ومقصودة** لحمايتها من أي مستخدم عادي:

1. سجّلي حساب عادي جديد من صفحة "إنشاء حساب" بالموقع (سيُنشأ تلقائياً بصلاحية "customer").
2. روحي إلى Firebase Console → Firestore Database → مجموعة `users` → افتحي مستند المستخدم يلي بدك تعطيه صلاحية الأدمن.
3. غيّري قيمة الحقل `role` من `"customer"` إلى `"admin"` واحفظي.
4. سجّلي خروج ودخول من جديد بالموقع — رح يظهر رابط "لوحة التحكم" بالقائمة العلوية.

بهاي الطريقة ما حدا غير المطور/صاحب المشروع يقدر يصير أدمن.

## 5) النشر التلقائي عبر GitHub

1. ارفعي المشروع على مستودع GitHub جديد.
2. من إعدادات المستودع Settings → Secrets and variables → Actions، أضيفي هاي الأسرار:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `FIREBASE_SERVICE_ACCOUNT` (تولّديه من Firebase Console → Project settings → Service accounts → Generate new private key، وتلصقي محتوى ملف الـ JSON كامل كسر واحد)
3. أي `push` على فرع `main` رح يبني وينشر الموقع تلقائياً على Firebase Hosting (عبر `.github/workflows/deploy.yml`).

## 6) هيكل قاعدة البيانات (Firestore)

- `products/{id}`: name, description, category, images[], variants[{color, size, price, stock}]
- `users/{uid}`: name, phone, email, role ("customer" | "admin")
- `orders/{id}`: userId, items[], customerInfo{name, phone, city, address, notes}, total, status
- `messages/{id}`: name, phone, message, read, userId (اختياري)

## 7) خطوة تالية: وكيل ذكاء اصطناعي لإدارة فيسبوك/انستغرام/واتساب

هاي الميزة منفصلة عن كود المتجر لأنها تحتاج ربط حسابات أعمال رسمية (Meta Business Suite لفيسبوك وانستغرام، وWhatsApp Business API)، والحصول على مفاتيح API من حساب عمك مباشرة — ما فيني إنشاؤها بدون تلك الحسابات. بعد ما يصير المتجر شغال، أقدر أساعد ببناء:
- بوت رد تلقائي على استفسارات الزبائن بفيسبوك/انستغرام/واتساب
- ربط الرسائل الواردة بلوحة تحكم واحدة (نفس فكرة صفحة "الرسائل" بالمتجر)
- منشورات تلقائية للمنتجات الجديدة على الصفحات

قوليلي متى تحبي نبدأ فيها ونحدد الحسابات المطلوبة خطوة بخطوة.
