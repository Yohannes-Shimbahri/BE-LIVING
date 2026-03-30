import Link from 'next/link';
import AnimatedCard from '@/components/AnimatedCard';
import { STATS, VALUES, PROCESS } from '@/lib/data';
import styles from './page.module.css';

export const metadata = {
  title: 'About Us | Be-Living Marketing Agency',
  description: 'Learn about Be-Living Marketing Agency — our story, values, and the process we use to drive results for our clients.',
};

export default function About() {
  return (
    <>
      <div className="page-hero">
        <div className="page-hero__grid" />
        <span className="page-hero__tag">About Us</span>
        <h1 className="page-hero__title">We Are Be-Living</h1>
        <p className="page-hero__sub">
          A team of strategists, creatives, and data analysts united by one goal: growing your business.
        </p>
      </div>

      {/* ── STORY ── */}
      <section className="section">
        <div className={styles.storyGrid}>
          <div className={styles.storyText}>
            <h2 className={styles.heading}>Our Story</h2>
            <p className={styles.body}>
              Be-Living Marketing Agency was founded on a simple belief — great marketing is equal parts art and science. We blend storytelling, analytics, and customer-focused strategies to build strong brand identities, increase engagement, and drive measurable business results.
            </p>
            <p className={styles.body}>
              Our approach is rooted in understanding each client's unique goals and delivering tailored solutions that align with their target audience, industry trends, and long-term vision. We don't do cookie-cutter — every strategy is built from scratch, for you.
            </p>
            <p className={styles.body}>
              We prioritize both creativity and performance, ensuring that every campaign is not only visually compelling but also results-oriented. When you work with Be-Living, you get a true partner, not just a vendor.
            </p>
            <Link href="/contact" className="btn-primary" style={{ marginTop: '24px', display: 'inline-block' }}>
              Work With Us →
            </Link>
          </div>
          <div className={styles.statsGrid}>
            {STATS.map((s, i) => (
              <AnimatedCard key={i} delay={i * 80} className={styles.statCard}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="section--dark">
        <div className="inner">
          <div className="section-header">
            <span className="section-tag section-tag--light">Our Values</span>
            <h2 className="section-title section-title--light">What Drives Us</h2>
          </div>
          <div className={styles.valuesGrid}>
            {VALUES.map((v, i) => (
              <AnimatedCard key={i} delay={i * 70} className={styles.valueCard}>
                <span className={styles.valueIcon}>{v.icon}</span>
                <h4 className={styles.valueTitle}>{v.title}</h4>
                <p className={styles.valueDesc}>{v.desc}</p>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="section">
        <div className="section-header">
          <span className="section-tag">How We Work</span>
          <h2 className="section-title">Our Process</h2>
        </div>
        <div className={styles.processGrid}>
          {PROCESS.map((step, i) => (
            <AnimatedCard key={i} delay={i * 100} className={styles.processStep}>
              <div className={styles.processNum}>{step.num}</div>
              <h4 className={styles.processTitle}>{step.title}</h4>
              <p className={styles.processDesc}>{step.desc}</p>
            </AnimatedCard>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="cta-band">
        <h2 className="cta-band__title">Let's Build Something Together</h2>
        <p className="cta-band__sub">Ready to experience the Be-Living difference? Let's talk.</p>
        <Link href="/contact" className="btn-white">Book a Consultation</Link>
      </div>
    </>
  );
}
