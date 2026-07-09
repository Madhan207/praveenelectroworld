import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HeartHandshake, Image as ImageIcon, Users, Calendar, Plus, Edit2, Trash2, Heart, MessageSquare } from 'lucide-react';
import { SkeletonTable } from '../../components/admin/SkeletonLoader';

const API = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8000/api' : '/api');
const getHeaders = () => {
  const token = sessionStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const AdminTrustManagement = () => {
  const [businesses, setBusinesses] = useState([]);
  const [selectedBizId, setSelectedBizId] = useState('all');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('programs');
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    axios.get(`${API}/businesses/`, { headers: getHeaders() })
      .then(res => {
        const list = res.data.results || res.data;
        setBusinesses(list.filter(b => b.type === 'trust'));
        if (list.filter(b => b.type === 'trust').length > 0) {
          setSelectedBizId(list.filter(b => b.type === 'trust')[0].id);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (activeTab === 'donations' && selectedBizId && selectedBizId !== 'all') {
      axios.get(`${API}/donations/?business=${selectedBizId}`, { headers: getHeaders() })
        .then(res => setDonations(res.data.results || res.data))
        .catch(console.error);
    }
  }, [activeTab, selectedBizId]);

  const updateDonationStatus = async (id, newStatus) => {
    try {
      await axios.patch(`${API}/donations/${id}/`, { status: newStatus }, { headers: getHeaders() });
      setDonations(prev => prev.map(d => d.id === id ? { ...d, status: newStatus } : d));
    } catch (err) {
      console.error('Failed to update donation status:', err);
      alert('Failed to update donation status');
    }
  };

  if (loading) return <SkeletonTable rows={5} cols={4} />;

  if (businesses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <HeartHandshake className="w-16 h-16 text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-700">No Trust Organizations Found</h2>
        <p className="text-slate-500 mt-2">Create a trust business first to manage programs and events.</p>
      </div>
    );
  }

  const activeBusinessObj = businesses.find(b => String(b.id) === String(selectedBizId)) || businesses[0];

  const tabs = [
    { id: 'programs', label: 'Programs', icon: HeartHandshake },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'donations', label: 'Donations', icon: Heart },
    { id: 'volunteers', label: 'Volunteers', icon: Users },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'team', label: 'Board Members', icon: Users },
    { id: 'testimonials', label: 'Impact Stories', icon: MessageSquare },
  ];

  const renderDataTab = (dataArray, columns, emptyMsg) => {
    if (!dataArray || dataArray.length === 0) {
      return (
        <div className="text-center py-12 border-2 border-dashed rounded-xl" style={{ borderColor: 'var(--admin-border)' }}>
          <p className="text-slate-500">{emptyMsg}</p>
          <button className="mt-4 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700">
            Add New {activeTab.slice(0, -1)}
          </button>
        </div>
      );
    }
    return (
      <div className="overflow-x-auto border rounded-xl" style={{ borderColor: 'var(--admin-border)' }}>
        <table className="w-full text-sm text-left">
          <thead style={{ background: 'var(--admin-content-bg)' }}>
            <tr>
              {columns.map(c => <th key={c.key} className="px-5 py-3 font-semibold text-xs uppercase tracking-wider text-slate-500">{c.label}</th>)}
              <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wider text-right text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dataArray.map((item, i) => (
              <tr key={i} className="border-t hover:bg-slate-50" style={{ borderColor: 'var(--admin-border)' }}>
                {columns.map(c => (
                  <td key={c.key} className="px-5 py-3">
                    {c.isImage && item[c.key] ? (
                      <img src={item[c.key]} alt="thumbnail" className="w-10 h-10 rounded object-cover border" />
                    ) : c.isDate ? (
                      <span className="text-slate-600">{new Date(item[c.key]).toLocaleDateString()}</span>
                    ) : (
                      <span className="font-medium text-slate-700">{item[c.key] || '-'}</span>
                    )}
                  </td>
                ))}
                <td className="px-5 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></button>
                    <button className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold" style={{ color: 'var(--admin-text)' }}>Trust Management</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--admin-text-muted)' }}>Managing content for {activeBusinessObj?.name}</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={selectedBizId} 
            onChange={e => setSelectedBizId(e.target.value)}
            className="px-4 py-2 border rounded-xl bg-white text-sm font-semibold outline-none focus:ring-2 focus:ring-orange-500 min-w-48"
            style={{ borderColor: 'var(--admin-border)', color: 'var(--admin-text)' }}
          >
            {businesses.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
          {!['donations', 'volunteers'].includes(activeTab) && (
            <button className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl bg-orange-600 text-white font-semibold hover:bg-orange-700 transition-colors shadow">
              <Plus className="w-4 h-4" /> Add New
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar border-b" style={{ borderColor: 'var(--admin-border)' }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors border-b-2 ${
              activeTab === t.id 
                ? 'text-orange-600 border-orange-600 bg-orange-50/50' 
                : 'text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      <div className="admin-card p-6 min-h-[400px]">
        {activeTab === 'programs' && renderDataTab(
          activeBusinessObj.services_data, 
          [{ key: 'title', label: 'Program Name' }, { key: 'image', label: 'Image', isImage: true }],
          'No programs defined yet.'
        )}
        
        {activeTab === 'events' && renderDataTab(
          activeBusinessObj.events_data, 
          [{ key: 'title', label: 'Event Name' }, { key: 'date', label: 'Date', isDate: true }, { key: 'location', label: 'Location' }],
          'No upcoming events.'
        )}
        
        {activeTab === 'gallery' && renderDataTab(
          activeBusinessObj.gallery_data, 
          [{ key: 'url', label: 'Image', isImage: true }, { key: 'caption', label: 'Caption' }],
          'Gallery is empty.'
        )}
        
        {activeTab === 'team' && renderDataTab(
          activeBusinessObj.team_data, 
          [{ key: 'name', label: 'Name' }, { key: 'role', label: 'Position' }, { key: 'image', label: 'Photo', isImage: true }],
          'No board members added.'
        )}

        {activeTab === 'testimonials' && renderDataTab(
          activeBusinessObj.testimonials_data, 
          [{ key: 'name', label: 'Beneficiary/Donor' }, { key: 'text', label: 'Story' }],
          'No impact stories added.'
        )}

        {activeTab === 'donations' && (
          donations.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">No donations recorded yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto border rounded-xl" style={{ borderColor: 'var(--admin-border)' }}>
              <table className="w-full text-sm text-left">
                <thead style={{ background: 'var(--admin-content-bg)' }}>
                  <tr>
                    <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wider text-slate-500">Donor</th>
                    <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wider text-slate-500">Contact</th>
                    <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wider text-slate-500">Amount</th>
                    <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wider text-slate-500">Transaction ID</th>
                    <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wider text-slate-500">Screenshot</th>
                    <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wider text-slate-500">Status</th>
                    <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wider text-right text-slate-500">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((d, i) => {
                    const imgUrl = d.payment_screenshot ? (d.payment_screenshot.startsWith('http') ? d.payment_screenshot : `http://localhost:8000${d.payment_screenshot}`) : null;
                    return (
                      <tr key={i} className="border-t hover:bg-slate-50" style={{ borderColor: 'var(--admin-border)' }}>
                        <td className="px-5 py-3 font-medium text-slate-700">{d.donor_name}</td>
                        <td className="px-5 py-3 text-slate-600">{d.donor_email}<br/><span className="text-xs text-slate-400">{d.donor_phone}</span></td>
                        <td className="px-5 py-3 font-bold text-green-600">₹{Number(d.amount).toLocaleString('en-IN')}</td>
                        <td className="px-5 py-3 font-mono text-slate-600">{d.transaction_id || '-'}</td>
                        <td className="px-5 py-3">
                          {imgUrl ? (
                            <a href={imgUrl} target="_blank" rel="noopener noreferrer">
                              <img src={imgUrl} alt="Proof" className="w-12 h-12 rounded object-cover border hover:scale-105 transition-transform" />
                            </a>
                          ) : '-'}
                        </td>
                        <td className="px-5 py-3">
                          <select
                            value={d.status}
                            onChange={(e) => updateDonationStatus(d.id, e.target.value)}
                            className={`px-2 py-1 rounded-lg text-xs font-bold border outline-none cursor-pointer ${d.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' : d.status === 'Failed' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                            <option value="Failed">Failed</option>
                          </select>
                        </td>
                        <td className="px-5 py-3 text-right text-slate-500">{new Date(d.created_at).toLocaleDateString('en-IN')}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        )}
        
        {activeTab === 'volunteers' && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No volunteer applications found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTrustManagement;
