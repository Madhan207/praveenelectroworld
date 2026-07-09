import React, { useState } from 'react';
import { useBusinessContext } from '../../context/BusinessContext';
import { Truck, Image as ImageIcon, Users, MessageSquare, Plus, Edit2, Trash2, Map, Package } from 'lucide-react';
import { SkeletonTable } from '../../components/admin/SkeletonLoader';

const AdminTransportManagement = () => {
  const { activeBusinessObj, loading } = useBusinessContext();
  const [activeTab, setActiveTab] = useState('services');

  if (loading) return <SkeletonTable rows={5} cols={4} />;

  if (!activeBusinessObj || activeBusinessObj.type !== 'logistics') {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Truck className="w-16 h-16 text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-700">Not a Logistics Business</h2>
        <p className="text-slate-500 mt-2">Please select a Logistics company (e.g., Praveen Transports) from the top menu.</p>
      </div>
    );
  }

  const tabs = [
    { id: 'services', label: 'Services', icon: Truck },
    { id: 'fleet', label: 'Fleet & Pricing', icon: Package },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'testimonials', label: 'Reviews', icon: MessageSquare },
    { id: 'quotes', label: 'Quote Requests', icon: Map },
  ];

  const renderDataTab = (dataArray, columns, emptyMsg) => {
    if (!dataArray || dataArray.length === 0) {
      return (
        <div className="text-center py-12 border-2 border-dashed rounded-xl" style={{ borderColor: 'var(--admin-border)' }}>
          <p className="text-slate-500">{emptyMsg}</p>
          <button className="mt-4 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700">
            Add New Item
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
                    ) : c.isArray ? (
                      <span className="text-xs text-slate-500">{item[c.key]?.length || 0} items</span>
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold" style={{ color: 'var(--admin-text)' }}>Transport & Logistics Management</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--admin-text-muted)' }}>Managing content for {activeBusinessObj.name}</p>
        </div>
        {!['quotes'].includes(activeTab) && (
          <button className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl bg-yellow-600 text-white font-semibold hover:bg-yellow-700 transition-colors shadow">
            <Plus className="w-4 h-4" /> Add New
          </button>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar border-b" style={{ borderColor: 'var(--admin-border)' }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors border-b-2 ${
              activeTab === t.id 
                ? 'text-yellow-600 border-yellow-600 bg-yellow-50/50' 
                : 'text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      <div className="admin-card p-6 min-h-[400px]">
        {activeTab === 'services' && renderDataTab(
          activeBusinessObj.services_data, 
          [{ key: 'title', label: 'Service Name' }, { key: 'image', label: 'Image', isImage: true }],
          'No services defined yet.'
        )}
        
        {activeTab === 'fleet' && renderDataTab(
          activeBusinessObj.packages_data, 
          [{ key: 'name', label: 'Vehicle Type' }, { key: 'price', label: 'Base Rate' }, { key: 'features', label: 'Specs', isArray: true }],
          'No fleet/pricing defined yet.'
        )}
        
        {activeTab === 'gallery' && renderDataTab(
          activeBusinessObj.gallery_data, 
          [{ key: 'url', label: 'Image', isImage: true }, { key: 'caption', label: 'Caption' }],
          'Gallery is empty.'
        )}
        
        {activeTab === 'team' && renderDataTab(
          activeBusinessObj.team_data, 
          [{ key: 'name', label: 'Name' }, { key: 'role', label: 'Role' }, { key: 'image', label: 'Photo', isImage: true }],
          'No team members added.'
        )}

        {activeTab === 'testimonials' && renderDataTab(
          activeBusinessObj.testimonials_data, 
          [{ key: 'name', label: 'Client' }, { key: 'rating', label: 'Rating' }, { key: 'text', label: 'Review' }],
          'No reviews added.'
        )}

        {activeTab === 'quotes' && (
          <div className="text-center py-12">
            <Map className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No quote requests found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTransportManagement;
