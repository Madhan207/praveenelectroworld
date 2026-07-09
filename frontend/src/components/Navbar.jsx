import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, Search, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { MegaMenu } from './MegaMenu';

export const Navbar = () => {
  const { cartItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 px-4 md:px-6 py-3 flex items-center justify-between transition-all duration-300 shadow-sm">
      <div className="flex items-center gap-6 xl:gap-10">
        <Link to="/" className="flex items-center gap-2 text-xl xl:text-2xl font-heading font-extrabold text-slate-900 tracking-tight">
          <img src="/logo.png" alt="Praveen Groups Logo" className="w-10 h-10 object-contain" />
          <span className="hidden md:flex flex-col leading-none">
            <span>Praveen</span>
            <span className="text-brand-600 text-sm tracking-widest">GROUPS</span>
          </span>
        </Link>
        
        <div className="hidden lg:block">
          <MegaMenu />
        </div>
      </div>

      <div className="flex-1 max-w-2xl mx-6 hidden md:block">
        <form onSubmit={handleSearch} className="relative group w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-slate-400 w-5 h-5 group-focus-within:text-brand-500 transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Search across all Praveen Businesses..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 text-sm rounded-xl bg-slate-100 border border-transparent focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none text-slate-800 placeholder-slate-400"
          />
          <button type="submit" className="hidden">Search</button>
        </form>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <Link to="/cart">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="p-2 relative text-slate-700 hover:text-brand-600 transition-colors bg-slate-50 hover:bg-slate-100 rounded-full">
            <ShoppingCart className="w-5 h-5" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                {cartItems.length}
              </span>
            )}
          </motion.button>
        </Link>
        
        {user ? (
          <div className="flex items-center gap-2">
            <Link to="/profile" className="p-2 text-slate-700 hover:text-brand-600 transition-colors flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-full" title="My Profile">
              <User className="w-5 h-5" />
            </Link>
            {user.is_staff && (
              <Link to="/admin" className="text-xs font-bold bg-slate-900 text-white px-3 py-1.5 rounded-full hover:bg-slate-800 transition-colors shadow-md hidden sm:block">Admin Panel</Link>
            )}
            <button onClick={logout} className="p-2 text-slate-700 hover:text-red-500 transition-colors bg-slate-50 hover:bg-red-50 rounded-full" title="Logout">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <Link to="/login">
            <motion.button 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }} 
              className="px-6 py-2.5 text-sm font-bold bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/25"
            >
              Sign In
            </motion.button>
          </Link>
        )}
        
        <button className="lg:hidden p-2 text-slate-700 bg-slate-100 rounded-lg">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
};
