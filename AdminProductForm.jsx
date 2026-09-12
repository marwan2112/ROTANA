import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { db, storage } from '../../firebase'

const CATEGORIES = ['ملابس', 'مكياج', 'عطور', 'شنط', 'أحذية']

const emptyVariant = { color: '', size: '', price: '', stock: '' }

export default function AdminProductForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [images, setImages] = useState([]) // existing URLs
  const [newFiles, setNewFiles] = useState([]) // File objects to upload
  const [variants, setVariants] = useState([{ ...emptyVariant }])
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    async function load() {
      const snap = await getDoc(doc(db, 'products', id))
      if (snap.exists()) {
        const data = snap.data()
        setName(data.name || '')
        setDescription(data.description || '')
        setCategory(data.category || CATEGORIES[0])
        setImages(data.images || [])
        setVariants(data.variants?.length ? data.variants : [{ ...emptyVariant }])
      }
      setLoading(false)
    }
    load()
  }, [id, isEdit])

  function updateVariant(index, field, value) {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    )
  }

  function addVariant() {
    setVariants((prev) => [...prev, { ...emptyVariant }])
  }

  function removeVariant(index) {
    setVariants((prev) => prev.filter((_, i) => i !== index))
  }

  function removeExistingImage(url) {
    setImages((prev) => prev.filter((u) => u !== url))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name || variants.length === 0) {
      setError('فضلاً أدخلي اسم المنتج وخيار واحد على الأقل.')
      return
    }
    setSaving(true)
    setError('')
    try {
      // رفع الصور الجديدة إلى Firebase Storage
      const uploadedUrls = []
      for (const file of newFiles) {
        const fileRef = ref(storage, `products/${Date.now()}-${file.name}`)
        await uploadBytes(fileRef, file)
        const url = await getDownloadURL(fileRef)
        uploadedUrls.push(url)
      }

      const cleanVariants = variants
        .filter((v) => v.color || v.size || v.price)
        .map((v) => ({
          color: v.color || '',
          size: v.size || '',
          price: Number(v.price) || 0,
          stock: Number(v.stock) || 0,
        }))

      const payload = {
        name,
        description,
        category,
        images: [...images, ...uploadedUrls],
        variants: cleanVariants,
      }

      if (isEdit) {
        await updateDoc(doc(db, 'products', id), payload)
      } else {
        await addDoc(collection(db, 'products'), {
          ...payload,
          createdAt: serverTimestamp(),
        })
      }
      navigate('/admin/products')
    } catch (err) {
      console.error(err)
      setError('حدث خطأ أثناء حفظ المنتج.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-center py-16 text-charcoal/60">جارٍ التحميل...</p>

  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <h1 className="font-display text-3xl text-charcoal mb-8">
        {isEdit ? 'تعديل المنتج' : 'إضافة منتج جديد'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm text-charcoal/70 mb-1">اسم المنتج *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-sand rounded px-4 py-2 bg-white/60 focus:border-gold outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-charcoal/70 mb-1">الوصف</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full border border-sand rounded px-4 py-2 bg-white/60 focus:border-gold outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-charcoal/70 mb-1">الفئة</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-sand rounded px-4 py-2 bg-white/60 focus:border-gold outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-charcoal/70 mb-2">الصور</label>
          {images.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {images.map((url) => (
                <div key={url} className="relative w-20 h-20">
                  <img src={url} alt="" className="w-full h-full object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(url)}
                    className="absolute -top-2 -left-2 bg-plum text-ivory rounded-full w-5 h-5 text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setNewFiles(Array.from(e.target.files))}
            className="w-full text-sm"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm text-charcoal/70">
              الخيارات (اللون، المقاس، السعر، الكمية المتوفرة)
            </label>
            <button
              type="button"
              onClick={addVariant}
              className="text-sm text-plum underline"
            >
              + إضافة خيار
            </button>
          </div>
          <div className="space-y-3">
            {variants.map((v, i) => (
              <div key={i} className="grid grid-cols-5 gap-2 items-center">
                <input
                  placeholder="اللون"
                  value={v.color}
                  onChange={(e) => updateVariant(i, 'color', e.target.value)}
                  className="border border-sand rounded px-2 py-1.5 text-sm bg-white/60"
                />
                <input
                  placeholder="المقاس"
                  value={v.size}
                  onChange={(e) => updateVariant(i, 'size', e.target.value)}
                  className="border border-sand rounded px-2 py-1.5 text-sm bg-white/60"
                />
                <input
                  type="number"
                  placeholder="السعر"
                  value={v.price}
                  onChange={(e) => updateVariant(i, 'price', e.target.value)}
                  className="border border-sand rounded px-2 py-1.5 text-sm bg-white/60"
                />
                <input
                  type="number"
                  placeholder="الكمية"
                  value={v.stock}
                  onChange={(e) => updateVariant(i, 'stock', e.target.value)}
                  className="border border-sand rounded px-2 py-1.5 text-sm bg-white/60"
                />
                <button
                  type="button"
                  onClick={() => removeVariant(i)}
                  className="text-plum text-sm"
                >
                  حذف
                </button>
              </div>
            ))}
          </div>
        </div>

        {error && <p className="text-plum text-sm">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-plum text-ivory py-2.5 rounded hover:bg-plumDark transition-colors disabled:opacity-60"
        >
          {saving ? 'جارٍ الحفظ...' : isEdit ? 'حفظ التعديلات' : 'إضافة المنتج'}
        </button>
      </form>
    </div>
  )
}
