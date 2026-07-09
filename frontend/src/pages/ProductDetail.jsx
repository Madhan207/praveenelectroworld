import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Zap, Star, ChevronLeft, ChevronRight, X, CheckCircle, Truck, ShieldCheck, RefreshCw, Heart, ZoomIn, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ProductCard } from '../components/ProductCard';

const API = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8000/api' : '/api');

const StarRow = ({ rating, count }) => (
  <div className="flex items-center gap-2">
    <div className="flex">
      {[1,2,3,4,5].map(s => (
        <Star key={s} className={`w-4 h-4 ${s <= Math.round(Number(rating)) ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-200'}`} />
      ))}
    </div>
    <span className="text-amber-600 font-bold">{rating}</span>
    {count !== undefined && <span className="text-slate-400 text-sm">({count.toLocaleString('en-IN')} reviews)</span>}
  </div>
);

export const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const [selectedImg, setSelectedImg] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [wishlist, setWishlist] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API}/products/${slug}/`);
        setProduct(response.data);
        
        // Fetch related products (e.g., from the same category)
        if (response.data.category_slug) {
          const relRes = await axios.get(`${API}/products/?category=${response.data.category_slug}`);
          setRelatedProducts((relRes.data.results || relRes.data).filter(p => p.slug !== slug).slice(0, 4));
        }
      } catch (error) {
        console.error("Failed to fetch product", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
    setSelectedImg(0);
    setActiveTab('description');
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-brand-600 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-24 mt-16 max-w-7xl mx-auto px-6">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-slate-700 mb-2">Product Not Found</h2>
        <p className="text-slate-400 mb-6">This product doesn't exist or may have been removed.</p>
        <button onClick={() => navigate(-1)} className="text-brand-600 font-semibold hover:underline">← Go Back</button>
      </div>
    );
  }

  const images = (product.images && product.images.length > 0) ? product.images.map(img => img.image) : ['https://placehold.co/800x800/f8fafc/94a3b8?text=No+Image'];
  
  const discount = product.discount_price
    ? Math.round((1 - Number(product.discount_price) / Number(product.price)) * 100) : 0;

  const handleAddToCart = () => {
    addToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const handleBuyNow = () => {
    if (!user) { navigate('/login'); return; }
    addToCart(product);
    navigate('/checkout');
  };

  const prevImg = () => setSelectedImg(i => (i - 1 + images.length) % images.length);
  const nextImg = () => setSelectedImg(i => (i + 1) % images.length);

  return (
    <div className="space-y-12 mt-16 max-w-7xl mx-auto px-6 pb-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-400">
        <Link to="/" className="hover:text-brand-600">Home</Link>
        <span>/</span>
        <Link to={`/category/${product.category_slug}`} className="hover:text-brand-600">{product.category_name}</Link>
        <span>/</span>
        <span className="text-slate-700 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* ── Main Product Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white rounded-3xl p-8 shadow-sm border border-slate-100">

        {/* ── Image Gallery ── */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-50 aspect-square group cursor-zoom-in"
            onClick={() => { setLightboxIdx(selectedImg); setLightbox(true); }}>
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedImg}
                src={images[selectedImg]}
                alt={product.name}
                className="w-full h-full object-contain p-4"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
              />
            </AnimatePresence>
            {discount > 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">-{discount}%</div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
              <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
            </div>
            {images.length > 1 && (
              <>
                <button onClick={e => { e.stopPropagation(); prevImg(); }} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 shadow-md p-2 rounded-full hover:bg-white transition-all">
                  <ChevronLeft className="w-5 h-5 text-slate-700" />
                </button>
                <button onClick={e => { e.stopPropagation(); nextImg(); }} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 shadow-md p-2 rounded-full hover:bg-white transition-all">
                  <ChevronRight className="w-5 h-5 text-slate-700" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImg(i)}
                  className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImg === i ? 'border-brand-500 shadow-md' : 'border-slate-200 opacity-60 hover:opacity-100'}`}>
                  <img src={img} alt={`View ${i+1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Product Info ── */}
        <div className="space-y-5">
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">{product.brand}</span>
            <h1 className="text-2xl lg:text-3xl font-heading font-bold text-slate-900 mt-1 leading-tight">{product.name}</h1>
          </div>

          <StarRow rating={product.rating} count={product.reviews_count} />

          {/* Price */}
          <div className="flex items-baseline gap-3 flex-wrap">
            {product.discount_price ? (
              <>
                <span className="text-4xl font-extrabold text-slate-900">₹{Number(product.discount_price).toLocaleString('en-IN')}</span>
                <span className="text-xl text-slate-400 line-through">₹{Number(product.price).toLocaleString('en-IN')}</span>
                <span className="bg-green-100 text-green-700 font-bold text-sm px-2 py-0.5 rounded-lg">{discount}% OFF</span>
              </>
            ) : (
              <span className="text-4xl font-extrabold text-slate-900">₹{Number(product.price).toLocaleString('en-IN')}</span>
            )}
          </div>
          {product.discount_price && (
            <p className="text-green-600 text-sm font-medium -mt-2">
              You save ₹{(Number(product.price) - Number(product.discount_price)).toLocaleString('en-IN')}!
            </p>
          )}

          {/* Highlights */}
          {product.features && product.features.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide">Key Features</h3>
              <ul className="space-y-1.5">
                {product.features.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Stock */}
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-orange-400' : 'bg-red-500'}`} />
            <span className={`text-sm font-semibold ${product.stock > 10 ? 'text-green-600' : 'text-orange-500'}`}>
              {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left!` : 'Out of Stock'}
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3 pt-2">
            <button onClick={handleAddToCart} disabled={product.stock === 0 && !product.is_service}
              className={`flex-1 flex items-center justify-center gap-2 border-2 font-bold py-3.5 rounded-2xl transition-all text-sm ${addedToCart ? 'border-green-500 text-green-600 bg-green-50' : 'border-brand-500 text-brand-600 hover:bg-brand-50'}`}>
              {addedToCart ? <><CheckCircle className="w-5 h-5" /> Added!</> : <><ShoppingCart className="w-5 h-5" /> Add to Cart</>}
            </button>
            <button onClick={handleBuyNow} disabled={product.stock === 0 && !product.is_service}
              className="flex-1 flex items-center justify-center gap-2 bg-brand-600 text-white font-bold py-3.5 rounded-2xl hover:bg-brand-700 transition-all shadow-lg hover:shadow-xl text-sm">
              <Zap className="w-5 h-5" /> Buy Now
            </button>
            <button onClick={() => setWishlist(!wishlist)}
              className={`p-3.5 rounded-2xl border-2 transition-all ${wishlist ? 'border-red-300 bg-red-50 text-red-500' : 'border-slate-200 text-slate-400 hover:border-red-300 hover:text-red-400'}`}>
              <Heart className={`w-5 h-5 ${wishlist ? 'fill-red-500' : ''}`} />
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { icon: Truck, label: 'Home Delivery', sub: 'All Orders' },
              { icon: ShieldCheck, label: 'Warranty', sub: 'Brand Assured' },
              { icon: RefreshCw, label: '7-Day Returns', sub: 'Easy Process' },
            ].map((b, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                <b.icon className="w-5 h-5 text-brand-500 mx-auto mb-1" />
                <div className="text-xs font-bold text-slate-700">{b.label}</div>
                <div className="text-xs text-slate-400">{b.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Description / Specs / Reviews Tabs ── */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex border-b border-slate-100">
          {[
            { id: 'description', label: 'Description' },
            { id: 'specs', label: 'Specifications' },
            { id: 'reviews', label: `Reviews (${product.reviews_count?.toLocaleString('en-IN') || 0})` },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-4 font-semibold text-sm transition-all border-b-2 ${activeTab === tab.id ? 'text-brand-600 border-brand-500 bg-brand-50/50' : 'text-slate-500 border-transparent hover:text-slate-700'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-8">
          {activeTab === 'description' && (
            <div className="prose prose-slate max-w-none">
              {product.description?.split('\n\n').map((para, i) => (
                <p key={i} className="text-slate-600 leading-relaxed mb-4">{para}</p>
              ))}
            </div>
          )}

          {activeTab === 'specs' && product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="overflow-hidden rounded-2xl border border-slate-100">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-slate-50">
                  {Object.entries(product.specifications).map(([key, val], i) => (
                    <tr key={key} className={i % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}>
                      <td className="px-6 py-3.5 font-semibold text-slate-700 w-1/3">{key}</td>
                      <td className="px-6 py-3.5 text-slate-600">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Rating Summary */}
              <div className="flex items-center gap-6 bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <div className="text-center">
                  <div className="text-5xl font-extrabold text-slate-900">{product.rating}</div>
                  <StarRow rating={product.rating} />
                  <div className="text-slate-500 text-sm mt-1">{product.reviews_count?.toLocaleString('en-IN')} ratings</div>
                </div>
              </div>
              {/* Individual Reviews */}
              <div className="space-y-4">
                {(product.reviews || []).map((rev, i) => (
                  <div key={i} className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center font-bold text-brand-600 text-sm">{rev.user_name?.[0] || 'U'}</div>
                        <div>
                          <div className="font-semibold text-slate-900 text-sm">{rev.user_name || 'User'}</div>
                          <div className="text-xs text-slate-400">{new Date(rev.created_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="flex">
                        {[1,2,3,4,5].map(s => <Star key={s} className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-200'}`} />)}
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Related Products ── */}
      {relatedProducts.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-heading font-bold text-slate-900">Related Products</h2>
            <Link to={`/category/${product.category_slug}`} className="text-brand-600 font-semibold text-sm hover:underline">View All →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
            onClick={() => setLightbox(false)}>
            <button onClick={() => setLightbox(false)} className="absolute top-5 right-5 text-white p-2 hover:bg-white/10 rounded-full">
              <X className="w-7 h-7" />
            </button>

            <button onClick={e => { e.stopPropagation(); setLightboxIdx(i => (i - 1 + images.length) % images.length); }}
              className="absolute left-5 text-white p-3 hover:bg-white/10 rounded-full transition-all">
              <ChevronLeft className="w-8 h-8" />
            </button>

            <motion.img
              key={lightboxIdx}
              src={images[lightboxIdx]}
              alt="Full view"
              className="max-w-[90vw] max-h-[88vh] object-contain rounded-xl"
              initial={{ scale: 0.93, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.93, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            />

            <button onClick={e => { e.stopPropagation(); setLightboxIdx(i => (i + 1) % images.length); }}
              className="absolute right-5 text-white p-3 hover:bg-white/10 rounded-full transition-all">
              <ChevronRight className="w-8 h-8" />
            </button>

            {/* Thumbnail Strip in Lightbox */}
            <div className="absolute bottom-5 flex gap-3">
              {images.map((img, i) => (
                <button key={i} onClick={e => { e.stopPropagation(); setLightboxIdx(i); }}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${lightboxIdx === i ? 'border-white' : 'border-white/30 opacity-50 hover:opacity-80'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <div className="absolute top-5 left-5 text-white/60 text-sm">{lightboxIdx + 1} / {images.length}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
