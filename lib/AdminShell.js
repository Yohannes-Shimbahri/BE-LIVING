'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const NAV = [
  { label: 'Dashboard',  href: '/admin/dashboard',          icon: '🏠' },
  { label: 'Hero',       href: '/admin/editors/hero',        icon: '✦'  },
  { label: 'Stats',      href: '/admin/editors/stats',       icon: '📊' },
  { label: 'Services',   href: '/admin/editors/services',    icon: '⚙️'  },
  { label: 'Portfolio',  href: '/admin/editors/portfolio',   icon: '🖼'  },
  { label: 'Industries', href: '/admin/editors/industries',  icon: '🏢' },
  { label: 'About',      href: '/admin/editors/about',       icon: '📄' },
  { label: 'Contact',    href: '/admin/editors/contact',     icon: '📞' },
  { label: 'Theme',      href: '/admin/editors/theme',       icon: '🎨' },
  { label: 'Blog',       href: '/admin/editors/blog',        icon: '✏️'  },
  { label: 'Team',       href: '/admin/team',                icon: '👥' },
];

export default function AdminShell({ children, title }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [user, setUser]         = useState(null);
  const [sideOpen, setSideOpen] = useState(true);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/admin'); return; }
      setUser(session.user);
      setChecking(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) router.push('/admin');
      else { setUser(session.user); setChecking(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/admin'); };

  if (checking) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F1F5F9' }}>
      <p style={{ color: '#64748B' }}>Loading...</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={s.shell}>
      <aside style={{ ...s.sidebar, ...(!sideOpen ? s.sideHidden : {}) }}>
        <div style={s.sideTop}>
          <div style={s.logo}><div style={s.logoIcon}>B</div><span style={s.logoTxt}>Be<span style={{color:'#3B82F6'}}>Living</span></span></div>
          <span style={s.badge}>Admin Panel</span>
        </div>
        <nav style={s.nav}>
          {NAV.map(item => (
            <Link key={item.href} href={item.href} onClick={() => setSideOpen(false)}
              style={{...s.navItem,...(pathname===item.href?s.navActive:{})}}>
              <span style={s.navIcon}>{item.icon}</span>{item.label}
            </Link>
          ))}
        </nav>
        <div style={s.sideBot}>
          <Link href="/" target="_blank" style={s.viewSite}>🌐 View Live Site</Link>
          <button style={s.logoutBtn} onClick={handleLogout}>← Log Out</button>
        </div>
      </aside>

      <div style={{...s.main,...(sideOpen?s.mainOpen:{})}}>
        <div style={s.topBar}>
          <div style={s.topLeft}>
            <button style={s.hamburger} onClick={() => setSideOpen(!sideOpen)}>{sideOpen ? '✕' : '☰'}</button>
            <h1 style={s.pageTitle}>{title}</h1>
          </div>
          {user && (
            <div style={s.userInfo}>
              <div style={s.avatar}>{user.email?.[0]?.toUpperCase()}</div>
              <p style={s.userEmail}>{user.email}</p>
            </div>
          )}
        </div>
        <div style={s.content}>{children}</div>
      </div>

      {sideOpen && <div style={s.overlay} onClick={() => setSideOpen(false)} />}
    </div>
  );
}

const s = {
  shell:    {display:'flex',minHeight:'100vh',background:'#F1F5F9'},
  sidebar:  {width:240,background:'#0F172A',display:'flex',flexDirection:'column',position:'fixed',top:0,left:0,bottom:0,zIndex:50,overflowY:'auto',transition:'transform 0.25s ease'},
  sideHidden:{transform:'translateX(-100%)'},
  sideTop:  {padding:'24px 20px 14px'},
  logo:     {display:'flex',alignItems:'center',gap:10,marginBottom:10},
  logoIcon: {width:34,height:34,background:'#1A56DB',color:'#fff',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:800},
  logoTxt:  {fontSize:17,fontWeight:800,color:'#fff'},
  badge:    {fontSize:10,fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',color:'#3B82F6',background:'rgba(59,130,246,0.15)',padding:'4px 10px',borderRadius:100,display:'inline-block'},
  nav:      {flex:1,padding:'12px'},
  navItem:  {display:'flex',alignItems:'center',gap:10,padding:'10px 12px',borderRadius:8,color:'rgba(255,255,255,0.55)',fontSize:14,fontWeight:500,textDecoration:'none',marginBottom:2,transition:'all 0.15s'},
  navActive:{background:'rgba(26,86,219,0.3)',color:'#93C5FD',fontWeight:700},
  navIcon:  {fontSize:16,width:20,textAlign:'center',flexShrink:0},
  sideBot:  {padding:'16px',borderTop:'1px solid rgba(255,255,255,0.08)',display:'flex',flexDirection:'column',gap:8},
  viewSite: {display:'block',textAlign:'center',padding:'9px',background:'rgba(255,255,255,0.07)',color:'rgba(255,255,255,0.65)',borderRadius:8,fontSize:13,fontWeight:600,textDecoration:'none'},
  logoutBtn:{padding:'9px',background:'none',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.45)',borderRadius:8,fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'inherit'},
  main:     {flex:1,display:'flex',flexDirection:'column',minHeight:'100vh',transition:'margin 0.25s ease'},
  mainOpen: {marginLeft:240},
  topBar:   {background:'#fff',borderBottom:'1px solid #E2E8F0',padding:'14px 28px',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:10,boxShadow:'0 1px 6px rgba(0,0,0,0.04)'},
  topLeft:  {display:'flex',alignItems:'center',gap:14},
  hamburger:{background:'none',border:'none',fontSize:20,cursor:'pointer',padding:4,color:'#334155'},
  pageTitle:{fontSize:19,fontWeight:800,color:'#0F172A',letterSpacing:'-0.3px'},
  userInfo: {display:'flex',alignItems:'center',gap:10},
  avatar:   {width:36,height:36,background:'#1A56DB',color:'#fff',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,fontWeight:700},
  userEmail:{fontSize:13,color:'#64748B',fontWeight:500},
  content:  {flex:1,padding:'28px 32px',maxWidth:1100,width:'100%'},
  overlay:  {position:'fixed',inset:0,background:'rgba(0,0,0,0.35)',zIndex:40},
};
