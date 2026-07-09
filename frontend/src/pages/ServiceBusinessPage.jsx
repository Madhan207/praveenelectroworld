import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Phone, Mail, MessageCircle, Star, ChevronLeft, ChevronRight,
  CheckCircle, Users, Calendar, ChevronDown, ChevronUp,
  ArrowRight, Send, Loader2, X
} from 'lucide-react';
import { BookingModal } from '../components/BookingModal';
import { QuoteModal } from '../components/QuoteModal';

// ── Inline brand icons ──────────────────────────────────────────────────────
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);
const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const API = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8000/api' : '/api');
const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } };

/* ── Sub-components ──────────────────────────────────────────────────────────── */

function HeroSlider({ banners, businessName, businessDescription, whatsapp, phone, onBook, onQuote, businessType }) {
  const [current, setCurrent] = useState(0);
  const len = banners.length;

  useEffect(() => {
    if (len < 2) return;
    const t = setInterval(() => setCurrent(p => (p + 1) % len), 5000);
    return () => clearInterval(t);
  }, [len]);

  const safeCurrent = current < len ? current : 0;
  const slide = banners[safeCurrent] || {};

  return (
    <section className="relative w-full min-h-screen flex items-center overflow-hidden bg-slate-950">
      {banners.map((b, i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          initial={false}
          animate={{ opacity: i === current ? 1 : 0 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
        >
          <img
            src={b.image || b.image_file}
            alt={b.title || 'Banner'}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-slate-950/20" />
        </motion.div>
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-24 pb-16 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-block bg-brand-500/20 border border-brand-400/40 text-brand-300 text-sm font-bold px-5 py-2 rounded-full mb-6 backdrop-blur-sm">
              {businessName}
            </span>
            <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-white leading-tight mb-6 drop-shadow-xl">
              {slide.title || businessName}
            </h1>
            <p className="text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl">
              {slide.subtitle || businessDescription}
            </p>
            <div className="flex flex-wrap gap-4">
              {businessType === 'trust' ? (
                <>
                  <a
                    href={`mailto:${''}`}
                    onClick={e => { e.preventDefault(); document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' }); }}
                    className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-xl shadow-amber-500/30 text-lg"
                  >
                    <CheckCircle className="w-5 h-5" /> Donate Now
                  </a>
                  <a
                    href={`mailto:${''}`}
                    onClick={e => { e.preventDefault(); document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' }); }}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold px-8 py-4 rounded-2xl transition-all backdrop-blur-sm text-lg"
                  >
                    <Users className="w-5 h-5" /> Volunteer
                  </a>
                </>
              ) : businessType === 'logistics' ? (
                <>
                  <button
                    onClick={onQuote}
                    className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-xl shadow-brand-500/30 text-lg"
                  >
                    <ArrowRight className="w-5 h-5" /> Get a Quote
                  </button>
                  <button
                    onClick={onBook}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold px-8 py-4 rounded-2xl transition-all backdrop-blur-sm text-lg"
                  >
                    <Calendar className="w-5 h-5" /> Book Shipment
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={onBook}
                    className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-xl shadow-brand-500/30 text-lg"
                  >
                    <Calendar className="w-5 h-5" /> Book Now
                  </button>
                  <button
                    onClick={onQuote}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold px-8 py-4 rounded-2xl transition-all backdrop-blur-sm text-lg"
                  >
                    <ArrowRight className="w-5 h-5" /> Get Quote
                  </button>
                </>
              )}
              {whatsapp && (
                <a
                  href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-xl shadow-green-500/30 text-lg"
                >
                  <MessageCircle className="w-5 h-5" /> WhatsApp
                </a>
              )}
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold px-6 py-4 rounded-2xl transition-all backdrop-blur-sm text-lg"
                >
                  <Phone className="w-5 h-5" /> Call Now
                </a>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {len > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2.5 rounded-full transition-all duration-500 ${i === current ? 'bg-brand-400 w-10' : 'bg-white/30 w-3 hover:bg-white/60'}`}
            />
          ))}
        </div>
      )}
      {len > 1 && (
        <>
          <button onClick={() => setCurrent(p => (p - 1 + len) % len)} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-all">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={() => setCurrent(p => (p + 1) % len)} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-all">
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}
    </section>
  );
}

function SectionHeader({ badge, title, subtitle }) {
  return (
    <div className="text-center mb-12">
      {badge && <span className="inline-block text-brand-600 font-bold text-sm uppercase tracking-widest mb-3">{badge}</span>}
      <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-slate-900">{title}</h2>
      {subtitle && <p className="text-slate-500 text-lg mt-4 max-w-2xl mx-auto">{subtitle}</p>}
    </div>
  );
}

function ServiceCard({ service, index, onBook, onQuote }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ delay: (index % 4) * 0.1 }}
      className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col"
    >
      {service.image && (
        <div className="aspect-video overflow-hidden">
          <img src={service.image} alt={service.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        </div>
      )}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-brand-600 transition-colors">{service.name}</h3>
        <p className="text-slate-500 leading-relaxed text-sm flex-1">{service.description || service.short_description}</p>
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => onBook(service, null)}
            className="flex-1 py-2.5 rounded-xl bg-brand-600 text-white font-bold hover:bg-brand-700 transition-colors text-sm"
          >
            Book Now
          </button>
          <button
            onClick={() => onQuote(null)}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors text-sm"
          >
            Get Quote
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function PackageCard({ pkg, index, onBook, onQuote }) {
  const isHighlighted = pkg.badge === 'Best Value' || pkg.badge === 'Popular' || pkg.tier === 'Gold' || pkg.tier === 'Premium';
  const price = pkg.price ? `₹${parseFloat(pkg.price).toLocaleString('en-IN')}` : pkg.price;
  const features = Array.isArray(pkg.features) ? pkg.features : [];

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`relative rounded-3xl p-8 flex flex-col border transition-all duration-300 ${
        isHighlighted
          ? 'bg-gradient-to-br from-brand-600 to-brand-800 text-white border-brand-500 shadow-2xl shadow-brand-600/30 scale-105'
          : 'bg-white text-slate-900 border-slate-100 hover:shadow-xl'
      }`}
    >
      {pkg.badge && (
        <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-sm font-bold shadow-lg ${isHighlighted ? 'bg-white text-brand-700' : 'bg-brand-600 text-white'}`}>
          {pkg.badge}
        </div>
      )}
      <div className="mb-6">
        <div className={`text-xs font-bold uppercase tracking-widest mb-2 ${isHighlighted ? 'text-brand-200' : 'text-brand-600'}`}>
          {pkg.tier}
        </div>
        <h3 className={`text-2xl font-bold mb-1 ${isHighlighted ? 'text-white' : 'text-slate-900'}`}>{pkg.name}</h3>
        <div className={`text-4xl font-extrabold font-heading ${isHighlighted ? 'text-white' : 'text-brand-600'}`}>{price}</div>
        {pkg.duration && <div className={`text-sm mt-1 ${isHighlighted ? 'text-brand-200' : 'text-slate-500'}`}>{pkg.duration}</div>}
      </div>
      <ul className="space-y-3 flex-1 mb-8">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-3">
            <CheckCircle className={`w-5 h-5 shrink-0 mt-0.5 ${isHighlighted ? 'text-brand-200' : 'text-green-500'}`} />
            <span className={`text-sm ${isHighlighted ? 'text-brand-100' : 'text-slate-600'}`}>{f}</span>
          </li>
        ))}
      </ul>
      <div className="flex flex-col gap-2">
        <button
          onClick={() => onBook(null, pkg)}
          className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all ${isHighlighted ? 'bg-white text-brand-700 hover:bg-slate-100' : 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-600/25'}`}
        >
          Book This Package
        </button>
        <button
          onClick={() => onQuote(pkg)}
          className={`w-full py-2.5 rounded-2xl font-bold text-sm transition-all border ${isHighlighted ? 'border-white/30 text-white hover:bg-white/10' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
        >
          Get Quote
        </button>
      </div>
    </motion.div>
  );
}

function GalleryGrid({ images }) {
  const [selected, setSelected] = useState(null);
  if (!images || images.length === 0) return null;
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img, i) => (
          <motion.div
            key={img.id || i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setSelected(img)}
            className={`relative overflow-hidden rounded-2xl cursor-pointer group ${i === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'}`}
          >
            <img src={img.image} alt={img.caption} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-all duration-300 flex items-end">
              <p className="text-white text-sm font-semibold p-4 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">{img.caption}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 bg-slate-950/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={e => e.stopPropagation()}
              className="max-w-4xl w-full"
            >
              <img src={selected.image} alt={selected.caption} className="w-full rounded-3xl shadow-2xl" />
              {selected.caption && <p className="text-white text-center mt-4 text-lg font-medium">{selected.caption}</p>}
              <button onClick={() => setSelected(null)} className="mt-4 mx-auto block text-slate-400 hover:text-white transition-colors text-sm">
                Close ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function TestimonialCard({ t }) {
  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm h-full flex flex-col">
      <div className="flex mb-4">
        {[1, 2, 3, 4, 5].map(s => (
          <Star key={s} className={`w-5 h-5 ${s <= t.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-200'}`} />
        ))}
      </div>
      <p className="text-slate-600 leading-relaxed flex-1 italic mb-6">"{t.comment}"</p>
      <div className="flex items-center gap-3">
        {t.avatar
          ? <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
          : <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-xl">{t.name?.[0]}</div>
        }
        <div>
          <p className="font-bold text-slate-900">{t.name}</p>
          <p className="text-slate-500 text-sm">{t.role}</p>
        </div>
      </div>
    </div>
  );
}

function FAQSection({ faqs }) {
  const [open, setOpen] = useState(null);
  if (!faqs || faqs.length === 0) return null;
  return (
    <div className="space-y-4">
      {faqs.map((faq, i) => (
        <motion.div
          key={faq.id || i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05 }}
          className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm"
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-8 py-6 text-left"
          >
            <span className="font-bold text-slate-900 text-lg pr-4">{faq.question}</span>
            {open === i ? <ChevronUp className="w-5 h-5 text-brand-600 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
          </button>
          <AnimatePresence>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="px-8 pb-6 text-slate-600 leading-relaxed border-t border-slate-50 pt-4">{faq.answer}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}

// ── Availability Calendar ───────────────────────────────────────────────────
function AvailabilityCalendar({ slots, onBookDate }) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());

  const slotMap = {};
  (slots || []).forEach(s => { slotMap[s.date] = s; });

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const monthName = new Date(viewYear, viewMonth).toLocaleString('default', { month: 'long' });

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6 text-sm">
        <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-green-400 inline-block"></span> Available</div>
        <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-red-400 inline-block"></span> Booked</div>
        <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-slate-200 inline-block"></span> No slot set</div>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
          <ChevronLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h3 className="text-lg font-bold text-slate-900">{monthName} {viewYear}</h3>
        <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
          <ChevronRight className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-center text-xs font-bold text-slate-400 py-2">{d}</div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const slot = slotMap[dateStr];
          const isPast = new Date(dateStr) < new Date(today.toISOString().split('T')[0]);
          const isAvailable = slot?.is_available === true;
          const isBooked = slot?.is_available === false;

          let btnClass = 'w-full aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-semibold transition-all ';
          if (isPast) btnClass += 'text-slate-300 cursor-not-allowed';
          else if (isBooked) btnClass += 'bg-red-100 text-red-400 cursor-not-allowed';
          else if (isAvailable) btnClass += 'bg-green-100 text-green-700 hover:bg-green-500 hover:text-white cursor-pointer';
          else btnClass += 'hover:bg-slate-100 text-slate-600 cursor-pointer';

          return (
            <button
              key={day}
              disabled={isPast || isBooked}
              onClick={() => !isPast && !isBooked && onBookDate(dateStr)}
              className={btnClass}
              title={slot?.title || (isAvailable ? 'Available — Click to book' : isBooked ? 'Booked' : '')}
            >
              {day}
              {isAvailable && <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-0.5"></span>}
              {isBooked && <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-0.5"></span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Contact Form ─────────────────────────────────────────────────────────────
function ContactForm({ business }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await axios.post(`${API}/contact-inquiries/`, {
        business: business.id,
        name: form.name,
        phone: form.phone,
        email: form.email,
        message: form.message,
      });
      setSent(true);
      setForm({ name: '', phone: '', email: '', message: '' });
    } catch (err) {
      console.error('Contact form failed:', err);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="bg-green-50 border border-green-100 rounded-3xl p-12 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h3>
        <p className="text-slate-600">We'll get back to you within 24 hours.</p>
        <button onClick={() => setSent(false)} className="mt-6 px-6 py-2.5 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-colors text-sm">
          Send Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-5">
      <h3 className="text-xl font-bold text-slate-900">Send a Message</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name *</label>
          <input required name="name" value={form.name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all text-slate-800" placeholder="Your name" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
          <input name="phone" value={form.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all text-slate-800" placeholder="+91 XXXXX XXXXX" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all text-slate-800" placeholder="your@email.com" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Message *</label>
        <textarea required name="message" value={form.message} onChange={handleChange} rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all text-slate-800 resize-none" placeholder="Tell us about your event..." />
      </div>
      <button type="submit" disabled={sending} className="w-full flex items-center justify-center gap-3 bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-2xl text-lg transition-all shadow-xl shadow-brand-600/30 disabled:opacity-60">
        {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        {sending ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}

/* ── Main Component ──────────────────────────────────────────────────────────── */
export const ServiceBusinessPage = () => {
  const { slug } = useParams();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [prefilledDate, setPrefilledDate] = useState('');

  const handleBook = useCallback((service, pkg) => {
    setSelectedService(service);
    setSelectedPackage(pkg);
    setPrefilledDate('');
    setIsBookingModalOpen(true);
  }, []);

  const handleBookDate = useCallback((dateStr) => {
    setSelectedService(null);
    setSelectedPackage(null);
    setPrefilledDate(dateStr);
    setIsBookingModalOpen(true);
  }, []);

  const handleQuote = useCallback((pkg) => {
    setSelectedPackage(pkg);
    setIsQuoteModalOpen(true);
  }, []);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const res = await axios.get(`${API}/businesses/${slug}/`);
        setBusiness(res.data);
      } catch (err) {
        console.error('Failed to load business', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBusiness();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-14 h-14 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!business) {
    return <div className="text-center py-40 text-2xl text-slate-400 font-bold">Business not found</div>;
  }

  // ── Data resolution: prefer new DB-driven lists, fall back to JSON fields ──
  const banners = business.banners && business.banners.length > 0
    ? business.banners
    : [{ image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1600&q=80', title: business.name, subtitle: business.description }];

  const packages = (business.packages_list && business.packages_list.length > 0)
    ? business.packages_list
    : (business.packages_data || []);

  // Prefer DB-driven services_list over legacy services_data JSON field
  const services = (business.services_list && business.services_list.length > 0)
    ? business.services_list
    : (business.services_data || []);

  const gallery = (business.gallery_list && business.gallery_list.length > 0)
    ? business.gallery_list
    : (business.gallery_data || []);

  const testimonials = (business.testimonials_list && business.testimonials_list.length > 0)
    ? business.testimonials_list
    : (business.testimonials_data || []);

  const faqs = (business.faqs_list && business.faqs_list.length > 0)
    ? business.faqs_list
    : (business.faqs_data || []);

  const availability = business.availability_list || [];

  return (
    <div className="pb-20">
      {/* ── Hero ──────────────────────────────────────────── */}
      <HeroSlider
        banners={banners}
        businessName={business.name}
        businessDescription={business.description}
        whatsapp={business.whatsapp_number}
        phone={business.contact_phone}
        onBook={() => handleBook(null, null)}
        onQuote={() => handleQuote(null)}
        businessType={business.type}
      />

      {/* ── Stats Bar ─────────────────────────────────────── */}
      <div className={`text-white ${
        business.type === 'trust' ? 'bg-amber-600' :
        business.type === 'logistics' ? 'bg-slate-800' :
        'bg-brand-600'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/20">
          {(business.stats_data && business.stats_data.length > 0 ? business.stats_data :
            business.type === 'trust' ? [
              { label: 'Years of Service', value: '14+' },
              { label: 'Students Supported', value: '5,000+' },
              { label: 'Programs Running', value: '6' },
              { label: 'Donors & Volunteers', value: '500+' },
            ] : business.type === 'logistics' ? [
              { label: 'Years of Operation', value: '15+' },
              { label: 'Vehicles in Fleet', value: '120+' },
              { label: 'Corporate Clients', value: '500+' },
              { label: 'Deliveries Per Day', value: '500+' },
            ] : [
              { label: 'Years of Experience', value: '12+' },
              { label: 'Events Completed', value: '2,000+' },
              { label: 'Happy Clients', value: '1,800+' },
              { label: 'Cities Covered', value: '25+' },
            ]
          ).map((s, i) => (
            <div key={i} className="text-center px-4">
              <div className="text-3xl font-extrabold">{s.value}</div>
              <div className="text-white/70 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 space-y-24 mt-20">

        {/* ── About ─────────────────────────────────────────── */}
        {(business.about_us || business.mission_vision) && (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <span className="text-brand-600 font-bold text-sm uppercase tracking-widest">About Us</span>
              <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-slate-900 mt-3 mb-6 leading-tight">
                Who We Are
              </h2>
              {business.about_us && <p className="text-slate-600 leading-relaxed text-lg mb-8 whitespace-pre-wrap">{business.about_us}</p>}
              {business.mission_vision && (
                <div className="bg-brand-50 border border-brand-100 rounded-2xl p-6">
                  <p className="text-brand-800 leading-relaxed whitespace-pre-wrap font-medium">{business.mission_vision}</p>
                </div>
              )}
            </motion.div>
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <div className="grid grid-cols-2 gap-4">
                {gallery.slice(0, 4).map((img, i) => (
                  <div key={img.id || i} className={`rounded-3xl overflow-hidden ${i === 0 ? 'col-span-2 aspect-video' : 'aspect-square'}`}>
                    <img src={img.image} alt={img.caption} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                ))}
              </div>
            </motion.div>
          </section>
        )}

        {/* ── Services ──────────────────────────────────────── */}
        {services && services.length > 0 && (
          <section>
            <SectionHeader
              badge={business.type === 'trust' ? 'Our Programs' : business.type === 'logistics' ? 'Our Services' : 'What We Do'}
              title={business.type === 'trust' ? 'Programs & Initiatives' : business.type === 'logistics' ? 'Logistics Solutions' : 'Our Services'}
              subtitle={business.type === 'trust' ? 'Making a meaningful difference through education, healthcare, and community welfare' : business.type === 'logistics' ? 'End-to-end freight and logistics solutions tailored to your business' : 'Premium services tailored to make every event extraordinary'}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {services.map((service, i) => (
                <ServiceCard key={service.id || i} service={service} index={i} onBook={handleBook} onQuote={handleQuote} />
              ))}
            </div>
          </section>
        )}

        {/* ── Packages ──────────────────────────────────────── */}
        {packages.length > 0 && (
          <section className="bg-slate-50 rounded-[2.5rem] p-8 md:p-16">
            <SectionHeader badge="Pricing" title="Service Packages" subtitle="Transparent pricing — choose the package that fits your event perfectly" />
            <div className={`grid grid-cols-1 md:grid-cols-2 ${packages.length >= 3 ? 'lg:grid-cols-3' : ''} ${packages.length >= 5 ? 'xl:grid-cols-5' : packages.length === 4 ? 'xl:grid-cols-4' : ''} gap-6 items-start`}>
              {packages.map((pkg, i) => (
                <PackageCard key={pkg.id || i} pkg={pkg} index={i} onBook={handleBook} onQuote={handleQuote} />
              ))}
            </div>
          </section>
        )}

        {/* ── Gallery ───────────────────────────────────────── */}
        {gallery.length > 0 && (
          <section>
            <SectionHeader
              badge={business.type === 'trust' ? 'Photo Gallery' : 'Portfolio'}
              title={business.type === 'trust' ? 'Our Activities' : business.type === 'logistics' ? 'Our Operations' : 'Our Gallery'}
              subtitle={business.type === 'trust' ? 'A glimpse into our community programs and impact' : 'A glimpse into our work and achievements'}
            />
            <GalleryGrid images={gallery} />
          </section>
        )}

        {/* ── Events ────────────────────────────────────────── */}
        {business.events_data && business.events_data.length > 0 && (
          <section className="bg-slate-50 rounded-[2.5rem] p-8 md:p-16">
            <SectionHeader
              badge="Events"
              title={business.type === 'trust' ? 'Upcoming Programs' : 'Upcoming Events'}
              subtitle="Join us and be part of something meaningful"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {business.events_data.map((event, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all"
                >
                  <div className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-4 ${
                    event.status === 'Ongoing' ? 'bg-green-100 text-green-700' :
                    event.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {event.status}
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">{event.title}</h3>
                  {event.date && (
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                      <Calendar className="w-4 h-4 text-brand-500" />
                      {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  )}
                  {event.location && (
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <MapPin className="w-4 h-4 text-brand-500" />
                      {event.location}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── Testimonials ──────────────────────────────────── */}
        {testimonials.length > 0 && (
          <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 md:p-16">
            <div className="text-center mb-12">
              <span className="text-brand-400 font-bold text-sm uppercase tracking-widest">Reviews</span>
              <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-white mt-3">What Clients Say</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.div key={t.id || i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <TestimonialCard t={t} />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── Availability Calendar ──────────────────────────── */}
        {business.type !== 'trust' && (
        <section>
          <SectionHeader badge="Schedule" title="Availability Calendar" subtitle="Check available dates and book your preferred slot instantly" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <AvailabilityCalendar slots={availability} onBookDate={handleBookDate} />
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Ready to Book?</h3>
                <p className="text-slate-500 leading-relaxed mb-6">
                  Click on any <span className="text-green-600 font-bold">green date</span> in the calendar to instantly start a booking, or contact us to check custom availability.
                </p>
                <button
                  onClick={() => handleBook(null, null)}
                  className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-brand-600/30"
                >
                  <Calendar className="w-5 h-5" /> Start Booking Request
                </button>
                <button
                  onClick={() => handleQuote(null)}
                  className="w-full flex items-center justify-center gap-2 border border-slate-200 text-slate-700 font-bold py-3.5 rounded-2xl transition-all hover:bg-slate-50 mt-3"
                >
                  <ArrowRight className="w-5 h-5" /> Get a Custom Quote
                </button>
              </div>
              {/* Contact quick links */}
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-4">
                <h3 className="text-xl font-bold text-slate-900">Contact Us</h3>
                {business.contact_phone && (
                  <a href={`tel:${business.contact_phone}`} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center group-hover:bg-brand-100 transition-colors">
                      <Phone className="w-5 h-5 text-brand-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Call / WhatsApp</p>
                      <p className="text-slate-900 font-bold">{business.contact_phone}</p>
                    </div>
                  </a>
                )}
                {business.contact_email && (
                  <a href={`mailto:${business.contact_email}`} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center group-hover:bg-brand-100 transition-colors">
                      <Mail className="w-5 h-5 text-brand-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Email</p>
                      <p className="text-slate-900 font-bold">{business.contact_email}</p>
                    </div>
                  </a>
                )}
                {business.address && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-brand-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Address</p>
                      <p className="text-slate-700 text-sm leading-relaxed">{business.address}</p>
                    </div>
                  </div>
                )}
                {business.whatsapp_number && (
                  <a
                    href={`https://wa.me/${business.whatsapp_number.replace(/\D/g, '')}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-green-500/30"
                  >
                    <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
                  </a>
                )}
              </div>

              {/* Social Links */}
              {business.social_links && Object.keys(business.social_links).length > 0 && (
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Follow Us</h3>
                  <div className="flex gap-3">
                    {business.social_links.instagram && (
                      <a href={business.social_links.instagram} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg">
                        <InstagramIcon />
                      </a>
                    )}
                    {business.social_links.facebook && (
                      <a href={business.social_links.facebook} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg">
                        <FacebookIcon />
                      </a>
                    )}
                    {business.social_links.youtube && (
                      <a href={business.social_links.youtube} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg">
                        <YoutubeIcon />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
        )}

        {/* ── Google Map ────────────────────────────────────── */}
        {business.google_map_embed && (
          <section>
            <SectionHeader badge="Find Us" title="Our Location" />
            <div
              className="w-full h-96 rounded-3xl overflow-hidden shadow-lg border border-slate-100"
              dangerouslySetInnerHTML={{ __html: business.google_map_embed }}
            />
          </section>
        )}

        {/* ── Contact Form ──────────────────────────────────── */}
        <section id="contact-section">
          <SectionHeader
            badge="Get In Touch"
            title={business.type === 'trust' ? 'Contact & Donate' : 'Send Us a Message'}
            subtitle={business.type === 'trust' ? 'Reach out to donate, volunteer, or learn more about our programs' : "Have questions? Fill out the form and we'll respond within 24 hours"}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ContactForm business={business} />
            <div className={`rounded-3xl p-8 md:p-12 text-white flex flex-col justify-between bg-gradient-to-br ${
              business.type === 'trust' ? 'from-amber-600 to-amber-800' :
              business.type === 'logistics' ? 'from-slate-700 to-slate-900' :
              'from-brand-600 to-brand-800'
            }`}>
              <div>
                <h3 className="text-3xl font-bold font-heading mb-4">
                  {business.type === 'trust' ? 'Make a Difference Today' :
                   business.type === 'logistics' ? 'Get Your Shipment Moving' :
                   'Plan Your Perfect Event'}
                </h3>
                <p className="text-white/80 leading-relaxed mb-8">
                  {business.type === 'trust'
                    ? 'Your donation and support can change the lives of hundreds of students and families across Tamil Nadu.'
                    : business.type === 'logistics'
                    ? 'Reliable, tracked, and affordable logistics across Tamil Nadu and pan-India. Get a quote in minutes.'
                    : 'From intimate gatherings to grand celebrations — we bring your vision to life with precision, creativity, and passion.'}
                </p>
                <div className="space-y-4">
                  {(business.type === 'trust' ? [
                    { icon: Users, text: '5,000+ Lives Changed' },
                    { icon: CheckCircle, text: '200+ Annual Scholarships' },
                    { icon: Calendar, text: '80G Tax Exemption on Donations' },
                  ] : business.type === 'logistics' ? [
                    { icon: CheckCircle, text: 'GPS-Tracked Shipments' },
                    { icon: Users, text: '500+ Corporate Clients' },
                    { icon: Calendar, text: '24/7 Customer Support' },
                  ] : [
                    { icon: Calendar, text: '500+ Events Successfully Delivered' },
                    { icon: Users, text: '1,800+ Happy Clients' },
                    { icon: CheckCircle, text: '24-Hour Response Guarantee' },
                  ]).map(({ icon: Icon, text }, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-white/80 font-medium">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-10 pt-8 border-t border-white/20">
                {business.type === 'trust' ? (
                  <>
                    <a
                      href={`mailto:${business.contact_email || ''}`}
                      className="w-full py-4 bg-white text-amber-700 font-bold rounded-2xl hover:bg-amber-50 transition-all text-lg shadow-lg flex items-center justify-center gap-2 mb-3"
                    >
                      <Mail className="w-5 h-5" /> Donate / Contact Us
                    </a>
                    {business.whatsapp_number && (
                      <a
                        href={`https://wa.me/${business.whatsapp_number.replace(/\D/g, '')}`}
                        target="_blank" rel="noopener noreferrer"
                        className="w-full py-3.5 border border-white/30 text-white font-bold rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="w-5 h-5" /> Volunteer via WhatsApp
                      </a>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => business.type === 'logistics' ? handleQuote(null) : handleBook(null, null)}
                    className="w-full py-4 bg-white font-bold rounded-2xl hover:opacity-90 transition-all text-lg shadow-lg"
                    style={{ color: business.type === 'logistics' ? '#1e293b' : 'var(--brand-600)' }}
                  >
                    {business.type === 'logistics' ? 'Get a Freight Quote' : 'Book Your Event Now'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────── */}
        {faqs.length > 0 && (
          <section>
            <SectionHeader badge="Help" title="Frequently Asked Questions" subtitle="Everything you need to know before booking" />
            <FAQSection faqs={faqs} />
          </section>
        )}

      </div>

      {/* ── Modals ────────────────────────────────────────── */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => { setIsBookingModalOpen(false); setPrefilledDate(''); }}
        service={selectedService}
        package={selectedPackage}
        business={business}
        prefilledDate={prefilledDate}
      />

      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        business={business}
        selectedPackage={selectedPackage}
      />
    </div>
  );
};
