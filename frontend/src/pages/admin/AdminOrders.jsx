import React, { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Download, CheckCircle, XCircle, Eye,
  ChevronLeft, ChevronRight, RefreshCw, SlidersHorizontal
} from 'lucide-react';
import OrderDrawer from '../../components/admin/OrderDrawer';
import { useToast } from '../../context/ToastContext';
import { SkeletonTable } from '../../components/admin/SkeletonLoader';

const API = import.meta.env.DEV ? 'http://localhost:8000/api' : '/api';
const authH = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } });

const STATUS_COLORS = {
  'Pending':          'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Payment Verified': 'bg-blue-100 text-blue-700 border-blue-200',
  'Processing':       'bg-indigo-100 text-indigo-700 border-indigo-200',
  'Shipped':          'bg-cyan-100 text-cyan-700 border-cyan-200',
  'Delivered':        'bg-green-100 text-green-700 border-green-200',
  'Cancelled':        'bg-red-100 text-red-700 border-red-200',
};
const StatusBadge = ({ status }) => (
  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[status] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>{status}</span>
);

const PAGE_SIZE_OPTIONS = [10, 25, 50];
const ALL_STATUSES = ['All', 'Pending', 'Payment Verified', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const ALL_METHODS  = ['All', 'UPI', 'COD'];

const exportCSV = (orders) => {
  const headers = ['ID', 'Customer', 'Email', 'Phone', 'Amount', 'Method', 'Status', 'Date', 'City', 'State'];
  const rows = orders.map(o => [
    o.id, o.user_name || o.full_name, o.user_email, o.mobile_number,
    o.total_amount, o.payment_method, o.status,
    new Date(o.created_at).toLocaleDateString('en-IN'),
    o.city, o.state,
  ]);
  const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a'); a.href = url; a.download = 'orders.csv'; a.click();
  URL.revokeObjectURL(url);
};

const AdminOrders = () => {
  const [orders, setOrders]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [statusFilter, setStatus]   = useState('All');
  const [methodFilter, setMethod]   = useState('All');
  const [page, setPage]             = useState(1);
  const [pageSize, setPageSize]     = useState(10);
  const [selected, setSelected]     = useState([]);
  const [bulkStatus, setBulkStatus] = useState('');
  const [drawerOrder, setDrawer]    = useState(null);
  const [sortKey, setSortKey]       = useState('id');
  const [sortDir, setSortDir]       = useState('desc');
  const { toast } = useToast();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const r = await axios.get(`${API}/orders/?all=true`, authH());
      setOrders(r.data);
    } catch { toast('Failed to fetch orders', 'error'); }
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id, field, value) => {
    try {
      await axios.patch(`${API}/orders/${id}/`, { [field]: value }, authH());
      setOrders(prev => prev.map(o => o.id === id ? { ...o, [field]: value } : o));
      if (drawerOrder?.id === id) setDrawer(prev => ({ ...prev, [field]: value }));
      toast(`Order #${id} updated`, 'success');
    } catch { toast('Update failed', 'error'); }
  };

  const bulkUpdate = async () => {
    if (!bulkStatus || !selected.length) return;
    await Promise.all(selected.map(id => updateStatus(id, 'status', bulkStatus)));
    setSelected([]);
    setBulkStatus('');
  };

  const sort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const filtered = useMemo(() => {
    let list = [...orders];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(o =>
        String(o.id).includes(q) ||
        (o.user_name || o.full_name || '').toLowerCase().includes(q) ||
        (o.user_email || '').toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'All') list = list.filter(o => o.status === statusFilter);
    if (methodFilter !== 'All') list = list.filter(o => o.payment_method === methodFilter);
    list.sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey];
      if (sortKey === 'total_amount') { av = Number(av); bv = Number(bv); }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [orders, search, statusFilter, methodFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated  = filtered.slice((page - 1) * pageSize, page * pageSize);

  const SortIcon = ({ k }) => {
    if (sortKey !== k) return <span className="opacity-30">↕</span>;
    return <span>{sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

  if (loading) return <SkeletonTable rows={8} cols={6} />;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-heading font-bold" style={{ color: 'var(--admin-text)' }}>Order Management</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--admin-text-muted)' }}>{filtered.length} orders</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchOrders} className="flex items-center gap-2 text-sm px-3 py-2 rounded-xl border transition-all hover:border-brand-400 hover:text-brand-600"
            style={{ borderColor: 'var(--admin-border)', color: 'var(--admin-text-muted)' }}>
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button onClick={() => exportCSV(filtered)} className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700 transition-colors shadow">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-card p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--admin-text-muted)' }} />
          <input
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by order #, customer, email..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border outline-none focus:ring-2 focus:ring-brand-500"
            style={{ background: 'var(--admin-content-bg)', borderColor: 'var(--admin-border)', color: 'var(--admin-text)' }}
          />
        </div>
        <select value={statusFilter} onChange={e => { setStatus(e.target.value); setPage(1); }}
          className="text-sm px-3 py-2 rounded-xl border outline-none focus:ring-2 focus:ring-brand-500"
          style={{ background: 'var(--admin-content-bg)', borderColor: 'var(--admin-border)', color: 'var(--admin-text)' }}>
          {ALL_STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={methodFilter} onChange={e => { setMethod(e.target.value); setPage(1); }}
          className="text-sm px-3 py-2 rounded-xl border outline-none focus:ring-2 focus:ring-brand-500"
          style={{ background: 'var(--admin-content-bg)', borderColor: 'var(--admin-border)', color: 'var(--admin-text)' }}>
          {ALL_METHODS.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Bulk actions */}
      <AnimatePresence>
        {selected.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="admin-card p-3 flex items-center gap-3 flex-wrap bg-brand-50 border-brand-200"
          >
            <span className="text-sm font-semibold text-brand-700">{selected.length} selected</span>
            <select value={bulkStatus} onChange={e => setBulkStatus(e.target.value)}
              className="text-sm px-3 py-1.5 rounded-lg border border-brand-300 outline-none text-brand-700 bg-white">
              <option value="">Change status to...</option>
              {['Pending','Payment Verified','Processing','Shipped','Delivered','Cancelled'].map(s => <option key={s}>{s}</option>)}
            </select>
            <button onClick={bulkUpdate} className="text-sm bg-brand-600 text-white px-4 py-1.5 rounded-lg font-semibold hover:bg-brand-700">Apply</button>
            <button onClick={() => setSelected([])} className="text-sm text-brand-600 underline">Clear</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead style={{ background: 'var(--admin-content-bg)' }}>
              <tr>
                <th className="px-4 py-3">
                  <input type="checkbox"
                    checked={paginated.length > 0 && paginated.every(o => selected.includes(o.id))}
                    onChange={e => setSelected(e.target.checked ? paginated.map(o => o.id) : [])}
                    className="w-4 h-4 rounded"
                  />
                </th>
                {[['id','Order #'],['user_name','Customer'],['total_amount','Amount'],['payment_method','Method'],['status','Status'],['created_at','Date']].map(([k, label]) => (
                  <th key={k} className="px-4 py-3 text-left cursor-pointer select-none font-semibold text-xs uppercase tracking-wider"
                    style={{ color: 'var(--admin-text-muted)' }}
                    onClick={() => sort(k)}>
                    <span className="flex items-center gap-1">{label} <SortIcon k={k} /></span>
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--admin-text-muted)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((o, i) => (
                <motion.tr
                  key={o.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-t transition-colors hover:bg-slate-50/50"
                  style={{ borderColor: 'var(--admin-border)' }}
                >
                  <td className="px-4 py-3.5">
                    <input type="checkbox" checked={selected.includes(o.id)}
                      onChange={e => setSelected(prev => e.target.checked ? [...prev, o.id] : prev.filter(x => x !== o.id))}
                      className="w-4 h-4 rounded" />
                  </td>
                  <td className="px-4 py-3.5 font-bold text-brand-600">#{o.id}</td>
                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-sm" style={{ color: 'var(--admin-text)' }}>{o.user_name || o.full_name}</p>
                    <p className="text-xs" style={{ color: 'var(--admin-text-muted)' }}>{o.user_email}</p>
                  </td>
                  <td className="px-4 py-3.5 font-semibold" style={{ color: 'var(--admin-text)' }}>₹{Number(o.total_amount).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${o.payment_method === 'UPI' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>{o.payment_method}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <select value={o.status} onChange={e => updateStatus(o.id, 'status', e.target.value)}
                      className={`text-xs font-bold px-2 py-1 rounded-lg border outline-none cursor-pointer ${STATUS_COLORS[o.status]}`}>
                      {['Pending','Payment Verified','Processing','Shipped','Delivered','Cancelled'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3.5 text-xs" style={{ color: 'var(--admin-text-muted)' }}>{new Date(o.created_at).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-1">
                      <button onClick={() => setDrawer(o)} className="p-1.5 rounded-lg hover:bg-brand-50 text-brand-600 transition-colors" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      {o.payment_method === 'UPI' && o.status === 'Pending' && (
                        <>
                          <button onClick={() => updateStatus(o.id, 'status', 'Payment Verified')}
                            className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition-colors" title="Verify Payment">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button onClick={() => updateStatus(o.id, 'status', 'Cancelled')}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Reject">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-16 text-center" style={{ color: 'var(--admin-text-muted)' }}>
                    No orders match your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t" style={{ borderColor: 'var(--admin-border)' }}>
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--admin-text-muted)' }}>
            Show
            <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
              className="px-2 py-1 rounded-lg border outline-none text-sm"
              style={{ background: 'var(--admin-content-bg)', borderColor: 'var(--admin-border)', color: 'var(--admin-text)' }}>
              {PAGE_SIZE_OPTIONS.map(n => <option key={n}>{n}</option>)}
            </select>
            per page · Showing {Math.min((page - 1) * pageSize + 1, filtered.length)}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-2 rounded-lg border disabled:opacity-40 hover:bg-slate-100 transition-colors"
              style={{ borderColor: 'var(--admin-border)', color: 'var(--admin-text-muted)' }}>
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
              return (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${p === page ? 'bg-brand-600 text-white' : 'hover:bg-slate-100'}`}
                  style={{ color: p === page ? undefined : 'var(--admin-text-muted)' }}>
                  {p}
                </button>
              );
            })}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="p-2 rounded-lg border disabled:opacity-40 hover:bg-slate-100 transition-colors"
              style={{ borderColor: 'var(--admin-border)', color: 'var(--admin-text-muted)' }}>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Order Drawer */}
      {drawerOrder && (
        <OrderDrawer order={drawerOrder} onClose={() => setDrawer(null)} onStatusChange={updateStatus} />
      )}
    </div>
  );
};

export default AdminOrders;
