import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/Button';
import { ProductCard } from '../components/ProductCard';
import { HeroSlider } from '../components/HeroSlider';
import { ShieldCheck, Truck, RefreshCw, Headphones, Star } from 'lucide-react';

// Business-type image map — matched by slug / name keyword
const BIZ_IMAGES = {
  electro:     'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
  electronic:  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
  lifestyle:   'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&q=80',
  fashion:     'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&q=80',
  mart:        'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=600&q=80',
  grocery:     'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=600&q=80',
  spiritual:   'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=600&q=80',
  pooja:       'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=600&q=80',
  mannu:       'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80',
  farm:        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80',
  agri:        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80',
  global:      'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80',
  enterprise:  'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80',
  construct:   'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80',
  dj:          'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80',
  event:       'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80',
  studio:      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80',
  photo:       'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80',
  video:       'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80',
  logistic:    'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&q=80',
  transport:   'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&q=80',
  trust:       'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&q=80',
  foundation:  'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&q=80',
};

const DEFAULT_BIZ_IMAGE = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80';

function getBizImage(biz) {
  // 1. If the API already provides an image/logo, use it
  if (biz.logo) return biz.logo;
  if (biz.thumbnail) return biz.thumbnail;
  // 2. Match slug or name keywords
  const key = `${biz.slug || ''} ${biz.name || ''}`.toLowerCase();
  for (const [keyword, url] of Object.entries(BIZ_IMAGES)) {
    if (key.includes(keyword)) return url;
  }
  return DEFAULT_BIZ_IMAGE;
}

const API = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8000/api' : '/api');

const TRUST_BADGES = [
  { icon: Truck, label: 'Nationwide Delivery', sub: 'Fast & Secure' },
  { icon: ShieldCheck, label: 'Trusted by Millions', sub: '100% Genuine' },
  { icon: RefreshCw, label: 'Easy Returns', sub: 'Hassle-free process' },
  { icon: Headphones, label: '24/7 Support', sub: 'Always here to help' },
];

