import Link from 'next/link';
import { SITE } from '@/lib/data';
import styles from './Footer.module.css';

const LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Industries', href: '/industries' },
  { label: 'Contact', href: '/contact' },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <span className={styles.logoB}>Be</span>
            <span className={styles.logoDash}>—</span>
            <span className={styles.logoLiving}>Living</span>
          </div>
          <p className={styles.tagline}>{SITE.tagline}</p>
          <p className={styles.desc}>
            Data-driven strategy. Creative execution.<br />Measurable results.
          </p>
        </div>

        <div className={styles.nav}>
          <p className={styles.navTitle}>Navigation</p>
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={styles.navLink}>{l.label}</Link>
          ))}
        </div>

        <div className={styles.contact}>
          <p className={styles.navTitle}>Contact</p>
          <p className={styles.contactItem}>{SITE.email}</p>
          <p className={styles.contactItem}>{SITE.phone}</p>
          <p className={styles.contactItem}>{SITE.location}</p>
          <Link href="/contact" className={styles.cta}>Book a Consultation</Link>
        </div>
      </div>

      <div className={styles.bottom}>
        <p className={styles.copy}>© {new Date().getFullYear()} Be-Living Marketing Agency. All rights reserved.</p>
      </div>
    </footer>
  );
}
