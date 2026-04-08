'use client';
import { useState, useEffect } from 'react';
import AdminShell from '@/components/AdminShell';
import { supabase } from '@/lib/supabase';

export default function TeamPage() {
  const [users, setUsers]           = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [form, setForm]             = useState({ email: '' });
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState('');
  const [showForm, setShowForm]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [revoking, setRevoking]     = useState(null); // userId being revoked

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
    fetchUsers();
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin-users');
      const data = await res.json();
      if (data.users) setUsers(data.users);
    } catch {
      // If API not set up yet, just show current user
    }
  };

  const handleInvite = async () => {
    setError('');
    if (!form.email.trim()) return setError('Email is required.');

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: form.email.trim(),
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/admin`,
        },
      });
      if (error) throw error;

      setForm({ email: '' });
      setShowForm(false);
      setSuccess(`✓ Magic link sent to ${form.email}! They click it to access the admin panel.`);
      setTimeout(() => setSuccess(''), 6000);
      fetchUsers();
    } catch (err) {
      setError(err.message || 'Failed to send invite.');
    }
    setLoading(false);
  };

  const handleRevoke = async (userId, email) => {
    if (!confirm(`Remove ${email} from the admin panel? They will lose access immediately.`)) return;

    setRevoking(userId);
    try {
      const res = await fetch('/api/admin-users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setSuccess(`✓ ${email} has been removed.`);
      setTimeout(() => setSuccess(''), 4000);
      fetchUsers();
    } catch (err) {
      setError(err.message || 'Failed to remove user.');
    }
    setRevoking(null);
  };

  const otherUsers = users.filter(u => u.id !== currentUser?.id);

  return (
    <AdminShell title="Team Members">
      <div style={s.header}>
        <p style={s.sub}>Manage who can access this admin panel</p>
        <button style={s.addBtn} onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ Invite Team Member'}
        </button>
      </div>

      {success && <div style={s.success}>{success}</div>}
      {error   && <div style={s.error}>{error}</div>}

      {/* Invite form */}
      {showForm && (
        <div style={s.formCard}>
          <h3 style={s.formTitle}>Invite Team Member</h3>
          <p style={s.formNote}>
            We'll send them a magic link — they click it and get instant access.
            No password needed. Links expire after 24 hours.
          </p>
          <div style={s.field}>
            <label style={s.label}>Email Address</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ email: e.target.value })}
              style={s.input}
              placeholder="colleague@email.com"
            />
          </div>
          <button style={s.submitBtn} onClick={handleInvite} disabled={loading}>
            {loading ? 'Sending...' : 'Send Magic Link →'}
          </button>
        </div>
      )}

      {/* Your account */}
      <div style={s.section}>
        <p style={s.sectionTitle}>YOUR ACCOUNT</p>
        {currentUser && (
          <div style={s.memberCard}>
            <div style={s.avatar}>{currentUser.email?.[0]?.toUpperCase()}</div>
            <div style={s.memberInfo}>
              <p style={s.memberEmail}>{currentUser.email}</p>
              <p style={s.memberMeta}>
                Joined {new Date(currentUser.created_at).toLocaleDateString('en-US', {
                  month: 'long', day: 'numeric', year: 'numeric',
                })}
              </p>
            </div>
            <span style={s.ownerBadge}>Owner</span>
          </div>
        )}
      </div>

      {/* Other team members */}
      {otherUsers.length > 0 && (
        <div style={s.section}>
          <p style={s.sectionTitle}>TEAM MEMBERS</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {otherUsers.map((user) => (
              <div key={user.id} style={s.memberCard}>
                <div style={{ ...s.avatar, background: '#6366F1' }}>
                  {user.email?.[0]?.toUpperCase()}
                </div>
                <div style={s.memberInfo}>
                  <p style={s.memberEmail}>{user.email}</p>
                  <p style={s.memberMeta}>
                    Joined {new Date(user.created_at).toLocaleDateString('en-US', {
                      month: 'long', day: 'numeric', year: 'numeric',
                    })}
                  </p>
                </div>
                <button
                  style={s.revokeBtn}
                  onClick={() => handleRevoke(user.id, user.email)}
                  disabled={revoking === user.id}
                >
                  {revoking === user.id ? 'Removing...' : 'Revoke Access'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={s.instructionBox}>
        <h4 style={s.instrTitle}>📌 How Team Access Works</h4>
        <p style={s.instrText}>
          When you invite someone, they'll receive a magic link in their email.
          They simply click it — no password needed — and they'll land directly
          in the admin panel. Links expire after 24 hours.
        </p>
        <p style={{ ...s.instrText, marginTop: 10 }}>
          To remove access, click the <strong>Revoke Access</strong> button next
          to their name above. They'll be blocked immediately.
        </p>
      </div>

      <div style={s.note}>
        <span>🔒</span>
        <p style={s.noteText}>
          All admin access is managed securely through Supabase Authentication.
          Only people you personally invite can log into this panel.
        </p>
      </div>
    </AdminShell>
  );
}

const s = {
  header:       { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sub:          { fontSize: 14, color: '#64748B' },
  addBtn:       { padding: '10px 22px', background: '#1A56DB', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(26,86,219,0.25)' },
  success:      { background: '#D1FAE5', border: '1px solid #6EE7B7', color: '#065F46', fontSize: 14, padding: '12px 16px', borderRadius: 8, marginBottom: 16, fontWeight: 500 },
  error:        { background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', fontSize: 14, padding: '12px 16px', borderRadius: 8, marginBottom: 16 },
  formCard:     { background: '#fff', borderRadius: 14, padding: '28px', border: '1px solid #E2E8F0', marginBottom: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  formTitle:    { fontSize: 17, fontWeight: 700, color: '#0F172A', marginBottom: 6 },
  formNote:     { fontSize: 13, color: '#64748B', marginBottom: 20, lineHeight: 1.5 },
  field:        { display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 20 },
  label:        { fontSize: 12, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#334155' },
  input:        { padding: '11px 14px', border: '1.5px solid #E2E8F0', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', color: '#0F172A', outline: 'none', background: '#F8FAFF' },
  submitBtn:    { padding: '12px 28px', background: '#1A56DB', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
  section:      { marginBottom: 28 },
  sectionTitle: { fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', color: '#94A3B8', marginBottom: 12 },
  memberCard:   { background: '#fff', borderRadius: 12, padding: '18px 22px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
  avatar:       { width: 44, height: 44, background: '#1A56DB', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, flexShrink: 0 },
  memberInfo:   { flex: 1 },
  memberEmail:  { fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 3 },
  memberMeta:   { fontSize: 12, color: '#94A3B8' },
  ownerBadge:   { background: '#EDE9FE', color: '#7C3AED', fontSize: 12, fontWeight: 700, padding: '5px 14px', borderRadius: 100 },
  revokeBtn:    { padding: '8px 16px', background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' },
  instructionBox:{ background: '#EBF2FF', border: '1px solid #BFDBFE', borderRadius: 14, padding: '24px 26px', marginBottom: 20 },
  instrTitle:   { fontSize: 16, fontWeight: 700, color: '#1E3A8A', marginBottom: 10 },
  instrText:    { fontSize: 14, color: '#1E40AF', lineHeight: 1.6 },
  note:         { background: '#F8FAFF', border: '1px solid #E2E8F0', borderRadius: 10, padding: '14px 18px', display: 'flex', gap: 10, alignItems: 'flex-start' },
  noteText:     { fontSize: 13, color: '#64748B', lineHeight: 1.5 },
};