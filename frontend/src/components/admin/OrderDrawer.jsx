import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, MapPin, CreditCard, Clock, CheckCircle, Truck, ShoppingBag, XCircle, AlertCircle } from 'lucide-react';

const STATUS_STEPS = [
  { key: 'Pending',          label: 'Order Placed',       icon: ShoppingBag,   color: 'text-yellow-500', bg: 'bg-yellow-100' },
  { key: 'Payment Verified', label: 'Payment Verified',   icon: CheckCircle,   color: 'text-blue-500',   bg: 'bg-blue-100' },
  { key: 'Processing',       label: 'Processing',         icon: Clock,         color: 'text-indigo-500', bg: 'bg-indigo-100' },
  { key: 'Shipped',          label: 'Shipped',            icon: Truck,         color: 'text-cyan-500',   bg: 'bg-cyan-100' },
  { key: 'Delivered',        label: 'Delivered',          icon: CheckCircle,   color: 'text-green-500',  bg: 'bg-green-100' },
];

const CANCELLED_STEP = { key: 'Cancelled', label: 'Cancelled', icon: XCircle, color: 'text-red-500', bg: 'bg-red-100' };

const statusIndex = (status) => STATUS_STEPS.findIndex(s => s.key === status);

const OrderDrawer = ({ order, onClose, onStatusChange }) => {
  if (!order) return null;

  const isCancelled = order.status === 'Cancelled';
  const steps       = isCancelled ? [...STATUS_STEPS.slice(0, 1), CANCELLED_STEP] : STATUS_STEPS;
  const currentIdx  = isCancelled ? 1 : statusIndex(order.status);

  return (
    <AnimatePresence>
      <div className="order-drawer-overlay" onClick={onClose} />
      <motion.div
        className="order-drawer"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{ background: 'var(--admin-card-bg)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--admin-border)' }}>
          <div>
            <h2 className="font-heading font-bold text-lg" style={{ color: 'var(--admin-text)' }}>
              Order #{order.id}
            </h2>
            <p className="text-sm" style={{ color: 'var(--admin-text-muted)' }}>
              {new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition-colors" style={{ color: 'var(--admin-text-muted)' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer Info */}
          <div className="admin-card p-4 space-y-2">
            <h3 className="font-bold text-sm uppercase tracking-wider mb-3" style={{ color: 'var(--admin-text-muted)' }}>Customer</h3>
            <p className="font-semibold" style={{ color: 'var(--admin-text)' }}>{order.user_name || order.full_name}</p>
            <p className="text-sm" style={{ color: 'var(--admin-text-muted)' }}>{order.user_email}</p>
            <p className="text-sm" style={{ color: 'var(--admin-text-muted)' }}>{order.mobile_number}</p>
          </div>

          {/* Shipping Address */}
          <div className="admin-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-brand-500" />
              <h3 className="font-bold text-sm uppercase tracking-wider" style={{ color: 'var(--admin-text-muted)' }}>Shipping</h3>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--admin-text)' }}>
              {order.address},<br />{order.city}, {order.state} — {order.pincode}
            </p>
          </div>

          {/* Payment */}
          <div className="admin-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-4 h-4 text-purple-500" />
              <h3 className="font-bold text-sm uppercase tracking-wider" style={{ color: 'var(--admin-text-muted)' }}>Payment</h3>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium" style={{ color: 'var(--admin-text)' }}>{order.payment_method}</span>
              <span className="text-xl font-heading font-bold text-green-600">₹{Number(order.total_amount).toLocaleString('en-IN')}</span>
            </div>
            {order.payment_verification && (
              <div className="mt-3 p-3 rounded-xl border bg-slate-50 border-slate-200">
                <p className="text-sm font-semibold mb-1" style={{ color: 'var(--admin-text)' }}>
                  Transaction ID (UTR): <span className="font-mono text-brand-600 ml-1">{order.payment_verification.utr_number || 'N/A'}</span>
                </p>
                {order.payment_verification.screenshot && (() => {
                  const s = order.payment_verification.screenshot;
                  const imgUrl = s.startsWith('http') ? s : `http://localhost:8000${s.startsWith('/') ? '' : '/'}${s}`;
                  return (
                    <div className="mt-2">
                      <p className="text-xs text-slate-500 mb-1">Payment Screenshot:</p>
                      <a href={imgUrl} target="_blank" rel="noopener noreferrer" className="block max-w-[200px]">
                        <img src={imgUrl} alt="Payment Proof" className="w-full h-auto rounded-lg border shadow-sm hover:opacity-90 transition-opacity" />
                      </a>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          {/* Items */}
          <div className="admin-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-4 h-4 text-green-500" />
              <h3 className="font-bold text-sm uppercase tracking-wider" style={{ color: 'var(--admin-text-muted)' }}>Items ({order.items?.length || 0})</h3>
            </div>
            <div className="space-y-2">
              {order.items?.map(item => (
                <div key={item.id} className="flex justify-between items-center py-1.5 border-b last:border-0" style={{ borderColor: 'var(--admin-border)' }}>
                  <span className="text-sm" style={{ color: 'var(--admin-text)' }}>{item.product_name} × {item.quantity}</span>
                  <span className="text-sm font-semibold" style={{ color: 'var(--admin-text)' }}>₹{(Number(item.price) * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Order Timeline */}
          <div className="admin-card p-4">
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: 'var(--admin-text-muted)' }}>Order Timeline</h3>
            <div className="space-y-0">
              {steps.map((step, i) => {
                const Icon     = step.icon;
                const done     = i <= currentIdx;
                const isCurrent= i === currentIdx;
                return (
                  <div key={step.key} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${done ? step.bg : 'bg-slate-100'}`}>
                        <Icon className={`w-4 h-4 ${done ? step.color : 'text-slate-400'}`} />
                      </div>
                      {i < steps.length - 1 && (
                        <div className={`w-0.5 h-8 my-1 ${i < currentIdx ? 'bg-brand-400' : 'bg-slate-200'}`} />
                      )}
                    </div>
                    <div className="pt-1.5 pb-4">
                      <p className={`text-sm font-semibold ${done ? '' : 'opacity-40'}`} style={{ color: done ? 'var(--admin-text)' : undefined }}>
                        {step.label}
                        {isCurrent && <span className="ml-2 text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full">Current</span>}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Update Status */}
          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: 'var(--admin-text)' }}>Update Status</label>
            <select
              value={order.status}
              onChange={e => onStatusChange(order.id, 'status', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm font-medium border outline-none focus:ring-2 focus:ring-brand-500"
              style={{ background: 'var(--admin-content-bg)', borderColor: 'var(--admin-border)', color: 'var(--admin-text)' }}
            >
              {['Pending', 'Payment Verified', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {order.tracking_id && (
              <p className="mt-2 text-xs" style={{ color: 'var(--admin-text-muted)' }}>
                Tracking ID: <span className="font-mono font-bold">{order.tracking_id}</span>
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OrderDrawer;
