import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-5 py-16">
      <h1 className="font-display text-3xl text-charcoal mb-8 text-center">تسجيل الدخول</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-sand rounded px-4 py-2 bg-white/60 focus:border-gold outline-none"
        />
        <input
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border border-sand rounded px-4 py-2 bg-white/60 focus:border-gold outline-none"
        />
        {error && <p className="text-plum text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-plum text-ivory py-2.5 rounded hover:bg-plumDark transition-colors disabled:opacity-60"
        >
          {loading ? 'جارٍ الدخول...' : 'دخول'}
        </button>
      </form>
      <p className="text-center text-sm text-charcoal/70 mt-6">
        ليس لديك حساب؟{' '}
        <Link to="/register" className="text-plum underline">
          أنشئي حساباً
        </Link>
      </p>
    </div>
  )
}
