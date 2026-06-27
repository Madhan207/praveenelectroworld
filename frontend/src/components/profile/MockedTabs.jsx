import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MapPin, CreditCard, Tag, Bell, Star, Settings, ShieldCheck, Plus, Trash2, Edit2, ShoppingCart } from 'lucide-react';

const EmptyState = ({ icon: Icon, title, desc, action }) => (
  <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
      <Icon className="w-12 h-12 text-slate-300" />
    </div>
    <h3 className="text-2xl font-bold text-slate-900 mb-2 font-heading">{title}</h3>
    <p className="text-slate-500 max-w-md mx-auto mb-8">{desc}</p>
    {action && (
      <button className="bg-brand-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-brand-700 transition-colors shadow-md shadow-brand-500/20">
        {action}
      </button>
    )}
  </div>
);

export const WishlistTab = () => (
  <EmptyState 
    icon={Heart} 
    title="Your Wishlist is Empty" 
    desc="Save items you like in your wishlist. Review them anytime and easily move them to cart."
    action="Discover Products"
  />
);

export const AddressesTab = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-heading font-bold text-slate-900">Saved Addresses</h2>
      <button className="flex items-center gap-2 text-brand-600 font-bold bg-brand-50 px-4 py-2 rounded-xl hover:bg-brand-100 transition-colors">
        <Plus className="w-4 h-4" /> Add New
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Mock Address 1 */}
      <div className="bg-white p-6 rounded-2xl border-2 border-brand-500 shadow-sm relative">
        <span className="absolute top-4 right-4 bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-full">DEFAULT</span>
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-5 h-5 text-brand-500" />
          <h3 className="font-bold text-slate-900">Home</h3>
        </div>
        <p className="text-slate-600 text-sm leading-relaxed mb-4">
          <span className="font-semibold text-slate-900">User Name</span><br />
          123, Tech Park Avenue, Cyber City<br />
          Block B, 4th Floor<br />
          Bangalore, Karnataka - 560001<br />
          Phone: +91 9876543210
        </p>
        <div className="flex gap-4 pt-4 border-t border-slate-100">
          <button className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"><Edit2 className="w-4 h-4"/> Edit</button>
          <button className="text-sm font-semibold text-red-500 hover:text-red-600 flex items-center gap-1"><Trash2 className="w-4 h-4"/> Delete</button>
        </div>
      </div>

      {/* Add New Box */}
      <div className="bg-slate-50 p-6 rounded-2xl border-2 border-dashed border-slate-200 hover:border-brand-400 hover:bg-brand-50 transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[200px] text-brand-600">
        <Plus className="w-8 h-8 mb-2 opacity-50" />
        <p className="font-bold">Add New Address</p>
      </div>
    </div>
  </div>
);

export const PaymentsTab = () => (
  <EmptyState 
    icon={CreditCard} 
    title="No Saved Payment Methods" 
    desc="Save your credit, debit cards or UPI IDs during checkout for faster payments."
  />
);

export const CouponsTab = () => (
  <EmptyState 
    icon={Tag} 
    title="No Active Coupons" 
    desc="You don't have any coupons right now. Keep shopping to earn exciting rewards!"
  />
);

export const NotificationsTab = () => (
  <EmptyState 
    icon={Bell} 
    title="All Caught Up!" 
    desc="You have no new notifications. We'll let you know when there are updates on your orders or new offers."
  />
);

export const ReviewsTab = () => (
  <EmptyState 
    icon={Star} 
    title="No Reviews Yet" 
    desc="Share your experience with other customers by reviewing products you've purchased."
  />
);

export const SettingsTab = () => (
  <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
    <h2 className="text-2xl font-heading font-bold text-slate-900 mb-6 flex items-center gap-2">
      <Settings className="w-6 h-6 text-brand-500" /> Account Settings
    </h2>
    <div className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
          <input type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-brand-500 transition-colors" defaultValue="User Name" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
          <input type="email" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-brand-500 transition-colors" defaultValue="user@example.com" disabled />
        </div>
      </div>
      <button className="bg-brand-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-brand-700 transition-colors shadow-md shadow-brand-500/20">
        Save Changes
      </button>
    </div>
  </div>
);

export const SecurityTab = () => (
  <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
    <h2 className="text-2xl font-heading font-bold text-slate-900 mb-6 flex items-center gap-2">
      <ShieldCheck className="w-6 h-6 text-green-500" /> Security
    </h2>
    <div className="space-y-8 max-w-xl">
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Change Password</h3>
        <div className="space-y-4">
          <input type="password" placeholder="Current Password" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-brand-500 transition-colors" />
          <input type="password" placeholder="New Password" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-brand-500 transition-colors" />
          <input type="password" placeholder="Confirm New Password" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-brand-500 transition-colors" />
          <button className="bg-slate-900 text-white font-bold px-8 py-3 rounded-xl hover:bg-slate-800 transition-colors">
            Update Password
          </button>
        </div>
      </div>
      
      <div className="pt-8 border-t border-slate-100">
        <h3 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h3>
        <p className="text-sm text-slate-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
        <button className="bg-red-50 text-red-600 border border-red-200 font-bold px-8 py-3 rounded-xl hover:bg-red-100 transition-colors">
          Delete Account
        </button>
      </div>
    </div>
  </div>
);
