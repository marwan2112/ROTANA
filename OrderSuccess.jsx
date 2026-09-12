import { Link } from 'react-router-dom'

export default function OrderSuccess() {
  return (
    <div className="max-w-xl mx-auto px-5 py-24 text-center">
      <h1 className="font-display text-3xl text-plum mb-4">تم استلام طلبك بنجاح</h1>
      <p className="text-charcoal/80 mb-8">
        شكراً لتسوّقك معنا. سيتواصل معك فريقنا قريباً لتأكيد الطلب والتوصيل.
      </p>
      <div className="flex gap-3 justify-center">
        <Link to="/" className="border border-plum text-plum px-5 py-2 rounded hover:bg-plum hover:text-ivory transition-colors">
          متابعة التسوق
        </Link>
        <Link to="/my-orders" className="bg-plum text-ivory px-5 py-2 rounded hover:bg-plumDark transition-colors">
          طلباتي
        </Link>
      </div>
    </div>
  )
}
