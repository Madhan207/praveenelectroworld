import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

// A robust, full-bleed hero slider suitable for an enterprise e-commerce platform
export const HeroSlider = ({ banners = [], loading = false, fallbackHeight = 'min-h-[60vh] md:min-h-[70vh]' }) => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll to hash anchor when page loads (e.g. /#businesses)
  useEffect(() => {
    if (window.location.hash) {
      const el = document.querySelector(window.location.hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    if (banners.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length, isPaused]);

  if (loading) {
    return (
      <section className={`relative overflow-hidden bg-slate-900 ${fallbackHeight} flex items-center justify-center w-full`}>
        <Loader2 className="w-12 h-12 text-brand-500 animate-spin" />
      </section>
    );
  }

  if (banners.length === 0) {
    return null; // or a fallback banner
  }

  const handleNext = () => setCurrentSlide((prev) => (prev + 1) % banners.length);
  const handlePrev = () => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <section 
      className={`relative overflow-hidden bg-slate-900 ${fallbackHeight} w-full group`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentSlide}
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Background Image with Ken Burns effect */}
          <motion.img
            src={banners[currentSlide]?.image || banners[currentSlide]?.image_file}
            alt={banners[currentSlide]?.title || 'Banner'}
            className="absolute inset-0 w-full h-full object-cover"
            loading={currentSlide === 0 ? "eager" : "lazy"}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6, ease: "linear" }}
            style={{ objectPosition: 'center' }}
          />

          {/* Suble dark gradient for text readability (left to right) */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-transparent" />
          {/* Bottom gradient for seamless transition to content */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-900/30 to-transparent" />

          {/* Text Content Overlay */}
          <div className="absolute inset-0 flex items-center">
            <div className="w-full max-w-7xl mx-auto px-6 md:px-12 xl:px-20 pt-20">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="max-w-2xl text-white"
              >
                {banners[currentSlide]?.business_name && (
                  <span className="inline-block bg-brand-500/20 border border-brand-400/40 text-brand-300 text-xs md:text-sm font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4 md:mb-6 backdrop-blur-sm shadow-lg">
                    {banners[currentSlide].business_name}
                  </span>
                )}
                
                <h1 className="text-4xl md:text-6xl xl:text-7xl font-heading font-extrabold mb-4 md:mb-6 leading-[1.1] drop-shadow-xl">
                  {banners[currentSlide]?.title}
                </h1>
                
                {banners[currentSlide]?.subtitle && (
                  <p className="text-base md:text-xl xl:text-2xl text-slate-200 mb-8 md:mb-10 leading-relaxed font-medium drop-shadow-md opacity-90 max-w-xl">
                    {banners[currentSlide].subtitle}
                  </p>
                )}

                {banners[currentSlide]?.cta_text && (
                  <div className="flex flex-wrap gap-4">
                    {(() => {
                      const rawLink = banners[currentSlide].cta_link?.trim();
                      // Treat blank, "/", "#" as "no real destination" → use scroll fallback
                      const link = (rawLink && rawLink !== '/' && rawLink !== '#') ? rawLink : null;
                      const btnClass = "inline-flex items-center justify-center px-8 py-3.5 md:px-10 md:py-4 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl transition-all shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)] hover:shadow-[0_0_60px_-15px_rgba(59,130,246,0.7)] text-base md:text-lg";

                      const scrollToBusinesses = (e) => {
                        e.preventDefault();
                        const el = document.getElementById('businesses');
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth' });
                        }
                      };

                      // External URL (http/https or protocol-relative)
                      if (link && (link.startsWith('http') || link.startsWith('//'))) {
                        return (
                          <a href={link} target="_blank" rel="noopener noreferrer" className={btnClass}>
                            {banners[currentSlide].cta_text}
                          </a>
                        );
                      }

                      // Internal React-Router path (e.g. /products, /company/xyz)
                      if (link) {
                        return (
                          <Link to={link} className={btnClass}>
                            {banners[currentSlide].cta_text}
                          </Link>
                        );
                      }

                      // No real link — scroll down to the businesses section
                      return (
                        <button onClick={scrollToBusinesses} className={btnClass}>
                          {banners[currentSlide].cta_text}
                        </button>
                      );
                    })()}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows (Visible on hover) */}
      {banners.length > 1 && (
        <>
          <button 
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white/10 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
          </button>
          
          <button 
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white/10 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2.5 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 md:h-2.5 rounded-full transition-all duration-500 ${index === currentSlide ? 'bg-brand-500 w-8 md:w-12 shadow-lg shadow-brand-500/50' : 'bg-white/40 w-2 md:w-2.5 hover:bg-white/80'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};
