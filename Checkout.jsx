import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Checkout() {
  const { currentUser, profile } = useAuth()
  const { items, total, clearCart } = useCart()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: profile?.name || '',
    phone: profile?.phone || '',
    city: '',
    address: '',
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.phone || !form.city || !form.address) {
      setError('فضلاً عبّئي جميع الحقول المطلوبة.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await addDoc(collection(db, 'orders'), {
        userId: currentUser.uid,
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          color: i.color,
          size: i.size,
          price: i.price,
          qty: i.qty,
        })),
        customerInfo: form,
        total,
        status: 'pending',
        createdAt: serverTimestamp(),
      })
      clearCart()
      navigate('/order-success')
    } catch (err) {
      console.error(err)
      setError('حدث خطأ أثناء إرسال الطلب، حاولي مرة أخرى.')
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <p className="text-center py-20 text-charcoal/60">
        السلة فارغة، أضيفي منتجات أولاً.
      </p>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <h1 className="font-display text-3xl text-charcoal mb-8">إتمام الشراء</h1>

      <div className="border border-sand rounded p-5 mb-8">
        {items.map((i) => (
          <div
            key={`${i.productId}-${i.color}-${i.size}`}
            className="flex justify-between text-sm py-1"
          >
            <span>
              {i.name} ({[i.color, i.size].filter(Boolean).join(' / ')}) × {i.qty}
            </span>
            <span>{i.price * i.qty} د.أ</span>
          </div>
        ))}
        <div className="flex justify-between font-medium text-plum pt-3 mt-3 border-t border-sand">
          <span>الإجمالي</span>
          <span>{total} د.أ</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-charcoal/70 mb-1">الاسم الكامل *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-sand rounded px-4 py-2 bg-white/60 focus:border-gold outline-none"
          />
        </div>
        <div>
          <label className="block text-sm text-charcoal/70 mb-1">رقم الهاتف *</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border border-sand rounded px-4 py-2 bg-white/60 focus:border-gold outline-none"
          />
        </div>
        <div>
          <label className="block text-sm text-charcoal/70 mb-1">المدينة *</label>
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            className="w-full border border-sand rounded px-4 py-2 bg-white/60 focus:border-gold outline-none"
          />
        </div>
        <div>
          <label className="block text-sm text-charcoal/70 mb-1">العنوان التفصيلي *</label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            rows={3}
            className="w-full border border-sand rounded px-4 py-2 bg-white/60 focus:border-gold outline-none"
          />
        </div>
        <div>
          <label className="block text-sm text-charcoal/70 mb-1">ملاحظات (اختياري)</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={2}
            className="w-full border border-sand rounded px-4 py-2 bg-white/60 focus:border-gold outline-none"
          />
        </div>

        {error && <p className="text-plum text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-plum text-ivory py-3 rounded hover:bg-plumDark transition-colors disabled:opacity-60"
        >
          {submitting ? 'جارٍ إرسال الطلب...' : 'تأكيد الطلب'}
        </button>
      </form>
    </div>
  )
}
