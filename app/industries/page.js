import Link from 'next/link';
import AnimatedCard from '@/components/AnimatedCard';
import { INDUSTRIES } from '@/lib/data';
import styles from './page.module.css';

export const metadata = {
  title: 'Industries | Be-Living Marketing Agency',
  description: 'Be-Living serves automotive, fashion, real estate, logistics, import/export, and non-profit industries with tailored marketing strategies.',
};

export default function Industries() {
  return (
    <>
      <div className="page-hero">
        <div className="page-hero__grid" />
        <span className="page-hero__tag">Industries</span>
        <h1 className="page-hero__title">Expertise Across Sectors</h1>
        <p className="page-hero__sub">
          We adapt our strategies to fit the unique dynamics of your industry — because one size never fits all.
        </p>
      </div>

      <section className="section">
        <div className={styles.grid}>
          {INDUSTRIES.map((ind, i) => (
            <AnimatedCard key={i} delay={i * 80} className={styles.card}>
              <span className={styles.icon}>{ind.icon}</span>
              <h3 className={styles.name}>{ind.name}</h3>
              <p className={styles.desc}>{ind.desc}</p>
              <p className={styles.detail}>{ind.detail}</p>
            </AnimatedCard>
          ))}
        </div>
      </section>

      {/* Cross-industry section */}
      <section className="section--dark">
        <div className="inner">
          <div className="section-header">
            <span className="section-tag section-tag--light">Cross-Industry</span>
            <h2 className="section-title section-title--light">Why Our Experience Matters</h2>
          </div>
          <div className={styles.crossGrid}>
            {[
              {
                title: 'Diverse Perspective',
                desc: 'Working across industries gives us pattern recognition that single-niche agencies lack. We bring fresh ideas from unexpected places.',
              },
              {
                title: 'Transferable Strategy',
                desc: "We apply winning tactics from one industry to unlock growth in another — what works in real estate can transform how a fashion brand captures leads.",
              },
              {
                title: 'Audience Intelligence',
                desc: 'Deep understanding of different buyer behaviors and decision journeys means we build campaigns that speak the right language to the right people.',
              },
            ].map((c, i) => (
              <AnimatedCard key={i} delay={i * 100} className={styles.crossCard}>
                <h4 className={styles.crossTitle}>{c.title}</h4>
                <p className={styles.crossDesc}>{c.desc}</p>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      <div className="cta-band">
        <h2 className="cta-band__title">Don't See Your Industry?</h2>
        <p className="cta-band__sub">We adapt to new sectors quickly. Let's talk about your business.</p>
        <Link href="/contact" className="btn-white">Book a Consultation</Link>
      </div>
    </>
  );
}
