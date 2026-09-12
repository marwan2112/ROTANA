import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { collection, deleteDoc, doc, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../../firebase'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function handleDelete(id) {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return
    await deleteDoc(doc(db, 'products', id))
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-3xl text-charcoal">المنتجات</h1>
        <Link
          to="/admin/products/new"
          className="bg-plum text-ivory px-4 py-2 rounded hover:bg-plumDark transition-colors"
        >
          + إضافة منتج
        </Link>
      </div>

      {loading ? (
        <p className="text-charcoal/60">جارٍ التحميل...</p>
      ) : products.length === 0 ? (
        <p className="text-charcoal/60">لا توجد منتجات بعد.</p>
      ) : (
        <div className="border border-sand rounded divide-y divide-sand">
          {products.map((p) => (
            <div key={p.id} className="flex items-center gap-4 p-4">
              <div className="w-14 h-14 bg-sand/40 rounded overflow-hidden shrink-0">
                {p.images?.[0] && (
                  <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-charcoal">{p.name}</p>
                <p className="text-sm text-charcoal/60">{p.category}</p>
              </div>
              <Link
                to={`/admin/products/${p.id}`}
                className="text-sm border border-sand px-3 py-1.5 rounded hover:border-gold"
              >
                تعديل
              </Link>
              <button
                onClick={() => handleDelete(p.id)}
                className="text-sm text-plum border border-plum px-3 py-1.5 rounded hover:bg-plum hover:text-ivory transition-colors"
              >
                حذف
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
