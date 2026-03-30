'use client';
import { useState, useEffect } from 'react';
import AdminShell from '@/components/AdminShell';
import { getContent, saveContent } from '@/lib/adminStore';

export default function HeroEditor() {
  const [data, setData]       = useState({ badge: '', title: '', subtitle: '', btn1: '', btn2: '' });
  const [preview, setPreview] = useState(false);
  const [saved, setSaved]     = useState(false);

  useEffect(() => { setData(getContent('hero')); }, []);

  const handleSave = () => {
    saveContent('hero', data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <AdminShell title="Edit Hero Section">
      <div style={s.toolbar}>
        <button style={{ ...s.tabBtn, ...(preview ? {} : s.tabActive) }} onClick={() => setPreview(false)}>✏️ Edit</button>
        <button style={{ ...s.tabBtn, ...(preview ? s.tabActive : {}) }} onClick={() => setPreview(true)}>👁 Preview</button>
        <button style={s.saveBtn} onClick={handleSave}>{saved ? '✓ Saved!' : 'Save Changes'}</button>
      </div>

      {preview ? (
        <div style={s.previewWrap}>
          <p style={s.previewLabel}>Live Preview</p>
          <div style={s.heroPreview}>
            <div style={s.heroDots} />
            <span style={s.heroBadge}>{data.badge}</span>
            <h1 style={s.heroTitle}>{data.title}</h1>
            <p style={s.heroSub}>{data.subtitle}</p>
            <div style={s.heroBtns}>
              <div style={s.btn1}>{data.btn1}</div>
              <div style={s.btn2}>{data.btn2}</div>
            </div>
          </div>
        </div>
      ) : (
        <div style={s.form}>
          {[
            { label: 'Badge Text', key: 'badge', placeholder: 'Full Service Digital Marketing Agency' },
            { label: 'Main Title', key: 'title', placeholder: 'We Build Brands That Move People.' },
            { label: 'Subtitle', key: 'subtitle', placeholder: 'We help grow your business, naturally.' },
            { label: 'Button 1 Text', key: 'btn1', placeholder: 'Book a Consultation' },
            { label: 'Button 2 Text', key: 'btn2', placeholder: 'View Our Work' },
          ].map((f) => (
            <div key={f.key} style={s.field}>
              <label style={s.label}>{f.label}</label>
              <input value={data[f.key] || ''} onChange={(e) => setData({ ...data, [f.key]: e.target.value })}
                style={s.input} placeholder={f.placeholder} />
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}

const s = {
  toolbar:     { display: 'flex', gap: 8, marginBottom: 24, alignItems: 'center', flexWrap: 'wrap' },
  tabBtn:      { padding: '9px 18px', border: '1.5px solid #E2E8F0', background: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#64748B', fontFamily: 'inherit' },
  tabActive:   { background: '#1A56DB', color: '#fff', borderColor: '#1A56DB' },
  saveBtn:     { marginLeft: 'auto', padding: '10px 24px', background: '#1A56DB', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(26,86,219,0.25)' },
  form:        { background: '#fff', borderRadius: 14, padding: '28px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 20 },
  field:       { display: 'flex', flexDirection: 'column', gap: 6 },
  label:       { fontSize: 12, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#334155' },
  input:       { padding: '12px 14px', border: '1.5px solid #E2E8F0', borderRadius: 8, fontSize: 15, fontFamily: 'inherit', color: '#0F172A', outline: 'none', background: '#F8FAFF', transition: 'all 0.2s' },
  previewWrap: { borderRadius: 14, overflow: 'hidden', border: '1px solid #E2E8F0' },
  previewLabel:{ background: '#1A56DB', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', padding: '8px 16px', textAlign: 'center' },
  heroPreview: { background: 'linear-gradient(135deg,#1040B0,#1A56DB,#3B82F6)', padding: '60px 48px', position: 'relative', overflow: 'hidden' },
  heroDots:    { position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.07) 1px,transparent 1px)', backgroundSize: '28px 28px' },
  heroBadge:   { display: 'inline-block', background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '1px', padding: '6px 16px', borderRadius: 100, marginBottom: 18, border: '1px solid rgba(255,255,255,0.2)', position: 'relative' },
  heroTitle:   { fontSize: 40, fontWeight: 800, color: '#fff', lineHeight: 1.1, letterSpacing: '-1px', marginBottom: 14, position: 'relative' },
  heroSub:     { fontSize: 16, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, marginBottom: 28, maxWidth: 480, position: 'relative' },
  heroBtns:    { display: 'flex', gap: 12, position: 'relative' },
  btn1:        { background: '#fff', color: '#1A56DB', padding: '12px 24px', borderRadius: 8, fontSize: 13, fontWeight: 700 },
  btn2:        { background: 'transparent', color: '#fff', padding: '12px 24px', borderRadius: 8, fontSize: 13, fontWeight: 600, border: '2px solid rgba(255,255,255,0.4)' },
};
