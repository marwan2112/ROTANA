import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, updateQty, removeItem, total } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-20 text-center">
        <p className="text-charcoal/70 mb-4">سلتك فارغة حالياً.</p>
        <Link to="/" className="text-plum underline">
          تصفّحي المنتجات
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      <h1 className="font-display text-3xl text-charcoal mb-8">سلة التسوق</h1>

      <div className="divide-y divide-sand border-y border-sand mb-6">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.color}-${item.size}`}
            className="flex items-center gap-4 py-5"
          >
            <div className="w-20 h-20 bg-sand/40 rounded overflow-hidden shrink-0">
              {item.image && (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-charcoal">{item.name}</p>
              <p className="text-sm text-charcoal/60">
                {[item.color, item.size].filter(Boolean).join(' / ')}
              </p>
              <p className="text-plum mt-1">{item.price} د.أ</p>
            </div>
            <div className="flex items-center border border-sand rounded">
              <button
                onClick={() => updateQty(item.productId, item.color, item.size, item.qty - 1)}
                className="px-3 py-1"
              >
                -
              </button>
              <span className="px-3">{item.qty}</span>
              <button
                onClick={() => updateQty(item.productId, item.color, item.size, item.qty + 1)}
                className="px-3 py-1"
              >
                +
              </button>
            </div>
            <button
              onClick={() => removeItem(item.productId, item.color, item.size)}
              className="text-sm text-charcoal/50 hover:text-plum"
            >
              إزالة
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mb-8">
        <span className="text-lg text-charcoal">الإجمالي</span>
        <span className="text-xl text-plum font-medium">{total} د.أ</span>
      </div>

      <button
        onClick={() => navigate('/checkout')}
        className="w-full bg-plum text-ivory py-3 rounded hover:bg-plumDark transition-colors"
      >
        إتمام الشراء
      </button>
    </div>
  )
}
