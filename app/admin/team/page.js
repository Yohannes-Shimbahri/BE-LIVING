'use client';
import { useState, useEffect } from 'react';
import AdminShell from '@/components/AdminShell';
import { supabase } from '@/lib/supabase';

export default function TeamPage() {
  const [users, setUsers]     = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
    // Note: listing all users requires Supabase service role key (server-side only)
    // So we just show the current user for now
    if (user) setUsers([user]);
  };

  const handleAddUser = async () => {
    setError('');
    if (!form.email.trim())    return setError('Email is required.');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');

    setLoading(true);
    try {
      // Sign up the new user via Supabase Auth
      const { error: signUpError } = await supabase.auth.admin?.createUser({
        email: form.email.trim(),
        password: form.password,
        email_confirm: true,
      });

      if (signUpError) throw signUpError;

      setForm({ email: '', password: '' });
      setShowForm(false);
      setSuccess('Team member added! They can now log in at /admin.');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      // admin.createUser needs service role — show instructions instead
      setError('');
      setSuccess('');
      setShowForm(false);
      setError(
        'To add team members: go to your Supabase Dashboard → Authentication → Users → Add User. Enter their email and password there.'
      );
    }
    setLoading(false);
  };

  return (
    <AdminShell title="Team Members">
      <div style={s.header}>
        <div>
          <p style={s.sub}>Manage who can access this admin panel</p>
        </div>
        <button style={s.addBtn} onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ Add Team Member'}
        </button>
      </div>

      {success && <div style={s.success}>{success}</div>}
      {error   && <div style={s.error}>{error}</div>}

      {/* Add form */}
      {showForm && (
        <div style={s.formCard}>
          <h3 style={s.formTitle}>Add New Team Member</h3>
          <p style={s.formNote}>
            This creates a new Supabase Auth user who can log into the admin panel.
          </p>
          <div style={s.formRow}>
            <div style={s.field}>
              <label style={s.label}>Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={s.input}
                placeholder="friend@email.com"
              />
            </div>
            <div style={s.field}>
              <label style={s.label}>Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                style={s.input}
                placeholder="Min. 6 characters"
              />
            </div>
          </div>
          <button style={s.submitBtn} onClick={handleAddUser} disabled={loading}>
            {loading ? 'Adding...' : 'Add Team Member →'}
          </button>
        </div>
      )}

      {/* Current user card */}
      <div style={s.section}>
        <p style={s.sectionTitle}>YOUR ACCOUNT</p>
        {currentUser && (
          <div style={s.memberCard}>
            <div style={s.avatar}>
              {currentUser.email?.[0]?.toUpperCase()}
            </div>
            <div style={s.memberInfo}>
              <p style={s.memberEmail}>{currentUser.email}</p>
              <p style={s.memberMeta}>
                Joined {new Date(currentUser.created_at).toLocaleDateString('en-US', {
                  month: 'long', day: 'numeric', year: 'numeric'
                })}
              </p>
            </div>
            <span style={s.ownerBadge}>Owner</span>
          </div>
        )}
      </div>

      {/* How to add more admins */}
      <div style={s.instructionBox}>
        <h4 style={s.instrTitle}>📌 How to Add More Admin Users</h4>
        <p style={s.instrText}>
          To add team members who can log into this admin panel:
        </p>
        <ol style={s.instrList}>
          <li style={s.instrItem}>Go to <strong>supabase.com</strong> → your project</li>
          <li style={s.instrItem}>Click <strong>Authentication</strong> in the left sidebar</li>
          <li style={s.instrItem}>Click <strong>Users</strong> → <strong>Add User</strong> → <strong>Create New User</strong></li>
          <li style={s.instrItem}>Enter their email and a password → click <strong>Create User</strong></li>
          <li style={s.instrItem}>Share the <strong>/admin</strong> URL and their login details with them</li>
        </ol>
        <a
          href="https://supabase.com/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          style={s.supabaseLink}
        >
          Open Supabase Dashboard →
        </a>
      </div>

      <div style={s.note}>
        <span>🔒</span>
        <p style={s.noteText}>
          All admin users are managed securely through Supabase Authentication.
          Only users you create in Supabase can log into this panel.
        </p>
      </div>
    </AdminShell>
  );
}

const s = {
  header:        { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  sub:           { fontSize: 14, color: '#64748B', marginTop: 4 },
  addBtn:        { padding: '10px 22px', background: '#1A56DB', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(26,86,219,0.25)' },
  success:       { background: '#D1FAE5', border: '1px solid #6EE7B7', color: '#065F46', fontSize: 14, padding: '12px 16px', borderRadius: 8, marginBottom: 16, fontWeight: 500 },
  error:         { background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', fontSize: 14, padding: '12px 16px', borderRadius: 8, marginBottom: 16, lineHeight: 1.6 },
  formCard:      { background: '#fff', borderRadius: 14, padding: '28px', border: '1px solid #E2E8F0', marginBottom: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  formTitle:     { fontSize: 17, fontWeight: 700, color: '#0F172A', marginBottom: 6 },
  formNote:      { fontSize: 13, color: '#64748B', marginBottom: 20, lineHeight: 1.5 },
  formRow:       { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 },
  field:         { display: 'flex', flexDirection: 'column', gap: 5 },
  label:         { fontSize: 12, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#334155' },
  input:         { padding: '11px 14px', border: '1.5px solid #E2E8F0', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', color: '#0F172A', outline: 'none', background: '#F8FAFF', width: '100%' },
  submitBtn:     { padding: '12px 28px', background: '#1A56DB', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
  section:       { marginBottom: 28 },
  sectionTitle:  { fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', color: '#94A3B8', marginBottom: 12 },
  memberCard:    { background: '#fff', borderRadius: 12, padding: '18px 22px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
  avatar:        { width: 44, height: 44, background: '#1A56DB', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, flexShrink: 0 },
  memberInfo:    { flex: 1 },
  memberEmail:   { fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 3 },
  memberMeta:    { fontSize: 12, color: '#94A3B8' },
  ownerBadge:    { background: '#EDE9FE', color: '#7C3AED', fontSize: 12, fontWeight: 700, padding: '5px 14px', borderRadius: 100 },
  instructionBox:{ background: '#EBF2FF', border: '1px solid #BFDBFE', borderRadius: 14, padding: '24px 26px', marginBottom: 20 },
  instrTitle:    { fontSize: 16, fontWeight: 700, color: '#1E3A8A', marginBottom: 10 },
  instrText:     { fontSize: 14, color: '#1E40AF', marginBottom: 14, lineHeight: 1.5 },
  instrList:     { paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 },
  instrItem:     { fontSize: 14, color: '#1E40AF', lineHeight: 1.5 },
  supabaseLink:  { display: 'inline-block', background: '#1A56DB', color: '#fff', padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none' },
  note:          { background: '#F8FAFF', border: '1px solid #E2E8F0', borderRadius: 10, padding: '14px 18px', display: 'flex', gap: 10, alignItems: 'flex-start' },
  noteText:      { fontSize: 13, color: '#64748B', lineHeight: 1.5 },
};
