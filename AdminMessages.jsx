import { useEffect, useState } from 'react'
import { collection, doc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setLoading(false)
    }
    load()
  }, [])

  async function markRead(id) {
    await updateDoc(doc(db, 'messages', id), { read: true })
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)))
  }

  if (loading) return <p className="text-center py-16 text-charcoal/60">جارٍ التحميل...</p>

  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      <h1 className="font-display text-3xl text-charcoal mb-8">الرسائل</h1>
      {messages.length === 0 ? (
        <p className="text-charcoal/60">لا توجد رسائل بعد.</p>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`border rounded p-4 ${m.read ? 'border-sand' : 'border-gold bg-gold/5'}`}
            >
              <div className="flex justify-between mb-2">
                <p className="font-medium text-charcoal">
                  {m.name} — {m.phone}
                </p>
                {!m.read && (
                  <button
                    onClick={() => markRead(m.id)}
                    className="text-xs text-plum underline"
                  >
                    تمييز كمقروءة
                  </button>
                )}
              </div>
              <p className="text-charcoal/80 text-sm">{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
