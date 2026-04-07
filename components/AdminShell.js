'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, logoutAdmin } from '@/lib/adminStore';

const NAV = [
  { label: 'Dashboard',  href: '/admin/dashboard',          icon: '🏠' },
  { label: 'Hero',       href: '/admin/editors/hero',        icon: '✦' },
  { label: 'Stats',      href: '/admin/editors/stats',       icon: '📊' },
  { label: 'Services',   href: '/admin/editors/services',    icon: '⚙️' },
  { label: 'Portfolio',  href: '/admin/editors/portfolio',   icon: '🖼' },
  { label: 'Industries', href: '/admin/editors/industries',  icon: '🏢' },
  { label: 'About',      href: '/admin/editors/about',       icon: '📄' },
  { label: 'Contact',    href: '/admin/editors/contact',     icon: '📞' },
  { label: 'Theme',      href: '/admin/editors/theme',       icon: '🎨' },
  { label: 'Blog',       href: '/admin/editors/blog',        icon: '✏️' },
  { label: 'Team',       href: '/admin/team',                icon: '👥' },
];

export default function AdminShell({ children, title }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin]       = useState(null);
  const [sideOpen, setSideOpen] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const a = await getCurrentUser();
      if (!a) { router.push('/admin'); return; }
      setAdmin(a);
    }
    checkAuth();
  }, []);

  const handleLogout = () => { logoutAdmin(); router.push('/admin'); };

  return (
    <div style={s.shell}>
      {/* ── Sidebar ── */}
      <aside style={{ ...s.sidebar, ...(sideOpen ? s.sidebarOpen : {}) }}>
        <div style={s.sideTop}>
          <div style={s.sideLogo}>
            <div style={s.sideLogoIcon}>B</div>
            <span style={s.sideLogoText}>Be<span style={{ color: '#3B82F6' }}>Living</span></span>
          </div>
          <div style={s.sideAdminBadge}>Admin Panel</div>
        </div>

        <nav style={s.nav}>
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}
                style={{ ...s.navItem, ...(active ? s.navItemActive : {}) }}
                onClick={() => setSideOpen(false)}>
                <span style={s.navIcon}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div style={s.sideBottom}>
          <Link href="/" target="_blank" style={s.viewSiteBtn}>🌐 View Live Site</Link>
          <button style={s.logoutBtn} onClick={handleLogout}>← Log Out</button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div style={s.main}>
        {/* Top bar */}
        <div style={s.topBar}>
          <div style={s.topLeft}>
            <button style={s.hamburger} onClick={() => setSideOpen(!sideOpen)}>☰</button>
            <h1 style={s.pageTitle}>{title}</h1>
          </div>
          {admin && (
            <div style={s.adminInfo}>
              <div style={s.adminAvatar}>{admin.email?.[0]?.toUpperCase() || 'A'}</div>
              <div>
                <p style={s.adminName}>{admin.email}</p>
                <p style={s.adminRole}>Admin</p>
              </div>
            </div>
          )}
        </div>

        {/* Page content */}
        <div style={s.content}>{children}</div>
      </div>

      {/* Mobile overlay */}
      {sideOpen && <div style={s.overlay} onClick={() => setSideOpen(false)} />}
    </div>
  );
}

const s = {
  shell:    { display: 'flex', minHeight: '100vh', background: '#F1F5F9' },
  sidebar:  { width: 240, background: '#0F172A', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50, transition: 'transform 0.3s', overflowY: 'auto' },
  sidebarOpen: { transform: 'translateX(0)' },
  sideTop:  { padding: '24px 20px 16px' },
  sideLogo: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 },
  sideLogoIcon: { width: 34, height: 34, background: '#1A56DB', color: '#fff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800 },
  sideLogoText: { fontSize: 17, fontWeight: 800, color: '#fff' },
  sideAdminBadge: { fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#3B82F6', background: 'rgba(59,130,246,0.15)', padding: '4px 10px', borderRadius: 100, display: 'inline-block' },
  nav:      { flex: 1, padding: '12px 12px' },
  navItem:  { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: 500, textDecoration: 'none', marginBottom: 2, transition: 'all 0.15s' },
  navItemActive: { background: 'rgba(26,86,219,0.3)', color: '#93C5FD', fontWeight: 700 },
  navIcon:  { fontSize: 16, width: 20, textAlign: 'center' },
  sideBottom: { padding: '16px 16px 24px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: 8 },
  viewSiteBtn: { display: 'block', textAlign: 'center', padding: '9px', background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s' },
  logoutBtn: { padding: '9px', background: 'none', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' },
  main:     { flex: 1, marginLeft: 240, display: 'flex', flexDirection: 'column', minHeight: '100vh' },
  topBar:   { background: '#fff', borderBottom: '1px solid #E2E8F0', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10, boxShadow: '0 1px 8px rgba(0,0,0,0.05)' },
  topLeft:  { display: 'flex', alignItems: 'center', gap: 14 },
  hamburger:{ display: 'none', background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', padding: 4 },
  pageTitle:{ fontSize: 20, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.3px' },
  adminInfo:{ display: 'flex', alignItems: 'center', gap: 10 },
  adminAvatar: { width: 38, height: 38, background: '#1A56DB', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700 },
  adminName:{ fontSize: 14, fontWeight: 700, color: '#0F172A', margin: 0 },
  adminRole:{ fontSize: 11, color: '#64748B', textTransform: 'capitalize', margin: 0 },
  content:  { flex: 1, padding: '32px', maxWidth: 1100, width: '100%' },
  overlay:  { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 40 },
};
