import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/Button';
import { ProductCard } from '../components/ProductCard';
import { Star, ShieldCheck, Truck, RefreshCw, Headphones } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8000/api' : '/api');

// ─── Fake product data always visible for demo ─────────────────────────────
const CATEGORIES = [
  { name: 'Smartphones', slug: 'smartphones', image: '/images/cat_smartphones.png', count: 6 },
  { name: 'Audio Systems', slug: 'audio', image: '/images/cat_audio.png', count: 6 },
  { name: 'Home Appliances', slug: 'home-appliances', image: '/images/cat_appliances.png', count: 6 },
  { name: 'Electrical', slug: 'electrical', image: '/images/cat_electrical.png', count: 6 },
];

const TOP_SELLERS = [
  {
    id: 1, name: 'Samsung Galaxy S25 Ultra', category_name: 'Smartphones', slug: 'samsung-galaxy-s25-ultra',
    price: '129999', discount_price: '119999', rating: '4.8', stock: 25,
    images: [{ image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80' }]
  },
  {
    id: 2, name: 'iPhone 16 Pro Max', category_name: 'Smartphones', slug: 'iphone-16-pro-max',
    price: '159900', discount_price: null, rating: '4.9', stock: 18,
    images: [{ image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&q=80' }]
  },
  {
    id: 3, name: 'Sony WH-1000XM5 Headphones', category_name: 'Audio Systems', slug: 'sony-wh-1000xm5',
    price: '29990', discount_price: '26490', rating: '4.9', stock: 80,
    images: [{ image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80' }]
  },
  {
    id: 4, name: 'LG 1.5 Ton 5 Star Inverter AC', category_name: 'Home Appliances', slug: 'lg-15-ton-5star-ac',
    price: '45990', discount_price: '42990', rating: '4.7', stock: 30,
    images: [{ image: 'https://images.unsplash.com/photo-1562766024-11cb4e4e78e5?w=600&q=80' }]
  },
  {
    id: 5, name: 'Apple AirPods Pro 2nd Gen', category_name: 'Audio Systems', slug: 'apple-airpods-pro-2',
    price: '24900', discount_price: '22900', rating: '4.8', stock: 50,
    images: [{ image: 'https://images.unsplash.com/photo-1588423771073-b8903febb85b?w=600&q=80' }]
  },
  {
    id: 6, name: 'OnePlus 13', category_name: 'Smartphones', slug: 'oneplus-13',
    price: '69999', discount_price: '64999', rating: '4.6', stock: 40,
    images: [{ image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&q=80' }]
  },
  {
    id: 7, name: 'Samsung 324L Frost Free Refrigerator', category_name: 'Home Appliances', slug: 'samsung-324l-fridge',
    price: '34990', discount_price: '29990', rating: '4.5', stock: 15,
    images: [{ image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600&q=80' }]
  },
  {
    id: 8, name: 'Havells Modular Switch Board', category_name: 'Electrical', slug: 'havells-6-module-switch',
    price: '1299', discount_price: '999', rating: '4.5', stock: 500,
    images: [{ image: 'https://images.unsplash.com/photo-1621905251189-08b45249e1b7?w=600&q=80' }]
  },
];

const TRUST_BADGES = [
  { icon: Truck, label: 'Home Delivery Available', sub: 'On All orders' },
  { icon: ShieldCheck, label: 'Warranty Available', sub: 'On all electronics' },
  { icon: RefreshCw, label: 'Easy Returns', sub: '7-day hassle-free return' },
  { icon: Headphones, label: '24/7 Support', sub: 'Dedicated customer care' },
];

export const Home = () => {
  const navigate = useNavigate();
  const [topSellers, setTopSellers] = useState([]);

  useEffect(() => {
    // Fetch products from API and take the first 8 as "Top Sellers"
    const fetchTopSellers = async () => {
      try {
        const res = await axios.get(`${API}/products/`);
        setTopSellers(res.data.slice(0, 8));
      } catch (error) {
        console.error('Failed to fetch top sellers:', error);
        // Fallback or leave empty
      }
    };
    fetchTopSellers();
  }, []);

  return (
    <div className="space-y-24">

      {/* ─── Hero ─────────────────────────────────────────────────── */}
      <section className="relative rounded-3xl overflow-hidden bg-slate-900 min-h-[580px] flex items-center px-8 md:px-20">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1400&q=80"
            alt="Electronics showroom"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/70 to-transparent" />
        </div>
        <div className="relative z-10 max-w-2xl text-white">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <span className="inline-block bg-brand-500/20 border border-brand-400/40 text-brand-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
              🔥 Best Deals of the Season
            </span>
            <h1 className="text-5xl md:text-6xl font-heading font-extrabold mb-5 leading-tight">
              Premium Electronics<br />
              <span className="text-brand-400">for Modern Living</span>
            </h1>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
              Discover the latest smartphones, audio systems, home appliances & electrical products. Quality you can trust, prices you'll love.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" className="text-lg px-8 py-4" onClick={() => navigate('/category/smartphones')}>
                Shop Now
              </Button>
              <button
                onClick={() => navigate('/category/home-appliances')}
                className="text-white border border-white/30 px-8 py-4 rounded-2xl font-semibold hover:bg-white/10 transition-all"
              >
                View Offers
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Trust Badges ─────────────────────────────────────────── */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {TRUST_BADGES.map((b, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm"
          >
            <div className="w-11 h-11 bg-brand-50 rounded-xl flex items-center justify-center shrink-0">
              <b.icon className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">{b.label}</div>
              <div className="text-xs text-slate-500">{b.sub}</div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* ─── Categories ───────────────────────────────────────────── */}
      <section>
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-heading font-bold text-slate-900 mb-1">Shop by Category</h2>
            <p className="text-slate-500">Find products across all our departments</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {CATEGORIES.map((cat, i) => (
            <motion.div key={i} whileHover={{ y: -6 }} className="group cursor-pointer">
              <Link to={`/category/${cat.slug}`}>
                <div className="relative rounded-2xl overflow-hidden aspect-square bg-slate-100 shadow-sm">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-white font-bold text-lg">{cat.name}</h3>
                    <p className="text-white/70 text-xs">{cat.count} Products</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Top Sellers ──────────────────────────────────────────── */}
      <section>
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-brand-600 font-semibold text-sm uppercase tracking-wider">⭐ Best Picks</span>
            <h2 className="text-3xl font-heading font-bold text-slate-900 mt-1">Top Sellers</h2>
            <p className="text-slate-500">Our most popular products loved by customers</p>
          </div>
          <Button variant="secondary" onClick={() => navigate('/category/smartphones')}>View All</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {topSellers.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ─── Banner ───────────────────────────────────────────────── */}
      <section className="rounded-3xl overflow-hidden bg-gradient-to-r from-brand-600 to-blue-700 p-10 md:p-16 flex flex-col md:flex-row items-center gap-8">
        <div className="text-white flex-1">
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold mb-3">Special Offer 🎉</h2>
          <p className="text-white/80 text-lg mb-6">Get up to 30% off on all Home Appliances this month. Limited stock available!</p>
          <Button
            onClick={() => navigate('/category/home-appliances')}
            className="bg-black text-white hover:bg-slate-800 px-8 py-3.5 text-base font-bold"
          >
            Shop Appliances
          </Button>
        </div>
      </section>

      {/* ─── Why Choose Us ────────────────────────────────────────── */}
      <section className="text-center">
        <h2 className="text-3xl font-heading font-bold text-slate-900 mb-3">Why Choose Praveen Electro World?</h2>
        <p className="text-slate-500 mb-12 max-w-xl mx-auto">We're not just another electronics store. We're your trusted partner in bringing premium technology to your home.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { emoji: '🏆', title: 'Authorised Dealer', text: 'Official dealer for Samsung, LG, Sony, Philips, Havells & 30+ top brands.' },
            { emoji: '💰', title: 'Best Price Guarantee', text: 'Found it cheaper? We\'ll match the price. Shop with 100% confidence.' },
            { emoji: '🔧', title: 'Expert Installation', text: 'Professional installation for all ACs, washing machines & large appliances.' },
          ].map((f, i) => (
            <motion.div key={i} whileHover={{ y: -4 }} className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
              <div className="text-5xl mb-4">{f.emoji}</div>
              <h3 className="font-bold text-xl text-slate-900 mb-2">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
};
