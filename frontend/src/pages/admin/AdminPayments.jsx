import React, { useState, useEffect } from 'react';
import { useBusinessContext } from '../../context/BusinessContext';
import { CreditCard, Smartphone, Banknote, Landmark, Save, Wallet, RefreshCw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const PAYMENT_METHODS = [
  { id: 'cod', label: 'Cash on Delivery', icon: Banknote, desc: 'Allow customers to pay upon delivery' },
  { id: 'upi', label: 'UPI / QR', icon: Smartphone, desc: 'Google Pay, PhonePe, Paytm, etc.' },
  { id: 'cards', label: 'Credit / Debit Cards', icon: CreditCard, desc: 'Visa, Mastercard, RuPay' },
  { id: 'netbanking', label: 'Net Banking', icon: Landmark, desc: 'Direct bank account transfers' },
  { id: 'wallets', label: 'Wallets', icon: Wallet, desc: 'Amazon Pay, MobiKwik, Freecharge' },
  { id: 'emi', label: 'EMI Options', icon: CreditCard, desc: 'Pay later and installment options' },
];

const AdminPayments = () => {
  const { activeBusinessObj, selectedBusiness, loading } = useBusinessContext();
  const { toast } = useToast();
  
  // State for configuration (saved in localStorage for now as per plan)
  const [config, setConfig] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (selectedBusiness !== 'all') {
      const saved = localStorage.getItem(`paymentConfig_${selectedBusiness}`);
      if (saved) {
        setConfig(JSON.parse(saved));
      } else {
        // Default config based on business type
        const isTrust = activeBusinessObj?.type === 'trust';
        setConfig({
          cod: !isTrust,
          upi: true,
          cards: true,
          netbanking: true,
          wallets: !isTrust,
          emi: false,
        });
      }
    }
  }, [selectedBusiness, activeBusinessObj]);

  const handleToggle = (id) => {
    setConfig(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = () => {
    if (selectedBusiness === 'all') return;
    setSaving(true);
    setTimeout(() => {
      localStorage.setItem(`paymentConfig_${selectedBusiness}`, JSON.stringify(config));
      toast('Payment configuration saved successfully!', 'success');
      setSaving(false);
    }, 600);
  };

  if (loading) return <div>Loading...</div>;

  if (selectedBusiness === 'all') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <CreditCard className="w-16 h-16 text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-700">Select a specific business</h2>
        <p className="text-slate-500 mt-2 max-w-md mx-auto">
          Payment configurations are unique to each business. Please select a specific business from the top menu to configure its payment methods.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold" style={{ color: 'var(--admin-text)' }}>Payment Settings</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--admin-text-muted)' }}>
            Configuring payment methods for: <span className="font-semibold">{activeBusinessObj?.name}</span>
          </p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 text-sm px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700 transition-colors shadow disabled:opacity-70"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PAYMENT_METHODS.map(method => {
          const isEnabled = config[method.id] || false;
          return (
            <div 
              key={method.id} 
              className={`admin-card p-5 border-2 transition-all ${isEnabled ? 'border-brand-500 ring-2 ring-brand-500/10' : 'border-transparent opacity-80'}`}
              onClick={() => handleToggle(method.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isEnabled ? 'bg-brand-100 text-brand-600' : 'bg-slate-100 text-slate-400'}`}>
                  <method.icon className="w-6 h-6" />
                </div>
                {/* Custom Toggle Switch */}
                <div 
                  className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer ${isEnabled ? 'bg-brand-500' : 'bg-slate-300'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${isEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </div>
              <h3 className="font-bold text-lg" style={{ color: 'var(--admin-text)' }}>{method.label}</h3>
              <p className="text-xs mt-1" style={{ color: 'var(--admin-text-muted)' }}>{method.desc}</p>
              
              <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--admin-border)' }}>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${isEnabled ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                  {isEnabled ? 'Active' : 'Disabled'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminPayments;
