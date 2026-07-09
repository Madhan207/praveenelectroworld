import React, { useState } from 'react';
import { Shield, AlertTriangle, Clock, RefreshCw, Key, User, Edit, ShoppingCart, LogIn, Filter } from 'lucide-react';
import { useBusinessContext } from '../../context/BusinessContext';

const DUMMY_LOGS = [
  { id: 1, type: 'login', user: 'Admin User', role: 'Super Admin', action: 'Logged in from IP 192.168.1.45', time: '10 mins ago', date: '2026-07-02 14:15:00', icon: LogIn, color: 'text-blue-500', bg: 'bg-blue-100', business: 'all' },
  { id: 2, type: 'product', user: 'Inventory Mgr', role: 'Staff', action: 'Updated price for "Sony Headphones"', time: '1 hour ago', date: '2026-07-02 13:20:00', icon: Edit, color: 'text-orange-500', bg: 'bg-orange-100', business: 'praveen-electro-world' },
  { id: 3, type: 'order', user: 'Sales Rep', role: 'Staff', action: 'Cancelled Order #1040', time: '2 hours ago', date: '2026-07-02 12:05:00', icon: ShoppingCart, color: 'text-red-500', bg: 'bg-red-100', business: 'praveen-electro-world' },
  { id: 4, type: 'security', user: 'System', role: 'System', action: 'Failed login attempt from IP 104.22.14.8', time: '5 hours ago', date: '2026-07-02 09:15:00', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-100', business: 'all' },
  { id: 5, type: 'service', user: 'Event Mgr', role: 'Staff', action: 'Added new service "Premium Wedding DJ"', time: '1 day ago', date: '2026-07-01 16:30:00', icon: Edit, color: 'text-purple-500', bg: 'bg-purple-100', business: 'praveen-dj-events' },
  { id: 6, type: 'trust', user: 'Trust Mgr', role: 'Staff', action: 'Approved 5 volunteer applications', time: '1 day ago', date: '2026-07-01 11:20:00', icon: User, color: 'text-green-500', bg: 'bg-green-100', business: 'praveen-welfare-trust' },
];

const AdminSecurityLogs = () => {
  const { selectedBusiness } = useBusinessContext();
  const [filter, setFilter] = useState('all'); // all, security, product, order, login
  const [loading, setLoading] = useState(false);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  const filteredLogs = DUMMY_LOGS.filter(log => {
    // Business filter: show 'all' business logs (system wide) + specific business logs
    const matchesBiz = selectedBusiness === 'all' || log.business === 'all' || log.business === selectedBusiness;
    // Type filter
    const matchesType = filter === 'all' || log.type === filter;
    
    return matchesBiz && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold" style={{ color: 'var(--admin-text)' }}>Security & Activity Logs</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--admin-text-muted)' }}>Monitor system activities and security events</p>
        </div>
        <button 
          onClick={handleRefresh}
          className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl border hover:border-brand-400 hover:text-brand-600 transition-all bg-white shadow-sm"
          style={{ borderColor: 'var(--admin-border)' }}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Logs
        </button>
      </div>

      <div className="admin-card overflow-hidden">
        <div className="p-4 border-b flex flex-wrap gap-4 items-center justify-between" style={{ borderColor: 'var(--admin-border)' }}>
          <div className="flex bg-slate-100 rounded-lg p-1 border" style={{ borderColor: 'var(--admin-border)' }}>
            {[
              { id: 'all', label: 'All Activities' },
              { id: 'security', label: 'Security Alerts' },
              { id: 'login', label: 'Logins' },
              { id: 'product', label: 'Products/Services' },
              { id: 'order', label: 'Orders/Bookings' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  filter === f.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border bg-white hover:bg-slate-50 font-medium" style={{ borderColor: 'var(--admin-border)' }}>
            <Filter className="w-4 h-4" /> Filter by Date
          </button>
        </div>

        <div className="p-0">
          {filteredLogs.length > 0 ? (
            <div className="divide-y" style={{ borderColor: 'var(--admin-border)' }}>
              {filteredLogs.map(log => (
                <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors flex gap-4 items-start">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${log.bg} ${log.color}`}>
                    <log.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{log.action}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-medium"><User className="w-3.5 h-3.5" /> {log.user} ({log.role})</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {log.date}</span>
                      {log.business !== 'all' && (
                        <span className="bg-slate-100 px-2 py-0.5 rounded font-mono text-[10px] uppercase border" style={{ borderColor: 'var(--admin-border)' }}>
                          {log.business.replace(/-/g, ' ')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0 text-xs text-slate-400 font-medium">
                    {log.time}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <Shield className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">No logs found for this filter in the current context.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSecurityLogs;
