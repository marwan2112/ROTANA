import { useState } from 'react'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'

export default function Contact() {
  const { currentUser, profile } = useAuth()
  const [form, setForm] = useState({
    name: profile?.name || '',
    phone: profile?.phone || '',
    message: '',
  })
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.phone || !form.message) {
      setError('فضلاً عبّئي جميع الحقول.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await addDoc(collection(db, 'messages'), {
        userId: currentUser?.uid || null,
        name: form.name,
        phone: form.phone,
        message: form.message,
        read: false,
        createdAt: serverTimestamp(),
      })
      setSent(true)
      setForm({ name: '', phone: '', message: '' })
    } catch (err) {
      console.error(err)
      setError('تعذّر إرسال الرسالة، حاولي مرة أخرى.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto px-5 py-14">
      <h1 className="font-display text-3xl text-charcoal mb-3 text-center">تواصلي معنا</h1>
      <p className="text-center text-charcoal/70 mb-8">
        لأي استفسار عن منتج أو طلب، أرسلي لنا رسالة وسنعاود التواصل معك.
      </p>

      {sent && (
        <p className="text-plum text-center mb-4">تم إرسال رسالتك بنجاح، شكراً لتواصلك معنا.</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="الاسم"
          value={form.name}
          onChange={handleChange}
          className="w-full border border-sand rounded px-4 py-2 bg-white/60 focus:border-gold outline-none"
        />
        <input
          name="phone"
          placeholder="رقم الهاتف"
          value={form.phone}
          onChange={handleChange}
          className="w-full border border-sand rounded px-4 py-2 bg-white/60 focus:border-gold outline-none"
        />
        <textarea
          name="message"
          placeholder="اكتبي رسالتك هنا..."
          value={form.message}
          onChange={handleChange}
          rows={5}
          className="w-full border border-sand rounded px-4 py-2 bg-white/60 focus:border-gold outline-none"
        />
        {error && <p className="text-plum text-sm">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-plum text-ivory py-2.5 rounded hover:bg-plumDark transition-colors disabled:opacity-60"
        >
          {submitting ? 'جارٍ الإرسال...' : 'إرسال'}
        </button>
      </form>
    </div>
  )
}
