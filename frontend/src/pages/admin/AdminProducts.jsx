import React, { useState, useEffect, useMemo } from 'react';
import api from '../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit2, Trash2, Search, X, ImagePlus, Package,
  AlertTriangle, CheckCircle, Filter, RefreshCw
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { SkeletonTable } from '../../components/admin/SkeletonLoader';

const API = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8000/api' : '/api');
// NOTE: auth headers injected automatically by api.js interceptor

const EMPTY = { name: '', slug: '', category: '', description: '', price: '', discount_price: '', stock: '', is_featured: false, rating: '4.5' };

const StockBadge = ({ stock }) => {
  if (stock === 0) return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">Out of Stock</span>;
  if (stock < 10) return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700">{stock} Low</span>;
  return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">{stock} In Stock</span>;
};

const AdminProducts = () => {
  const [products, setProducts]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [catFilter, setCatFilter]   = useState('all');
  const [bizFilter, setBizFilter]   = useState('all');
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
      const [p, c, b] = await Promise.all([
        api.get(`/products/`), 
        api.get(`/categories/`),
        api.get(`/businesses/`)
      ]);
      setProducts(p.data.results || p.data); 
      setCategories(c.data.results || c.data);
      let bizList = b.data.results || b.data;
      setBusinesses(bizList.filter(bz => bz.type === 'product'));
    } catch { toast('Failed to load products', 'error'); }
    setLoading(false);
  };
  useEffect(() => { fetchAll(); }, []);

  const openAdd = () => { setEditItem(null); setForm(EMPTY); setImgFile(null); setFormError(''); setModal(true); };

  // Auto-generate slug from product name (only for new products)
  const handleNameChange = (value) => {
    if (!editItem) {
      const autoSlug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      setForm(prev => ({ ...prev, name: value, slug: autoSlug }));
    } else {
      setForm(prev => ({ ...prev, name: value }));
    }
  };

  const openEdit = (p) => {
    setEditItem(p);
    setForm({
      name: p.name,
      slug: p.slug,
      category: String(p.category),   // ensure it's a string to match <select> option values
      description: p.description,
      price: p.price,
      discount_price: p.discount_price || '',
      stock: p.stock,
      is_featured: p.is_featured,
      rating: p.rating,
    });
    setImgFile(null); setFormError(''); setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setFL(true); setFormError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        // Skip empty discount_price
        if (k === 'discount_price' && v === '') return;
        fd.append(k, v);
      });
      if (imgFile) fd.append('image', imgFile);

      if (editItem) {
        await api.patch(`/products/${editItem.slug}/`, fd);
      } else {
        await api.post(`/products/`, fd);
      }
      setModal(false);
      fetchAll();
      toast(editItem ? 'Product updated!' : 'Product added!', 'success');
    } catch (err) {
      const d = err.response?.data;
      if (d && typeof d === 'object') {
        // Format validation errors into human-readable text
        const msgs = Object.entries(d).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join(' | ');
        setFormError(msgs);
      } else {
        setFormError('Failed to save product. Please check all fields and try again.');
      }
    }
    setFL(false);
  };

  const deleteProduct = async (slug, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try { await api.delete(`/products/${slug}/`); fetchAll(); toast('Product deleted', 'warning'); }
    catch { toast('Delete failed', 'error'); }
  };

  const filtered = useMemo(() => {
    let list = products;
    if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    
    // If bizFilter is active, we should filter categories that belong to this business, or filter products by their business
    // p has p.business_name, but p.business might not be there. Let's filter categories first.
    if (bizFilter !== 'all') {
      const allowedCategories = categories.filter(c => String(c.business) === bizFilter).map(c => String(c.id));
      list = list.filter(p => allowedCategories.includes(String(p.category)));
    }
    
    if (catFilter !== 'all') list = list.filter(p => String(p.category) === catFilter);
    return list;
  }, [products, search, catFilter, bizFilter, categories]);

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
        <select value={bizFilter} onChange={e => { setBizFilter(e.target.value); setCatFilter('all'); }}
          className="text-sm px-3 py-2 rounded-xl border outline-none"
          style={{ background: 'var(--admin-content-bg)', borderColor: 'var(--admin-border)', color: 'var(--admin-text)' }}>
          <option value="all">All Businesses</option>
          {businesses.map(b => <option key={b.id} value={String(b.id)}>{b.name}</option>)}
        </select>
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
                {['Product', 'Business / Category', 'Price', 'Discount', 'Stock', 'Featured', 'Actions'].map(h => (
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
                  <td className="px-5 py-3.5 text-sm" style={{ color: 'var(--admin-text-muted)' }}>
                    <div className="font-semibold" style={{ color: 'var(--admin-text)' }}>{p.business_name}</div>
                    <div className="text-xs">{p.category_name}</div>
                  </td>
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

      {/* ── Product Modal (centered, full-screen overlay) ── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            key="modal-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) setModal(false); }}
          >
            <motion.div
              key="modal-card"
              initial={{ opacity: 0, y: -30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 360, damping: 36 }}
              className="w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col"
              style={{ background: 'var(--admin-card-bg)' }}
            >
              {/* ── Modal Header ── */}
              <div className="relative overflow-hidden flex-shrink-0">
                <div className={`absolute inset-0 ${
                  editItem
                    ? 'bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500'
                    : 'bg-gradient-to-br from-indigo-600 via-brand-600 to-purple-700'
                }`} />
                <div className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                />
                <div className="relative px-8 py-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                      {editItem ? <Edit2 className="w-6 h-6 text-white" /> : <Plus className="w-6 h-6 text-white" />}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{editItem ? 'Edit Product' : 'Add New Product'}</h2>
                      <p className="text-white/70 text-sm mt-0.5">
                        {editItem ? `Editing: ${editItem.name}` : 'Fill in the details to add a product to your catalog'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button" onClick={() => setModal(false)}
                      className="px-5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-sm font-semibold transition-all"
                    >Cancel</button>
                    <button
                      form="product-form" type="submit" disabled={formLoading}
                      className={`px-6 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-60 flex items-center gap-2 shadow-lg ${
                        editItem
                          ? 'bg-white/25 hover:bg-white/35 border border-white/30 text-white'
                          : 'bg-white text-indigo-700 hover:bg-indigo-50 shadow-white/30'
                      }`}
                    >
                      {formLoading ? (
                        <><span className={`w-4 h-4 border-2 border-current/40 border-t-current rounded-full animate-spin`} /> Saving...</>
                      ) : editItem ? (
                        <><CheckCircle className="w-4 h-4" /> Update Product</>
                      ) : (
                        <><Plus className="w-4 h-4" /> Add Product</>
                      )}
                    </button>
                    <button
                      onClick={() => setModal(false)}
                      className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all"
                    ><X className="w-5 h-5" /></button>
                  </div>
                </div>
              </div>

              {/* ── Modal Body ── */}
              <div className="overflow-y-auto max-h-[75vh]">
                {formError && (
                  <div className="mx-8 mt-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-sm flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <form id="product-form" onSubmit={handleSubmit} className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* ── LEFT COLUMN: Basic Info ── */}
                    <div className="space-y-6">
                      <div className="rounded-2xl border p-6 space-y-5" style={{ borderColor: 'var(--admin-border)', background: 'var(--admin-content-bg)' }}>
                        <p className="text-xs font-bold uppercase tracking-widest flex items-center gap-2" style={{ color: 'var(--admin-text-muted)' }}>
                          <Package className="w-3.5 h-3.5" /> Basic Information
                        </p>

                        <div>
                          <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--admin-text)' }}>Product Name *</label>
                          <input
                            type="text" required placeholder='e.g. Samsung 55" QLED 4K TV'
                            value={form.name} onChange={e => handleNameChange(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-brand-400"
                            style={{ background: 'var(--admin-card-bg)', borderColor: 'var(--admin-border)', color: 'var(--admin-text)' }}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--admin-text)' }}>
                              URL Slug {!editItem && <span className="text-brand-400 font-normal text-xs">auto</span>}
                            </label>
                            <input
                              type="text" required placeholder="product-url-slug"
                              value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })}
                              readOnly={!editItem}
                              className="w-full px-4 py-3 rounded-xl border text-sm outline-none font-mono"
                              style={{ background: 'var(--admin-card-bg)', borderColor: 'var(--admin-border)', color: 'var(--admin-text-muted)', opacity: editItem ? 1 : 0.65 }}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--admin-text)' }}>Category *</label>
                            <select
                              required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-brand-400"
                              style={{ background: 'var(--admin-card-bg)', borderColor: 'var(--admin-border)', color: 'var(--admin-text)' }}
                            >
                              <option value="">— Select —</option>
                              {categories.map(c => <option key={c.id} value={c.id}>{c.name}{c.business_name ? ` (${c.business_name})` : ''}</option>)}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--admin-text)' }}>Description *</label>
                          <textarea
                            rows={5} required placeholder="Describe the product in detail..."
                            value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none focus:ring-2 focus:ring-brand-400"
                            style={{ background: 'var(--admin-card-bg)', borderColor: 'var(--admin-border)', color: 'var(--admin-text)' }}
                          />
                        </div>
                      </div>

                      {/* Featured toggle */}
                      <label
                        className="flex items-center justify-between p-5 rounded-2xl border cursor-pointer transition-all hover:shadow-md"
                        style={{
                          borderColor: form.is_featured ? '#818cf8' : 'var(--admin-border)',
                          background: form.is_featured ? 'linear-gradient(135deg, #eef2ff, #f5f3ff)' : 'var(--admin-content-bg)'
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl" style={{ background: form.is_featured ? '#e0e7ff' : 'var(--admin-content-bg)' }}>⭐</div>
                          <div>
                            <p className="text-sm font-bold" style={{ color: 'var(--admin-text)' }}>Feature on Homepage</p>
                            <p className="text-xs" style={{ color: 'var(--admin-text-muted)' }}>Show in the featured products carousel</p>
                          </div>
                        </div>
                        <div className={`w-13 h-7 rounded-full relative transition-all ${form.is_featured ? 'bg-indigo-500' : 'bg-slate-200'}`} style={{ width: 52, height: 28 }}>
                          <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${form.is_featured ? 'left-[22px]' : 'left-1'}`} />
                        </div>
                        <input type="checkbox" className="hidden" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })} />
                      </label>
                    </div>

                    {/* ── RIGHT COLUMN: Pricing & Image ── */}
                    <div className="space-y-6">
                      <div className="rounded-2xl border p-6 space-y-5" style={{ borderColor: 'var(--admin-border)', background: 'var(--admin-content-bg)' }}>
                        <p className="text-xs font-bold uppercase tracking-widest flex items-center gap-2" style={{ color: 'var(--admin-text-muted)' }}>
                          <Filter className="w-3.5 h-3.5" /> Pricing & Inventory
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { label: 'Price (₹) *', name: 'price', req: true, placeholder: '999' },
                            { label: 'Discount Price (₹)', name: 'discount_price', req: false, placeholder: '799' },
                            { label: 'Stock Qty *', name: 'stock', req: true, placeholder: '100' },
                            { label: 'Rating (0-5)', name: 'rating', req: false, placeholder: '4.5' },
                          ].map(({ label, name, req, placeholder }) => (
                            <div key={name}>
                              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--admin-text)' }}>{label}</label>
                              <input
                                type="number" required={req} min="0" placeholder={placeholder}
                                step={name === 'rating' ? '0.1' : '1'} max={name === 'rating' ? '5' : undefined}
                                value={form[name]} onChange={e => setForm({ ...form, [name]: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-brand-400"
                                style={{ background: 'var(--admin-card-bg)', borderColor: 'var(--admin-border)', color: 'var(--admin-text)' }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Image Upload */}
                      <div className="rounded-2xl border p-6 space-y-4" style={{ borderColor: 'var(--admin-border)', background: 'var(--admin-content-bg)' }}>
                        <p className="text-xs font-bold uppercase tracking-widest flex items-center gap-2" style={{ color: 'var(--admin-text-muted)' }}>
                          <ImagePlus className="w-3.5 h-3.5" /> Product Image
                        </p>
                        <label
                          htmlFor="prod-img"
                          className="group flex flex-col items-center justify-center gap-4 p-10 border-2 border-dashed rounded-2xl cursor-pointer transition-all hover:border-brand-400 hover:bg-brand-50/30"
                          style={{ borderColor: imgFile ? '#818cf8' : 'var(--admin-border)', background: imgFile ? '#eef2ff' : 'var(--admin-card-bg)' }}
                        >
                          {imgFile ? (
                            <>
                              <img src={URL.createObjectURL(imgFile)} alt="Preview"
                                className="w-28 h-28 object-cover rounded-2xl shadow-lg ring-4 ring-white" />
                              <div className="text-center">
                                <p className="text-sm font-bold text-indigo-700">Image ready!</p>
                                <p className="text-xs text-indigo-500 mt-0.5 truncate max-w-[200px]">{imgFile.name}</p>
                                <p className="text-xs text-indigo-400 mt-1">Click to change</p>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <ImagePlus className="w-8 h-8 text-slate-400" />
                              </div>
                              <div className="text-center">
                                <p className="text-sm font-bold" style={{ color: 'var(--admin-text)' }}>Upload Product Image</p>
                                <p className="text-xs mt-1" style={{ color: 'var(--admin-text-muted)' }}>Click or drag & drop</p>
                                <p className="text-xs mt-0.5 opacity-60" style={{ color: 'var(--admin-text-muted)' }}>PNG, JPG, WEBP • Max 5MB</p>
                              </div>
                            </>
                          )}
                          <input type="file" id="prod-img" accept="image/*" className="hidden" onChange={e => setImgFile(e.target.files[0])} />
                        </label>
                      </div>
                    </div>

                  </div>
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

