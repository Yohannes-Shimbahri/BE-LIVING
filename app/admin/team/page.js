'use client';
import { useState, useEffect } from 'react';
import AdminShell from '@/components/AdminShell';
import { supabase } from '@/lib/supabase';

export default function TeamPage() {
  const [users, setUsers]     = useState([]);
  const [current, setCurrent] = useState(null);
  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setCurrent(user));
    fetchUsers();
  }, []);

  async function fetchUsers() {
    // List users via Supabase Admin API (requires service role key in backend)
    // For now we show the current user and allow adding via Supabase Auth
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setUsers([user]);
  }

  async function handleAdd() {
    setError('');
    if (!form.email) return setError('Email is required.');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');

    setLoading(true);
    // Use Supabase Admin to invite/create a user
    // This requires the service role key — for now, guide the user to do it in Supabase dashboard
    setLoading(false);
    setShowForm(false);
    setSuccess('To add a new admin, go to Supabase → Authentication → Users → Add User and enter their email + password. They can then log in at /admin.');
    setTimeout(() => setSuccess(''), 8000);
  }

  return (
    <AdminShell title="Team Members">
      <div style={s.header}>
        <p style={s.sub}>Manage who can log into the admin panel</p>
        <button style={s.addBtn} onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ Add Team Member'}
        </button>
      </div>

      {success && <div style={s.success}>{success}</div>}
      {error   && <div style={s.error}>{error}</div>}

      {showForm && (
        <div style={s.formCard}>
          <h3 style={s.formTitle}>Add New Admin User</h3>
          <div style={s.infoBox}>
            <p style={s.infoText}>
              <strong>How to add a new admin:</strong><br />
              1. Go to your <a href="https://supabase.com/dashboard" target="_blank" style={{color:'#1A56DB'}}>Supabase Dashboard</a><br />
              2. Click <strong>Authentication → Users → Add User</strong><br />
              3. Enter their email and a temporary password<br />
              4. They can log in at <strong>/admin</strong> immediately
            </p>
          </div>
          <button style={s.externalBtn} onClick={() => window.open('https://supabase.com/dashboard', '_blank')}>
            Open Supabase Dashboard →
          </button>
        </div>
      )}

      {/* Current user card */}
      <div style={s.teamList}>
        <p style={s.sectionLabel}>Currently Logged In</p>
        {current && (
          <div style={s.memberCard}>
            <div style={s.avatar}>{current.email?.[0]?.toUpperCase()}</div>
            <div style={s.memberInfo}>
              <p style={s.memberEmail}>{current.email}</p>
              <p style={s.memberDate}>
                Account created: {new Date(current.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <span style={s.youBadge}>You</span>
          </div>
        )}
      </div>

      <div style={s.note}>
        <span>🔐</span>
        <div>
          <p style={s.noteTitle}>Managing Admin Users</p>
          <p style={s.noteText}>
            All admin users are managed securely through <strong>Supabase Authentication</strong>. To add, remove, or reset passwords for admins, go to your Supabase Dashboard → Authentication → Users.
          </p>
          <a href="https://supabase.com/dashboard" target="_blank" style={s.noteLink}>Open Supabase Dashboard →</a>
        </div>
      </div>

      <div style={s.note}>
        <span>🔑</span>
        <div>
          <p style={s.noteTitle}>Forgot your password?</p>
          <p style={s.noteText}>
            Go to Supabase Dashboard → Authentication → Users, find your account and reset the password from there.
          </p>
        </div>
      </div>
    </AdminShell>
  );
}

const s = {
  header:      {display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20},
  sub:         {fontSize:14,color:'#64748B'},
  addBtn:      {padding:'10px 22px',background:'#1A56DB',color:'#fff',border:'none',borderRadius:8,fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:'inherit'},
  success:     {background:'#D1FAE5',border:'1px solid #6EE7B7',color:'#065F46',fontSize:14,padding:'14px 18px',borderRadius:8,marginBottom:16,lineHeight:1.6},
  error:       {background:'#FEF2F2',border:'1px solid #FECACA',color:'#DC2626',fontSize:13,padding:'12px 16px',borderRadius:8,marginBottom:16},
  formCard:    {background:'#fff',borderRadius:14,padding:'24px',border:'1px solid #E2E8F0',marginBottom:24},
  formTitle:   {fontSize:16,fontWeight:700,color:'#0F172A',marginBottom:16},
  infoBox:     {background:'#F8FAFF',border:'1px solid #E2E8F0',borderRadius:10,padding:'16px 18px',marginBottom:16},
  infoText:    {fontSize:14,color:'#334155',lineHeight:1.8},
  externalBtn: {padding:'10px 22px',background:'#1A56DB',color:'#fff',border:'none',borderRadius:8,fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:'inherit'},
  teamList:    {marginBottom:24},
  sectionLabel:{fontSize:12,fontWeight:700,letterSpacing:'1px',textTransform:'uppercase',color:'#64748B',marginBottom:12},
  memberCard:  {background:'#fff',borderRadius:12,padding:'18px 22px',border:'1px solid #E2E8F0',display:'flex',alignItems:'center',gap:16},
  avatar:      {width:46,height:46,background:'#1A56DB',color:'#fff',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,fontWeight:700,flexShrink:0},
  memberInfo:  {flex:1},
  memberEmail: {fontSize:15,fontWeight:700,color:'#0F172A',marginBottom:3},
  memberDate:  {fontSize:12,color:'#94A3B8'},
  youBadge:    {background:'#EBF2FF',color:'#1A56DB',fontSize:11,fontWeight:700,padding:'4px 12px',borderRadius:100},
  note:        {background:'#fff',border:'1px solid #E2E8F0',borderRadius:12,padding:'18px 20px',display:'flex',gap:14,alignItems:'flex-start',marginBottom:14},
  noteTitle:   {fontSize:14,fontWeight:700,color:'#0F172A',marginBottom:4},
  noteText:    {fontSize:13,color:'#64748B',lineHeight:1.6,marginBottom:8},
  noteLink:    {fontSize:13,color:'#1A56DB',fontWeight:600,textDecoration:'none'},
};
