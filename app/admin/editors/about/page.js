'use client';
import { useState, useEffect } from 'react';
import AdminShell from '@/components/AdminShell';
import { getContent, saveContent } from '@/lib/adminStore';

export default function AboutEditor() {
  const [data, setData]       = useState({ heading: '', p1: '', p2: '', p3: '' });
  const [preview, setPreview] = useState(false);
  const [saved, setSaved]     = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getContent('about');
      setData(data);
    }
    load();
  }, []);

  const handleSave = async () => {
    await saveContent('about', data); setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  return (
    <AdminShell title="Edit About Page">
      <div style={s.toolbar}>
        <button style={{ ...s.tabBtn, ...(preview ? {} : s.tabActive) }} onClick={() => setPreview(false)}>✏️ Edit</button>
        <button style={{ ...s.tabBtn, ...(preview ? s.tabActive : {}) }} onClick={() => setPreview(true)}>👁 Preview</button>
        <button style={s.saveBtn} onClick={handleSave}>{saved ? '✓ Saved!' : 'Save Changes'}</button>
      </div>
      {preview ? (
        <div style={s.previewWrap}>
          <p style={s.previewLabel}>Live Preview</p>
          <div style={s.preview}>
            <h2 style={s.previewHeading}>{data.heading}</h2>
            <p style={s.previewP}>{data.p1}</p>
            <p style={s.previewP}>{data.p2}</p>
            <p style={s.previewP}>{data.p3}</p>
          </div>
        </div>
      ) : (
        <div style={s.form}>
          {[
            { label: 'Section Heading', key: 'heading', rows: 1 },
            { label: 'Paragraph 1', key: 'p1', rows: 4 },
            { label: 'Paragraph 2', key: 'p2', rows: 4 },
            { label: 'Paragraph 3', key: 'p3', rows: 4 },
          ].map((f) => (
            <div key={f.key} style={s.field}>
              <label style={s.label}>{f.label}</label>
              <textarea value={data[f.key] || ''} onChange={(e) => setData({ ...data, [f.key]: e.target.value })}
                style={{ ...s.input, height: f.rows * 44, resize: 'vertical' }} />
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}

const s = {
  toolbar:{display:'flex',gap:8,marginBottom:24,alignItems:'center'},
  tabBtn:{padding:'9px 18px',border:'1.5px solid #E2E8F0',background:'#fff',borderRadius:8,fontSize:13,fontWeight:600,cursor:'pointer',color:'#64748B',fontFamily:'inherit'},
  tabActive:{background:'#1A56DB',color:'#fff',borderColor:'#1A56DB'},
  saveBtn:{marginLeft:'auto',padding:'10px 24px',background:'#1A56DB',color:'#fff',border:'none',borderRadius:8,fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:'inherit'},
  form:{background:'#fff',borderRadius:14,padding:'28px',border:'1px solid #E2E8F0',display:'flex',flexDirection:'column',gap:18},
  field:{display:'flex',flexDirection:'column',gap:5},
  label:{fontSize:12,fontWeight:700,letterSpacing:'0.5px',textTransform:'uppercase',color:'#334155'},
  input:{padding:'12px 14px',border:'1.5px solid #E2E8F0',borderRadius:8,fontSize:14,fontFamily:'inherit',color:'#0F172A',outline:'none',background:'#F8FAFF',width:'100%'},
  previewWrap:{borderRadius:14,overflow:'hidden',border:'1px solid #E2E8F0'},
  previewLabel:{background:'#1A56DB',color:'#fff',fontSize:11,fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',padding:'8px 16px',textAlign:'center'},
  preview:{background:'#fff',padding:'40px 48px'},
  previewHeading:{fontSize:32,fontWeight:800,color:'#0F172A',marginBottom:20,letterSpacing:'-0.5px'},
  previewP:{fontSize:16,color:'#64748B',lineHeight:1.8,marginBottom:16},
};
