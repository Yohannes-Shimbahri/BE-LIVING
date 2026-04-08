'use client';
import { useState, useEffect } from 'react';
import AdminShell from '@/components/AdminShell';
import { getContent, saveContent } from '@/lib/adminStore';

export default function ServicesEditor() {
  const [services, setServices] = useState([]);
  const [selected, setSelected] = useState(0);
  const [preview, setPreview]   = useState(false);
  const [saved, setSaved]       = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getContent('services');
      setservices(data);
    }
    load();
  }, []);

  const update = (key, val) => {
    const next = [...services];
    next[selected] = { ...next[selected], [key]: val };
    setServices(next);
  };

  const updateItem = (j, val) => {
    const next = [...services];
    const items = [...(next[selected].items || [])];
    items[j] = val;
    next[selected] = { ...next[selected], items };
    setServices(next);
  };

  const handleSave = () => {
    saveContent('services', services);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const cur = services[selected] || {};

  return (
    <AdminShell title="Edit Services">
      <div style={s.toolbar}>
        <button style={{ ...s.tabBtn, ...(preview ? {} : s.tabActive) }} onClick={() => setPreview(false)}>✏️ Edit</button>
        <button style={{ ...s.tabBtn, ...(preview ? s.tabActive : {}) }} onClick={() => setPreview(true)}>👁 Preview</button>
        <button style={s.saveBtn} onClick={handleSave}>{saved ? '✓ Saved!' : 'Save Changes'}</button>
      </div>

      {/* Service tabs */}
      <div style={s.tabs}>
        {services.map((sv, i) => (
          <button key={i} style={{ ...s.serviceTab, ...(selected === i ? s.serviceTabActive : {}) }}
            onClick={() => setSelected(i)}>
            {sv.icon} {sv.title?.split(' ')[0]}
          </button>
        ))}
      </div>

      {preview ? (
        <div style={s.previewWrap}>
          <p style={s.previewLabel}>Live Preview — {cur.title}</p>
          <div style={s.card}>
            <div style={s.cardIcon}>{cur.icon}</div>
            <h3 style={s.cardTitle}>{cur.title}</h3>
            <p style={s.cardDesc}>{cur.desc}</p>
            <ul style={s.cardList}>
              {(cur.items || []).map((item, i) => (
                <li key={i} style={s.cardItem}><span style={s.check}>✓</span> {item}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div style={s.form}>
          <div style={s.row}>
            <div style={s.field}>
              <label style={s.label}>Icon (emoji)</label>
              <input value={cur.icon || ''} onChange={(e) => update('icon', e.target.value)} style={s.input} placeholder="◈" />
            </div>
            <div style={{ ...s.field, flex: 3 }}>
              <label style={s.label}>Service Title</label>
              <input value={cur.title || ''} onChange={(e) => update('title', e.target.value)} style={s.input} placeholder="Social Media Management" />
            </div>
          </div>
          <div style={s.field}>
            <label style={s.label}>Description</label>
            <textarea value={cur.desc || ''} onChange={(e) => update('desc', e.target.value)}
              style={{ ...s.input, height: 80, resize: 'vertical' }} placeholder="Short description..." />
          </div>
          <div style={s.field}>
            <label style={s.label}>Bullet Points</label>
            {(cur.items || []).map((item, j) => (
              <input key={j} value={item} onChange={(e) => updateItem(j, e.target.value)}
                style={{ ...s.input, marginBottom: 8 }} placeholder={`Bullet ${j + 1}`} />
            ))}
          </div>
        </div>
      )}
    </AdminShell>
  );
}

const s = {
  toolbar:        { display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' },
  tabBtn:         { padding: '9px 18px', border: '1.5px solid #E2E8F0', background: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#64748B', fontFamily: 'inherit' },
  tabActive:      { background: '#1A56DB', color: '#fff', borderColor: '#1A56DB' },
  saveBtn:        { marginLeft: 'auto', padding: '10px 24px', background: '#1A56DB', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
  tabs:           { display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 },
  serviceTab:     { padding: '7px 14px', border: '1px solid #E2E8F0', background: '#fff', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', color: '#64748B', fontFamily: 'inherit' },
  serviceTabActive:{ background: '#EBF2FF', color: '#1A56DB', borderColor: '#1A56DB' },
  form:           { background: '#fff', borderRadius: 14, padding: '28px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 18 },
  row:            { display: 'flex', gap: 14 },
  field:          { display: 'flex', flexDirection: 'column', gap: 5, flex: 1 },
  label:          { fontSize: 12, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#334155' },
  input:          { padding: '11px 14px', border: '1.5px solid #E2E8F0', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', color: '#0F172A', outline: 'none', background: '#F8FAFF', width: '100%' },
  previewWrap:    { borderRadius: 14, overflow: 'hidden', border: '1px solid #E2E8F0' },
  previewLabel:   { background: '#1A56DB', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', padding: '8px 16px', textAlign: 'center' },
  card:           { background: '#fff', padding: '32px', borderTop: '3px solid #1A56DB' },
  cardIcon:       { width: 52, height: 52, background: '#EBF2FF', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 16 },
  cardTitle:      { fontSize: 20, fontWeight: 700, color: '#0F172A', marginBottom: 10 },
  cardDesc:       { fontSize: 14, color: '#64748B', lineHeight: 1.7, marginBottom: 18, paddingBottom: 16, borderBottom: '1px solid #E2E8F0' },
  cardList:       { listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 },
  cardItem:       { fontSize: 14, color: '#334155', display: 'flex', gap: 8 },
  check:          { color: '#1A56DB', fontWeight: 700, flexShrink: 0 },
};
