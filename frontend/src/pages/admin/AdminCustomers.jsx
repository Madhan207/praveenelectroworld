import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Search, Users, ShoppingBag, TrendingUp, Mail } from 'lucide-react';
import { SkeletonStats } from '../../components/admin/SkeletonLoader';

const API = import.meta.env.DEV ? 'http://localhost:8000/api' : '/api';
const authH = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } });

const AdminCustomers = () => {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');

  useEffect(() => {
    axios.get(`${API}/orders/?all=true`, authH())
      .then(r => setOrders(r.data))
      .finally(() => setLoading(false));
  }, []);

  // Aggregate customers from order data
  const customers = useMemo(() => {
    const map = {};
    orders.forEach(o => {
      const key = o.user_email || o.full_name;
      if (!map[key]) {
        map[key] = {
          name: o.user_name || o.full_name,
          email: o.user_email || '—',
          phone: o.mobile_number || '—',
          orders: 0, total: 0, lastOrder: o.created_at,
        };
      }
      map[key].orders += 1;
      if (o.status !== 'Cancelled') map[key].total += Number(o.total_amount || 0);
      if (new Date(o.created_at) > new Date(map[key].lastOrder)) map[key].lastOrder = o.created_at;
    });
    return Object.values(map).sort((a, b) => b.total - a.total);
  }, [orders]);

  const filtered = useMemo(() => {
    if (!search) return customers;
    const q = search.toLowerCase();
    return customers.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
  }, [customers, search]);

  const totalRevenue   = customers.reduce((s, c) => s + c.total, 0);
  const totalOrdersCnt = customers.reduce((s, c) => s + c.orders, 0);
  const avgSpend       = customers.length ? totalRevenue / customers.length : 0;

  if (loading) return <SkeletonStats count={3} />;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-heading font-bold" style={{ color: 'var(--admin-text)' }}>Customer Management</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--admin-text-muted)' }}>{customers.length} unique customers from order data</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Customers', value: customers.length, icon: Users,       gradient: 'from-blue-500 to-blue-700' },
          { label: 'Total Orders',    value: totalOrdersCnt,   icon: ShoppingBag,  gradient: 'from-purple-500 to-purple-700' },
          { label: 'Avg. Spend',      value: `₹${Math.round(avgSpend).toLocaleString('en-IN')}`, icon: TrendingUp, gradient: 'from-green-500 to-emerald-600' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="stat-card" style={{ background: 'var(--admin-card-bg)', borderColor: 'var(--admin-border)' }}>
            <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${s.gradient}`} />
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center mb-3 shadow`}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-heading font-bold" style={{ color: 'var(--admin-text)' }}>{s.value}</p>
            <p className="text-sm mt-1" style={{ color: 'var(--admin-text-muted)' }}>{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Search */}
      <div className="admin-card p-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--admin-text-muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border outline-none focus:ring-2 focus:ring-brand-500"
            style={{ background: 'var(--admin-content-bg)', borderColor: 'var(--admin-border)', color: 'var(--admin-text)' }} />
        </div>
      </div>

      {/* Customer table */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead style={{ background: 'var(--admin-content-bg)' }}>
              <tr>
                {['Customer', 'Email', 'Phone', 'Orders', 'Total Spent', 'Last Order'].map(h => (
                  <th key={h} className="px-5 py-3 text-left font-semibold text-xs uppercase tracking-wider" style={{ color: 'var(--admin-text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <motion.tr key={c.email + i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="border-t hover:bg-slate-50/30 transition-colors" style={{ borderColor: 'var(--admin-border)' }}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {c.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <span className="font-semibold" style={{ color: 'var(--admin-text)' }}>{c.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" style={{ color: 'var(--admin-text-muted)' }} />
                      <span className="text-xs" style={{ color: 'var(--admin-text-muted)' }}>{c.email}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm" style={{ color: 'var(--admin-text-muted)' }}>{c.phone}</td>
                  <td className="px-5 py-3.5">
                    <span className="font-bold text-brand-600">{c.orders}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-bold text-green-600">₹{c.total.toLocaleString('en-IN')}</span>
                  </td>
                  <td className="px-5 py-3.5 text-xs" style={{ color: 'var(--admin-text-muted)' }}>
                    {new Date(c.lastOrder).toLocaleDateString('en-IN')}
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="py-16 text-center" style={{ color: 'var(--admin-text-muted)' }}>
                  <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  No customers found
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomers;
