import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Zap, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const ProductCard = memo(({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const discount = product.discount_price
    ? Math.round((1 - Number(product.discount_price) / Number(product.price)) * 100)
    : 0;

  const handleBuyNow = (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart(product);
    navigate('/checkout');
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden group flex flex-col"
    >
      {/* Image */}
      <Link to={`/product/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-slate-50">
        <img
          src={product.images && product.images.length > 0 ? product.images[0].image : 'https://placehold.co/400x300/f8fafc/94a3b8?text=No+Image'}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {discount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
              -{discount}%
            </span>
          )}
        </div>
        {product.stock < 10 && product.stock > 0 && (
          <div className="absolute bottom-3 left-3 bg-orange-500/90 text-white text-xs font-semibold px-2 py-1 rounded-lg">
            Only {product.stock} left!
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="text-xs text-brand-600 font-semibold mb-1 uppercase tracking-wide">{product.category_name}</div>
        <Link to={`/product/${product.slug}`} className="text-base font-bold text-slate-900 mb-2 hover:text-brand-600 transition-colors line-clamp-2 leading-snug">
          {product.name}
        </Link>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mb-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(Number(product.rating)) ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-200'}`} />
              ))}
            </div>
            <span className="text-xs text-slate-500 font-medium">({product.rating})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4 mt-auto">
          {product.discount_price ? (
            <>
              <span className="text-xl font-bold text-slate-900">₹{Number(product.discount_price).toLocaleString('en-IN')}</span>
              <span className="text-sm text-slate-400 line-through">₹{Number(product.price).toLocaleString('en-IN')}</span>
              <span className="text-xs font-bold text-green-600">{discount}% off</span>
            </>
          ) : (
            <span className="text-xl font-bold text-slate-900">₹{Number(product.price).toLocaleString('en-IN')}</span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-1.5 border-2 border-brand-500 text-brand-600 font-bold py-2.5 rounded-xl hover:bg-brand-50 transition-all text-sm"
          >
            <ShoppingCart className="w-4 h-4" /> Cart
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 flex items-center justify-center gap-1.5 bg-brand-600 text-white font-bold py-2.5 rounded-xl hover:bg-brand-700 transition-all text-sm shadow-md hover:shadow-lg"
          >
            <Zap className="w-4 h-4" /> Buy Now
          </button>
        </div>
      </div>
    </motion.div>
  );
});
