'use client';
import { useState, useEffect } from 'react';
import AdminShell from '@/components/AdminShell';
import { getAdmins, saveAdmins, getCurrentAdmin } from '@/lib/adminStore';

export default function TeamPage() {
  const [admins, setAdmins]   = useState([]);
  const [current, setCurrent] = useState(null);
  const [form, setForm]       = useState({ name: '', username: '', password: '', role: 'editor' });
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setAdmins(getAdmins());
    setCurrent(getCurrentAdmin());
  }, []);

  const handleAdd = () => {
    setError('');
    if (!form.name.trim())     return setError('Name is required.');
    if (!form.username.trim()) return setError('Username is required.');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    if (admins.find(a => a.username === form.username)) return setError('Username already exists.');

    const newAdmin = { id: Date.now(), ...form, createdAt: new Date().toISOString() };
    const updated  = [...admins, newAdmin];
    saveAdmins(updated);
    setAdmins(updated);
    setForm({ name: '', username: '', password: '', role: 'editor' });
    setShowForm(false);
    setSuccess('Team member added successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleRemove = (id) => {
    if (current?.id === id) return alert("You can't remove your own account.");
    if (!confirm('Remove this team member? They will no longer be able to log in.')) return;
    const updated = admins.filter(a => a.id !== id);
    saveAdmins(updated);
    setAdmins(updated);
  };

  const ROLE_COLORS = { owner: '#7C3AED', editor: '#1A56DB', viewer: '#059669' };

  return (
    <AdminShell title="Team Members">
      <div style={s.header}>
        <div>
          <p style={s.sub}>{admins.length} team member{admins.length !== 1 ? 's' : ''} total</p>
        </div>
        <button style={s.addBtn} onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ Add Team Member'}
        </button>
      </div>

      {success && <div style={s.success}>{success}</div>}

      {/* Add form */}
      {showForm && (
        <div style={s.formCard}>
          <h3 style={s.formTitle}>Add New Team Member</h3>
          {error && <div style={s.error}>{error}</div>}
          <div style={s.formGrid}>
            {[
              { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Jane Smith' },
              { label: 'Username', key: 'username', type: 'text', placeholder: 'jane_admin' },
              { label: 'Password', key: 'password', type: 'password', placeholder: 'Min. 6 characters' },
            ].map((f) => (
              <div key={f.key} style={s.field}>
                <label style={s.label}>{f.label}</label>
                <input type={f.type} value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  style={s.input} placeholder={f.placeholder} />
              </div>
            ))}
            <div style={s.field}>
              <label style={s.label}>Role</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} style={s.input}>
                <option value="editor">Editor — can edit content & blog</option>
                <option value="viewer">Viewer — read only</option>
              </select>
            </div>
          </div>
          <button style={s.submitBtn} onClick={handleAdd}>Add Team Member →</button>
        </div>
      )}

      {/* Team list */}
      <div style={s.teamList}>
        {admins.map((admin) => (
          <div key={admin.id} style={s.memberCard}>
            <div style={s.memberAvatar}>{admin.name?.[0]?.toUpperCase() || 'A'}</div>
            <div style={s.memberInfo}>
              <div style={s.memberTop}>
                <p style={s.memberName}>{admin.name}</p>
                {current?.id === admin.id && <span style={s.youBadge}>You</span>}
              </div>
              <p style={s.memberUsername}>@{admin.username}</p>
              <p style={s.memberDate}>Added {new Date(admin.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
            <span style={{ ...s.roleBadge, background: `${ROLE_COLORS[admin.role]}18`, color: ROLE_COLORS[admin.role] }}>
              {admin.role}
            </span>
            {current?.id !== admin.id && (
              <button style={s.removeBtn} onClick={() => handleRemove(admin.id)}>Remove</button>
            )}
          </div>
        ))}
      </div>

      <div style={s.note}>
        <span>🔒</span>
        <p style={s.noteText}>Passwords are stored locally. For production, connect Supabase Auth for secure password management.</p>
      </div>
    </AdminShell>
  );
}

const s = {
  header:       { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  sub:          { fontSize: 14, color: '#64748B', marginTop: 4 },
  addBtn:       { padding: '10px 22px', background: '#1A56DB', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(26,86,219,0.25)' },
  success:      { background: '#D1FAE5', border: '1px solid #6EE7B7', color: '#065F46', fontSize: 14, padding: '12px 16px', borderRadius: 8, marginBottom: 16, fontWeight: 500 },
  formCard:     { background: '#fff', borderRadius: 14, padding: '28px', border: '1px solid #E2E8F0', marginBottom: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  formTitle:    { fontSize: 17, fontWeight: 700, color: '#0F172A', marginBottom: 18 },
  error:        { background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', fontSize: 13, padding: '11px 15px', borderRadius: 8, marginBottom: 16, fontWeight: 500 },
  formGrid:     { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 },
  field:        { display: 'flex', flexDirection: 'column', gap: 5 },
  label:        { fontSize: 12, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#334155' },
  input:        { padding: '11px 14px', border: '1.5px solid #E2E8F0', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', color: '#0F172A', outline: 'none', background: '#F8FAFF', width: '100%' },
  submitBtn:    { padding: '12px 28px', background: '#1A56DB', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
  teamList:     { display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 },
  memberCard:   { background: '#fff', borderRadius: 12, padding: '18px 22px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
  memberAvatar: { width: 46, height: 46, background: '#1A56DB', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, flexShrink: 0 },
  memberInfo:   { flex: 1 },
  memberTop:    { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 },
  memberName:   { fontSize: 15, fontWeight: 700, color: '#0F172A' },
  youBadge:     { background: '#EBF2FF', color: '#1A56DB', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100 },
  memberUsername:{ fontSize: 13, color: '#64748B', marginBottom: 2 },
  memberDate:   { fontSize: 12, color: '#94A3B8' },
  roleBadge:    { fontSize: 12, fontWeight: 700, padding: '5px 14px', borderRadius: 100, textTransform: 'capitalize', flexShrink: 0 },
  removeBtn:    { padding: '8px 14px', background: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 },
  note:         { background: '#F8FAFF', border: '1px solid #E2E8F0', borderRadius: 10, padding: '14px 18px', display: 'flex', gap: 10, alignItems: 'flex-start' },
  noteText:     { fontSize: 13, color: '#64748B', lineHeight: 1.5 },
};
