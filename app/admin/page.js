'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isSetupDone, loginAdmin, setCurrentAdmin, getCurrentAdmin } from '@/lib/adminStore';
import styles from './login.module.css';

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm]     = useState({ username: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isSetupDone()) { router.push('/admin/setup'); return; }
    if (getCurrentAdmin()) router.push('/admin/dashboard');
  }, []);

  const handleLogin = () => {
    setError('');
    if (!form.username || !form.password) return setError('Please enter your username and password.');
    setLoading(true);
    setTimeout(() => {
      const admin = loginAdmin(form.username, form.password);
      if (!admin) { setError('Invalid username or password.'); setLoading(false); return; }
      setCurrentAdmin(admin);
      router.push('/admin/dashboard');
    }, 400);
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
          <label className={styles.label}>Username</label>
          <input type="text" value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className={styles.input} placeholder="your_username"
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
        <p className={styles.hint}>First time? <a href="/admin/setup" className={styles.link}>Create your account</a></p>
      </div>
    </div>
  );
}
