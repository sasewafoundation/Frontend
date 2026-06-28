import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { FiLock, FiMail, FiArrowRight, FiShield } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const sessionMessage = sessionStorage.getItem('adminSessionMessage');
    if (sessionMessage) {
      setError(sessionMessage);
      sessionStorage.removeItem('adminSessionMessage');
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await api.post('/auth/login', { email, password });
      
      if (res.data && res.data.token) {
        localStorage.setItem('adminToken', res.data.token);
        navigate('/admin/dashboard');
      } else {
        setError('Invalid system response.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials or connection failure.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-panel min-h-screen bg-neutral-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl border border-neutral-200 shadow-[var(--shadow-card)] p-8">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Sa-Sewa Foundation" className="h-16 w-auto object-contain mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-neutral-900">Admin Login</h1>
          <p className="text-sm text-neutral-500 mt-1">Sign in to manage projects, volunteers, and blogs.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 p-3 rounded-xl text-sm mb-6 flex items-center gap-2">
            <FiLock className="shrink-0" />
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label className="form-label">Email</label>
            <div className="relative">
              <FiMail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="email"
                required
                placeholder="admin@sasewa.org"
                className="form-input pl-11"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Password</label>
            <div className="relative">
              <FiLock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="form-input pl-11"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors disabled:opacity-70"
          >
            {loading ? (
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                Sign In
                <FiArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-neutral-500">
          <FiShield size={13} className="text-primary-600" />
          Secure access for authorized admins
        </div>
      </div>
    </div>
  );
};

export default Login;
