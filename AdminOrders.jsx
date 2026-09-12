import { useEffect, useState } from 'react'
import { collection, doc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
const STATUS_LABELS = {
  pending: 'قيد المراجعة',
  confirmed: 'تم التأكيد',
  shipped: 'تم الشحن',
  delivered: 'تم التسليم',
  cancelled: 'ملغي',
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setLoading(false)
    }
    load()
  }, [])

  async function handleStatusChange(orderId, status) {
    await updateDoc(doc(db, 'orders', orderId), { status })
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)))
  }

  if (loading) return <p className="text-center py-16 text-charcoal/60">جارٍ التحميل...</p>

  return (
    <div className="max-w-4xl mx-auto px-5 py-10">
      <h1 className="font-display text-3xl text-charcoal mb-8">الطلبات</h1>
      {orders.length === 0 ? (
        <p className="text-charcoal/60">لا توجد طلبات حتى الآن.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="border border-sand rounded p-5">
              <div className="flex flex-wrap justify-between gap-2 mb-3">
                <div>
                  <p className="font-medium text-charcoal">{o.customerInfo?.name}</p>
                  <p className="text-sm text-charcoal/60">{o.customerInfo?.phone}</p>
                  <p className="text-sm text-charcoal/60">
                    {o.customerInfo?.city} — {o.customerInfo?.address}
                  </p>
                  {o.customerInfo?.notes && (
                    <p className="text-sm text-charcoal/50 mt-1">ملاحظات: {o.customerInfo.notes}</p>
                  )}
                </div>
                <select
                  value={o.status}
                  onChange={(e) => handleStatusChange(o.id, e.target.value)}
                  className="border border-sand rounded px-3 py-1.5 text-sm bg-white/60 h-fit"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="border-t border-sand pt-3">
                {o.items.map((i, idx) => (
                  <div key={idx} className="flex justify-between text-sm text-charcoal/80 py-0.5">
                    <span>
                      {i.name} ({[i.color, i.size].filter(Boolean).join(' / ')}) × {i.qty}
                    </span>
                    <span>{i.price * i.qty} د.أ</span>
                  </div>
                ))}
                <div className="flex justify-between font-medium text-plum pt-2 mt-2 border-t border-sand">
                  <span>الإجمالي</span>
                  <span>{o.total} د.أ</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
