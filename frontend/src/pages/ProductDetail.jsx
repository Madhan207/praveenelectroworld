import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Zap, Star, ChevronLeft, ChevronRight, X, CheckCircle, Truck, ShieldCheck, RefreshCw, Heart, Share2, ZoomIn } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ProductCard } from '../components/ProductCard';

// ─── Complete product dataset with multiple images, description & specs ────────
const ALL_PRODUCTS = {
  'samsung-galaxy-s25-ultra': {
    id: 1, name: 'Samsung Galaxy S25 Ultra', category_name: 'Smartphones', category_slug: 'smartphones',
    brand: 'Samsung', slug: 'samsung-galaxy-s25-ultra', price: '129999', discount_price: '119999',
    rating: '4.8', review_count: 2847, stock: 25,
    description: `The Samsung Galaxy S25 Ultra is the pinnacle of Android smartphone engineering. Powered by the Snapdragon 8 Elite processor and paired with 12GB RAM, this flagship delivers unmatched performance for gaming, multitasking, and AI-powered tasks.\n\nFeaturing the revolutionary S Pen with 2.8ms latency, the S25 Ultra is the ultimate productivity and creativity tool. The 6.9" Dynamic AMOLED 2X display with 120Hz refresh rate and 2600 nits peak brightness makes everything pop — indoors or under direct sunlight.\n\nThe quad-camera system led by a 200MP main sensor captures studio-grade photos with ProVisual Engine AI enhancements. From 0.6x ultrawide to 100x Space Zoom, no moment is too far or too close to capture perfectly.`,
    highlights: ['6.9" Dynamic AMOLED 2X, 120Hz', 'Snapdragon 8 Elite | 12GB RAM', '200MP + 50MP + 10MP + 10MP Quad Camera', '5000 mAh | 45W Super Fast Charging', 'Titanium Frame | IP68 Water Resistant', 'Built-in S Pen with 2.8ms Latency'],
    specs: {
      'Display': '6.9" QHD+ Dynamic AMOLED 2X, 120Hz, 2600 nits',
      'Processor': 'Snapdragon 8 Elite, Octa-core 3.2GHz',
      'RAM': '12 GB LPDDR5X',
      'Storage': '256 GB / 512 GB / 1 TB UFS 4.0',
      'Rear Camera': '200MP + 50MP + 10MP + 10MP',
      'Front Camera': '12 MP',
      'Battery': '5000 mAh, 45W Wired, 15W Wireless',
      'OS': 'Android 15, One UI 7',
      'Dimensions': '162.8 x 77.6 x 8.2 mm, 218g',
      'Water Resistance': 'IP68 (2m for 30 min)',
    },
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=90',
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=90',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=90',
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=90',
    ],
    reviews: [
      { name: 'Rahul K.', rating: 5, date: '2 days ago', text: 'Absolutely stunning phone! The S Pen is incredibly useful and the camera quality blows my mind every single time.' },
      { name: 'Priya S.', rating: 5, date: '1 week ago', text: 'Best phone I\'ve ever owned. Battery lasts a full day even with heavy use. Worth every rupee!' },
      { name: 'Arun M.', rating: 4, date: '2 weeks ago', text: 'Great phone overall. Camera is exceptional. Only wish the charging was faster.' },
    ],
    related_slugs: ['iphone-16-pro-max', 'oneplus-13', 'google-pixel-9-pro'],
  },
  'iphone-16-pro-max': {
    id: 2, name: 'iPhone 16 Pro Max', category_name: 'Smartphones', category_slug: 'smartphones',
    brand: 'Apple', slug: 'iphone-16-pro-max', price: '159900', discount_price: null,
    rating: '4.9', review_count: 4210, stock: 18,
    description: `The iPhone 16 Pro Max sets a new standard for what a smartphone can be. Crafted from Grade 5 Titanium with a textured matte finish, it feels as premium as it looks.\n\nPowered by the A18 Pro chip — the fastest chip ever in a smartphone — it handles everything from pro-level photography to demanding gaming without breaking a sweat. The 6.9" Super Retina XDR display with ProMotion technology delivers silky-smooth 120Hz scrolling.\n\nThe triple-camera system with a 48MP Fusion, 48MP ultrawide, and 12MP 5x telephoto captures life exactly as you see it — and better. Camera Control gives you instant access to all camera functions with a single click.`,
    highlights: ['6.9" Super Retina XDR, ProMotion 120Hz', 'A18 Pro Chip, 16-core Neural Engine', '48MP Fusion + 48MP Ultrawide + 12MP 5x Telephoto', '4685 mAh | 27W MagSafe Fast Charge', 'Grade 5 Titanium Frame | IP68', 'Camera Control Button'],
    specs: {
      'Display': '6.9" OLED Super Retina XDR, 120Hz ProMotion',
      'Processor': 'A18 Pro, 3nm Chip',
      'RAM': '8 GB',
      'Storage': '256 GB / 512 GB / 1 TB',
      'Rear Camera': '48MP + 48MP + 12MP Triple System',
      'Front Camera': '12 MP TrueDepth',
      'Battery': '4685 mAh, 27W Wired, 25W MagSafe',
      'OS': 'iOS 18',
      'Dimensions': '163 x 77.6 x 8.25 mm, 227g',
      'Water Resistance': 'IP68 (6m for 30 min)',
    },
    images: [
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&q=90',
      'https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=800&q=90',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=90',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=90',
    ],
    reviews: [
      { name: 'Sneha R.', rating: 5, date: '3 days ago', text: 'Perfection in every sense. The camera is just incredible and the titanium build feels so premium.' },
      { name: 'Vikram J.', rating: 5, date: '5 days ago', text: 'Switched from Android and never looking back. iOS is buttery smooth and the battery life is great.' },
      { name: 'Meera T.', rating: 4, date: '1 week ago', text: 'Excellent phone. Pricey but the quality justifies it. Photos come out amazing.' },
    ],
    related_slugs: ['samsung-galaxy-s25-ultra', 'oneplus-13', 'realme-gt-6t-5g'],
  },
  'oneplus-13': {
    id: 3, name: 'OnePlus 13', category_name: 'Smartphones', category_slug: 'smartphones',
    brand: 'OnePlus', slug: 'oneplus-13', price: '69999', discount_price: '64999',
    rating: '4.6', review_count: 1523, stock: 40,
    description: 'The OnePlus 13 brings flagship power to a more accessible price point. With Snapdragon 8 Elite, Hasselblad cameras, and a massive 6000 mAh battery with 100W SUPERVOOC charging, it\'s built for power users who demand the best.',
    highlights: ['6.82" LTPO AMOLED, 1-120Hz', 'Snapdragon 8 Elite | 12/16GB RAM', '50MP Hasselblad Triple Camera', '6000 mAh | 100W SUPERVOOC', 'Aqua Touch | IP65', 'Alert Slider'],
    specs: { 'Display': '6.82" LTPO AMOLED, 120Hz', 'Processor': 'Snapdragon 8 Elite', 'RAM': '12/16 GB', 'Battery': '6000 mAh, 100W', 'OS': 'OxygenOS 15 (Android 15)' },
    images: [
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=90',
      'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=90',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=90',
    ],
    reviews: [{ name: 'Aditya P.', rating: 5, date: '1 week ago', text: 'Fastest charging I\'ve ever experienced! 100W is a game changer.' }],
    related_slugs: ['samsung-galaxy-s25-ultra', 'iphone-16-pro-max', 'xiaomi-14-ultra'],
  },
  'sony-wh-1000xm5': {
    id: 201, name: 'Sony WH-1000XM5 Headphones', category_name: 'Audio Systems', category_slug: 'audio',
    brand: 'Sony', slug: 'sony-wh-1000xm5', price: '29990', discount_price: '26490',
    rating: '4.9', review_count: 3100, stock: 80,
    description: 'The WH-1000XM5 features industry-leading noise cancellation with two processors and eight microphones. With 30-hour battery life, multipoint connection, and best-in-class call quality, these are the best wireless headphones money can buy.',
    highlights: ['Industry-Leading Noise Cancellation', '30 Hours Battery Life', 'LDAC Hi-Res Audio', 'Multipoint Connection (2 devices)', '4-mic for Crystal Clear Calls', 'Foldable Design'],
    specs: { 'Driver': '30mm, Carbon Fibre Composite', 'Frequency': '4Hz–40,000Hz', 'Battery': '30 hours (NC on), 3 min = 3 hours', 'Bluetooth': '5.2, LDAC, AAC, SBC', 'Weight': '250g' },
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=90',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=90',
      'https://images.unsplash.com/photo-1524678714210-9917a6c619c2?w=800&q=90',
    ],
    reviews: [{ name: 'Karthik N.', rating: 5, date: '3 days ago', text: 'The noise cancellation is absolutely magical. I can\'t hear anything in a busy office.' }],
    related_slugs: ['apple-airpods-pro-2', 'bose-qc45', 'jbl-charge-5'],
  },
  'apple-airpods-pro-2': {
    id: 202, name: 'Apple AirPods Pro 2nd Gen', category_name: 'Audio Systems', category_slug: 'audio',
    brand: 'Apple', slug: 'apple-airpods-pro-2', price: '24900', discount_price: '22900',
    rating: '4.8', review_count: 2890, stock: 50,
    description: 'AirPods Pro (2nd generation) feature the H2 chip for smarter Active Noise Cancellation, Adaptive Transparency mode, and Personalized Spatial Audio with dynamic head tracking for an immersive listening experience.',
    highlights: ['2x Active Noise Cancellation (H2 chip)', 'Adaptive Transparency Mode', 'Personalized Spatial Audio', '6 hrs ANC playback + 24 hrs with case', 'Touch control on stem', 'IP54 Water Resistant'],
    specs: { 'Chip': 'H2', 'Battery': '6 hours + 24 hours (case)', 'Connectivity': 'Bluetooth 5.3', 'Case Charging': 'MagSafe, Lightning, Qi', 'Weight': '5.3g per earbud' },
    images: [
      'https://images.unsplash.com/photo-1588423771073-b8903febb85b?w=800&q=90',
      'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&q=90',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=90',
    ],
    reviews: [{ name: 'Divya M.', rating: 5, date: '2 days ago', text: 'Best earbuds I\'ve ever used. Seamless with my iPhone and the noise cancellation is top notch.' }],
    related_slugs: ['sony-wh-1000xm5', 'bose-qc45', 'boat-airdopes-141'],
  },
  'lg-15-ton-5star-ac': {
    id: 301, name: 'LG 1.5 Ton 5 Star AI Inverter AC', category_name: 'Home Appliances', category_slug: 'home-appliances',
    brand: 'LG', slug: 'lg-15-ton-5star-ac', price: '45990', discount_price: '42990',
    rating: '4.7', review_count: 987, stock: 30,
    description: 'The LG Dual Inverter AC with AI Technology intelligently adjusts compressor speed to maintain desired temperature while consuming minimum energy. With 5-star energy rating and advanced filtration, it delivers pure, cool comfort.',
    highlights: ['5 Star Energy Rating (ISEER: 4.73)', 'Dual Inverter Compressor', 'AI ThinQ & WiFi Control', 'HD Filter with Anti-Allergy Coating', '4-Way Swing', '10 Year Compressor Warranty'],
    specs: { 'Capacity': '1.5 Ton', 'Energy Rating': '5 Star (ISEER 4.73)', 'Compressor': 'Dual Inverter', 'Refrigerant': 'R-32', 'Noise Level': '19 dB (indoor)' },
    images: [
      'https://images.unsplash.com/photo-1562766024-11cb4e4e78e5?w=800&q=90',
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=90',
    ],
    reviews: [{ name: 'Ramesh V.', rating: 5, date: '1 month ago', text: 'Excellent cooling. Very quiet. The WiFi control from the phone is a great feature.' }],
    related_slugs: ['samsung-324l-fridge', 'ifb-7kg-washing-machine', 'whirlpool-25l-microwave'],
  },
  'havells-6-module-switch': {
    id: 401, name: 'Havells 6-Module Modular Switch Board', category_name: 'Electrical', category_slug: 'electrical',
    brand: 'Havells', slug: 'havells-6-module-switch', price: '1299', discount_price: '999',
    rating: '4.5', review_count: 654, stock: 500,
    description: 'Havells Modular Switch Boards are built for durability and aesthetics. The polycarbonate body is flame retardant and resistant to UV discoloration. Easy installation with a click-lock mechanism and compatible with all standard modular switches.',
    highlights: ['Polycarbonate Flame Retardant Body', 'UV & Impact Resistant', 'Compatible with Havells & Other Brands', 'Easy Click-Lock Installation', 'Suitable for 6 Modular Switches', 'ISI Marked'],
    specs: { 'Material': 'Polycarbonate', 'Modules': '6', 'Color': 'White', 'Standard': 'IS: 3854', 'Certification': 'ISI Marked' },
    images: [
      'https://images.unsplash.com/photo-1621905251189-08b45249e1b7?w=800&q=90',
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=90',
    ],
    reviews: [{ name: 'Suresh K.', rating: 4, date: '2 weeks ago', text: 'Good quality switch board. Easy to install and looks clean.' }],
    related_slugs: ['philips-10w-led-bulbs-4', 'syska-extension-board-3m', 'anchor-roma-wifi-switch'],
  },
};

