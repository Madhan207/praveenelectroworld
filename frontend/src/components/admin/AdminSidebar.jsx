import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, ShoppingBag, Users, BarChart3,
  Settings, LogOut, Zap, ChevronLeft, ChevronRight,
  Shield, Image as ImageIcon, Briefcase, HeartHandshake, Truck, Receipt, FileText, Lock, Calendar
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = ({ collapsed, onToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Three core enterprise modules
  const sections = [
    {
      title: 'Overview',
      items: [
        { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
        { to: '/admin/settings', label: 'Settings', icon: Settings },
      ]
    },
    {
      title: 'Product Management',
      items: [
        { to: '/admin/businesses?type=product', label: 'Businesses', icon: Briefcase },
        { to: '/admin/products', label: 'Products', icon: Package },
        { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
        { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
      ]
    },
    {
      title: 'Service Management',
      items: [
        { to: '/admin/businesses?type=service', label: 'Businesses', icon: Briefcase },
        { to: '/admin/service-management', label: 'Services & Packages', icon: Briefcase },
        { to: '/admin/bookings', label: 'Bookings', icon: Calendar },
      ]
    },
    {
      title: 'Trust Management',
      items: [
        { to: '/admin/businesses?type=trust', label: 'Businesses', icon: Briefcase },
        { to: '/admin/trust-management', label: 'Programs & Events', icon: HeartHandshake },
      ]
    },
    {
      title: 'System',
      items: [
        { to: '/admin/customers', label: 'All Customers', icon: Users },
        { to: '/admin/payments', label: 'Payments', icon: Receipt },
        { to: '/admin/purchase', label: 'Purchase', icon: ShoppingBag },
        { to: '/admin/banners', label: 'Banners', icon: ImageIcon },
        { to: '/admin/reports', label: 'Reports', icon: FileText },
        { to: '/admin/security', label: 'Security Logs', icon: Lock },
      ]
    }
  ];

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="admin-sidebar relative z-20 flex flex-col shrink-0 h-full overflow-y-auto custom-scrollbar"
      style={{ background: 'var(--admin-sidebar-bg)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/8 shrink-0 sticky top-0 z-10" style={{ background: 'var(--admin-sidebar-bg)' }}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shrink-0 shadow-lg shadow-brand-900/50">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="min-w-0"
            >
              <p className="text-white font-heading font-bold text-sm leading-tight truncate">PraveenElectro</p>
              <p className="text-brand-400 text-xs">Admin Panel</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-16 w-6 h-6 bg-brand-600 text-white rounded-full flex items-center justify-center shadow-lg z-30 hover:bg-brand-700 transition-colors border-2 border-white/20"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Admin profile */}
      <div className={`flex items-center gap-3 mx-3 my-4 p-3 rounded-xl bg-white/5 border border-white/8 shrink-0 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
          {user?.name?.[0]?.toUpperCase() || 'A'}
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-w-0"
            >
              <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-brand-400" />
                <span className="text-brand-400 text-xs">Super Admin</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 pb-6">
        {sections.map((section, idx) => (
          <div key={idx} className="mb-6">
            {!collapsed && (
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest px-2 mb-2">
                {section.title}
              </p>
            )}
            <div className="space-y-1">
              {section.items.map(({ to, label, icon: Icon, end }) => {
                // Determine isActive for query param routes
                const isActiveClass = ({ isActive, search }) => {
                  let isMatch = isActive;
                  if (to.includes('?')) {
                    const [path, query] = to.split('?');
                    isMatch = window.location.pathname === path && window.location.search === `?${query}`;
                  }
                  return `admin-nav-item flex items-center gap-3 px-3 py-2 w-full transition-all ${isMatch ? 'active' : ''} ${collapsed ? 'justify-center' : ''}`;
                };

                return (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={isActiveClass}
                    title={collapsed ? label : ''}
                  >
                    <Icon className="w-4 h-4 shrink-0" style={{ width: '18px', height: '18px' }} />
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -8 }}
                          transition={{ duration: 0.15 }}
                          className="text-sm font-medium whitespace-nowrap"
                        >
                          {label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-5 pt-4 shrink-0 sticky bottom-0 z-10" style={{ background: 'var(--admin-sidebar-bg)' }}>
        <button
          onClick={handleLogout}
          className={`admin-nav-item flex items-center gap-3 px-3 py-2.5 w-full text-red-400 hover:bg-red-500/15 hover:text-red-300 ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Logout' : ''}
        >
          <LogOut style={{ width: '18px', height: '18px' }} className="shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-medium"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
};

export default AdminSidebar;
