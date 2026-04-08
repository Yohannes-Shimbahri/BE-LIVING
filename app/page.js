import Link from 'next/link';
import AnimatedCard from '@/components/AnimatedCard';
import { STATS, SERVICES, INDUSTRIES, PORTFOLIO } from '@/lib/data';
import { getContent } from '@/lib/adminStore';
import styles from './page.module.css';

export const metadata = {
  title: 'Be-Living Marketing Agency | Digital Marketing That Moves People',
  description: 'Full service digital marketing agency. Social media, paid ads, content creation, email marketing, and more.',
};

export const revalidate = 60;

export default async function Home() {
  // Read from Supabase, fall back to hardcoded data
  const [stats, services, industries, portfolio, hero] = await Promise.all([
    getContent('stats'),
    getContent('services'),
    getContent('industries'),
    getContent('portfolio'),
    getContent('hero'),
  ]);

  const STATS_DATA      = Array.isArray(stats)      && stats.length      ? stats      : STATS;
  const SERVICES_DATA   = Array.isArray(services)   && services.length   ? services   : SERVICES;
  const INDUSTRIES_DATA = Array.isArray(industries) && industries.length ? industries : INDUSTRIES;
  const PORTFOLIO_DATA  = Array.isArray(portfolio)  && portfolio.length  ? portfolio  : PORTFOLIO;

  const heroStat = PORTFOLIO_DATA[0]?.result || '+340%';

  return (
    <>
      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroGrid} />
        <div className={styles.heroContent}>
          <span className={styles.heroBadge}>
            {hero?.badge || 'Full Service Digital Marketing Agency'}
          </span>
          <h1 className={styles.heroTitle}>
            {hero?.title?.split('That')[0] || 'We Build Brands'}
            <br />
            <span className={styles.heroAccent}>
              {hero?.title?.includes('That') ? 'That' + hero.title.split('That')[1] : 'That Move People.'}
            </span>
          </h1>
          <p className={styles.heroSub}>
            {hero?.subtitle || 'Data driven strategy. Creative execution. Measurable results. We help grow your business, naturally.'}
          </p>
          <div className={styles.heroBtns}>
            <Link href="/contact" className="btn-primary">
              {hero?.btn1 || 'Book a Consultation'}
            </Link>
            <Link href="/portfolio" className="btn-outline">
              {hero?.btn2 || 'View Our Work'}
            </Link>
          </div>
        </div>
        <div className={styles.heroRight}>
          <div className={styles.heroCircle1} />
          <div className={styles.heroCircle2} />
          <div className={styles.heroCard}>
            <p className={styles.heroCardLabel}>Latest Campaign</p>
            <p className={styles.heroCardStat}>{heroStat}</p>
            <p className={styles.heroCardDesc}>Lead growth in 90 days</p>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div className={styles.statsBar}>
        {STATS_DATA.map((s, i) => (
          <div key={i} className={styles.statItem}>
            <div className={styles.statDivider} />
            <div className={styles.statText}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── SERVICES PREVIEW ── */}
      <section className="section">
        <div className="section-header">
          <span className="section-tag">What We Do</span>
          <h2 className="section-title">Services Built for Growth</h2>
        </div>
        <div className={styles.serviceGrid}>
          {SERVICES_DATA.slice(0, 4).map((s, i) => (
            <AnimatedCard key={i} delay={i * 80} className={styles.serviceCard}>
              <span className={styles.serviceIcon}>{s.icon}</span>
              <h3 className={styles.serviceTitle}>{s.title}</h3>
              <p className={styles.serviceDesc}>{s.desc}</p>
            </AnimatedCard>
          ))}
        </div>
        <div className="center-btn">
          <Link href="/services" className="btn-primary">See All Services →</Link>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="section--dark">
        <div className="inner">
          <div className="section-header">
            <span className="section-tag section-tag--light">Why Be-Living</span>
            <h2 className="section-title section-title--light">Strategy Meets Creativity</h2>
          </div>
          <div className={styles.whyGrid}>
            {[
              { icon: '📊', title: 'Data-Driven',       desc: 'Every decision backed by analytics and performance data.' },
              { icon: '🎨', title: 'Creative Execution', desc: 'Visually compelling content that captures attention.' },
              { icon: '🤝', title: 'Client-Centered',   desc: 'Collaborative approach tailored to your unique goals.' },
              { icon: '📈', title: 'End-to-End',         desc: 'From strategy to execution — we handle it all.' },
            ].map((w, i) => (
              <AnimatedCard key={i} delay={i * 80} className={styles.whyCard}>
                <span className={styles.whyIcon}>{w.icon}</span>
                <h4 className={styles.whyTitle}>{w.title}</h4>
                <p className={styles.whyDesc}>{w.desc}</p>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── INDUSTRIES PREVIEW ── */}
      <section className="section">
        <div className="section-header">
          <span className="section-tag">Experience</span>
          <h2 className="section-title">Industries We Serve</h2>
        </div>
        <div className={styles.industryChips}>
          {INDUSTRIES_DATA.map((ind, i) => (
            <div key={i} className={styles.chip}>
              <span>{ind.icon}</span>
              <span>{ind.name}</span>
            </div>
          ))}
        </div>
        <div className="center-btn">
          <Link href="/industries" className="btn-primary">Learn More →</Link>
        </div>
      </section>

      {/* ── PORTFOLIO PREVIEW ── */}
      <section className="section">
        <div className="section-header">
          <span className="section-tag">Our Work</span>
          <h2 className="section-title">Recent Results</h2>
        </div>
        <div className={styles.portfolioGrid}>
          {PORTFOLIO_DATA.slice(0, 3).map((p, i) => (
            <AnimatedCard key={i} delay={i * 100} className={styles.portfolioCard}>
              {p.image ? (
                <div className={styles.portfolioImgWrap}>
                  <img src={p.image} alt={p.title} className={styles.portfolioImg} />
                  <span className={styles.portfolioImgTag}>{p.tag}</span>
                </div>
              ) : (
                <div className={styles.portfolioTop} style={{ background: p.color || '#C9A84C' }} />
              )}
              <div className={styles.portfolioBody}>
                <span className={styles.portfolioTag}>{p.tag}</span>
                <h3 className={styles.portfolioTitle}>{p.title}</h3>
                <p className={styles.portfolioDesc}>{p.desc}</p>
                <div className={styles.portfolioResult}>
                  <span className={styles.resultLabel}>Result</span>
                  <span className={styles.resultValue}>{p.result}</span>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>
        <div className="center-btn">
          <Link href="/portfolio" className="btn-primary">View All Work →</Link>
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <div className="cta-band">
        <h2 className="cta-band__title">Ready to Grow Your Business?</h2>
        <p className="cta-band__sub">Let's build something great together. Book your free consultation today.</p>
        <Link href="/contact" className="btn-white">Book a Consultation</Link>
      </div>
    </>
  );
}