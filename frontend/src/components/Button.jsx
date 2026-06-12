import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-brand-600 hover:bg-brand-700 text-white shadow-lg hover:shadow-brand-500/50",
    secondary: "bg-white text-slate-900 border border-slate-200 hover:border-brand-500 hover:text-brand-600 shadow-sm",
    outline: "border-2 border-brand-600 text-brand-600 hover:bg-brand-50"
  };

  return (
    <motion.button 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};
