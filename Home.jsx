import { useEffect, useMemo, useState } from 'react'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase'
import ProductCard from '../components/ProductCard'

const CATEGORIES = ['الكل', 'ملابس', 'مكياج', 'عطور', 'شنط', 'أحذية']

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('الكل')
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
        const snap = await getDocs(q)
        setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = category === 'الكل' || p.category === category
      const matchesSearch = p.name?.toLowerCase().includes(search.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [products, category, search])

  return (
    <div>
      <section className="border-b border-sand bg-gradient-to-b from-sand/40 to-transparent">
        <div className="max-w-6xl mx-auto px-5 py-16 text-center">
          <h1 className="font-display text-4xl md:text-5xl text-plum mb-4">
            كل ما تحتاجينه في مكان واحد
          </h1>
          <p className="text-charcoal/80 max-w-xl mx-auto">
            ملابس، مكياج، عطور، شنط وأحذية لجميع أفراد العائلة — تسوّقي بثقة واستلمي طلبك
            بسهولة.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-10">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
                  category === c
                    ? 'bg-plum text-ivory border-plum'
                    : 'border-sand text-charcoal hover:border-gold'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="ابحثي عن منتج..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-sand rounded px-4 py-2 w-full sm:w-64 bg-white/60 focus:border-gold outline-none"
          />
        </div>

        {loading ? (
          <p className="text-center text-charcoal/60 py-16">جارٍ تحميل المنتجات...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-charcoal/60 py-16">
            لا توجد منتجات مطابقة حالياً.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
