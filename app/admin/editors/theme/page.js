'use client';
import { useState, useEffect } from 'react';
import AdminShell from '@/components/AdminShell';
import { getContent, saveContent } from '@/lib/adminStore';

const COLOR_FIELDS = [
  { label: 'Primary Blue',   key: 'blue',      hint: 'Main brand color — buttons, links, accents' },
  { label: 'Dark Blue',      key: 'blueDark',   hint: 'Hover states and darker accents' },
  { label: 'Light Blue',     key: 'blueLight',  hint: 'Background tints and icon wraps' },
  { label: 'Accent (Cyan)',  key: 'accent',     hint: 'Pop color used in gradients' },
  { label: 'Dark Background',key: 'dark',       hint: 'Footer, hero background' },
  { label: 'Off White',      key: 'offwhite',   hint: 'Page background color' },
];

export default function ThemeEditor() {
  const [colors, setColors]   = useState({});
  const [preview, setPreview] = useState(false);
  const [saved, setSaved]     = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getContent('theme');
      setData(data);
    }
    load();
  }, []);

  const handleSave = async () => {
    await saveContent('theme', colors);
    // Apply CSS variables live to the page
    Object.entries(colors).forEach(([key, val]) => {
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      document.documentElement.style.setProperty(`--${cssKey}`, val);
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  // Apply preview in real time as user picks colors
  const handleChange = (key, val) => {
    setColors({ ...colors, [key]: val });
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    document.documentElement.style.setProperty(`--${cssKey}`, val);
  };

  return (
    <AdminShell title="Theme & Colors">
      <div style={s.toolbar}>
        <button style={{ ...s.tabBtn, ...(preview ? {} : s.tabActive) }} onClick={() => setPreview(false)}>🎨 Edit Colors</button>
        <button style={{ ...s.tabBtn, ...(preview ? s.tabActive : {}) }} onClick={() => setPreview(true)}>👁 Preview</button>
        <button style={s.saveBtn} onClick={handleSave}>{saved ? '✓ Saved!' : 'Save Changes'}</button>
      </div>

      <div style={s.notice}>
        <span>⚡</span>
        <p style={s.noticeText}>Color changes apply <strong>live</strong> as you pick — you can see them on the site immediately. Click Save to make them permanent.</p>
      </div>

      {preview ? (
        <div style={s.previewWrap}>
          <p style={s.previewLabel}>Live Preview — UI Elements</p>
          <div style={{ background: '#fff', padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Hero preview */}
            <div style={{ background: `linear-gradient(135deg, ${colors.dark || '#0F172A'}, ${colors.blue || '#1A56DB'})`, borderRadius: 12, padding: '28px 32px' }}>
              <span style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '1px', padding: '5px 14px', borderRadius: 100, display: 'inline-block', marginBottom: 14 }}>
                Full Service Digital Marketing Agency
              </span>
              <h2 style={{ color: '#fff', fontSize: 28, fontWeight: 800, marginBottom: 10 }}>We Build Brands That Move People.</h2>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ background: colors.blue || '#1A56DB', color: '#fff', padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 700 }}>Book a Consultation</div>
                <div style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '10px 20px', borderRadius: 8, fontSize: 13, border: '1px solid rgba(255,255,255,0.3)' }}>View Our Work</div>
              </div>
            </div>

            {/* Stat preview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0, border: '1px solid #E2E8F0', borderRadius: 10, overflow: 'hidden' }}>
              {['120+', '6', '340%', '98%'].map((v, i) => (
                <div key={i} style={{ padding: '18px 20px', borderRight: i < 3 ? '1px solid #E2E8F0' : 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 4, height: 36, background: colors.blue || '#1A56DB', borderRadius: 4 }} />
                  <div>
                    <p style={{ fontSize: 26, fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>{v}</p>
                    <p style={{ fontSize: 11, color: '#64748B', marginTop: 3 }}>Stat Label</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Button samples */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ background: colors.blue || '#1A56DB', color: '#fff', padding: '11px 22px', borderRadius: 8, fontSize: 14, fontWeight: 700 }}>Primary Button</div>
              <div style={{ background: colors.blueLight || '#EBF2FF', color: colors.blue || '#1A56DB', padding: '11px 22px', borderRadius: 8, fontSize: 14, fontWeight: 700 }}>Light Button</div>
              <div style={{ background: colors.accent || '#06B6D4', color: '#fff', padding: '11px 22px', borderRadius: 8, fontSize: 14, fontWeight: 700 }}>Accent Button</div>
              <span style={{ fontSize: 14, color: colors.blue || '#1A56DB', fontWeight: 700 }}>Link Text →</span>
            </div>

            {/* Tag badge */}
            <div style={{ display: 'flex', gap: 10 }}>
              <span style={{ background: colors.blueLight || '#EBF2FF', color: colors.blue || '#1A56DB', fontSize: 12, fontWeight: 700, letterSpacing: '1px', padding: '5px 14px', borderRadius: 100 }}>Section Tag</span>
              <span style={{ background: colors.dark || '#0F172A', color: '#fff', fontSize: 12, fontWeight: 700, padding: '5px 14px', borderRadius: 100 }}>Dark Tag</span>
            </div>
          </div>
        </div>
      ) : (
        <div style={s.grid}>
          {COLOR_FIELDS.map((f) => (
            <div key={f.key} style={s.colorCard}>
              <div style={s.colorTop}>
                <div style={{ ...s.colorSwatch, background: colors[f.key] || '#000' }} />
                <div>
                  <p style={s.colorLabel}>{f.label}</p>
                  <p style={s.colorHint}>{f.hint}</p>
                </div>
              </div>
              <div style={s.colorInputRow}>
                <input type="color" value={colors[f.key] || '#000000'}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                  style={s.colorPicker} />
                <input type="text" value={colors[f.key] || ''}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                  style={s.hexInput} placeholder="#1A56DB" />
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}

const s = {
  toolbar:    { display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' },
  tabBtn:     { padding: '9px 18px', border: '1.5px solid #E2E8F0', background: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#64748B', fontFamily: 'inherit' },
  tabActive:  { background: '#1A56DB', color: '#fff', borderColor: '#1A56DB' },
  saveBtn:    { marginLeft: 'auto', padding: '10px 24px', background: '#1A56DB', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
  notice:     { background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 10, padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 20 },
  noticeText: { fontSize: 13, color: '#92400E', lineHeight: 1.5 },
  grid:       { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 },
  colorCard:  { background: '#fff', borderRadius: 12, padding: '20px', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
  colorTop:   { display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 },
  colorSwatch:{ width: 48, height: 48, borderRadius: 10, border: '1px solid rgba(0,0,0,0.1)', flexShrink: 0 },
  colorLabel: { fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 3 },
  colorHint:  { fontSize: 12, color: '#64748B', lineHeight: 1.4 },
  colorInputRow:{ display: 'flex', gap: 10, alignItems: 'center' },
  colorPicker:{ width: 44, height: 44, border: '1px solid #E2E8F0', borderRadius: 8, cursor: 'pointer', padding: 2 },
  hexInput:   { flex: 1, padding: '11px 14px', border: '1.5px solid #E2E8F0', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', color: '#0F172A', outline: 'none', background: '#F8FAFF' },
  previewWrap:{ borderRadius: 14, overflow: 'hidden', border: '1px solid #E2E8F0' },
  previewLabel:{ background: '#1A56DB', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', padding: '8px 16px', textAlign: 'center' },
};
