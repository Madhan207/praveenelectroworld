import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(email, password);
      if (isAdminLogin && !user.is_staff) {
        setError('This account does not have admin privileges.');
        setLoading(false);
      } else if (isAdminLogin && user.is_staff) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Invalid email or password. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 w-full max-w-md"
      >
        {/* Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
          <button
            type="button"
            onClick={() => { setIsAdminLogin(false); setError(''); }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${!isAdminLogin ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            User Login
          </button>
          <button
            type="button"
            onClick={() => { setIsAdminLogin(true); setError(''); }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${isAdminLogin ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Admin Login
          </button>
        </div>

        <h2 className="text-3xl font-heading font-bold text-center text-slate-900 mb-2">
          {isAdminLogin ? '🛡️ Admin Portal' : 'Welcome Back'}
        </h2>
        <p className="text-center text-slate-500 text-sm mb-8">
          {isAdminLogin ? 'Sign in with your admin credentials' : 'Sign in to your account to continue shopping'}
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-1"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full py-3.5 text-base" disabled={loading}>
            {loading ? 'Signing in...' : (isAdminLogin ? 'Login to Dashboard' : 'Sign In')}
          </Button>
        </form>

        {!isAdminLogin && (
          <p className="mt-6 text-center text-slate-500 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-600 font-semibold hover:underline">
              Register here
            </Link>
          </p>
        )}
      </motion.div>
    </div>
  );
};
