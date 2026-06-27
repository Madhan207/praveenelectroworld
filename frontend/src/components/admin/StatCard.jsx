import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, gradient, trend, trendValue, delay = 0 }) => {
  const isPositive = trend === 'up';
  const isNeutral  = trend === 'neutral';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="stat-card group"
      style={{ background: 'var(--admin-card-bg)', borderColor: 'var(--admin-border)' }}
    >
      {/* Gradient accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${gradient}`} />

      <div className="flex items-start justify-between mb-4">
        {/* Icon */}
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-5 h-5 text-white" />
        </div>

        {/* Trend */}
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${
            isPositive ? 'bg-green-100 text-green-700' :
            isNeutral  ? 'bg-slate-100 text-slate-600' :
                         'bg-red-100 text-red-700'
          }`}>
            {isPositive  ? <TrendingUp className="w-3 h-3" /> :
             isNeutral   ? <Minus className="w-3 h-3" /> :
                           <TrendingDown className="w-3 h-3" />}
            {trendValue}
          </div>
        )}
      </div>

      <motion.p
        className="text-2xl font-heading font-bold mb-1"
        style={{ color: 'var(--admin-text)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.2, duration: 0.4 }}
      >
        {value}
      </motion.p>
      <p className="text-sm font-medium" style={{ color: 'var(--admin-text-muted)' }}>{label}</p>
    </motion.div>
  );
};

export default StatCard;
