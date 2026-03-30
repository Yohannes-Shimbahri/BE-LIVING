'use client';
import { useState, useEffect } from 'react';
import AdminShell from '@/components/AdminShell';
import { getContent, saveContent } from '@/lib/adminStore';

export default function ContactEditor() {
  const [data, setData]   = useState({ email: '', phone: '', location: '', responseTime: '' });
  const [preview, setPreview] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setData(getContent('contact')); }, []);

  const handleSave = () => {
    saveContent('contact', data); setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  return (
    <AdminShell title="Edit Contact Info">
      <div style={s.toolbar}>
        <button style={{ ...s.tabBtn, ...(preview ? {} : s.tabActive) }} onClick={() => setPreview(false)}>✏️ Edit</button>
        <button style={{ ...s.tabBtn, ...(preview ? s.tabActive : {}) }} onClick={() => setPreview(true)}>👁 Preview</button>
        <button style={s.saveBtn} onClick={handleSave}>{saved ? '✓ Saved!' : 'Save Changes'}</button>
      </div>
      {preview ? (
        <div style={s.previewWrap}>
          <p style={s.previewLabel}>Live Preview</p>
          <div style={s.preview}>
            {[
              { icon: '✉️', label: 'Email', val: data.email },
              { icon: '📞', label: 'Phone', val: data.phone },
              { icon: '📍', label: 'Location', val: data.location },
              { icon: '⚡', label: 'Response Time', val: data.responseTime },
            ].map((c, i) => (
              <div key={i} style={s.infoItem}>
                <div style={s.infoIcon}>{c.icon}</div>
                <div>
                  <p style={s.infoLabel}>{c.label}</p>
                  <p style={s.infoVal}>{c.val}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={s.form}>
          {[
            { label: 'Email Address', key: 'email', placeholder: 'beliving1000@gmail.com' },
            { label: 'Phone Number', key: 'phone', placeholder: '647-574-8350' },
            { label: 'Location', key: 'location', placeholder: 'Available Worldwide' },
            { label: 'Response Time', key: 'responseTime', placeholder: 'Within 24 hours' },
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
  toolbar:{display:'flex',gap:8,marginBottom:24,alignItems:'center'},
  tabBtn:{padding:'9px 18px',border:'1.5px solid #E2E8F0',background:'#fff',borderRadius:8,fontSize:13,fontWeight:600,cursor:'pointer',color:'#64748B',fontFamily:'inherit'},
  tabActive:{background:'#1A56DB',color:'#fff',borderColor:'#1A56DB'},
  saveBtn:{marginLeft:'auto',padding:'10px 24px',background:'#1A56DB',color:'#fff',border:'none',borderRadius:8,fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:'inherit'},
  form:{background:'#fff',borderRadius:14,padding:'28px',border:'1px solid #E2E8F0',display:'flex',flexDirection:'column',gap:18},
  field:{display:'flex',flexDirection:'column',gap:5},
  label:{fontSize:12,fontWeight:700,letterSpacing:'0.5px',textTransform:'uppercase',color:'#334155'},
  input:{padding:'12px 14px',border:'1.5px solid #E2E8F0',borderRadius:8,fontSize:15,fontFamily:'inherit',color:'#0F172A',outline:'none',background:'#F8FAFF',width:'100%'},
  previewWrap:{borderRadius:14,overflow:'hidden',border:'1px solid #E2E8F0'},
  previewLabel:{background:'#1A56DB',color:'#fff',fontSize:11,fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',padding:'8px 16px',textAlign:'center'},
  preview:{background:'#fff',padding:'32px',display:'flex',flexDirection:'column',gap:20},
  infoItem:{display:'flex',gap:14,alignItems:'flex-start'},
  infoIcon:{width:42,height:42,background:'#EBF2FF',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0},
  infoLabel:{fontSize:11,fontWeight:700,letterSpacing:'1px',textTransform:'uppercase',color:'#64748B',marginBottom:2},
  infoVal:{fontSize:15,color:'#0F172A',fontWeight:500},
};
