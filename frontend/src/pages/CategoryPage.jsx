import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';

// ─── All fake products ───────────────────────────────────────────────────────
export const ALL_PRODUCTS = {
  smartphones: [
    { id: 101, name: 'Samsung Galaxy S25 Ultra', category_name: 'Smartphones', slug: 'samsung-galaxy-s25-ultra', price: '129999', discount_price: '119999', rating: '4.8', stock: 25, brand: 'Samsung', images: [{ image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80' }] },
    { id: 102, name: 'iPhone 16 Pro Max', category_name: 'Smartphones', slug: 'iphone-16-pro-max', price: '159900', discount_price: null, rating: '4.9', stock: 18, brand: 'Apple', images: [{ image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&q=80' }] },
    { id: 103, name: 'OnePlus 13', category_name: 'Smartphones', slug: 'oneplus-13', price: '69999', discount_price: '64999', rating: '4.6', stock: 40, brand: 'OnePlus', images: [{ image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&q=80' }] },
    { id: 104, name: 'Google Pixel 9 Pro', category_name: 'Smartphones', slug: 'google-pixel-9-pro', price: '109999', discount_price: '99999', rating: '4.7', stock: 15, brand: 'Google', images: [{ image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&q=80' }] },
    { id: 105, name: 'Realme GT 6T 5G', category_name: 'Smartphones', slug: 'realme-gt-6t-5g', price: '35999', discount_price: '32999', rating: '4.4', stock: 60, brand: 'Realme', images: [{ image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&q=80' }] },
    { id: 106, name: 'Xiaomi 14 Ultra', category_name: 'Smartphones', slug: 'xiaomi-14-ultra', price: '99999', discount_price: '94999', rating: '4.7', stock: 20, brand: 'Xiaomi', images: [{ image: 'https://images.unsplash.com/photo-1628815113969-0487917e8b76?w=600&q=80' }] },
  ],
  audio: [
    { id: 201, name: 'Sony WH-1000XM5 Headphones', category_name: 'Audio Systems', slug: 'sony-wh-1000xm5', price: '29990', discount_price: '26490', rating: '4.9', stock: 80, brand: 'Sony', images: [{ image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80' }] },
    { id: 202, name: 'Apple AirPods Pro 2nd Gen', category_name: 'Audio Systems', slug: 'apple-airpods-pro-2', price: '24900', discount_price: '22900', rating: '4.8', stock: 50, brand: 'Apple', images: [{ image: 'https://images.unsplash.com/photo-1588423771073-b8903febb85b?w=600&q=80' }] },
    { id: 203, name: 'Bose QuietComfort 45', category_name: 'Audio Systems', slug: 'bose-qc45', price: '24500', discount_price: '21990', rating: '4.7', stock: 30, brand: 'Bose', images: [{ image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80' }] },
    { id: 204, name: 'JBL Charge 5 Speaker', category_name: 'Audio Systems', slug: 'jbl-charge-5', price: '16999', discount_price: '14999', rating: '4.5', stock: 100, brand: 'JBL', images: [{ image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80' }] },
    { id: 205, name: 'Sennheiser HD 560S', category_name: 'Audio Systems', slug: 'sennheiser-hd-560s', price: '14990', discount_price: null, rating: '4.6', stock: 25, brand: 'Sennheiser', images: [{ image: 'https://images.unsplash.com/photo-1524678714210-9917a6c619c2?w=600&q=80' }] },
    { id: 206, name: 'Boat Airdopes 141 TWS', category_name: 'Audio Systems', slug: 'boat-airdopes-141', price: '1299', discount_price: '899', rating: '4.2', stock: 500, brand: 'boAt', images: [{ image: 'https://images.unsplash.com/photo-1570394524600-c7b4c274cb84?w=600&q=80' }] },
  ],
  'home-appliances': [
    { id: 301, name: 'LG 1.5 Ton 5 Star AI Inverter AC', category_name: 'Home Appliances', slug: 'lg-15-ton-5star-ac', price: '45990', discount_price: '42990', rating: '4.7', stock: 30, brand: 'LG', images: [{ image: 'https://images.unsplash.com/photo-1562766024-11cb4e4e78e5?w=600&q=80' }] },
    { id: 302, name: 'Samsung 324L Frost Free Refrigerator', category_name: 'Home Appliances', slug: 'samsung-324l-fridge', price: '34990', discount_price: '29990', rating: '4.5', stock: 15, brand: 'Samsung', images: [{ image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600&q=80' }] },
    { id: 303, name: 'IFB 7kg Front Load Washing Machine', category_name: 'Home Appliances', slug: 'ifb-7kg-washing-machine', price: '32990', discount_price: '28990', rating: '4.6', stock: 20, brand: 'IFB', images: [{ image: 'https://images.unsplash.com/photo-1626806787461-102c1a9a8c34?w=600&q=80' }] },
    { id: 304, name: 'Philips Air Fryer XXL 7.3L', category_name: 'Home Appliances', slug: 'philips-air-fryer-xxl', price: '13995', discount_price: '10995', rating: '4.4', stock: 45, brand: 'Philips', images: [{ image: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=600&q=80' }] },
    { id: 305, name: 'Dyson V15 Detect Cordless Vacuum', category_name: 'Home Appliances', slug: 'dyson-v15-detect', price: '62900', discount_price: '55900', rating: '4.8', stock: 10, brand: 'Dyson', images: [{ image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80' }] },
    { id: 306, name: 'Whirlpool 25L Convection Microwave', category_name: 'Home Appliances', slug: 'whirlpool-25l-microwave', price: '10990', discount_price: '8990', rating: '4.3', stock: 35, brand: 'Whirlpool', images: [{ image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&q=80' }] },
  ],
  electrical: [
    { id: 401, name: 'Havells 6-Module Modular Switch Board', category_name: 'Electrical', slug: 'havells-6-module-switch', price: '1299', discount_price: '999', rating: '4.5', stock: 500, brand: 'Havells', images: [{ image: 'https://images.unsplash.com/photo-1621905251189-08b45249e1b7?w=600&q=80' }] },
    { id: 402, name: 'Philips 10W LED Bulb Pack of 4', category_name: 'Electrical', slug: 'philips-10w-led-bulbs-4', price: '599', discount_price: '449', rating: '4.6', stock: 1000, brand: 'Philips', images: [{ image: 'https://images.unsplash.com/photo-1545259742-f9e34d4e48b8?w=600&q=80' }] },
    { id: 403, name: 'Syska 5A Extension Board 3m', category_name: 'Electrical', slug: 'syska-extension-board-3m', price: '799', discount_price: '599', rating: '4.4', stock: 300, brand: 'Syska', images: [{ image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80' }] },
    { id: 404, name: 'Anchor Roma Smart WiFi Switch', category_name: 'Electrical', slug: 'anchor-roma-wifi-switch', price: '3499', discount_price: '2999', rating: '4.3', stock: 150, brand: 'Anchor', images: [{ image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80' }] },
    { id: 405, name: 'Legrand 16A 3-Pin Power Socket', category_name: 'Electrical', slug: 'legrand-16a-socket', price: '450', discount_price: null, rating: '4.5', stock: 800, brand: 'Legrand', images: [{ image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80' }] },
    { id: 406, name: 'Crompton 48W LED Tube Light', category_name: 'Electrical', slug: 'crompton-48w-led-tube', price: '699', discount_price: '549', rating: '4.4', stock: 600, brand: 'Crompton', images: [{ image: 'https://images.unsplash.com/photo-1524898615959-4e3a73bf2c3d?w=600&q=80' }] },
  ],
};

const CATEGORY_META = {
  smartphones: { label: 'Smartphones', hero: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1400&q=80', desc: 'Latest flagship and mid-range smartphones from top brands' },
  audio: { label: 'Audio Systems', hero: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1400&q=80', desc: 'Premium headphones, earbuds, and speakers for every budget' },
  'home-appliances': { label: 'Home Appliances', hero: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80', desc: 'Smart and energy-efficient appliances to power your home' },
  electrical: { label: 'Electrical', hero: 'https://images.unsplash.com/photo-1621905251189-08b45249e1b7?w=1400&q=80', desc: 'Switches, bulbs, and wiring accessories from top brands' },
};

const PRICE_RANGES = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under ₹1,000', min: 0, max: 1000 },
  { label: '₹1,000 – ₹10,000', min: 1000, max: 10000 },
  { label: '₹10,000 – ₹50,000', min: 10000, max: 50000 },
  { label: '₹50,000 – ₹1,00,000', min: 50000, max: 100000 },
  { label: 'Above ₹1,00,000', min: 100000, max: Infinity },
];

const SORT_OPTIONS = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Top Rated', value: 'rating' },
];

export const CategoryPage = () => {
  const { slug } = useParams();
  const [sortBy, setSortBy] = useState('relevance');
  const [priceRange, setPriceRange] = useState(0);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [onlyOnSale, setOnlyOnSale] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const products = ALL_PRODUCTS[slug] || [];
  const meta = CATEGORY_META[slug] || { label: slug, hero: '', desc: '' };
  const brands = [...new Set(products.map(p => p.brand))];
  const range = PRICE_RANGES[priceRange];

  const toggleBrand = (brand) =>
    setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);

  const resetFilters = () => {
    setSortBy('relevance'); setPriceRange(0); setSelectedBrands([]); setOnlyOnSale(false);
  };

  const filtered = useMemo(() => {
    let list = [...products];
    if (onlyOnSale) list = list.filter(p => p.discount_price);
    if (selectedBrands.length > 0) list = list.filter(p => selectedBrands.includes(p.brand));
    list = list.filter(p => {
      const price = Number(p.discount_price || p.price);
      return price >= range.min && price < range.max;
    });
    if (sortBy === 'price_asc') list.sort((a, b) => Number(a.discount_price || a.price) - Number(b.discount_price || b.price));
    else if (sortBy === 'price_desc') list.sort((a, b) => Number(b.discount_price || b.price) - Number(a.discount_price || a.price));
    else if (sortBy === 'rating') list.sort((a, b) => Number(b.rating) - Number(a.rating));
    return list;
  }, [products, onlyOnSale, selectedBrands, priceRange, sortBy]);

  const hasActiveFilters = priceRange !== 0 || selectedBrands.length > 0 || onlyOnSale || sortBy !== 'relevance';

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden h-52 mb-10 bg-slate-900 flex items-center px-10">
        {meta.hero && <img src={meta.hero} alt={meta.label} className="absolute inset-0 w-full h-full object-cover opacity-20" />}
        <div className="relative z-10 text-white">
          <nav className="text-xs text-slate-400 mb-2 flex gap-1 items-center">
            <Link to="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <span className="text-white">{meta.label}</span>
          </nav>
          <h1 className="text-4xl font-heading font-bold mb-1">{meta.label}</h1>
          <p className="text-slate-300">{meta.desc} · <strong>{products.length} products</strong></p>
        </div>
      </div>

      <div className="flex gap-8">
        {/* ── Sidebar Filter Panel ── */}
        <aside className="hidden lg:block w-60 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-24 space-y-7">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-900 flex items-center gap-2"><SlidersHorizontal className="w-4 h-4" /> Filters</h3>
              {hasActiveFilters && (
                <button onClick={resetFilters} className="text-xs text-brand-600 hover:underline font-medium flex items-center gap-1">
                  <X className="w-3 h-3" /> Clear All
                </button>
              )}
            </div>

            {/* Sort */}
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Sort By</h4>
              <div className="space-y-1">
                {SORT_OPTIONS.map(opt => (
                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" name="sort" checked={sortBy === opt.value} onChange={() => setSortBy(opt.value)} className="text-brand-600" />
                    <span className={`text-sm ${sortBy === opt.value ? 'text-brand-600 font-semibold' : 'text-slate-600 group-hover:text-slate-900'}`}>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Price Range</h4>
              <div className="space-y-1">
                {PRICE_RANGES.map((r, i) => (
                  <label key={i} className="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" name="price" checked={priceRange === i} onChange={() => setPriceRange(i)} className="text-brand-600" />
                    <span className={`text-sm ${priceRange === i ? 'text-brand-600 font-semibold' : 'text-slate-600 group-hover:text-slate-900'}`}>{r.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brand */}
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Brand</h4>
              <div className="space-y-1">
                {brands.map(brand => (
                  <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => toggleBrand(brand)} className="rounded text-brand-600" />
                    <span className={`text-sm ${selectedBrands.includes(brand) ? 'text-brand-600 font-semibold' : 'text-slate-600 group-hover:text-slate-900'}`}>{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* On Sale toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">🔥 On Sale Only</span>
              <button
                onClick={() => setOnlyOnSale(!onlyOnSale)}
                className={`w-10 h-6 rounded-full transition-colors ${onlyOnSale ? 'bg-brand-500' : 'bg-slate-200'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full mx-1 transition-transform ${onlyOnSale ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </aside>

        {/* ── Product Grid ── */}
        <div className="flex-1 min-w-0">
          {/* Product Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filtered.map((product, i) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: i * 0.04 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold text-slate-700 mb-2">No Products Found</h2>
              <p className="text-slate-400 mb-6">Try adjusting your filters.</p>
              <button onClick={resetFilters} className="text-brand-600 font-semibold hover:underline">Clear all filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
