import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Package, Truck, Clock, CheckCircle, LogOut, Search } from 'lucide-react';

const API = import.meta.env.DEV ? 'http://localhost:8000/api' : '/api';
const authHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } });

export const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API}/orders/`, authHeaders());
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to fetch orders', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'text-green-600 bg-green-50 border-green-200';
      case 'Shipped': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Processing': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Cancelled': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered': return <CheckCircle className="w-5 h-5" />;
      case 'Shipped': return <Truck className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  if (loading) return <div className="text-center py-20"><div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6 text-center md:text-left">
          <div className="w-20 h-20 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center text-3xl font-bold uppercase">
            {user?.name?.[0] || user?.email?.[0]}
          </div>
          <div>
            <h1 className="text-3xl font-heading font-bold text-slate-900">{user?.name}</h1>
            <p className="text-slate-500">{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 font-semibold px-6 py-3 rounded-xl bg-red-50 hover:bg-red-100 transition-colors">
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>

      {/* Orders List */}
      <div>
        <h2 className="text-2xl font-bold font-heading text-slate-900 mb-6 flex items-center gap-2">
          <Package className="w-6 h-6 text-brand-500" /> Your Orders
        </h2>
        
        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">No orders yet</h3>
            <p className="text-slate-400">When you buy something, it will appear here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Order Placed</p>
                    <p className="text-sm font-semibold text-slate-900">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Total</p>
                    <p className="text-sm font-semibold text-slate-900">₹{Number(order.total_amount).toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Order #</p>
                    <p className="text-sm font-semibold text-slate-900">{order.id}</p>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full border text-sm font-bold flex items-center gap-2 ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)} {order.status}
                  </div>
                </div>
                
                <div className="p-6">
                  {/* Tracking Section */}
                  {order.tracking_id && (
                    <div className="mb-6 bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-4">
                      <div className="bg-blue-100 p-2 rounded-full mt-1"><Search className="w-5 h-5 text-blue-600" /></div>
                      <div>
                        <h4 className="font-bold text-blue-900 mb-1">Tracking Information Available</h4>
                        <p className="text-sm text-blue-800">Your tracking ID is: <span className="font-mono font-bold text-blue-900 bg-blue-200/50 px-2 py-0.5 rounded">{order.tracking_id}</span></p>
                        <p className="text-xs text-blue-600 mt-1">Please use this ID to track your shipment on the carrier's website.</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    {order.items.map(item => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-xl">📦</div>
                          <div>
                            <p className="font-semibold text-slate-900">{item.product_name}</p>
                            <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-bold text-slate-900">₹{(Number(item.price) * item.quantity).toLocaleString('en-IN')}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
