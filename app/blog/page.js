// app/blog/page.js
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

export const metadata = {
  title: 'Blog | Be-Living Marketing Agency',
  description: 'Marketing insights, strategies, and tips from the Be-Living team.',
};

export const revalidate = 60; // refresh every 60s

async function getPosts() {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch {
    return MOCK_POSTS;
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <>
      <div className="page-hero">
        <div className="page-hero__dots" />
        <span className="page-hero__tag">Blog</span>
        <h1 className="page-hero__title">Marketing Insights</h1>
        <p className="page-hero__sub">
          Strategies, tips, and stories from the Be-Living team to help your business grow.
        </p>
      </div>

      <section className="section">
        {posts.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>✏️</span>
            <h3 className={styles.emptyTitle}>No posts yet</h3>
            <p className={styles.emptySub}>Check back soon — content is coming!</p>
          </div>
        ) : (
          <>
            {/* Featured first post */}
            {posts[0] && (
              <Link href={`/blog/${posts[0].slug}`} className={styles.featured}>
                <div className={styles.featuredImg}>
                  {posts[0].cover_image ? (
                    <img src={posts[0].cover_image} alt={posts[0].title} className={styles.featuredImgEl} />
                  ) : (
                    <div className={styles.imgPlaceholder} />
                  )}
                  <span className={styles.featuredBadge}>Featured</span>
                  <span className={styles.categoryBadge}>{posts[0].category || 'Marketing'}</span>
                </div>
                <div className={styles.featuredBody}>
                  <div className={styles.meta}>
                    <span className={styles.author}>✍ {posts[0].author || 'Be-Living Team'}</span>
                    <span className={styles.dot}>·</span>
                    <span className={styles.date}>{formatDate(posts[0].created_at)}</span>
                    <span className={styles.dot}>·</span>
                    <span className={styles.readTime}>{readTime(posts[0].body)} min read</span>
                  </div>
                  <h2 className={styles.featuredTitle}>{posts[0].title}</h2>
                  <p className={styles.featuredExcerpt}>{posts[0].excerpt}</p>
                  <span className={styles.readMore}>Read Article →</span>
                </div>
              </Link>
            )}

            {/* Rest of posts */}
            {posts.length > 1 && (
              <div className={styles.grid}>
                {posts.slice(1).map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className={styles.card}>
                    <div className={styles.cardImg}>
                      {post.cover_image ? (
                        <img src={post.cover_image} alt={post.title} className={styles.cardImgEl} />
                      ) : (
                        <div className={styles.imgPlaceholder} />
                      )}
                      <span className={styles.cardCategory}>{post.category || 'Marketing'}</span>
                    </div>
                    <div className={styles.cardBody}>
                      <div className={styles.cardMeta}>
                        <span className={styles.date}>{formatDate(post.created_at)}</span>
                        <span className={styles.dot}>·</span>
                        <span className={styles.readTime}>{readTime(post.body)} min read</span>
                      </div>
                      <h3 className={styles.cardTitle}>{post.title}</h3>
                      <p className={styles.cardExcerpt}>{post.excerpt}</p>
                      <span className={styles.cardReadMore}>Read More →</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
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

// Shown when Supabase is not yet set up
const MOCK_POSTS = [
  {
    id: '1',
    title: '5 Social Media Strategies That Doubled Our Clients\' Leads',
    slug: 'social-media-strategies',
    excerpt: 'We analyzed 50+ campaigns and found the tactics that consistently outperform. Here are the five strategies every business should be using right now.',
    body: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    cover_image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1200&q=80',
    author: 'Be-Living Team',
    category: 'Social Media',
    published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Why Your Paid Ads Aren\'t Converting (And How to Fix It)',
    slug: 'paid-ads-not-converting',
    excerpt: 'Most businesses waste 40% of their ad budget on the wrong targeting. We break down the most common mistakes and exactly how to fix them.',
    body: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor.',
    cover_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
    author: 'Be-Living Team',
    category: 'Paid Advertising',
    published: true,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: '3',
    title: 'The Complete Guide to Email Marketing in 2025',
    slug: 'email-marketing-guide-2025',
    excerpt: 'Email still delivers the highest ROI of any marketing channel. Here\'s how to build a list, write emails people actually open, and automate your growth.',
    body: 'Lorem ipsum dolor sit amet consectetur adipiscing elit.',
    cover_image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=1200&q=80',
    author: 'Be-Living Team',
    category: 'Email Marketing',
    published: true,
    created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
  },
];
