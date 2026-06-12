import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 px-6 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <img src="/logo.png" alt="Logo" className="h-9 w-9 object-contain" />
            <h3 className="text-2xl font-heading font-bold text-white">PraveenElectro<span className="text-brand-500">World</span></h3>
          </div>
          <p className="text-slate-400 text-sm">Premium Electronics for Modern Living. Trusted Technology Solutions Since 2022.</p>
          <a href="https://praveenelectroworld.in" target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors">🌐 praveenelectroworld.in</a>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link to="/about" className="hover:text-brand-500 transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-brand-500 transition-colors">Contact</Link></li>
            <li><Link to="/faq" className="hover:text-brand-500 transition-colors">FAQ</Link></li>
            <li><Link to="/shipping" className="hover:text-brand-500 transition-colors">Shipping Info</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Categories</h4>
          <ul className="space-y-2">
            <li><Link to="/category/smartphones" className="hover:text-brand-500 transition-colors">Smartphones</Link></li>
            <li><Link to="/category/audio" className="hover:text-brand-500 transition-colors">Audio Systems</Link></li>
            <li><Link to="/category/home-appliances" className="hover:text-brand-500 transition-colors">Home Appliances</Link></li>
            <li><Link to="/category/electrical" className="hover:text-brand-500 transition-colors">Electrical Products</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Contact Us</h4>
          <ul className="space-y-3 text-slate-400 text-sm">
            <li className="flex items-start gap-2">
              <span className="mt-0.5">📍</span>
              <span>824W+H5P Ella Nagar,<br />Tamil Nadu, India</span>
            </li>
            <li className="flex items-center gap-2">
              <span>📞</span>
              <a href="tel:+918675398848" className="hover:text-brand-400 transition-colors">+91 86753 98848</a>
            </li>

            <li className="flex items-center gap-2">
              <span>🌐</span>
              <a href="https://praveenelectroworld.in" target="_blank" rel="noopener noreferrer" className="hover:text-brand-400 transition-colors">praveenelectroworld.in</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
        &copy; {new Date().getFullYear()} Praveen Electro World. All rights reserved.
      </div>
    </footer>
  );
};
