import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { motion } from 'framer-motion';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';

export const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', mobile_number: '', password: '' });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const passwordStrength = (pwd) => {
    if (pwd.length === 0) return null;
    if (pwd.length < 6) return { label: 'Too short', color: 'bg-red-400', width: 'w-1/4' };
    if (pwd.length < 8) return { label: 'Weak', color: 'bg-orange-400', width: 'w-2/4' };
    if (!/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd)) return { label: 'Fair', color: 'bg-yellow-400', width: 'w-3/4' };
    return { label: 'Strong', color: 'bg-green-500', width: 'w-full' };
  };

  const strength = passwordStrength(formData.password);
  const passwordsMatch = confirmPassword.length > 0 && formData.password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && formData.password !== confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      const data = err.response?.data;
      if (data?.email) setError('Email already registered.');
      else if (data?.mobile_number) setError('Mobile number already registered.');
      else setError(data?.detail || 'Registration failed. Please check your details.');
    }
    setLoading(false);
  };

  const inputClass = "w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none transition-all";

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-heading font-bold text-slate-900">Create Account</h2>
          <p className="text-slate-500 text-sm mt-1">Join Praveen Electro World today</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
            <input type="text" name="name" required placeholder="Enter your full name"
              value={formData.name} onChange={handleChange} className={inputClass} />
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Mobile Number</label>
            <input type="tel" name="mobile_number" required placeholder="10-digit mobile number"
              pattern="[0-9]{10}" maxLength={10}
              value={formData.mobile_number} onChange={handleChange} className={inputClass} />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
            <input type="email" name="email" required placeholder="your@email.com"
              value={formData.email} onChange={handleChange} className={inputClass} />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} name="password" required
                placeholder="Create a strong password" minLength={6}
                value={formData.password} onChange={handleChange}
                className={`${inputClass} pr-12`} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {/* Strength bar */}
            {strength && (
              <div className="mt-2">
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${strength.color} ${strength.width}`} />
                </div>
                <p className={`text-xs mt-1 ${strength.color.replace('bg-', 'text-')}`}>{strength.label}</p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
            <div className="relative">
              <input type={showConfirm ? 'text' : 'password'} required
                placeholder="Re-enter your password"
                value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                className={`${inputClass} pr-12 ${passwordsMismatch ? 'border-red-300 ring-1 ring-red-300' : passwordsMatch ? 'border-green-300 ring-1 ring-green-300' : ''}`} />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {passwordsMatch && <CheckCircle className="w-4 h-4 text-green-500" />}
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="text-slate-400 hover:text-slate-600 p-1">
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            {passwordsMismatch && <p className="text-red-500 text-xs mt-1">Passwords do not match</p>}
            {passwordsMatch && <p className="text-green-600 text-xs mt-1">✓ Passwords match</p>}
          </div>

          <Button type="submit" className="w-full py-3.5 text-base mt-2" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <p className="mt-6 text-center text-slate-500 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-600 font-semibold hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};
