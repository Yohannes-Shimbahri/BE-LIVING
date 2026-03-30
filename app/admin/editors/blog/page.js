'use client';
import { useState, useEffect, useRef } from 'react';
import AdminShell from '@/components/AdminShell';
import { getContent, saveContent } from '@/lib/adminStore';

const EMPTY_POST = { id: null, title: '', slug: '', excerpt: '', body: '', category: 'Marketing', author: 'Be-Living Team', image: '', published: false };

const CATEGORIES = ['Marketing', 'Social Media', 'Paid Advertising', 'Content Creation', 'Email Marketing', 'SEO', 'Branding', 'Case Study', 'Tips & Tricks'];

export default function BlogEditor() {
  const [posts, setPosts]     = useState([]);
  const [view, setView]       = useState('list'); // list | edit | preview
  const [current, setCurrent] = useState(null);
  const [saved, setSaved]     = useState(false);
  const fileRef               = useRef(null);

  useEffect(() => { setPosts(getContent('blog') || []); }, []);

  const savePosts = (updated) => {
    setPosts(updated);
    saveContent('blog', updated);
  };

  const openNew = () => {
    setCurrent({ ...EMPTY_POST, id: Date.now() });
    setView('edit');
  };

  const openEdit = (post) => {
    setCurrent({ ...post });
    setView('edit');
  };

  const handleDelete = (id) => {
    if (!confirm('Delete this post? This cannot be undone.')) return;
    savePosts(posts.filter(p => p.id !== id));
  };

  const handleTogglePublish = (id) => {
    savePosts(posts.map(p => p.id === id ? { ...p, published: !p.published } : p));
  };

  const handleSavePost = (publish = null) => {
    if (!current.title.trim()) return alert('Title is required.');
    if (!current.body.trim())  return alert('Post body is required.');
    const slug = current.slug || current.title.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
    const post = { ...current, slug, published: publish !== null ? publish : current.published, savedAt: new Date().toISOString() };
    const exists = posts.find(p => p.id === post.id);
    const updated = exists ? posts.map(p => p.id === post.id ? post : p) : [post, ...posts];
    savePosts(updated);
    setSaved(true);
    setTimeout(() => { setSaved(false); setView('list'); }, 1200);
  };

  // Handle image upload — convert to base64 for localStorage
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return alert('Image must be under 2MB for local storage. Use an image URL instead.');
    const reader = new FileReader();
    reader.onload = () => setCurrent({ ...current, image: reader.result });
    reader.readAsDataURL(file);
  };

  const updateCurrent = (key, val) => setCurrent({ ...current, [key]: val });

  // Auto-generate slug from title
  const handleTitleChange = (val) => {
    const slug = val.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
    setCurrent({ ...current, title: val, slug });
  };

  // ── LIST VIEW ──
  if (view === 'list') {
    return (
      <AdminShell title="Blog Posts">
        <div style={s.listHeader}>
          <p style={s.listCount}>{posts.length} post{posts.length !== 1 ? 's' : ''}</p>
          <button style={s.newBtn} onClick={openNew}>+ New Post</button>
        </div>

        {posts.length === 0 ? (
          <div style={s.empty}>
            <span style={{ fontSize: 40 }}>✏️</span>
            <h3 style={s.emptyTitle}>No posts yet</h3>
            <p style={s.emptySub}>Click "New Post" to write your first blog post.</p>
          </div>
        ) : (
          <div style={s.table}>
            <div style={s.tableHead}>
              <span>Post</span><span>Category</span><span>Status</span><span>Actions</span>
            </div>
            {posts.map((post) => (
              <div key={post.id} style={s.tableRow}>
                <div style={s.rowLeft}>
                  {post.image && <img src={post.image} alt="" style={s.thumb} />}
                  <div>
                    <p style={s.rowTitle}>{post.title}</p>
                    <p style={s.rowSlug}>/blog/{post.slug}</p>
                  </div>
                </div>
                <span style={s.rowCat}>{post.category}</span>
                <span style={{ ...s.badge, ...(post.published ? s.badgePublished : s.badgeDraft) }}>
                  {post.published ? 'Published' : 'Draft'}
                </span>
                <div style={s.actions}>
                  <button style={s.editBtn} onClick={() => openEdit(post)}>Edit</button>
                  <button style={s.toggleBtn} onClick={() => handleTogglePublish(post.id)}>
                    {post.published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button style={s.deleteBtn} onClick={() => handleDelete(post.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminShell>
    );
  }

  // ── PREVIEW VIEW ──
  if (view === 'preview') {
    return (
      <AdminShell title="Blog Preview">
        <div style={s.toolbar}>
          <button style={s.backBtn} onClick={() => setView('edit')}>← Back to Edit</button>
          <button style={s.publishBtnSm} onClick={() => handleSavePost(true)}>{saved ? '✓ Published!' : '🚀 Publish'}</button>
          <button style={s.draftBtnSm} onClick={() => handleSavePost(false)}>Save Draft</button>
        </div>
        <div style={s.previewArticle}>
          {current.image && <img src={current.image} alt="" style={s.previewHeroImg} />}
          <div style={s.previewBody}>
            <span style={s.previewCat}>{current.category}</span>
            <h1 style={s.previewTitle}>{current.title || 'Untitled Post'}</h1>
            {current.excerpt && <p style={s.previewExcerpt}>{current.excerpt}</p>}
            <p style={s.previewAuthor}>By {current.author}</p>
            <div style={s.previewContent}>
              {(current.body || '').split('\n').filter(Boolean).map((line, i) => (
                <p key={i} style={s.previewPara}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      </AdminShell>
    );
  }

  // ── EDIT VIEW ──
  return (
    <AdminShell title={current?.id && posts.find(p => p.id === current.id) ? 'Edit Post' : 'New Post'}>
      <div style={s.toolbar}>
        <button style={s.backBtn} onClick={() => setView('list')}>← All Posts</button>
        <button style={s.previewBtn} onClick={() => setView('preview')}>👁 Preview</button>
        <button style={s.draftBtnSm} onClick={() => handleSavePost(false)}>Save Draft</button>
        <button style={s.publishBtnSm} onClick={() => handleSavePost(true)}>{saved ? '✓ Saved!' : '🚀 Publish'}</button>
      </div>

      <div style={s.editorGrid}>
        {/* Main */}
        <div style={s.editorMain}>
          <div style={s.field}>
            <label style={s.label}>Post Title *</label>
            <input value={current.title} onChange={(e) => handleTitleChange(e.target.value)}
              style={s.inputLg} placeholder="Write an engaging title..." />
          </div>
          <div style={s.field}>
            <label style={s.label}>URL Slug <span style={s.slugPreview}>/blog/{current.slug || 'your-post-title'}</span></label>
            <input value={current.slug} onChange={(e) => updateCurrent('slug', e.target.value)}
              style={s.input} placeholder="your-post-title" />
          </div>
          <div style={s.field}>
            <label style={s.label}>Excerpt <span style={s.hint}>(shown on blog listing)</span></label>
            <textarea value={current.excerpt} onChange={(e) => updateCurrent('excerpt', e.target.value)}
              style={{ ...s.input, height: 70, resize: 'vertical' }} placeholder="A short summary..." />
          </div>
          <div style={s.field}>
            <label style={s.label}>Post Body * <span style={s.hint}>— Use ## for headings, **bold**, *italic*, - for bullets</span></label>
            <textarea value={current.body} onChange={(e) => updateCurrent('body', e.target.value)}
              style={{ ...s.input, height: 380, resize: 'vertical', lineHeight: 1.7 }}
              placeholder={`Write your post here...\n\n## Section Heading\n\nYour paragraph goes here. Use **bold** or *italic* for emphasis.\n\n- Bullet one\n- Bullet two`} />
          </div>
        </div>

        {/* Sidebar */}
        <div style={s.editorSide}>
          {/* Cover photo */}
          <div style={s.sideCard}>
            <p style={s.sideTitle}>Cover Photo</p>
            {current.image ? (
              <>
                <img src={current.image} alt="" style={s.sideImg} />
                <button style={s.removeImgBtn} onClick={() => updateCurrent('image', '')}>✕ Remove Photo</button>
              </>
            ) : (
              <div style={s.uploadArea} onClick={() => fileRef.current?.click()}>
                <span style={{ fontSize: 28 }}>📷</span>
                <p style={s.uploadText}>Click to upload photo</p>
                <p style={s.uploadSub}>JPG, PNG — max 2MB</p>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            <p style={s.orText}>— or paste a URL —</p>
            <input value={current.image?.startsWith('data:') ? '' : current.image}
              onChange={(e) => updateCurrent('image', e.target.value)}
              style={s.input} placeholder="https://images.unsplash.com/..." />
          </div>

          {/* Settings */}
          <div style={s.sideCard}>
            <p style={s.sideTitle}>Post Settings</p>
            <div style={s.sideField}>
              <label style={s.sideLabel}>Category</label>
              <select value={current.category} onChange={(e) => updateCurrent('category', e.target.value)} style={s.select}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={s.sideField}>
              <label style={s.sideLabel}>Author</label>
              <input value={current.author} onChange={(e) => updateCurrent('author', e.target.value)} style={s.input} />
            </div>
            <div style={s.toggleRow} onClick={() => updateCurrent('published', !current.published)}>
              <div style={{ ...s.toggleTrack, ...(current.published ? s.toggleOn : {}) }}>
                <div style={{ ...s.toggleThumb, ...(current.published ? s.thumbOn : {}) }} />
              </div>
              <span style={s.toggleLabel}>{current.published ? 'Published' : 'Draft'}</span>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

const s = {
  listHeader:   { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  listCount:    { fontSize: 14, color: '#64748B', fontWeight: 500 },
  newBtn:       { padding: '10px 22px', background: '#1A56DB', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(26,86,219,0.25)' },
  empty:        { background: '#fff', borderRadius: 14, padding: '70px 20px', textAlign: 'center', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 },
  emptyTitle:   { fontSize: 20, fontWeight: 700, color: '#0F172A' },
  emptySub:     { fontSize: 14, color: '#64748B' },
  table:        { background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', overflow: 'hidden' },
  tableHead:    { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: 12, padding: '12px 20px', background: '#F8FAFF', borderBottom: '1px solid #E2E8F0', fontSize: 11, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#64748B' },
  tableRow:     { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: 12, padding: '14px 20px', borderBottom: '1px solid #E2E8F0', alignItems: 'center' },
  rowLeft:      { display: 'flex', alignItems: 'center', gap: 10 },
  thumb:        { width: 42, height: 42, borderRadius: 8, objectFit: 'cover', flexShrink: 0 },
  rowTitle:     { fontSize: 14, fontWeight: 600, color: '#0F172A', marginBottom: 2 },
  rowSlug:      { fontSize: 11, color: '#94A3B8' },
  rowCat:       { fontSize: 13, color: '#64748B' },
  badge:        { display: 'inline-block', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 100 },
  badgePublished:{ background: '#D1FAE5', color: '#065F46' },
  badgeDraft:   { background: '#F1F5F9', color: '#64748B' },
  actions:      { display: 'flex', gap: 6, flexWrap: 'wrap' },
  editBtn:      { padding: '6px 12px', background: '#EBF2FF', color: '#1A56DB', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  toggleBtn:    { padding: '6px 12px', background: '#F1F5F9', color: '#334155', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  deleteBtn:    { padding: '6px 12px', background: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  toolbar:      { display: 'flex', gap: 8, marginBottom: 24, alignItems: 'center', flexWrap: 'wrap' },
  backBtn:      { padding: '9px 16px', border: '1.5px solid #E2E8F0', background: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#64748B', fontFamily: 'inherit' },
  previewBtn:   { padding: '9px 16px', border: '1.5px solid #E2E8F0', background: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#64748B', fontFamily: 'inherit' },
  draftBtnSm:   { padding: '9px 16px', border: '1.5px solid #CBD5E1', background: '#F8FAFF', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#334155', fontFamily: 'inherit' },
  publishBtnSm: { marginLeft: 'auto', padding: '10px 20px', background: '#1A56DB', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
  editorGrid:   { display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' },
  editorMain:   { display: 'flex', flexDirection: 'column', gap: 18 },
  field:        { display: 'flex', flexDirection: 'column', gap: 6 },
  label:        { fontSize: 12, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#334155' },
  hint:         { fontSize: 11, color: '#94A3B8', textTransform: 'none', letterSpacing: 0, fontWeight: 400 },
  slugPreview:  { fontSize: 11, color: '#1A56DB', fontWeight: 500, textTransform: 'none', letterSpacing: 0 },
  inputLg:      { padding: '13px 16px', border: '1.5px solid #E2E8F0', borderRadius: 8, fontSize: 19, fontWeight: 700, fontFamily: 'inherit', color: '#0F172A', outline: 'none', background: '#fff', width: '100%' },
  input:        { padding: '11px 14px', border: '1.5px solid #E2E8F0', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', color: '#0F172A', outline: 'none', background: '#F8FAFF', width: '100%' },
  editorSide:   { display: 'flex', flexDirection: 'column', gap: 16 },
  sideCard:     { background: '#fff', borderRadius: 12, padding: '18px', border: '1px solid #E2E8F0' },
  sideTitle:    { fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 14 },
  sideImg:      { width: '100%', height: 150, objectFit: 'cover', borderRadius: 8, marginBottom: 10 },
  removeImgBtn: { width: '100%', padding: '8px', background: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 10 },
  uploadArea:   { border: '2px dashed #CBD5E1', borderRadius: 10, padding: '24px', textAlign: 'center', cursor: 'pointer', marginBottom: 10 },
  uploadText:   { fontSize: 13, fontWeight: 600, color: '#334155', marginTop: 8, marginBottom: 3 },
  uploadSub:    { fontSize: 11, color: '#94A3B8' },
  orText:       { fontSize: 11, color: '#94A3B8', textAlign: 'center', margin: '8px 0' },
  sideField:    { marginBottom: 14 },
  sideLabel:    { display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#64748B', marginBottom: 5 },
  select:       { width: '100%', padding: '10px 12px', border: '1.5px solid #E2E8F0', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', color: '#0F172A', outline: 'none', background: '#F8FAFF' },
  toggleRow:    { display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginTop: 4 },
  toggleTrack:  { width: 44, height: 24, borderRadius: 100, background: '#CBD5E1', position: 'relative', transition: 'background 0.2s', flexShrink: 0 },
  toggleOn:     { background: '#1A56DB' },
  toggleThumb:  { position: 'absolute', top: 3, left: 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'transform 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' },
  thumbOn:      { transform: 'translateX(20px)' },
  toggleLabel:  { fontSize: 14, fontWeight: 600, color: '#0F172A' },
  previewArticle:{ background: '#fff', borderRadius: 14, overflow: 'hidden', border: '1px solid #E2E8F0' },
  previewHeroImg:{ width: '100%', height: 320, objectFit: 'cover' },
  previewBody:  { padding: '36px 44px' },
  previewCat:   { display: 'inline-block', background: '#EBF2FF', color: '#1A56DB', fontSize: 11, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', padding: '5px 14px', borderRadius: 100, marginBottom: 16 },
  previewTitle: { fontSize: 36, fontWeight: 800, color: '#0F172A', lineHeight: 1.15, letterSpacing: '-0.5px', marginBottom: 16 },
  previewExcerpt:{ fontSize: 18, color: '#334155', lineHeight: 1.7, fontWeight: 500, marginBottom: 16, paddingBottom: 16, borderBottom: '2px solid #E2E8F0' },
  previewAuthor:{ fontSize: 13, color: '#94A3B8', marginBottom: 24 },
  previewContent:{ display: 'flex', flexDirection: 'column', gap: 14 },
  previewPara:  { fontSize: 16, color: '#334155', lineHeight: 1.85 },
};
