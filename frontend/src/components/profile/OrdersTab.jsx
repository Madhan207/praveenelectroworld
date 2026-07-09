import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, Clock, CheckCircle, Search, Download, RefreshCw, Star, XCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8000/api' : '/api');
const authHeaders = () => ({ headers: { Authorization: `Bearer ${sessionStorage.getItem('access_token')}` } });

export const OrdersTab = ({ orders: initialOrders }) => {
  const [orders, setOrders] = useState(initialOrders);
  const [cancellingId, setCancellingId] = useState(null);
  const { toast } = useToast();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'text-green-600 bg-green-50 border-green-200';
      case 'Shipped': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Out for Delivery': return 'text-brand-600 bg-brand-50 border-brand-200';
      case 'Processing': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Cancelled': return 'text-red-600 bg-red-50 border-red-200';
      case 'Refund Initiated': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered': return <CheckCircle className="w-4 h-4" />;
      case 'Shipped': case 'Out for Delivery': return <Truck className="w-4 h-4" />;
      case 'Cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    
    setCancellingId(orderId);
    try {
      const res = await axios.patch(`${API}/orders/${orderId}/cancel/`, {}, authHeaders());
      
      // Update local state
      setOrders(orders.map(o => 
        o.id === orderId ? { ...o, status: 'Cancelled' } : o
      ));
      
      toast('Order cancelled successfully.', 'success');
    } catch (err) {
      toast(err.response?.data?.detail || 'Failed to cancel order.', 'error');
    } finally {
      setCancellingId(null);
    }
  };

  const showToast = (msg, type = 'info') => {
    toast(msg, type);
  };

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
          <Package className="w-12 h-12 text-slate-300" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2 font-heading">No orders yet</h3>
        <p className="text-slate-500 max-w-md mx-auto mb-8">When you buy something from Praveen Electro World, it will appear here.</p>
        <button className="bg-brand-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-brand-700 transition-colors shadow-md shadow-brand-500/20">
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order, index) => (
        <motion.div
          key={order.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden group"
        >
          {/* Order Header */}
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex flex-wrap gap-6 items-center justify-between">
            <div className="flex flex-wrap gap-8">
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Order Placed</p>
                <p className="text-sm font-semibold text-slate-900">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Total</p>
                <p className="text-sm font-semibold text-slate-900">₹{Number(order.total_amount).toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Ship To</p>
                <p className="text-sm font-semibold text-brand-600 cursor-pointer hover:underline">User Name ▾</p>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Order # {order.id}</p>
              <div className="flex gap-3 mt-1">
                <button 
                  onClick={() => showToast('Invoice downloading...', 'info')}
                  className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                >
                  <Download className="w-4 h-4" /> Invoice
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* Items List */}
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-heading font-bold text-lg text-slate-900">
                    {order.status === 'Delivered' ? 'Delivered' : 'Arriving Soon'}
                  </h3>
                  <div className={`px-3 py-1 rounded-full border text-xs font-bold flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)} {order.status}
                  </div>
                </div>

                {order.items.map(item => (
                  <div key={item.id} className="flex gap-5">
                    {/* Mock Product Image */}
                    <div className="w-24 h-24 rounded-2xl bg-slate-100 shrink-0 border border-slate-200 overflow-hidden relative">
                      <div className="absolute inset-0 flex items-center justify-center text-3xl">📦</div>
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 hover:text-brand-600 cursor-pointer line-clamp-2 leading-tight mb-1">
                        {item.product_name}
                      </h4>
                      <p className="text-sm text-slate-500 mb-2">Sold by: Praveen Electro World</p>
                      
                      <div className="flex items-center gap-4 text-sm font-semibold text-slate-900">
                        <span>₹{(Number(item.price) * item.quantity).toLocaleString('en-IN')}</span>
                        <span className="text-slate-400">|</span>
                        <span>Qty: {item.quantity}</span>
                      </div>
                      
                      <div className="flex gap-3 mt-4">
                        <button 
                          onClick={() => showToast('Item added to cart.', 'success')}
                          className="px-4 py-1.5 bg-brand-50 text-brand-700 text-xs font-bold rounded-lg hover:bg-brand-100 transition-colors flex items-center gap-1.5"
                        >
                          <RefreshCw className="w-3.5 h-3.5" /> Buy Again
                        </button>
                        <button 
                          onClick={() => showToast('Review system coming soon!', 'info')}
                          className="px-4 py-1.5 border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                        >
                          <Star className="w-3.5 h-3.5" /> Write Review
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Order Actions Sidebar */}
              <div className="w-full lg:w-64 shrink-0 space-y-3 lg:border-l border-slate-100 lg:pl-8">
                <button 
                  onClick={() => showToast(`Tracking package for Order #${order.id}...`, 'info')}
                  className="w-full py-2.5 bg-brand-600 text-white text-sm font-bold rounded-xl hover:bg-brand-700 transition-colors shadow-md shadow-brand-500/20"
                >
                  Track Package
                </button>
                <button 
                  onClick={() => showToast('Return request initiated.', 'success')}
                  className="w-full py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Return or Replace Items
                </button>
                <button 
                  onClick={() => showToast('Connecting to support...', 'info')}
                  className="w-full py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Get Product Support
                </button>
                
                {['Pending', 'Processing'].includes(order.status) && (
                  <button 
                    onClick={() => handleCancelOrder(order.id)}
                    disabled={cancellingId === order.id}
                    className={`w-full py-2.5 bg-white border border-slate-200 text-red-600 text-sm font-bold rounded-xl transition-colors ${cancellingId === order.id ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-50'}`}
                  >
                    {cancellingId === order.id ? 'Cancelling...' : 'Cancel Order'}
                  </button>
                )}
              </div>

            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