// Flat product list for related/recommended
const PRODUCT_LIST = {
  'samsung-galaxy-s25-ultra': { id: 1, name: 'Samsung Galaxy S25 Ultra', category_name: 'Smartphones', slug: 'samsung-galaxy-s25-ultra', price: '129999', discount_price: '119999', rating: '4.8', stock: 25, images: [{ image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80' }] },
  'iphone-16-pro-max': { id: 2, name: 'iPhone 16 Pro Max', category_name: 'Smartphones', slug: 'iphone-16-pro-max', price: '159900', discount_price: null, rating: '4.9', stock: 18, images: [{ image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&q=80' }] },
  'oneplus-13': { id: 3, name: 'OnePlus 13', category_name: 'Smartphones', slug: 'oneplus-13', price: '69999', discount_price: '64999', rating: '4.6', stock: 40, images: [{ image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&q=80' }] },
  'google-pixel-9-pro': { id: 4, name: 'Google Pixel 9 Pro', category_name: 'Smartphones', slug: 'google-pixel-9-pro', price: '109999', discount_price: '99999', rating: '4.7', stock: 15, images: [{ image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&q=80' }] },
  'realme-gt-6t-5g': { id: 5, name: 'Realme GT 6T 5G', category_name: 'Smartphones', slug: 'realme-gt-6t-5g', price: '35999', discount_price: '32999', rating: '4.4', stock: 60, images: [{ image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&q=80' }] },
  'xiaomi-14-ultra': { id: 6, name: 'Xiaomi 14 Ultra', category_name: 'Smartphones', slug: 'xiaomi-14-ultra', price: '99999', discount_price: '94999', rating: '4.7', stock: 20, images: [{ image: 'https://images.unsplash.com/photo-1628815113969-0487917e8b76?w=600&q=80' }] },
  'sony-wh-1000xm5': { id: 201, name: 'Sony WH-1000XM5', category_name: 'Audio Systems', slug: 'sony-wh-1000xm5', price: '29990', discount_price: '26490', rating: '4.9', stock: 80, images: [{ image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80' }] },
  'apple-airpods-pro-2': { id: 202, name: 'Apple AirPods Pro 2nd Gen', category_name: 'Audio Systems', slug: 'apple-airpods-pro-2', price: '24900', discount_price: '22900', rating: '4.8', stock: 50, images: [{ image: 'https://images.unsplash.com/photo-1588423771073-b8903febb85b?w=600&q=80' }] },
  'bose-qc45': { id: 203, name: 'Bose QuietComfort 45', category_name: 'Audio Systems', slug: 'bose-qc45', price: '24500', discount_price: '21990', rating: '4.7', stock: 30, images: [{ image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80' }] },
  'jbl-charge-5': { id: 204, name: 'JBL Charge 5', category_name: 'Audio Systems', slug: 'jbl-charge-5', price: '16999', discount_price: '14999', rating: '4.5', stock: 100, images: [{ image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80' }] },
  'boat-airdopes-141': { id: 206, name: 'Boat Airdopes 141 TWS', category_name: 'Audio Systems', slug: 'boat-airdopes-141', price: '1299', discount_price: '899', rating: '4.2', stock: 500, images: [{ image: 'https://images.unsplash.com/photo-1570394524600-c7b4c274cb84?w=600&q=80' }] },
  'samsung-324l-fridge': { id: 302, name: 'Samsung 324L Refrigerator', category_name: 'Home Appliances', slug: 'samsung-324l-fridge', price: '34990', discount_price: '29990', rating: '4.5', stock: 15, images: [{ image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600&q=80' }] },
  'ifb-7kg-washing-machine': { id: 303, name: 'IFB 7kg Front Load Washing Machine', category_name: 'Home Appliances', slug: 'ifb-7kg-washing-machine', price: '32990', discount_price: '28990', rating: '4.6', stock: 20, images: [{ image: 'https://images.unsplash.com/photo-1626806787461-102c1a9a8c34?w=600&q=80' }] },
  'whirlpool-25l-microwave': { id: 306, name: 'Whirlpool 25L Microwave', category_name: 'Home Appliances', slug: 'whirlpool-25l-microwave', price: '10990', discount_price: '8990', rating: '4.3', stock: 35, images: [{ image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&q=80' }] },
  'philips-10w-led-bulbs-4': { id: 402, name: 'Philips 10W LED Bulb Pack of 4', category_name: 'Electrical', slug: 'philips-10w-led-bulbs-4', price: '599', discount_price: '449', rating: '4.6', stock: 1000, images: [{ image: 'https://images.unsplash.com/photo-1545259742-f9e34d4e48b8?w=600&q=80' }] },
  'syska-extension-board-3m': { id: 403, name: 'Syska 5A Extension Board 3m', category_name: 'Electrical', slug: 'syska-extension-board-3m', price: '799', discount_price: '599', rating: '4.4', stock: 300, images: [{ image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80' }] },
  'anchor-roma-wifi-switch': { id: 404, name: 'Anchor Roma Smart WiFi Switch', category_name: 'Electrical', slug: 'anchor-roma-wifi-switch', price: '3499', discount_price: '2999', rating: '4.3', stock: 150, images: [{ image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80' }] },
};

const StarRow = ({ rating, count }) => (
  <div className="flex items-center gap-2">
    <div className="flex">
      {[1,2,3,4,5].map(s => (
        <Star key={s} className={`w-4 h-4 ${s <= Math.round(Number(rating)) ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-200'}`} />
      ))}
    </div>
    <span className="text-amber-600 font-bold">{rating}</span>
    {count && <span className="text-slate-400 text-sm">({count.toLocaleString('en-IN')} reviews)</span>}
  </div>
);

export const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [selectedImg, setSelectedImg] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [wishlist, setWishlist] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  // Try to get product from fake data, else show not found
  const product = ALL_PRODUCTS[slug];

  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedImg(0);
    setActiveTab('description');
  }, [slug]);

  if (!product) {
    return (
      <div className="text-center py-24">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-slate-700 mb-2">Product Not Found</h2>
        <p className="text-slate-400 mb-6">This product doesn't exist or may have been removed.</p>
        <button onClick={() => navigate(-1)} className="text-brand-600 font-semibold hover:underline">← Go Back</button>
      </div>
    );
  }

  const images = product.images || [];
  const discount = product.discount_price
    ? Math.round((1 - Number(product.discount_price) / Number(product.price)) * 100) : 0;
  const relatedProducts = (product.related_slugs || []).map(s => PRODUCT_LIST[s]).filter(Boolean);
  const recommendedProducts = Object.values(PRODUCT_LIST)
    .filter(p => p.slug !== slug && !product.related_slugs?.includes(p.slug))
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart({ ...product, images: images.map(img => ({ image: img })) });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const handleBuyNow = () => {
    if (!user) { navigate('/login'); return; }
    addToCart({ ...product, images: images.map(img => ({ image: img })) });
    navigate('/checkout');
  };

  const prevImg = () => setSelectedImg(i => (i - 1 + images.length) % images.length);
  const nextImg = () => setSelectedImg(i => (i + 1) % images.length);

  return (
    <div className="space-y-12">
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

          <StarRow rating={product.rating} count={product.review_count} />

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
          {product.highlights && (
            <div className="space-y-2">
              <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide">Key Highlights</h3>
              <ul className="space-y-1.5">
                {product.highlights.map((h, i) => (
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
            <button onClick={handleAddToCart} disabled={product.stock === 0}
              className={`flex-1 flex items-center justify-center gap-2 border-2 font-bold py-3.5 rounded-2xl transition-all text-sm ${addedToCart ? 'border-green-500 text-green-600 bg-green-50' : 'border-brand-500 text-brand-600 hover:bg-brand-50'}`}>
              {addedToCart ? <><CheckCircle className="w-5 h-5" /> Added!</> : <><ShoppingCart className="w-5 h-5" /> Add to Cart</>}
            </button>
            <button onClick={handleBuyNow} disabled={product.stock === 0}
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
            { id: 'reviews', label: `Reviews (${product.review_count?.toLocaleString('en-IN') || 0})` },
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

          {activeTab === 'specs' && product.specs && (
            <div className="overflow-hidden rounded-2xl border border-slate-100">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-slate-50">
                  {Object.entries(product.specs).map(([key, val], i) => (
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
                  <div className="text-slate-500 text-sm mt-1">{product.review_count?.toLocaleString('en-IN')} ratings</div>
                </div>
              </div>
              {/* Individual Reviews */}
              <div className="space-y-4">
                {(product.reviews || []).map((rev, i) => (
                  <div key={i} className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center font-bold text-brand-600 text-sm">{rev.name[0]}</div>
                        <div>
                          <div className="font-semibold text-slate-900 text-sm">{rev.name}</div>
                          <div className="text-xs text-slate-400">{rev.date}</div>
                        </div>
                      </div>
                      <div className="flex">
                        {[1,2,3,4,5].map(s => <Star key={s} className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-200'}`} />)}
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">{rev.text}</p>
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

      {/* ── Recommended For You ── */}
      {recommendedProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-heading font-bold text-slate-900 mb-6">Recommended For You</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedProducts.map(p => <ProductCard key={p.id} product={p} />)}
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
