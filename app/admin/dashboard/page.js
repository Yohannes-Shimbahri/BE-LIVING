'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminShell from '@/components/AdminShell';
import { supabase } from '@/lib/supabase';

const EDITORS = [
  { label: 'Hero Section',   href: '/admin/editors/hero',       icon: '✦', desc: 'Badge, title, subtitle, buttons' },
  { label: 'Stats Bar',      href: '/admin/editors/stats',      icon: '📊', desc: 'The 4 numbers and labels' },
  { label: 'Services',       href: '/admin/editors/services',   icon: '⚙️', desc: 'All 7 service cards' },
  { label: 'Portfolio',      href: '/admin/editors/portfolio',  icon: '🖼',  desc: 'Case study cards + images' },
  { label: 'Industries',     href: '/admin/editors/industries', icon: '🏢', desc: 'Industry cards + images' },
  { label: 'About Page',     href: '/admin/editors/about',      icon: '📄', desc: 'Story and body text' },
  { label: 'Contact Info',   href: '/admin/editors/contact',    icon: '📞', desc: 'Email, phone, location' },
  { label: 'Theme & Colors', href: '/admin/editors/theme',      icon: '🎨', desc: 'Brand colors live preview' },
  { label: 'Blog Posts',     href: '/admin/editors/blog',       icon: '✏️', desc: 'Write, edit, publish posts' },
  { label: 'Team Members',   href: '/admin/team',               icon: '👥', desc: 'Manage admin users' },
];

export default function Dashboard() {
  const [postCount, setPostCount] = useState(null);

  useEffect(() => {
    supabase.from('posts').select('id', { count: 'exact', head: true })
      .then(({ count }) => setPostCount(count));
  }, []);

  return (
    <AdminShell title="Dashboard">
      <div style={s.welcome}>
        <h2 style={s.welcomeTitle}>Welcome to your Admin Panel 👋</h2>
        <p style={s.welcomeSub}>Select any section below to edit your website. Every editor has a live preview so you can see changes before saving.</p>
      </div>

      {/* Quick stats */}
      <div style={s.quickStats}>
        <div style={s.qs}>
          <p style={s.qsVal}>{postCount ?? '—'}</p>
          <p style={s.qsLabel}>Blog Posts</p>
        </div>
        <div style={s.qs}>
          <p style={s.qsVal}>✓</p>
          <p style={s.qsLabel}>Supabase Connected</p>
        </div>
        <div style={s.qs}>
          <p style={s.qsVal}>Live</p>
          <p style={s.qsLabel}>Site Status</p>
        </div>
      </div>

      <div style={s.grid}>
        {EDITORS.map((e) => (
          <Link key={e.href} href={e.href} style={s.card}>
            <div style={s.cardIcon}>{e.icon}</div>
            <div style={{flex:1}}>
              <p style={s.cardLabel}>{e.label}</p>
              <p style={s.cardDesc}>{e.desc}</p>
            </div>
            <span style={s.arrow}>→</span>
          </Link>
        ))}
      </div>

      <div style={s.tip}>
        <span>💡</span>
        <p style={s.tipText}>All content is saved to <strong>Supabase</strong> — changes are permanent and sync across all devices instantly.</p>
      </div>
    </AdminShell>
  );
}

const s = {
  welcome:      {background:'linear-gradient(135deg,#1040B0,#1A56DB)',borderRadius:16,padding:'28px 32px',marginBottom:24,color:'#fff'},
  welcomeTitle: {fontSize:22,fontWeight:800,marginBottom:6},
  welcomeSub:   {fontSize:14,color:'rgba(255,255,255,0.75)',lineHeight:1.6},
  quickStats:   {display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:24},
  qs:           {background:'#fff',borderRadius:12,padding:'18px 20px',border:'1px solid #E2E8F0',textAlign:'center'},
  qsVal:        {fontSize:26,fontWeight:800,color:'#1A56DB',lineHeight:1,marginBottom:4},
  qsLabel:      {fontSize:12,color:'#64748B',fontWeight:600},
  grid:         {display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:12,marginBottom:20},
  card:         {background:'#fff',borderRadius:12,padding:'16px 18px',display:'flex',alignItems:'center',gap:12,textDecoration:'none',border:'1px solid #E2E8F0',boxShadow:'0 1px 4px rgba(0,0,0,0.04)',transition:'all 0.2s'},
  cardIcon:     {width:42,height:42,background:'#EBF2FF',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0},
  cardLabel:    {fontSize:14,fontWeight:700,color:'#0F172A',marginBottom:2},
  cardDesc:     {fontSize:12,color:'#64748B'},
  arrow:        {color:'#1A56DB',fontSize:18,fontWeight:700,flexShrink:0},
  tip:          {background:'#F0FDF4',border:'1px solid #BBF7D0',borderRadius:12,padding:'14px 18px',display:'flex',gap:10,alignItems:'flex-start'},
  tipText:      {fontSize:13,color:'#166534',lineHeight:1.5},
};
