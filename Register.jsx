import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل.')
      return
    }
    setLoading(true)
    try {
      await register(form)
      navigate('/')
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('هذا البريد الإلكتروني مستخدم مسبقاً.')
      } else {
        setError('حدث خطأ أثناء إنشاء الحساب.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-5 py-16">
      <h1 className="font-display text-3xl text-charcoal mb-8 text-center">إنشاء حساب جديد</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="الاسم الكامل"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border border-sand rounded px-4 py-2 bg-white/60 focus:border-gold outline-none"
        />
        <input
          name="phone"
          placeholder="رقم الهاتف"
          value={form.phone}
          onChange={handleChange}
          required
          className="w-full border border-sand rounded px-4 py-2 bg-white/60 focus:border-gold outline-none"
        />
        <input
          type="email"
          name="email"
          placeholder="البريد الإلكتروني"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border border-sand rounded px-4 py-2 bg-white/60 focus:border-gold outline-none"
        />
        <input
          type="password"
          name="password"
          placeholder="كلمة المرور"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full border border-sand rounded px-4 py-2 bg-white/60 focus:border-gold outline-none"
        />
        {error && <p className="text-plum text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-plum text-ivory py-2.5 rounded hover:bg-plumDark transition-colors disabled:opacity-60"
        >
          {loading ? 'جارٍ الإنشاء...' : 'إنشاء الحساب'}
        </button>
      </form>
      <p className="text-center text-sm text-charcoal/70 mt-6">
        لديك حساب بالفعل؟{' '}
        <Link to="/login" className="text-plum underline">
          سجّلي الدخول
        </Link>
      </p>
    </div>
  )
}
