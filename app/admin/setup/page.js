'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isSetupDone, saveAdmins, setCurrentAdmin } from '@/lib/adminStore';
import styles from './page.module.css';

export default function AdminSetup() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '', confirm: '', name: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isSetupDone()) router.push('/admin');
  }, []);

  const handleSubmit = () => {
    setError('');
    if (!form.name.trim())     return setError('Full name is required.');
    if (!form.username.trim()) return setError('Username is required.');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    if (form.password !== form.confirm) return setError('Passwords do not match.');

    const owner = { id: Date.now(), username: form.username.trim(), password: form.password, name: form.name.trim(), role: 'owner', createdAt: new Date().toISOString() };
    saveAdmins([owner]);
    setCurrentAdmin(owner);
    router.push('/admin/dashboard');
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoRow}>
          <div className={styles.logoIcon}>B</div>
          <span className={styles.logoText}>Be<span className={styles.accent}>Living</span> Admin</span>
        </div>
        <div className={styles.setupBadge}>First Time Setup</div>
        <h1 className={styles.title}>Create Your Admin Account</h1>
        <p className={styles.sub}>This is the owner account. You can add more admins later from the dashboard.</p>

        {error && <div className={styles.error}>{error}</div>}

        {[
          { label: 'Your Full Name', key: 'name', type: 'text', placeholder: 'e.g. John Smith' },
          { label: 'Username', key: 'username', type: 'text', placeholder: 'e.g. john_admin' },
          { label: 'Password', key: 'password', type: 'password', placeholder: 'Min. 6 characters' },
          { label: 'Confirm Password', key: 'confirm', type: 'password', placeholder: 'Re-enter password' },
        ].map((f) => (
          <div key={f.key} className={styles.field}>
            <label className={styles.label}>{f.label}</label>
            <input
              type={f.type}
              value={form[f.key]}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              className={styles.input}
              placeholder={f.placeholder}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>
        ))}

        <button className={styles.btn} onClick={handleSubmit}>Create Account & Enter Dashboard →</button>
      </div>
    </div>
  );
}
