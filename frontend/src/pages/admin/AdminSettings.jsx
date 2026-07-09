import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { UserPlus, Eye, EyeOff, Shield, Settings, Bell, Store, Lock, CheckCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const API = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8000/api' : '/api');
const authH = () => ({ headers: { Authorization: `Bearer ${sessionStorage.getItem('access_token')}` } });

const EMPTY = { name: '', email: '', mobile_number: '', password: '', confirm_password: '' };

const AdminSettings = () => {
  const [activeTab, setTab] = useState('admin');
  const [form, setForm]     = useState(EMPTY);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm_password) { toast('Passwords do not match', 'error'); return; }
    if (form.password.length < 6) { toast('Password must be at least 6 characters', 'error'); return; }
    setLoading(true);
    try {
      await axios.post(`${API}/auth/create-admin/`, {
        name: form.name, email: form.email, mobile_number: form.mobile_number, password: form.password,
      }, authH());
      toast(`Admin "${form.name}" created successfully!`, 'success');
      setForm(EMPTY);
    } catch (err) {
      const d = err.response?.data;
      if (d?.email) toast('Email already exists', 'error');
      else if (d?.mobile_number) toast('Mobile number already exists', 'error');
      else toast(d?.detail || 'Failed to create admin', 'error');
    }
    setLoading(false);
  };

  const TABS = [
    { id: 'admin',    label: 'Create Admin',    icon: UserPlus },
    { id: 'store',    label: 'Store Settings',  icon: Store },
    { id: 'security', label: 'Security',        icon: Lock },
    { id: 'notify',   label: 'Notifications',   icon: Bell },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-heading font-bold" style={{ color: 'var(--admin-text)' }}>Settings</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--admin-text-muted)' }}>Manage store configuration and admin accounts</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === t.id ? 'bg-brand-600 text-white shadow' : 'hover:bg-slate-100'}`}
              style={activeTab !== t.id ? { color: 'var(--admin-text-muted)', background: 'var(--admin-card-bg)', border: `1px solid var(--admin-border)` } : {}}>
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Create Admin */}
      {activeTab === 'admin' && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl">
          <div className="admin-card p-7">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-heading font-bold" style={{ color: 'var(--admin-text)' }}>Create Admin Account</h2>
                <p className="text-sm" style={{ color: 'var(--admin-text-muted)' }}>Grant full dashboard access to a new admin</p>
              </div>
            </div>
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              {[
                { label: 'Full Name', name: 'name', type: 'text', ph: 'Admin Full Name' },
                { label: 'Email Address', name: 'email', type: 'email', ph: 'admin@example.com' },
                { label: 'Mobile Number', name: 'mobile_number', type: 'tel', ph: '10-digit mobile' },
              ].map(f => (
                <div key={f.name}>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--admin-text)' }}>{f.label}</label>
                  <input type={f.type} required placeholder={f.ph} value={form[f.name]}
                    onChange={e => setForm({ ...form, [f.name]: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-brand-500"
                    style={{ background: 'var(--admin-content-bg)', borderColor: 'var(--admin-border)', color: 'var(--admin-text)' }} />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--admin-text)' }}>Password</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} required minLength={6} placeholder="Min. 6 characters" value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    className="w-full px-4 py-2.5 pr-12 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-brand-500"
                    style={{ background: 'var(--admin-content-bg)', borderColor: 'var(--admin-border)', color: 'var(--admin-text)' }} />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors" style={{ color: 'var(--admin-text-muted)' }}>
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--admin-text)' }}>Confirm Password</label>
                <input type="password" required placeholder="Re-enter password" value={form.confirm_password}
                  onChange={e => setForm({ ...form, confirm_password: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-brand-500"
                  style={{ background: 'var(--admin-content-bg)', borderColor: 'var(--admin-border)', color: 'var(--admin-text)' }} />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-brand-600 text-white font-bold py-3 rounded-xl hover:bg-brand-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                <UserPlus className="w-4 h-4" />
                {loading ? 'Creating...' : 'Create Admin Account'}
              </button>
            </form>
          </div>
        </motion.div>
      )}

      {/* Store Settings (static UI) */}
      {activeTab === 'store' && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl">
          <div className="admin-card p-7 space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-700 flex items-center justify-center shadow">
                <Store className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-heading font-bold" style={{ color: 'var(--admin-text)' }}>Store Settings</h2>
                <p className="text-sm" style={{ color: 'var(--admin-text-muted)' }}>General store configuration</p>
              </div>
            </div>
            {[
              { label: 'Store Name', value: 'PraveenElectro World' },
              { label: 'Store Email', value: 'contact@praveenelectro.com' },
              { label: 'Store Phone', value: '+91 98765 43210' },
              { label: 'Store Address', value: 'Chennai, Tamil Nadu, India' },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--admin-text)' }}>{f.label}</label>
                <input type="text" defaultValue={f.value}
                  className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-brand-500"
                  style={{ background: 'var(--admin-content-bg)', borderColor: 'var(--admin-border)', color: 'var(--admin-text)' }} />
              </div>
            ))}
            <button className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-sm hover:bg-brand-700 transition-colors">
              Save Settings
            </button>
          </div>
        </motion.div>
      )}

      {/* Security */}
      {activeTab === 'security' && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl">
          <div className="admin-card p-7">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-500 to-teal-700 flex items-center justify-center shadow">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-heading font-bold" style={{ color: 'var(--admin-text)' }}>Security</h2>
                <p className="text-sm" style={{ color: 'var(--admin-text-muted)' }}>Security features are active</p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { label: 'JWT Authentication', desc: 'Secure token-based login — Active', ok: true },
                { label: 'Role-based Access Control', desc: 'Admin/User separation enforced', ok: true },
                { label: 'CORS Protection', desc: 'Cross-origin requests controlled', ok: true },
                { label: 'Password Hashing', desc: 'Django PBKDF2 + SHA256', ok: true },
                { label: 'CSRF Protection', desc: 'Django CSRF middleware active', ok: true },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-3 p-3 rounded-xl border" style={{ borderColor: 'var(--admin-border)' }}>
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm" style={{ color: 'var(--admin-text)' }}>{item.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--admin-text-muted)' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Notifications */}
      {activeTab === 'notify' && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl">
          <div className="admin-card p-7">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-heading font-bold" style={{ color: 'var(--admin-text)' }}>Notification Settings</h2>
                <p className="text-sm" style={{ color: 'var(--admin-text-muted)' }}>Configure admin notifications</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                'New order placed', 'Payment verification required', 'Low stock alert', 'Order delivered', 'New user registered',
              ].map(label => (
                <label key={label} className="flex items-center justify-between p-3 rounded-xl border cursor-pointer hover:border-brand-400 transition-colors" style={{ borderColor: 'var(--admin-border)' }}>
                  <span className="text-sm font-medium" style={{ color: 'var(--admin-text)' }}>{label}</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-brand-600" />
                </label>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminSettings;
