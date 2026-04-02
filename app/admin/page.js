'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import styles from './login.module.css';

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If already logged in, redirect to dashboard
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push('/admin/dashboard');
    });
  }, []);

  const handleLogin = async () => {
    setError('');
    if (!form.email || !form.password) return setError('Please enter your email and password.');
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email:    form.email,
      password: form.password,
    });

    if (authError) {
      setError('Invalid email or password. Please try again.');
      setLoading(false);
      return;
    }

    router.push('/admin/dashboard');
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoRow}>
          <div className={styles.logoIcon}>B</div>
          <span className={styles.logoText}>Be<span className={styles.accent}>Living</span> Admin</span>
        </div>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.sub}>Sign in to manage your website</p>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.field}>
          <label className={styles.label}>Email Address</label>
          <input type="email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={styles.input} placeholder="your@email.com"
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Password</label>
          <input type="password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className={styles.input} placeholder="••••••••"
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
        </div>

        <button className={styles.btn} onClick={handleLogin} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In →'}
        </button>

        <p className={styles.hint}>
          Need an account? Create one in <strong>Supabase → Authentication → Users → Add User</strong>
        </p>
      </div>
    </div>
  );
}
