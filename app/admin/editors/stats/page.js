'use client';
import { useState, useEffect } from 'react';
import AdminShell from '@/components/AdminShell';
import { getContent, saveContent } from '@/lib/adminStore';

export default function StatsEditor() {
  const [stats, setStats]     = useState([]);
  const [preview, setPreview] = useState(false);
  const [saved, setSaved]     = useState(false);

  useEffect(() => { setStats(getContent('stats')); }, []);

  const update = (i, key, val) => {
    const next = [...stats];
    next[i] = { ...next[i], [key]: val };
    setStats(next);
  };

  const handleSave = () => {
    saveContent('stats', stats);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <AdminShell title="Edit Stats Bar">
      <div style={s.toolbar}>
        <button style={{ ...s.tabBtn, ...(preview ? {} : s.tabActive) }} onClick={() => setPreview(false)}>✏️ Edit</button>
        <button style={{ ...s.tabBtn, ...(preview ? s.tabActive : {}) }} onClick={() => setPreview(true)}>👁 Preview</button>
        <button style={s.saveBtn} onClick={handleSave}>{saved ? '✓ Saved!' : 'Save Changes'}</button>
      </div>

      {preview ? (
        <div style={s.previewWrap}>
          <p style={s.previewLabel}>Live Preview</p>
          <div style={s.statsBar}>
            {stats.map((st, i) => (
              <div key={i} style={s.statItem}>
                <div style={s.statDivider} />
                <div>
                  <p style={s.statValue}>{st.value}</p>
                  <p style={s.statLabel}>{st.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={s.form}>
          <p style={s.hint}>Edit the 4 stat numbers and labels shown on the homepage.</p>
          {stats.map((st, i) => (
            <div key={i} style={s.statCard}>
              <p style={s.statNum}>Stat {i + 1}</p>
              <div style={s.row}>
                <div style={s.field}>
                  <label style={s.label}>Value</label>
                  <input value={st.value || ''} onChange={(e) => update(i, 'value', e.target.value)} style={s.input} placeholder="120+" />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Label</label>
                  <input value={st.label || ''} onChange={(e) => update(i, 'label', e.target.value)} style={s.input} placeholder="Campaigns Launched" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}

const s = {
  toolbar:     { display: 'flex', gap: 8, marginBottom: 24, alignItems: 'center' },
  tabBtn:      { padding: '9px 18px', border: '1.5px solid #E2E8F0', background: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#64748B', fontFamily: 'inherit' },
  tabActive:   { background: '#1A56DB', color: '#fff', borderColor: '#1A56DB' },
  saveBtn:     { marginLeft: 'auto', padding: '10px 24px', background: '#1A56DB', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
  form:        { background: '#fff', borderRadius: 14, padding: '28px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 16 },
  hint:        { fontSize: 14, color: '#64748B', marginBottom: 4 },
  statCard:    { border: '1px solid #E2E8F0', borderRadius: 10, padding: '18px 20px', background: '#F8FAFF' },
  statNum:     { fontSize: 12, fontWeight: 700, color: '#1A56DB', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 12 },
  row:         { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
  field:       { display: 'flex', flexDirection: 'column', gap: 5 },
  label:       { fontSize: 12, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#334155' },
  input:       { padding: '11px 14px', border: '1.5px solid #E2E8F0', borderRadius: 8, fontSize: 15, fontFamily: 'inherit', color: '#0F172A', outline: 'none', background: '#fff' },
  previewWrap: { borderRadius: 14, overflow: 'hidden', border: '1px solid #E2E8F0' },
  previewLabel:{ background: '#1A56DB', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', padding: '8px 16px', textAlign: 'center' },
  statsBar:    { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', background: '#fff', borderTop: '1px solid #E2E8F0' },
  statItem:    { display: 'flex', alignItems: 'center', gap: 14, padding: '24px 28px', borderRight: '1px solid #E2E8F0' },
  statDivider: { width: 4, height: 40, background: 'linear-gradient(180deg,#1A56DB,#06B6D4)', borderRadius: 4, flexShrink: 0 },
  statValue:   { fontSize: 34, fontWeight: 800, color: '#0F172A', lineHeight: 1, letterSpacing: '-2px', margin: 0 },
  statLabel:   { fontSize: 12, color: '#64748B', fontWeight: 600, marginTop: 3 },
};
