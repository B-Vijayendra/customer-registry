import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../context/ToastContext.jsx';
import Loader from '../components/Loader.jsx';
import FloatingInput from '../components/FloatingInput.jsx';

export default function Register() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Name must be at least 2 characters';
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
      await register(form);
      toast.success('Account created successfully');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-secondary-900 dark:text-white">Create your account</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">Join as a customer or as a support agent.</p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-5">
        <FloatingInput
          name="name"
          label="Full name"
          icon={<FiUser size={16} />}
          value={form.name}
          onChange={handleChange}
          error={errors.name}
          required
        />
        <FloatingInput
          name="email"
          type="email"
          label="Email address"
          icon={<FiMail size={16} />}
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          required
        />
        <FloatingInput
          name="password"
          type="password"
          label="Password"
          icon={<FiLock size={16} />}
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          required
        />

        <div>
          <label className="label-text">I am a</label>
          <div className="grid grid-cols-2 gap-3">
            {['customer', 'agent'].map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => setForm((f) => ({ ...f, role: r }))}
                className={`rounded-xl border px-4 py-2.5 text-sm font-medium capitalize transition-colors ${
                  form.role === r
                    ? 'border-violet-500 bg-violet-50 text-violet-700 dark:border-violet-400/50 dark:bg-violet-500/10 dark:text-violet-300'
                    : 'border-slate-200 text-slate-500 hover:border-slate-300 dark:border-white/10 dark:text-gray-400 dark:hover:border-white/20'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-cinematic w-full">
          {loading ? <Loader size="sm" /> : <>Create account <FiArrowRight /></>}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-gray-400">
        Already have an account? <Link to="/login" className="font-medium text-violet-600 hover:underline dark:text-violet-400">Log in</Link>
      </p>
    </div>
  );
}
