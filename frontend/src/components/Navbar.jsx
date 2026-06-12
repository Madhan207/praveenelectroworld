import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, Search, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

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
    <nav className="fixed top-0 w-full z-50 glass border-b border-white/20 px-6 py-4 flex items-center justify-between transition-all duration-300">
      <div className="flex items-center gap-4 xl:gap-8">
        <Link to="/" className="flex items-center gap-2 text-lg xl:text-xl font-heading font-bold text-brand-900 tracking-tight">
          <img src="/logo.png" alt="Praveen Electro World Logo" className="h-8 w-8 xl:h-10 xl:w-10 object-contain" />
          <span className="hidden md:inline">PraveenElectro<span className="text-brand-600">World</span></span>
        </Link>
        <div className="hidden lg:flex items-center gap-3 xl:gap-5 font-medium text-slate-600 text-xs xl:text-sm whitespace-nowrap">
          <Link to="/category/smartphones" className="hover:text-brand-600 transition-colors">Smartphones</Link>
          <Link to="/category/audio" className="hover:text-brand-600 transition-colors">Audio Systems</Link>
          <Link to="/category/home-appliances" className="hover:text-brand-600 transition-colors">Home Appliances</Link>
          <Link to="/category/electrical" className="hover:text-brand-600 transition-colors">Electrical</Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <form onSubmit={handleSearch} className="hidden lg:flex relative group w-48 xl:w-64">
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-full bg-slate-100 border-none focus:ring-2 focus:ring-brand-500 transition-all outline-none"
          />
          <Search className="absolute left-3 top-2 text-slate-400 w-4 h-4 group-focus-within:text-brand-500 transition-colors" />
          <button type="submit" className="hidden">Search</button>
        </form>
        
        <Link to="/cart">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 relative text-slate-700 hover:text-brand-600 transition-colors">
            <ShoppingCart className="w-6 h-6" />
            {cartItems.length > 0 && (
              <span className="absolute top-0 right-0 bg-brand-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </motion.button>
        </Link>
        
        {user ? (
          <div className="flex items-center gap-2">
            <Link to="/profile" className="p-2 text-slate-700 hover:text-brand-600 transition-colors flex items-center justify-center bg-slate-100 rounded-full" title="My Profile">
              <User className="w-5 h-5" />
            </Link>
            {user.is_staff && (
              <Link to="/admin" className="text-xs font-bold bg-brand-100 text-brand-700 px-2 py-1 rounded-full hover:bg-brand-200">Admin</Link>
            )}
            <button onClick={logout} className="p-2 text-slate-700 hover:text-red-500 transition-colors" title="Logout">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <Link to="/login">
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 text-slate-700 hover:text-brand-600 transition-colors">
              <User className="w-6 h-6" />
            </motion.button>
          </Link>
        )}
        
        <button className="lg:hidden p-2 text-slate-700">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
};
