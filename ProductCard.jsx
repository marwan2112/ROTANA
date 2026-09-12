import { Link } from 'react-router-dom'

function priceRange(variants = []) {
  if (!variants.length) return null
  const prices = variants.map((v) => Number(v.price) || 0)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  return min === max ? `${min} د.أ` : `${min} - ${max} د.أ`
}

export default function ProductCard({ product }) {
  const range = priceRange(product.variants)
  const image = product.images?.[0]

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block border border-sand rounded overflow-hidden bg-white/40 hover:border-gold transition-colors"
    >
      <div className="aspect-[3/4] bg-sand/40 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-charcoal/40 text-sm">
            لا توجد صورة
          </div>
        )}
      </div>
      <div className="p-4">
        {product.category && (
          <p className="text-xs text-gold mb-1">{product.category}</p>
        )}
        <h3 className="font-display text-lg text-charcoal truncate">{product.name}</h3>
        {range && <p className="text-plum mt-1">{range}</p>}
      </div>
    </Link>
  )
}
