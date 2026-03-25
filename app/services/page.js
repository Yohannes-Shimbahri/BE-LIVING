import Link from 'next/link';
import AnimatedCard from '@/components/AnimatedCard';
import { SERVICES } from '@/lib/data';
import styles from './page.module.css';

export const metadata = {
  title: 'Services | Be-Living Marketing Agency',
  description: 'Full-service digital marketing: social media, paid ads, content creation, email marketing, website development, event marketing, and consulting.',
};

export default function Services() {
  return (
    <>
      <div className="page-hero">
        <div className="page-hero__grid" />
        <span className="page-hero__tag">Services</span>
        <h1 className="page-hero__title">Everything You Need to Grow</h1>
        <p className="page-hero__sub">
          From strategy to execution — we offer end-to-end marketing solutions tailored to your business.
        </p>
      </div>

      <section className="section">
        <div className={styles.grid}>
          {SERVICES.map((s, i) => (
            <AnimatedCard key={i} delay={i * 70} className={styles.card}>
              <div className={styles.cardTop}>
                <span className={styles.icon}>{s.icon}</span>
                <h3 className={styles.title}>{s.title}</h3>
              </div>
              <p className={styles.desc}>{s.desc}</p>
              <ul className={styles.list}>
                {s.items.map((item, j) => (
                  <li key={j} className={styles.listItem}>
                    <span className={styles.arrow}>▸</span>
                    {item}
                  </li>
                ))}
              </ul>
            </AnimatedCard>
          ))}
        </div>
      </section>

      <div className="cta-band">
        <h2 className="cta-band__title">Not Sure Where to Start?</h2>
        <p className="cta-band__sub">Book a free consultation and let us recommend the right services for your goals.</p>
        <Link href="/contact" className="btn-white">Book a Consultation</Link>
      </div>
    </>
  );
}
