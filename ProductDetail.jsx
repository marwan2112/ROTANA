import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useCart } from '../context/CartContext'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [color, setColor] = useState('')
  const [size, setSize] = useState('')
  const [qty, setQty] = useState(1)
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function load() {
      const snap = await getDoc(doc(db, 'products', id))
      if (snap.exists()) {
        const data = { id: snap.id, ...snap.data() }
        setProduct(data)
        setColor(data.variants?.[0]?.color || '')
        setSize(data.variants?.[0]?.size || '')
      }
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <p className="text-center py-20 text-charcoal/60">جارٍ التحميل...</p>
  if (!product) return <p className="text-center py-20 text-charcoal/60">المنتج غير موجود.</p>

  const colors = [...new Set(product.variants?.map((v) => v.color).filter(Boolean))]
  const sizesForColor = product.variants
    ?.filter((v) => !color || v.color === color)
    .map((v) => v.size)
    .filter(Boolean)
  const uniqueSizes = [...new Set(sizesForColor)]

  const selectedVariant = product.variants?.find(
    (v) => (v.color || '') === color && (v.size || '') === size
  ) || product.variants?.[0]

  const outOfStock = selectedVariant && Number(selectedVariant.stock) <= 0

  function handleAdd() {
    if (!selectedVariant) return
    addItem({
      productId: product.id,
      name: product.name,
      image: product.images?.[0] || '',
      color,
      size,
      price: Number(selectedVariant.price) || 0,
      qty,
    })
    setMessage('تمت إضافة المنتج إلى السلة.')
    setTimeout(() => setMessage(''), 2500)
  }

  return (
    <div className="max-w-6xl mx-auto px-5 py-10 grid md:grid-cols-2 gap-10">
      <div>
        <div className="aspect-square bg-sand/40 rounded overflow-hidden mb-3">
          {product.images?.[activeImage] ? (
            <img
              src={product.images[activeImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-charcoal/40">
              لا توجد صورة
            </div>
          )}
        </div>
        {product.images?.length > 1 && (
          <div className="flex gap-2">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-16 h-16 rounded overflow-hidden border ${
                  i === activeImage ? 'border-plum' : 'border-sand'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        {product.category && <p className="text-gold text-sm mb-1">{product.category}</p>}
        <h1 className="font-display text-3xl text-charcoal mb-3">{product.name}</h1>
        <p className="text-2xl text-plum mb-5">
          {selectedVariant ? `${selectedVariant.price} د.أ` : ''}
        </p>
        <p className="text-charcoal/80 mb-6 leading-relaxed">{product.description}</p>

        {colors.length > 0 && (
          <div className="mb-5">
            <p className="text-sm text-charcoal/70 mb-2">اللون</p>
            <div className="flex flex-wrap gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`px-4 py-1.5 rounded-full border text-sm ${
                    color === c ? 'bg-plum text-ivory border-plum' : 'border-sand hover:border-gold'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {uniqueSizes.length > 0 && (
          <div className="mb-6">
            <p className="text-sm text-charcoal/70 mb-2">المقاس</p>
            <div className="flex flex-wrap gap-2">
              {uniqueSizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`px-4 py-1.5 rounded-full border text-sm ${
                    size === s ? 'bg-plum text-ivory border-plum' : 'border-sand hover:border-gold'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 mb-6">
          <p className="text-sm text-charcoal/70">الكمية</p>
          <div className="flex items-center border border-sand rounded">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-1">
              -
            </button>
            <span className="px-4">{qty}</span>
            <button onClick={() => setQty((q) => q + 1)} className="px-3 py-1">
              +
            </button>
          </div>
        </div>

        {outOfStock ? (
          <p className="text-plum font-medium mb-4">هذا الخيار غير متوفر حالياً.</p>
        ) : (
          <button
            onClick={handleAdd}
            className="w-full bg-plum text-ivory py-3 rounded hover:bg-plumDark transition-colors mb-3"
          >
            أضيفي إلى السلة
          </button>
        )}
        {message && <p className="text-sm text-plum">{message}</p>}

        <button
          onClick={() => navigate('/cart')}
          className="w-full border border-plum text-plum py-3 rounded hover:bg-plum hover:text-ivory transition-colors"
        >
          الذهاب إلى السلة
        </button>
      </div>
    </div>
  )
}
