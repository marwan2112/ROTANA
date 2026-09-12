import { useEffect, useState } from 'react'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'

const STATUS_LABELS = {
  pending: 'قيد المراجعة',
  confirmed: 'تم التأكيد',
  shipped: 'تم الشحن',
  delivered: 'تم التسليم',
  cancelled: 'ملغي',
}

export default function MyOrders() {
  const { currentUser } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      )
      const snap = await getDocs(q)
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setLoading(false)
    }
    load()
  }, [currentUser])

  if (loading) return <p className="text-center py-16 text-charcoal/60">جارٍ التحميل...</p>

  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      <h1 className="font-display text-3xl text-charcoal mb-8">طلباتي</h1>
      {orders.length === 0 ? (
        <p className="text-charcoal/60">لا توجد طلبات سابقة.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="border border-sand rounded p-5">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-charcoal/60">
                  رقم الطلب: {o.id.slice(0, 8)}
                </span>
                <span className="text-sm bg-sand/60 px-3 py-1 rounded-full">
                  {STATUS_LABELS[o.status] || o.status}
                </span>
              </div>
              {o.items.map((i, idx) => (
                <div key={idx} className="flex justify-between text-sm py-1 text-charcoal/80">
                  <span>
                    {i.name} ({[i.color, i.size].filter(Boolean).join(' / ')}) × {i.qty}
                  </span>
                  <span>{i.price * i.qty} د.أ</span>
                </div>
              ))}
              <div className="flex justify-between font-medium text-plum pt-3 mt-3 border-t border-sand">
                <span>الإجمالي</span>
                <span>{o.total} د.أ</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
