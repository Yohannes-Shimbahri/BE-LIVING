'use client';
import Link from 'next/link';
import AdminShell from '@/components/AdminShell';

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
  { label: 'Team Members',   href: '/admin/team',               icon: '👥', desc: 'Add or remove admin users' },
];

export default function Dashboard() {
  return (
    <AdminShell title="Dashboard">
      <div style={s.welcome}>
        <h2 style={s.welcomeTitle}>Welcome to your Admin Panel 👋</h2>
        <p style={s.welcomeSub}>Select any section below to edit your website. Every editor has a live preview so you can see changes before saving.</p>
      </div>
      <div style={s.grid}>
        {EDITORS.map((e) => (
          <Link key={e.href} href={e.href} style={s.card}>
            <div style={s.cardIconWrap}>{e.icon}</div>
            <div style={{ flex: 1 }}>
              <p style={s.cardLabel}>{e.label}</p>
              <p style={s.cardDesc}>{e.desc}</p>
            </div>
            <span style={s.arrow}>→</span>
          </Link>
        ))}
      </div>
      <div style={s.tip}>
        <span>💡</span>
        <p style={s.tipText}>Every editor has a <strong>Live Preview</strong> — see exactly how changes look before saving to the site.</p>
      </div>
    </AdminShell>
  );
}

const s = {
  welcome:      { background: 'linear-gradient(135deg,#1040B0,#1A56DB)', borderRadius: 16, padding: '30px 32px', marginBottom: 28, color: '#fff' },
  welcomeTitle: { fontSize: 22, fontWeight: 800, marginBottom: 6 },
  welcomeSub:   { fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 },
  grid:         { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(270px,1fr))', gap: 14, marginBottom: 24 },
  card:         { background: '#fff', borderRadius: 12, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: 'all 0.2s' },
  cardIconWrap: { width: 44, height: 44, background: '#EBF2FF', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 },
  cardLabel:    { fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 2 },
  cardDesc:     { fontSize: 12, color: '#64748B' },
  arrow:        { color: '#1A56DB', fontSize: 18, fontWeight: 700, flexShrink: 0 },
  tip:          { background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 12, padding: '14px 18px', display: 'flex', gap: 10, alignItems: 'flex-start' },
  tipText:      { fontSize: 13, color: '#92400E', lineHeight: 1.6 },
};
