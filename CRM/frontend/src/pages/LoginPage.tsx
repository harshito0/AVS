import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { loginApi, getToken, setStoredUser, clearToken, getMeApi } from '../services/apiClient';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = getToken();
    if (token) {
      getMeApi().then((res) => {
        if (res.success) {
          navigate('/dashboard', { replace: true });
        } else {
          clearToken();
        }
      });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setError('Email/Username and password are required');
      return;
    }
    setLoading(true);
    setError('');

    clearToken();

    const result = await loginApi(cleanEmail, password);
    setLoading(false);

    if (result.success && (result.data as any)?.token) {
      setStoredUser((result.data as any).user);
      navigate(from, { replace: true });
    } else {
      clearToken();
      setError((result as any).error?.message || 'Invalid username or password. Access denied.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-spa-bg relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-120px] right-[-80px] w-[480px] h-[480px] rounded-full bg-forest-900/5 blur-3xl" />
        <div className="absolute bottom-[-60px] left-[-40px] w-[320px] h-[320px] rounded-full bg-gold-300/10 blur-2xl" />
      </div>

      <div className="w-full max-w-md px-6 relative z-10">
        {/* Logo + Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-28 h-28 rounded-2xl flex items-center justify-center mb-3 overflow-hidden">
            <img
              src="/avs_logo.png"
              alt="Aura Vital Star"
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          <h1 className="font-serif text-2xl text-forest-900 tracking-wide">Aura Vital Star</h1>
          <p className="text-sm text-spa-muted tracking-[0.12em] uppercase mt-1">CRM Administration</p>
        </div>

        {/* Login Card */}
        <div className="crm-card p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-forest-900">Welcome Back</h2>
            <p className="text-sm text-spa-muted mt-1">Sign in to your admin account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 bg-rose-50 border border-rose-200/70 rounded-lg p-3">
                <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                <p className="text-sm text-rose-700">{error}</p>
              </div>
            )}

            {/* Email / Username */}
            <div>
              <label htmlFor="login-email" className="block text-xs font-semibold text-forest-800 uppercase tracking-wider mb-1.5">
                Username or Email
              </label>
              <input
                id="login-email"
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin or admin@auravitalstar.ca"
                className="w-full h-10 px-3 rounded-lg border border-spa-border bg-white text-sm text-forest-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-forest-700/20 focus:border-forest-700 transition-all"
                autoComplete="username"
                autoFocus
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="block text-xs font-semibold text-forest-800 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-10 px-3 pr-10 rounded-lg border border-spa-border bg-white text-sm text-forest-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-forest-700/20 focus:border-forest-700 transition-all"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="login-submit"
              disabled={loading}
              className="w-full h-10 bg-forest-900 text-white rounded-lg text-sm font-semibold tracking-wide hover:bg-forest-800 active:bg-forest-950 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-6">
          Aura Vital Star Rejuvenation Centre Inc. &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
