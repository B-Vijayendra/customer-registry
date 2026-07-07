import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../context/ToastContext.jsx';
import Loader from '../components/Loader.jsx';
import FloatingInput from '../components/FloatingInput.jsx';

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email address';
    if (form.password.length < 6) next.password = 'Password must be at least 6 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-secondary-900 dark:text-white">Welcome back</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">Log in to manage your complaints and conversations.</p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-5">
        <FloatingInput
          name="email"
          type="email"
          label="Email address"
          icon={<FiMail size={16} />}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={errors.email}
          required
        />
        <FloatingInput
          name="password"
          type="password"
          label="Password"
          icon={<FiLock size={16} />}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          error={errors.password}
          required
        />
        <button type="submit" disabled={loading} className="btn-cinematic w-full">
          {loading ? <Loader size="sm" /> : <>Log in <FiArrowRight /></>}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-gray-400">
        Don't have an account? <Link to="/register" className="font-medium text-violet-600 hover:underline dark:text-violet-400">Sign up</Link>
      </p>
    </div>
  );
}
