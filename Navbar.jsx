import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { currentUser, profile, isAdmin, logout } = useAuth()
  const { count } = useCart()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <header className="border-b border-sand bg-ivory sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
        <Link to="/" className="font-display text-2xl text-plum">
          البوتيك
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-charcoal">
          <Link to="/" className="hover:text-plum transition-colors">
            المنتجات
          </Link>
          <Link to="/contact" className="hover:text-plum transition-colors">
            تواصل معنا
          </Link>
          {isAdmin && (
            <Link to="/admin" className="hover:text-plum transition-colors">
              لوحة التحكم
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative flex items-center gap-1 text-charcoal hover:text-plum">
            <span>السلة</span>
            {count > 0 && (
              <span className="absolute -top-2 -left-3 bg-plum text-ivory text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>

          {currentUser ? (
            <div className="flex items-center gap-3">
              <Link to="/my-orders" className="text-sm text-charcoal hover:text-plum hidden sm:inline">
                طلباتي
              </Link>
              <span className="text-sm text-charcoal/70 hidden sm:inline">
                {profile?.name || currentUser.email}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm border border-plum text-plum px-3 py-1.5 rounded hover:bg-plum hover:text-ivory transition-colors"
              >
                خروج
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-sm bg-plum text-ivory px-4 py-1.5 rounded hover:bg-plumDark transition-colors"
            >
              دخول
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
