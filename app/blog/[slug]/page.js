// app/blog/[slug]/page.js
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

export const revalidate = 60;

async function getPost(slug) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();
    if (error) throw error;
    return data;
  } catch {
    return null;
  }
}

export default async function PostPage({ params }) {
  const post = await getPost(params.slug);

  if (!post) {
    return (
      <div style={{ textAlign: 'center', padding: '160px 40px 80px' }}>
        <h1 style={{ fontSize: 32, marginBottom: 12 }}>Post not found</h1>
        <Link href="/blog" className="btn-primary">← Back to Blog</Link>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <div className={styles.hero}>
        {post.cover_image && (
          <img src={post.cover_image} alt={post.title} className={styles.heroImg} />
        )}
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <span className={styles.category}>{post.category || 'Marketing'}</span>
          <h1 className={styles.title}>{post.title}</h1>
          <div className={styles.meta}>
            <span>✍ {post.author || 'Be-Living Team'}</span>
            <span className={styles.dot}>·</span>
            <span>{formatDate(post.created_at)}</span>
            <span className={styles.dot}>·</span>
            <span>{readTime(post.body)} min read</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className={styles.wrapper}>
        <div className={styles.body}>
          {post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: markdownToHtml(post.body || '') }}
          />
        </div>

        <div className={styles.back}>
          <Link href="/blog" className="btn-primary">← Back to Blog</Link>
        </div>
      </div>
    </>
  );
}

// Very simple markdown → HTML converter for basic formatting
function markdownToHtml(md) {
  return md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hul])/gm, '')
    .split('\n').map(line =>
      line && !line.startsWith('<') ? `<p>${line}</p>` : line
    ).join('\n');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

function readTime(body = '') {
  const words = (body || '').replace(/[#*>\-]/g, '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
