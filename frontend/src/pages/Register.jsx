import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Eye, EyeOff, CheckCircle, User, Phone, Mail, Lock, Zap, ArrowRight } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', mobile_number: '', password: '' });
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [focusedField, setFocusedField] = useState(null);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
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
      toast('Passwords do not match. Please re-enter.', 'error');
      return;
    }
    if (formData.password.length < 6) {
      toast('Password must be at least 6 characters long.', 'error');
      return;
    }
    setLoading(true);
    try {
      await register(formData);
      toast('Account created successfully!', 'success');
      navigate('/');
    } catch (err) {
      const data = err.response?.data;
      if (data?.email) toast('Email already registered.', 'error');
      else if (data?.mobile_number) toast('Mobile number already registered.', 'error');
      else toast(data?.detail || 'Registration failed. Please check your details.', 'error');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 login-gradient-bg flex items-center justify-center overflow-y-auto pt-20 pb-10">
      {/* Animated blobs */}
      <div className="login-blob-1 absolute top-[-10%] left-[-10%] w-80 h-80 rounded-full bg-blue-600/20 blur-3xl pointer-events-none fixed" />
      <div className="login-blob-2 absolute bottom-[-15%] right-[-10%] w-96 h-96 rounded-full bg-purple-600/20 blur-3xl pointer-events-none fixed" />
      <div className="login-blob-3 absolute top-[40%] left-[60%] w-64 h-64 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none fixed" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        className="relative w-full max-w-md mx-4 my-auto"
      >
        {/* Glass card */}
        <div className="glass-dark rounded-3xl px-8 pt-9 pb-8 shadow-2xl">
          {/* Logo */}
          <div className="flex items-center justify-center mb-5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-blue-700 flex items-center justify-center shadow-lg shadow-brand-900/60">
              <Zap className="w-6 h-6 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-heading font-bold text-white text-center mb-1.5">Create Account</h1>
          <p className="text-center text-sm text-white/50 mb-7">Join Praveen Electro World today</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name */}
            <div className="floating-label-group">
              <div className={`flex items-center rounded-2xl border transition-all ${focusedField === 'name' ? 'border-brand-400 bg-white/10' : 'border-white/15 bg-white/8'}`}>
                <User className="w-4 h-4 ml-4 shrink-0" style={{ color: focusedField === 'name' ? '#60a5fa' : 'rgba(255,255,255,0.4)' }} />
                <div className="flex-1 relative">
                  <input
                    type="text"
                    name="name"
                    id="register-name"
                    required
                    value={formData.name}
                    placeholder=" "
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full bg-transparent px-3 pt-5 pb-2 text-white text-sm outline-none placeholder-transparent"
                  />
                  <label
                    htmlFor="register-name"
                    className={`absolute left-3 pointer-events-none transition-all duration-200 ${formData.name || focusedField === 'name' ? 'top-1.5 text-[10px] text-white/50 uppercase tracking-wider' : 'top-1/2 -translate-y-1/2 text-sm text-white/40'}`}
                  >
                    Full Name
                  </label>
                </div>
              </div>
            </div>

            {/* Mobile Number */}
            <div className="floating-label-group">
              <div className={`flex items-center rounded-2xl border transition-all ${focusedField === 'mobile' ? 'border-brand-400 bg-white/10' : 'border-white/15 bg-white/8'}`}>
                <Phone className="w-4 h-4 ml-4 shrink-0" style={{ color: focusedField === 'mobile' ? '#60a5fa' : 'rgba(255,255,255,0.4)' }} />
                <div className="flex-1 relative">
                  <input
                    type="tel"
                    name="mobile_number"
                    id="register-mobile"
                    required
                    pattern="[0-9]{10}"
                    maxLength={10}
                    value={formData.mobile_number}
                    placeholder=" "
                    onChange={handleChange}
                    onFocus={() => setFocusedField('mobile')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full bg-transparent px-3 pt-5 pb-2 text-white text-sm outline-none placeholder-transparent"
                  />
                  <label
                    htmlFor="register-mobile"
                    className={`absolute left-3 pointer-events-none transition-all duration-200 ${formData.mobile_number || focusedField === 'mobile' ? 'top-1.5 text-[10px] text-white/50 uppercase tracking-wider' : 'top-1/2 -translate-y-1/2 text-sm text-white/40'}`}
                  >
                    10-digit Mobile Number
                  </label>
                </div>
              </div>
            </div>

            {/* Email Address */}
            <div className="floating-label-group">
              <div className={`flex items-center rounded-2xl border transition-all ${focusedField === 'email' ? 'border-brand-400 bg-white/10' : 'border-white/15 bg-white/8'}`}>
                <Mail className="w-4 h-4 ml-4 shrink-0" style={{ color: focusedField === 'email' ? '#60a5fa' : 'rgba(255,255,255,0.4)' }} />
                <div className="flex-1 relative">
                  <input
                    type="email"
                    name="email"
                    id="register-email"
                    required
                    value={formData.email}
                    placeholder=" "
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full bg-transparent px-3 pt-5 pb-2 text-white text-sm outline-none placeholder-transparent"
                  />
                  <label
                    htmlFor="register-email"
                    className={`absolute left-3 pointer-events-none transition-all duration-200 ${formData.email || focusedField === 'email' ? 'top-1.5 text-[10px] text-white/50 uppercase tracking-wider' : 'top-1/2 -translate-y-1/2 text-sm text-white/40'}`}
                  >
                    Email Address
                  </label>
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="floating-label-group">
              <div className={`flex items-center rounded-2xl border transition-all ${focusedField === 'password' ? 'border-brand-400 bg-white/10' : 'border-white/15 bg-white/8'}`}>
                <Lock className="w-4 h-4 ml-4 shrink-0" style={{ color: focusedField === 'password' ? '#60a5fa' : 'rgba(255,255,255,0.4)' }} />
                <div className="flex-1 relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    id="register-pass"
                    required
                    minLength={6}
                    value={formData.password}
                    placeholder=" "
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full bg-transparent px-3 pt-5 pb-2 text-white text-sm outline-none placeholder-transparent pr-10"
                  />
                  <label
                    htmlFor="register-pass"
                    className={`absolute left-3 pointer-events-none transition-all duration-200 ${formData.password || focusedField === 'password' ? 'top-1.5 text-[10px] text-white/50 uppercase tracking-wider' : 'top-1/2 -translate-y-1/2 text-sm text-white/40'}`}
                  >
                    Create Password
                  </label>
                </div>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="mr-4 text-white/40 hover:text-white/70 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Strength bar */}
              {strength && (
                <div className="mt-1.5 pl-2 pr-1">
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${strength.color} ${strength.width}`} />
                  </div>
                  <p className={`text-[10px] mt-1 ${strength.color.replace('bg-', 'text-')}`}>{strength.label}</p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="floating-label-group">
              <div className={`flex items-center rounded-2xl border transition-all ${focusedField === 'confirm' ? 'border-brand-400 bg-white/10' : 'border-white/15 bg-white/8'} ${passwordsMismatch ? 'border-red-500/50' : passwordsMatch ? 'border-green-500/50' : ''}`}>
                <Lock className="w-4 h-4 ml-4 shrink-0" style={{ color: focusedField === 'confirm' ? '#60a5fa' : 'rgba(255,255,255,0.4)' }} />
                <div className="flex-1 relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    id="register-confirm"
                    required
                    value={confirmPassword}
                    placeholder=" "
                    onChange={e => setConfirmPassword(e.target.value)}
                    onFocus={() => setFocusedField('confirm')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full bg-transparent px-3 pt-5 pb-2 text-white text-sm outline-none placeholder-transparent pr-16"
                  />
                  <label
                    htmlFor="register-confirm"
                    className={`absolute left-3 pointer-events-none transition-all duration-200 ${confirmPassword || focusedField === 'confirm' ? 'top-1.5 text-[10px] text-white/50 uppercase tracking-wider' : 'top-1/2 -translate-y-1/2 text-sm text-white/40'}`}
                  >
                    Confirm Password
                  </label>
                </div>
                <div className="absolute right-4 flex items-center gap-2">
                  {passwordsMatch && <CheckCircle className="w-4 h-4 text-green-400" />}
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-white/40 hover:text-white/70 transition-colors">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {passwordsMismatch && <p className="text-red-400 text-[10px] pl-2 mt-1">Passwords do not match</p>}
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70"
              style={{ background: 'linear-gradient(135deg, #2563eb, #4f46e5)', color: 'white', boxShadow: '0 8px 25px rgba(37, 99, 235, 0.4)' }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                  Creating Account...
                </span>
              ) : (
                <>Create Account <ArrowRight className="w-4 h-4" /></>
              )}
            </motion.button>
          </form>

          {/* Login link */}
          <p className="mt-6 text-center text-sm text-white/40">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 font-semibold hover:text-brand-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
