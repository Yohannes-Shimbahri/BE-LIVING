'use client';
import { useState, useEffect, useRef } from 'react';
import AdminShell from '@/components/AdminShell';
import { supabase } from '@/lib/supabase';
import { uploadImage } from '@/lib/adminStore';

const EMPTY = { title:'', slug:'', excerpt:'', body:'', category:'Marketing', author:'Be-Living Team', cover_image:'', published:false };
const CATS   = ['Marketing','Social Media','Paid Advertising','Content Creation','Email Marketing','SEO','Branding','Case Study','Tips & Tricks'];

export default function BlogEditor() {
  const [posts, setPosts]   = useState([]);
  const [view, setView]     = useState('list');
  const [cur, setCur]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved]       = useState(false);
  const [error, setError]       = useState('');
  const fileRef = useRef(null);

  useEffect(() => { fetchPosts(); }, []);

  async function fetchPosts() {
    setLoading(true);
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    setPosts(data || []);
    setLoading(false);
  }

  async function handleSave(publishNow = null) {
    setError('');
    if (!cur.title?.trim()) return setError('Title is required.');
    if (!cur.body?.trim())  return setError('Post body is required.');

    setSaving(true);
    const slug = cur.slug || cur.title.toLowerCase().replace(/[^a-z0-9\s]/g,'').replace(/\s+/g,'-');
    const post = { ...cur, slug, published: publishNow !== null ? publishNow : cur.published };

    let dbError;
    if (post.id) {
      ({ error: dbError } = await supabase.from('posts').update({ ...post, updated_at: new Date().toISOString() }).eq('id', post.id));
    } else {
      delete post.id;
      ({ error: dbError } = await supabase.from('posts').insert([post]));
    }

    setSaving(false);
    if (dbError) { setError('Save failed: ' + dbError.message); return; }

    setSaved(true);
    await fetchPosts();
    setTimeout(() => { setSaved(false); setView('list'); }, 1200);
  }

  async function handleDelete(id) {
    if (!confirm('Delete this post permanently?')) return;
    await supabase.from('posts').delete().eq('id', id);
    fetchPosts();
  }

  async function handleToggle(post) {
    await supabase.from('posts').update({ published: !post.published }).eq('id', post.id);
    fetchPosts();
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, 'blog-images');
      setCur({ ...cur, cover_image: url });
    } catch (err) {
      setError('Image upload failed: ' + err.message);
    }
    setUploading(false);
  }

  const upd = (key, val) => setCur({ ...cur, [key]: val });
  const handleTitle = (val) => {
    const slug = val.toLowerCase().replace(/[^a-z0-9\s]/g,'').replace(/\s+/g,'-');
    setCur({ ...cur, title: val, slug });
  };

  // ── LIST ──
  if (view === 'list') return (
    <AdminShell title="Blog Posts">
      <div style={s.listHead}>
        <p style={s.listCount}>{posts.length} post{posts.length !== 1 ? 's' : ''}</p>
        <button style={s.newBtn} onClick={() => { setCur({...EMPTY}); setView('edit'); }}>+ New Post</button>
      </div>

      {loading ? <p style={s.loading}>Loading posts...</p> : posts.length === 0 ? (
        <div style={s.empty}>
          <span style={{fontSize:40}}>✏️</span>
          <h3 style={s.emptyTitle}>No posts yet</h3>
          <p style={s.emptySub}>Click "New Post" to write your first blog post.</p>
        </div>
      ) : (
        <div style={s.table}>
          <div style={s.thead}><span>Post</span><span>Category</span><span>Status</span><span>Actions</span></div>
          {posts.map(post => (
            <div key={post.id} style={s.trow}>
              <div style={s.trowLeft}>
                {post.cover_image && <img src={post.cover_image} alt="" style={s.thumb} />}
                <div>
                  <p style={s.trowTitle}>{post.title}</p>
                  <p style={s.trowSlug}>/blog/{post.slug}</p>
                </div>
              </div>
              <span style={s.trowCat}>{post.category}</span>
              <span style={{...s.badge,...(post.published ? s.badgePub : s.badgeDraft)}}>{post.published ? 'Published' : 'Draft'}</span>
              <div style={s.actions}>
                <button style={s.editBtn} onClick={() => { setCur({...post}); setView('edit'); }}>Edit</button>
                <button style={s.toggleBtn} onClick={() => handleToggle(post)}>{post.published ? 'Unpublish' : 'Publish'}</button>
                <button style={s.deleteBtn} onClick={() => handleDelete(post.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );

  // ── PREVIEW ──
  if (view === 'preview') return (
    <AdminShell title="Post Preview">
      <div style={s.toolbar}>
        <button style={s.backBtn} onClick={() => setView('edit')}>← Back to Edit</button>
        <button style={s.publishBtn} onClick={() => handleSave(true)}>{saving ? 'Saving...' : '🚀 Publish'}</button>
        <button style={s.draftBtn} onClick={() => handleSave(false)}>Save Draft</button>
      </div>
      <div style={s.previewArticle}>
        {cur.cover_image && <img src={cur.cover_image} alt="" style={s.previewHero} />}
        <div style={s.previewBody}>
          <span style={s.previewCat}>{cur.category}</span>
          <h1 style={s.previewTitle}>{cur.title || 'Untitled'}</h1>
          {cur.excerpt && <p style={s.previewExcerpt}>{cur.excerpt}</p>}
          <p style={s.previewAuthor}>By {cur.author}</p>
          <div style={s.previewContent}>
            {(cur.body||'').split('\n').filter(Boolean).map((line,i) => <p key={i} style={s.previewP}>{line}</p>)}
          </div>
        </div>
      </div>
    </AdminShell>
  );

  // ── EDIT ──
  return (
    <AdminShell title={cur?.id ? 'Edit Post' : 'New Post'}>
      <div style={s.toolbar}>
        <button style={s.backBtn} onClick={() => setView('list')}>← All Posts</button>
        <button style={s.previewBtn} onClick={() => setView('preview')}>👁 Preview</button>
        <button style={s.draftBtn} onClick={() => handleSave(false)} disabled={saving}>Save Draft</button>
        <button style={s.publishBtn} onClick={() => handleSave(true)} disabled={saving}>{saving ? 'Saving...' : saved ? '✓ Saved!' : '🚀 Publish'}</button>
      </div>

      {error && <div style={s.errBanner}>{error}</div>}

      <div style={s.grid}>
        <div style={s.main}>
          <div style={s.field}>
            <label style={s.label}>Post Title *</label>
            <input value={cur.title} onChange={e => handleTitle(e.target.value)} style={s.inputLg} placeholder="Write an engaging title..." />
          </div>
          <div style={s.field}>
            <label style={s.label}>URL Slug <span style={s.hint}>/blog/{cur.slug||'your-post-title'}</span></label>
            <input value={cur.slug} onChange={e => upd('slug', e.target.value)} style={s.input} />
          </div>
          <div style={s.field}>
            <label style={s.label}>Excerpt <span style={s.hint}>(shown on blog listing)</span></label>
            <textarea value={cur.excerpt} onChange={e => upd('excerpt', e.target.value)}
              style={{...s.input, height:70, resize:'vertical'}} placeholder="A short summary of this post..." />
          </div>
          <div style={s.field}>
            <label style={s.label}>Post Body * <span style={s.hint}>Use ## Heading, **bold**, *italic*, - bullet</span></label>
            <textarea value={cur.body} onChange={e => upd('body', e.target.value)}
              style={{...s.input, height:400, resize:'vertical', lineHeight:1.7}}
              placeholder={`Write your post here...\n\n## Section Heading\n\nYour paragraph text goes here.\n\n- Bullet one\n- Bullet two`} />
          </div>
        </div>

        <div style={s.side}>
          {/* Cover photo */}
          <div style={s.sideCard}>
            <p style={s.sideTitle}>Cover Photo</p>
            {cur.cover_image ? (
              <>
                <img src={cur.cover_image} alt="" style={s.sideImg} />
                <button style={s.removeBtn} onClick={() => upd('cover_image','')}>✕ Remove</button>
              </>
            ) : (
              <div style={s.uploadZone} onClick={() => fileRef.current?.click()}>
                <span style={{fontSize:28}}>📷</span>
                <p style={s.uploadTxt}>{uploading ? 'Uploading...' : 'Click to upload'}</p>
                <p style={s.uploadSub}>JPG, PNG, WebP</p>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} style={{display:'none'}} />
            <p style={s.orLine}>— or paste URL —</p>
            <input value={cur.cover_image?.startsWith('data:') ? '' : (cur.cover_image||'')}
              onChange={e => upd('cover_image', e.target.value)}
              style={s.input} placeholder="https://images.unsplash.com/..." />
          </div>

          {/* Settings */}
          <div style={s.sideCard}>
            <p style={s.sideTitle}>Settings</p>
            <div style={s.sf}>
              <label style={s.sl}>Category</label>
              <select value={cur.category} onChange={e => upd('category', e.target.value)} style={s.select}>
                {CATS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={s.sf}>
              <label style={s.sl}>Author</label>
              <input value={cur.author} onChange={e => upd('author', e.target.value)} style={s.input} />
            </div>
            <div style={s.toggleRow} onClick={() => upd('published', !cur.published)}>
              <div style={{...s.track,...(cur.published?s.trackOn:{})}}>
                <div style={{...s.thumb,...(cur.published?s.thumbOn:{})}} />
              </div>
              <span style={s.toggleLbl}>{cur.published ? 'Published' : 'Draft'}</span>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

const s = {
  listHead:{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20},
  listCount:{fontSize:14,color:'#64748B'},
  newBtn:{padding:'10px 22px',background:'#1A56DB',color:'#fff',border:'none',borderRadius:8,fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:'inherit'},
  loading:{textAlign:'center',padding:'60px',color:'#64748B'},
  empty:{background:'#fff',borderRadius:14,padding:'60px 20px',textAlign:'center',border:'1px solid #E2E8F0',display:'flex',flexDirection:'column',alignItems:'center',gap:8},
  emptyTitle:{fontSize:20,fontWeight:700,color:'#0F172A'},
  emptySub:{fontSize:14,color:'#64748B'},
  table:{background:'#fff',borderRadius:14,border:'1px solid #E2E8F0',overflow:'hidden'},
  thead:{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1.6fr',gap:12,padding:'12px 20px',background:'#F8FAFF',borderBottom:'1px solid #E2E8F0',fontSize:11,fontWeight:700,letterSpacing:'0.5px',textTransform:'uppercase',color:'#64748B'},
  trow:{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1.6fr',gap:12,padding:'14px 20px',borderBottom:'1px solid #E2E8F0',alignItems:'center'},
  trowLeft:{display:'flex',alignItems:'center',gap:10},
  thumb:{width:40,height:40,borderRadius:8,objectFit:'cover',flexShrink:0},
  trowTitle:{fontSize:14,fontWeight:600,color:'#0F172A',marginBottom:2},
  trowSlug:{fontSize:11,color:'#94A3B8'},
  trowCat:{fontSize:13,color:'#64748B'},
  badge:{display:'inline-block',fontSize:11,fontWeight:700,padding:'4px 12px',borderRadius:100},
  badgePub:{background:'#D1FAE5',color:'#065F46'},
  badgeDraft:{background:'#F1F5F9',color:'#64748B'},
  actions:{display:'flex',gap:6,flexWrap:'wrap'},
  editBtn:{padding:'6px 12px',background:'#EBF2FF',color:'#1A56DB',border:'none',borderRadius:6,fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'inherit'},
  toggleBtn:{padding:'6px 12px',background:'#F1F5F9',color:'#334155',border:'none',borderRadius:6,fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'inherit'},
  deleteBtn:{padding:'6px 12px',background:'#FEF2F2',color:'#DC2626',border:'none',borderRadius:6,fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'inherit'},
  toolbar:{display:'flex',gap:8,marginBottom:20,alignItems:'center',flexWrap:'wrap'},
  backBtn:{padding:'9px 16px',border:'1.5px solid #E2E8F0',background:'#fff',borderRadius:8,fontSize:13,fontWeight:600,cursor:'pointer',color:'#64748B',fontFamily:'inherit'},
  previewBtn:{padding:'9px 16px',border:'1.5px solid #E2E8F0',background:'#fff',borderRadius:8,fontSize:13,fontWeight:600,cursor:'pointer',color:'#64748B',fontFamily:'inherit'},
  draftBtn:{padding:'9px 16px',border:'1.5px solid #CBD5E1',background:'#F8FAFF',borderRadius:8,fontSize:13,fontWeight:600,cursor:'pointer',color:'#334155',fontFamily:'inherit'},
  publishBtn:{marginLeft:'auto',padding:'10px 20px',background:'#1A56DB',color:'#fff',border:'none',borderRadius:8,fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'inherit'},
  errBanner:{background:'#FEF2F2',border:'1px solid #FECACA',color:'#DC2626',fontSize:13,padding:'12px 16px',borderRadius:8,marginBottom:18,fontWeight:500},
  grid:{display:'grid',gridTemplateColumns:'1fr 300px',gap:24,alignItems:'start'},
  main:{display:'flex',flexDirection:'column',gap:18},
  field:{display:'flex',flexDirection:'column',gap:6},
  label:{fontSize:12,fontWeight:700,letterSpacing:'0.5px',textTransform:'uppercase',color:'#334155'},
  hint:{fontSize:11,color:'#94A3B8',textTransform:'none',letterSpacing:0,fontWeight:400},
  inputLg:{padding:'13px 16px',border:'1.5px solid #E2E8F0',borderRadius:8,fontSize:19,fontWeight:700,fontFamily:'inherit',color:'#0F172A',outline:'none',background:'#fff',width:'100%'},
  input:{padding:'11px 14px',border:'1.5px solid #E2E8F0',borderRadius:8,fontSize:14,fontFamily:'inherit',color:'#0F172A',outline:'none',background:'#F8FAFF',width:'100%'},
  side:{display:'flex',flexDirection:'column',gap:14},
  sideCard:{background:'#fff',borderRadius:12,padding:'18px',border:'1px solid #E2E8F0'},
  sideTitle:{fontSize:13,fontWeight:700,color:'#0F172A',marginBottom:14},
  sideImg:{width:'100%',height:140,objectFit:'cover',borderRadius:8,marginBottom:10},
  removeBtn:{width:'100%',padding:'8px',background:'#FEF2F2',color:'#DC2626',border:'none',borderRadius:8,fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'inherit',marginBottom:10},
  uploadZone:{border:'2px dashed #CBD5E1',borderRadius:10,padding:'22px',textAlign:'center',cursor:'pointer',marginBottom:10},
  uploadTxt:{fontSize:13,fontWeight:600,color:'#334155',marginTop:8,marginBottom:2},
  uploadSub:{fontSize:11,color:'#94A3B8'},
  orLine:{fontSize:11,color:'#94A3B8',textAlign:'center',margin:'8px 0'},
  sf:{marginBottom:14},
  sl:{display:'block',fontSize:11,fontWeight:700,letterSpacing:'0.5px',textTransform:'uppercase',color:'#64748B',marginBottom:5},
  select:{width:'100%',padding:'10px 12px',border:'1.5px solid #E2E8F0',borderRadius:8,fontSize:13,fontFamily:'inherit',color:'#0F172A',outline:'none',background:'#F8FAFF'},
  toggleRow:{display:'flex',alignItems:'center',gap:10,cursor:'pointer',marginTop:4},
  track:{width:44,height:24,borderRadius:100,background:'#CBD5E1',position:'relative',transition:'background 0.2s',flexShrink:0},
  trackOn:{background:'#1A56DB'},
  thumb:{position:'absolute',top:3,left:3,width:18,height:18,borderRadius:'50%',background:'#fff',transition:'transform 0.2s',boxShadow:'0 1px 4px rgba(0,0,0,0.15)'},
  thumbOn:{transform:'translateX(20px)'},
  toggleLbl:{fontSize:14,fontWeight:600,color:'#0F172A'},
  previewArticle:{background:'#fff',borderRadius:14,overflow:'hidden',border:'1px solid #E2E8F0'},
  previewHero:{width:'100%',height:300,objectFit:'cover'},
  previewBody:{padding:'32px 40px'},
  previewCat:{display:'inline-block',background:'#EBF2FF',color:'#1A56DB',fontSize:11,fontWeight:700,letterSpacing:'1px',textTransform:'uppercase',padding:'5px 14px',borderRadius:100,marginBottom:14},
  previewTitle:{fontSize:34,fontWeight:800,color:'#0F172A',lineHeight:1.15,letterSpacing:'-0.5px',marginBottom:14},
  previewExcerpt:{fontSize:17,color:'#334155',lineHeight:1.7,fontWeight:500,marginBottom:14,paddingBottom:14,borderBottom:'2px solid #E2E8F0'},
  previewAuthor:{fontSize:13,color:'#94A3B8',marginBottom:20},
  previewContent:{display:'flex',flexDirection:'column',gap:12},
  previewP:{fontSize:16,color:'#334155',lineHeight:1.85},
};
