import AnimatedCard from '@/components/AnimatedCard';
import { PORTFOLIO } from '@/lib/data';
import { getContent } from '@/lib/adminStore';
import styles from './page.module.css';

export const metadata = {
  title: 'Portfolio | Be-Living Marketing Agency',
  description: 'Real campaigns, real results. See how Be-Living has helped businesses across industries achieve measurable growth.',
};

export const revalidate = 60; // refresh every 60 seconds

export default async function Portfolio() {
  // Try Supabase first, fall back to hardcoded data
  let portfolio = await getContent('portfolio');
  if (!portfolio || !Array.isArray(portfolio) || portfolio.length === 0) {
    portfolio = PORTFOLIO;
  }

  return (
    <>
      <div className="page-hero">
        <div className="page-hero__grid" />
        <span className="page-hero__tag">Portfolio</span>
        <h1 className="page-hero__title">Our Work Speaks for Itself</h1>
        <p className="page-hero__sub">
          Real campaigns. Real results. Explore how we've helped businesses
          across industries achieve measurable growth.
        </p>
      </div>

      <section className="section">
        <div className={styles.grid}>
          {portfolio.map((p, i) => (
            <AnimatedCard key={i} delay={i * 80} className={styles.card}>
              {/* Image if available, color block as fallback */}
              {p.image ? (
                <div className={styles.cardImgWrap}>
                  <img src={p.image} alt={p.title} className={styles.cardImg} />
                  <span className={styles.cardImgTag}>{p.tag}</span>
                </div>
              ) : (
                <div className={styles.cardTop} style={{ background: p.color || '#1A56DB' }}>
                  <span className={styles.cardTopTag}>{p.tag}</span>
                </div>
              )}
              <div className={styles.cardBody}>
                {!p.image && <span className={styles.tag}>{p.tag}</span>}
                <h3 className={styles.title}>{p.title}</h3>
                <p className={styles.desc}>{p.desc}</p>
                <div className={styles.result}>
                  <span className={styles.resultLabel}>Result</span>
                  <span className={styles.resultValue}>{p.result}</span>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </section>

      <div className="cta-band">
        <h2 className="cta-band__title">Want Results Like These?</h2>
        <p className="cta-band__sub">Let's build your next success story together.</p>
        <a href="/contact" className="btn-white">Get Started Today</a>
      </div>
    </>
  );
}