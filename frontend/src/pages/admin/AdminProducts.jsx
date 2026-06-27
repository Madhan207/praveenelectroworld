import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit2, Trash2, Search, X, ImagePlus, Package,
  AlertTriangle, CheckCircle, Filter, RefreshCw
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { SkeletonTable } from '../../components/admin/SkeletonLoader';

const API = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8000/api' : '/api');
const authH = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } });
const multiH = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}`, 'Content-Type': 'multipart/form-data' } });

const EMPTY = { name: '', slug: '', category: '', description: '', price: '', discount_price: '', stock: '', is_featured: false, rating: '4.5' };

const StockBadge = ({ stock }) => {
  if (stock === 0) return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">Out of Stock</span>;
  if (stock < 10) return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700">{stock} Low</span>;
  return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">{stock} In Stock</span>;
};

const AdminProducts = () => {
  const [products, setProducts]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [catFilter, setCatFilter]   = useState('all');
  const [showModal, setModal]       = useState(false);
  const [editItem, setEditItem]     = useState(null);
  const [form, setForm]             = useState(EMPTY);
  const [imgFile, setImgFile]       = useState(null);
  const [formError, setFormError]   = useState('');
  const [formLoading, setFL]        = useState(false);
  const { toast } = useToast();

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [p, c] = await Promise.all([axios.get(`${API}/products/`), axios.get(`${API}/categories/`)]);
      setProducts(p.data); setCategories(c.data);
    } catch { toast('Failed to load products', 'error'); }
    setLoading(false);
  };
  useEffect(() => { fetchAll(); }, []);

  const openAdd = () => { setEditItem(null); setForm(EMPTY); setImgFile(null); setFormError(''); setModal(true); };
  const openEdit = (p) => {
    setEditItem(p);
    setForm({ name: p.name, slug: p.slug, category: p.category, description: p.description, price: p.price, discount_price: p.discount_price || '', stock: p.stock, is_featured: p.is_featured, rating: p.rating });
    setImgFile(null); setFormError(''); setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setFL(true); setFormError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (k === 'discount_price' && v === '') return; fd.append(k, v); });
      if (imgFile) fd.append('image', imgFile);
      if (editItem) await axios.patch(`${API}/products/${editItem.slug}/`, fd, multiH());
      else await axios.post(`${API}/products/`, fd, multiH());
      setModal(false); fetchAll();
      toast(editItem ? 'Product updated!' : 'Product added!', 'success');
    } catch (err) {
      const d = err.response?.data;
      setFormError(d ? JSON.stringify(d) : 'Failed to save product.');
    }
    setFL(false);
  };

  const deleteProduct = async (slug, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try { await axios.delete(`${API}/products/${slug}/`, authH()); fetchAll(); toast('Product deleted', 'warning'); }
    catch { toast('Delete failed', 'error'); }
  };

  const filtered = useMemo(() => {
    let list = products;
    if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    if (catFilter !== 'all') list = list.filter(p => String(p.category) === catFilter);
    return list;
  }, [products, search, catFilter]);

  if (loading) return <SkeletonTable rows={6} cols={7} />;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-heading font-bold" style={{ color: 'var(--admin-text)' }}>Product Management</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--admin-text-muted)' }}>{filtered.length} products · {products.filter(p => p.stock === 0).length} out of stock</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchAll} className="p-2.5 rounded-xl border transition-all hover:border-brand-400 hover:text-brand-600"
            style={{ borderColor: 'var(--admin-border)', color: 'var(--admin-text-muted)' }}>
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={openAdd} className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700 shadow transition-all">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-card p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--admin-text-muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border outline-none focus:ring-2 focus:ring-brand-500"
            style={{ background: 'var(--admin-content-bg)', borderColor: 'var(--admin-border)', color: 'var(--admin-text)' }} />
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
          className="text-sm px-3 py-2 rounded-xl border outline-none"
          style={{ background: 'var(--admin-content-bg)', borderColor: 'var(--admin-border)', color: 'var(--admin-text)' }}>
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead style={{ background: 'var(--admin-content-bg)' }}>
              <tr>
                {['Product', 'Category', 'Price', 'Discount', 'Stock', 'Featured', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left font-semibold text-xs uppercase tracking-wider" style={{ color: 'var(--admin-text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="border-t hover:bg-slate-50/30 transition-colors" style={{ borderColor: 'var(--admin-border)' }}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {p.images?.[0]?.image_file || p.images?.[0]?.image ? (
                        <img src={p.images[0].image_file ? `http://localhost:8000${p.images[0].image_file}` : p.images[0].image}
                          alt={p.name} className="w-10 h-10 object-cover rounded-lg border" style={{ borderColor: 'var(--admin-border)' }} />
                      ) : (
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--admin-content-bg)' }}>
                          <Package className="w-5 h-5" style={{ color: 'var(--admin-text-muted)' }} />
                        </div>
                      )}
                      <span className="font-semibold max-w-[180px] truncate" style={{ color: 'var(--admin-text)' }}>{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm" style={{ color: 'var(--admin-text-muted)' }}>{p.category_name}</td>
                  <td className="px-5 py-3.5 font-semibold" style={{ color: 'var(--admin-text)' }}>₹{Number(p.price).toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3.5" style={{ color: 'var(--admin-text-muted)' }}>{p.discount_price ? `₹${Number(p.discount_price).toLocaleString('en-IN')}` : '—'}</td>
                  <td className="px-5 py-3.5"><StockBadge stock={p.stock} /></td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${p.is_featured ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-500'}`}>
                      {p.is_featured ? '⭐ Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-brand-50 text-brand-600 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteProduct(p.slug, p.name)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="py-16 text-center" style={{ color: 'var(--admin-text-muted)' }}>No products found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && setModal(false)}>
            <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
              className="w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl shadow-2xl"
              style={{ background: 'var(--admin-card-bg)' }}>
              <div className="flex justify-between items-center px-7 pt-7 pb-4 border-b" style={{ borderColor: 'var(--admin-border)' }}>
                <h2 className="text-xl font-heading font-bold" style={{ color: 'var(--admin-text)' }}>
                  {editItem ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button onClick={() => setModal(false)} className="p-2 rounded-xl hover:bg-slate-100 transition-colors" style={{ color: 'var(--admin-text-muted)' }}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-7">
                {formError && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-sm mb-4">{formError}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {[
                    { label: 'Product Name *', name: 'name', type: 'text' },
                    { label: 'URL Slug *', name: 'slug', type: 'text' },
                  ].map(f => (
                    <div key={f.name}>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--admin-text)' }}>{f.label}</label>
                      <input type={f.type} required value={form[f.name]} onChange={e => setForm({ ...form, [f.name]: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-brand-500"
                        style={{ background: 'var(--admin-content-bg)', borderColor: 'var(--admin-border)', color: 'var(--admin-text)' }} />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--admin-text)' }}>Category *</label>
                    <select required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-brand-500"
                      style={{ background: 'var(--admin-content-bg)', borderColor: 'var(--admin-border)', color: 'var(--admin-text)' }}>
                      <option value="">Select category</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--admin-text)' }}>Description *</label>
                    <textarea rows={3} required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-brand-500"
                      style={{ background: 'var(--admin-content-bg)', borderColor: 'var(--admin-border)', color: 'var(--admin-text)' }} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[['Price (₹) *','price',true],['Discount Price (₹)','discount_price',false],['Stock *','stock',true],['Rating (0-5)','rating',false]].map(([lbl,name,req]) => (
                      <div key={name}>
                        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--admin-text)' }}>{lbl}</label>
                        <input type="number" required={req} min="0" step={name === 'rating' ? '0.1' : '1'} max={name === 'rating' ? '5' : undefined}
                          value={form[name]} onChange={e => setForm({ ...form, [name]: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-brand-500"
                          style={{ background: 'var(--admin-content-bg)', borderColor: 'var(--admin-border)', color: 'var(--admin-text)' }} />
                      </div>
                    ))}
                  </div>
                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--admin-text)' }}>Product Image</label>
                    <label htmlFor="prod-img" className="flex flex-col items-center gap-2 p-5 border-2 border-dashed rounded-xl cursor-pointer hover:border-brand-400 transition-colors"
                      style={{ borderColor: 'var(--admin-border)', background: 'var(--admin-content-bg)' }}>
                      {imgFile ? (
                        <>
                          <img src={URL.createObjectURL(imgFile)} alt="Preview" className="w-20 h-20 object-cover rounded-lg" />
                          <span className="text-xs" style={{ color: 'var(--admin-text-muted)' }}>{imgFile.name}</span>
                        </>
                      ) : (
                        <>
                          <ImagePlus className="w-8 h-8" style={{ color: 'var(--admin-text-muted)' }} />
                          <span className="text-sm font-medium" style={{ color: 'var(--admin-text-muted)' }}>Click to upload image</span>
                          <span className="text-xs" style={{ color: 'var(--admin-text-muted)' }}>PNG, JPG, WEBP</span>
                        </>
                      )}
                      <input type="file" id="prod-img" accept="image/*" className="hidden" onChange={e => setImgFile(e.target.files[0])} />
                    </label>
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })} className="w-4 h-4 rounded text-brand-600" />
                    <span className="text-sm font-medium" style={{ color: 'var(--admin-text)' }}>⭐ Feature on Homepage</span>
                  </label>
                  <button type="submit" disabled={formLoading}
                    className="w-full bg-brand-600 text-white font-bold py-3.5 rounded-xl hover:bg-brand-700 transition-all disabled:opacity-60 text-sm">
                    {formLoading ? 'Saving...' : (editItem ? '✅ Update Product' : '➕ Add Product')}
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProducts;