export const Home = () => {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [topServices, setTopServices] = useState([]);
  const [globalBanners, setGlobalBanners] = useState([]);
  // Hero slider handles its own state now

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bizRes, prodRes, servRes, bannerRes] = await Promise.all([
          axios.get(`${API}/businesses/`),
          axios.get(`${API}/products/?is_service=false`),
          axios.get(`${API}/products/?is_service=true`),
          axios.get(`${API}/banners/?global=true`)
        ]);
        setBusinesses(bizRes.data);
        
        // Just take some random or top products for the homepage
        setTopProducts(prodRes.data.results ? prodRes.data.results.slice(0, 8) : prodRes.data.slice(0, 8));
        setTopServices(servRes.data.results ? servRes.data.results.slice(0, 4) : servRes.data.slice(0, 4));
        setGlobalBanners(bannerRes.data.results || bannerRes.data);
      } catch (error) {
        console.error('Failed to fetch homepage data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-24 pb-20">

      {/* ─── Hero Slider ─────────────────────────────────────────────────── */}
      <HeroSlider banners={globalBanners} fallbackHeight="min-h-[500px] md:min-h-[650px]" />

      {/* ─── Trust Badges ─────────────────────────────────────────── */}
      <section className="px-6 mx-auto max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {TRUST_BADGES.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-slate-100 rounded-2xl p-6 flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow"
            >
              <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center shrink-0 text-brand-600">
                <b.icon className="w-7 h-7" />
              </div>
              <div className="mt-2 md:mt-1">
                <div className="font-bold text-slate-900 text-base">{b.label}</div>
                <div className="text-sm text-slate-500 mt-1">{b.sub}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Featured Businesses ───────────────────────────────────────────── */}
      <section id="businesses" className="px-6 mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-brand-600 font-bold text-sm uppercase tracking-widest">Our Divisions</span>
            <h2 className="text-4xl font-heading font-extrabold text-slate-900 mt-2">Explore Praveen Groups</h2>
            <p className="text-slate-500 mt-2 text-lg">Serving quality products and services across 11 specialized divisions</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {businesses.map((biz, i) => (
            <motion.div 
              key={biz.slug} 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 4) * 0.1 }}
              whileHover={{ y: -8 }} 
              className="group cursor-pointer bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col relative overflow-hidden"
            >
              <Link to={`/company/${biz.slug}`} className="absolute inset-0 z-10" />

              {/* Business image banner */}
              <div className="relative w-full h-36 overflow-hidden rounded-t-3xl">
                <img
                  src={getBizImage(biz)}
                  alt={biz.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />
              </div>

              {/* Card content */}
              <div className="p-5 flex flex-col flex-1 text-center items-center">
                <h3 className="font-bold text-base text-slate-900 group-hover:text-brand-600 transition-colors mb-1.5 line-clamp-1">{biz.name}</h3>
                <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">{biz.description}</p>
                <div className="mt-4 flex items-center gap-1 text-xs font-bold text-brand-600 uppercase tracking-wider group-hover:gap-2 transition-all">
                  Explore <span className="text-base">→</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Top Products ──────────────────────────────────────────── */}
      <section className="bg-slate-50 py-24">
        <div className="px-6 mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-brand-600 font-bold text-sm uppercase tracking-widest">Global Marketplace</span>
              <h2 className="text-4xl font-heading font-extrabold text-slate-900 mt-2">Trending Products</h2>
              <p className="text-slate-500 mt-2 text-lg">Top-selling items across all our retail divisions</p>
            </div>
            <Button variant="secondary" className="bg-white">View All Products</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {topProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Banner ───────────────────────────────────────────────── */}
      <section className="px-6 mx-auto max-w-7xl">
        <div className="rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-slate-900 p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-10 relative shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500 rounded-full blur-[120px] opacity-20 translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-[120px] opacity-20 -translate-x-1/3 translate-y-1/3"></div>
          
          <div className="text-white flex-1 relative z-10 max-w-2xl">
            <span className="inline-block bg-white/10 text-brand-200 text-sm font-bold px-4 py-1.5 rounded-full mb-6 border border-white/20">
              Corporate Orders
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-extrabold mb-6 leading-tight">Partner with Praveen Global Enterprises</h2>
            <p className="text-brand-100 text-lg mb-8 leading-relaxed">
              Looking for bulk orders, B2B supplies, or industrial equipment? Our Global Enterprises division offers unmatched pricing and dedicated support for all corporate needs.
            </p>
            <div className="flex gap-4">
              <Button className="bg-amber-500 hover:bg-amber-400 text-white px-8 py-4 text-base font-bold shadow-xl shadow-amber-500/40 transition-all duration-300 hover:scale-105">
                Contact Sales
              </Button>
            </div>
          </div>
          
          <div className="w-full md:w-1/3 relative z-10 hidden md:block">
            <img src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80" alt="Corporate" className="rounded-3xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500" />
          </div>
        </div>
      </section>

      {/* ─── Featured Services ──────────────────────────────────────────── */}
      {topServices.length > 0 && (
        <section className="px-6 mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-brand-600 font-bold text-sm uppercase tracking-widest">Professional Services</span>
              <h2 className="text-4xl font-heading font-extrabold text-slate-900 mt-2">Book Expert Services</h2>
              <p className="text-slate-500 mt-2 text-lg">From DJ Events to Home Appliance Repair</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {topServices.map(service => (
              <ProductCard key={service.id} product={service} />
            ))}
          </div>
        </section>
      )}

      {/* ─── Trust ────────────────────────────────────────── */}
      <section className="text-center px-6 mx-auto max-w-4xl py-12">
        <h2 className="text-4xl font-heading font-extrabold text-slate-900 mb-6">Built on Trust & Quality</h2>
        <p className="text-slate-500 text-lg mb-16 leading-relaxed">Praveen Groups of Companies has been serving the community with dedication, innovation, and unwavering commitment to customer satisfaction across all our divisions.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: '11 Divisions', text: 'Operating across multiple industries to serve all your needs.' },
            { title: '1M+ Customers', text: 'Trusted by millions for products and professional services.' },
            { title: 'ISO Certified', text: 'Maintaining the highest standards of quality and excellence.' },
          ].map((f, i) => (
            <motion.div key={i} whileHover={{ y: -6 }} className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 fill-brand-500" />
              </div>
              <h3 className="font-extrabold text-2xl text-slate-900 mb-3">{f.title}</h3>
              <p className="text-slate-500 text-base leading-relaxed">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
};
