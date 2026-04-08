'use client';
import { useState, useEffect } from 'react';
import AdminShell from '@/components/AdminShell';
import { getContent, saveContent } from '@/lib/adminStore';

export default function PortfolioEditor() {
  const [items, setItems]     = useState([]);
  const [selected, setSel]    = useState(0);
  const [preview, setPreview] = useState(false);
  const [saved, setSaved]     = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getContent('portfolio');
      setItems(data);
    }
    load();
  }, []);

  const update = (key, val) => {
    const next = [...items];
    next[selected] = { ...next[selected], [key]: val };
    setItems(next);
  };

  const addCard = () => {
    setItems([...items, { tag: 'New', title: 'New Project', desc: '', result: '', image: '' }]);
    setSel(items.length);
  };

  const removeCard = () => {
    if (items.length <= 1) return;
    const next = items.filter((_, i) => i !== selected);
    setItems(next);
    setSel(Math.max(0, selected - 1));
  };

  const handleSave = async () => {
    await saveContent('portfolio', items);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const cur = items[selected] || {};

  return (
    <AdminShell title="Edit Portfolio">
      <div style={s.toolbar}>
        <button style={{ ...s.tabBtn, ...(preview ? {} : s.tabActive) }} onClick={() => setPreview(false)}>✏️ Edit</button>
        <button style={{ ...s.tabBtn, ...(preview ? s.tabActive : {}) }} onClick={() => setPreview(true)}>👁 Preview</button>
        <button style={s.addBtn} onClick={addCard}>+ Add Card</button>
        <button style={s.removeBtn} onClick={removeCard}>✕ Remove</button>
        <button style={s.saveBtn} onClick={handleSave}>{saved ? '✓ Saved!' : 'Save Changes'}</button>
      </div>

      <div style={s.tabs}>
        {items.map((item, i) => (
          <button key={i} style={{ ...s.tab, ...(selected === i ? s.tabActive2 : {}) }} onClick={() => setSel(i)}>
            {item.tag || `Card ${i + 1}`}
          </button>
        ))}
      </div>

      {preview ? (
        <div style={s.previewWrap}>
          <p style={s.previewLabel}>Live Preview — {cur.title}</p>
          <div style={s.card}>
            <div style={s.cardImgWrap}>
              {cur.image
                ? <img src={cur.image} alt="" style={s.cardImg} />
                : <div style={s.cardImgPlaceholder}>No image set</div>}
              <span style={s.cardTag}>{cur.tag}</span>
            </div>
            <div style={s.cardBody}>
              <h3 style={s.cardTitle}>{cur.title}</h3>
              <p style={s.cardDesc}>{cur.desc}</p>
              <div style={s.cardResult}>
                <span style={s.resultLabel}>Result</span>
                <span style={s.resultValue}>{cur.result}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={s.form}>
          {[
            { label: 'Industry Tag', key: 'tag', placeholder: 'Automotive' },
            { label: 'Project Title', key: 'title', placeholder: 'MMM Auto Sales' },
            { label: 'Result', key: 'result', placeholder: '+340% Leads' },
          ].map((f) => (
            <div key={f.key} style={s.field}>
              <label style={s.label}>{f.label}</label>
              <input value={cur[f.key] || ''} onChange={(e) => update(f.key, e.target.value)} style={s.input} placeholder={f.placeholder} />
            </div>
          ))}
          <div style={s.field}>
            <label style={s.label}>Description</label>
            <textarea value={cur.desc || ''} onChange={(e) => update('desc', e.target.value)}
              style={{ ...s.input, height: 80, resize: 'vertical' }} placeholder="Brief description of the campaign..." />
          </div>
          <div style={s.field}>
            <label style={s.label}>Image URL</label>
            <input value={cur.image || ''} onChange={(e) => update('image', e.target.value)}
              style={s.input} placeholder="https://images.unsplash.com/... or your own URL" />
            <p style={s.fieldHint}>Paste any image URL. Use <a href="https://unsplash.com" target="_blank" style={{ color: '#1A56DB' }}>unsplash.com</a> for free photos.</p>
            {cur.image && <img src={cur.image} alt="" style={s.imgPreview} />}
          </div>
        </div>
      )}
    </AdminShell>
  );
}

const s = {
  toolbar:        { display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' },
  tabBtn:         { padding: '9px 18px', border: '1.5px solid #E2E8F0', background: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#64748B', fontFamily: 'inherit' },
  tabActive:      { background: '#1A56DB', color: '#fff', borderColor: '#1A56DB' },
  addBtn:         { padding: '9px 16px', border: '1.5px solid #1A56DB', background: '#EBF2FF', color: '#1A56DB', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
  removeBtn:      { padding: '9px 16px', border: '1.5px solid #FECACA', background: '#FEF2F2', color: '#DC2626', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
  saveBtn:        { marginLeft: 'auto', padding: '10px 24px', background: '#1A56DB', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
  tabs:           { display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 },
  tab:            { padding: '7px 14px', border: '1px solid #E2E8F0', background: '#fff', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', color: '#64748B', fontFamily: 'inherit' },
  tabActive2:     { background: '#EBF2FF', color: '#1A56DB', borderColor: '#1A56DB' },
  form:           { background: '#fff', borderRadius: 14, padding: '28px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 18 },
  field:          { display: 'flex', flexDirection: 'column', gap: 5 },
  label:          { fontSize: 12, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#334155' },
  input:          { padding: '11px 14px', border: '1.5px solid #E2E8F0', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', color: '#0F172A', outline: 'none', background: '#F8FAFF', width: '100%' },
  fieldHint:      { fontSize: 12, color: '#64748B', marginTop: 4 },
  imgPreview:     { width: '100%', height: 180, objectFit: 'cover', borderRadius: 10, marginTop: 8 },
  previewWrap:    { borderRadius: 14, overflow: 'hidden', border: '1px solid #E2E8F0' },
  previewLabel:   { background: '#1A56DB', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', padding: '8px 16px', textAlign: 'center' },
  card:           { background: '#fff', borderRadius: 14, overflow: 'hidden' },
  cardImgWrap:    { position: 'relative', height: 200, overflow: 'hidden' },
  cardImg:        { width: '100%', height: '100%', objectFit: 'cover' },
  cardImgPlaceholder: { width: '100%', height: '100%', background: '#EBF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', fontSize: 14 },
  cardTag:        { position: 'absolute', top: 12, left: 12, background: 'rgba(255,255,255,0.92)', color: '#1A56DB', fontSize: 11, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', padding: '4px 12px', borderRadius: 100 },
  cardBody:       { padding: '22px 24px 26px' },
  cardTitle:      { fontSize: 20, fontWeight: 700, color: '#0F172A', marginBottom: 8 },
  cardDesc:       { fontSize: 14, color: '#64748B', lineHeight: 1.65, marginBottom: 16 },
  cardResult:     { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid #E2E8F0' },
  resultLabel:    { fontSize: 11, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: '#64748B' },
  resultValue:    { fontSize: 18, fontWeight: 800, color: '#1A56DB' },
};
