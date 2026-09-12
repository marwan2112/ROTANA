import { Link } from 'react-router-dom'

const links = [
  { to: '/admin/products', label: 'إدارة المنتجات', desc: 'إضافة وتعديل وحذف المنتجات والألوان والمقاسات والأسعار' },
  { to: '/admin/orders', label: 'الطلبات', desc: 'متابعة طلبات الزبائن وتحديث حالتها' },
  { to: '/admin/messages', label: 'الرسائل', desc: 'رسائل التواصل الواردة من الزبائن' },
]

export default function AdminDashboard() {
  return (
    <div className="max-w-4xl mx-auto px-5 py-10">
      <h1 className="font-display text-3xl text-charcoal mb-8">لوحة تحكم المتجر</h1>
      <div className="grid sm:grid-cols-3 gap-5">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="border border-sand rounded p-5 hover:border-gold transition-colors"
          >
            <h2 className="font-display text-xl text-plum mb-2">{l.label}</h2>
            <p className="text-sm text-charcoal/70">{l.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
