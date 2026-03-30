'use client';
import { useState, useEffect } from 'react';
import AdminShell from '@/components/AdminShell';
import { getContent, saveContent } from '@/lib/adminStore';

export default function IndustriesEditor() {
  const [items, setItems]     = useState([]);
  const [selected, setSel]    = useState(0);
  const [preview, setPreview] = useState(false);
  const [saved, setSaved]     = useState(false);

  useEffect(() => { setItems(getContent('industries')); }, []);

  const update = (key, val) => {
    const next = [...items]; next[selected] = { ...next[selected], [key]: val }; setItems(next);
  };

  const handleSave = () => {
    saveContent('industries', items); setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  const cur = items[selected] || {};

  return (
    <AdminShell title="Edit Industries">
      <div style={s.toolbar}>
        <button style={{ ...s.tabBtn, ...(preview ? {} : s.tabActive) }} onClick={() => setPreview(false)}>✏️ Edit</button>
        <button style={{ ...s.tabBtn, ...(preview ? s.tabActive : {}) }} onClick={() => setPreview(true)}>👁 Preview</button>
        <button style={s.saveBtn} onClick={handleSave}>{saved ? '✓ Saved!' : 'Save Changes'}</button>
      </div>
      <div style={s.tabs}>
        {items.map((item, i) => (
          <button key={i} style={{ ...s.tab, ...(selected === i ? s.tabActive2 : {}) }} onClick={() => setSel(i)}>
            {item.icon} {item.name?.split(' ')[0]}
          </button>
        ))}
      </div>
      {preview ? (
        <div style={s.previewWrap}>
          <p style={s.previewLabel}>Live Preview — {cur.name}</p>
          <div style={s.card}>
            <div style={s.imgWrap}>
              {cur.image ? <img src={cur.image} alt="" style={s.img} /> : <div style={s.imgPlaceholder} />}
              <span style={s.cardIcon}>{cur.icon}</span>
            </div>
            <div style={s.cardBody}>
              <h3 style={s.cardName}>{cur.name}</h3>
              <p style={s.cardDesc}>{cur.desc}</p>
              <p style={s.cardDetail}>{cur.detail}</p>
            </div>
          </div>
        </div>
      ) : (
        <div style={s.form}>
          {[
            { label: 'Icon (emoji)', key: 'icon', placeholder: '🚗' },
            { label: 'Industry Name', key: 'name', placeholder: 'Automotive Sales' },
            { label: 'Short Description', key: 'desc', placeholder: 'Driving leads and brand awareness...' },
            { label: 'Image URL', key: 'image', placeholder: 'https://images.unsplash.com/...' },
          ].map((f) => (
            <div key={f.key} style={s.field}>
              <label style={s.label}>{f.label}</label>
              <input value={cur[f.key] || ''} onChange={(e) => update(f.key, e.target.value)} style={s.input} placeholder={f.placeholder} />
            </div>
          ))}
          <div style={s.field}>
            <label style={s.label}>Detail Text</label>
            <textarea value={cur.detail || ''} onChange={(e) => update('detail', e.target.value)}
              style={{ ...s.input, height: 90, resize: 'vertical' }} placeholder="Longer description..." />
          </div>
          {cur.image && <img src={cur.image} alt="" style={s.imgPreview} />}
        </div>
      )}
    </AdminShell>
  );
}

const s = {
  toolbar:{ display:'flex',gap:8,marginBottom:16,alignItems:'center',flexWrap:'wrap'},
  tabBtn: { padding:'9px 18px',border:'1.5px solid #E2E8F0',background:'#fff',borderRadius:8,fontSize:13,fontWeight:600,cursor:'pointer',color:'#64748B',fontFamily:'inherit'},
  tabActive:{background:'#1A56DB',color:'#fff',borderColor:'#1A56DB'},
  saveBtn:{marginLeft:'auto',padding:'10px 24px',background:'#1A56DB',color:'#fff',border:'none',borderRadius:8,fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:'inherit'},
  tabs:{display:'flex',flexWrap:'wrap',gap:6,marginBottom:20},
  tab:{padding:'7px 14px',border:'1px solid #E2E8F0',background:'#fff',borderRadius:8,fontSize:12,fontWeight:600,cursor:'pointer',color:'#64748B',fontFamily:'inherit'},
  tabActive2:{background:'#EBF2FF',color:'#1A56DB',borderColor:'#1A56DB'},
  form:{background:'#fff',borderRadius:14,padding:'28px',border:'1px solid #E2E8F0',display:'flex',flexDirection:'column',gap:16},
  field:{display:'flex',flexDirection:'column',gap:5},
  label:{fontSize:12,fontWeight:700,letterSpacing:'0.5px',textTransform:'uppercase',color:'#334155'},
  input:{padding:'11px 14px',border:'1.5px solid #E2E8F0',borderRadius:8,fontSize:14,fontFamily:'inherit',color:'#0F172A',outline:'none',background:'#F8FAFF',width:'100%'},
  imgPreview:{width:'100%',height:160,objectFit:'cover',borderRadius:10,marginTop:4},
  previewWrap:{borderRadius:14,overflow:'hidden',border:'1px solid #E2E8F0'},
  previewLabel:{background:'#1A56DB',color:'#fff',fontSize:11,fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',padding:'8px 16px',textAlign:'center'},
  card:{background:'#fff',borderRadius:14,overflow:'hidden'},
  imgWrap:{position:'relative',height:180,overflow:'hidden'},
  img:{width:'100%',height:'100%',objectFit:'cover'},
  imgPlaceholder:{width:'100%',height:'100%',background:'#EBF2FF'},
  cardIcon:{position:'absolute',bottom:12,right:14,fontSize:28},
  cardBody:{padding:'22px 24px'},
  cardName:{fontSize:20,fontWeight:700,color:'#0F172A',marginBottom:8},
  cardDesc:{fontSize:14,color:'#1A56DB',fontWeight:600,marginBottom:8},
  cardDetail:{fontSize:13,color:'#64748B',lineHeight:1.65},
};
