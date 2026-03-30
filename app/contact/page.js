'use client';
import { useState } from 'react';
import { SERVICES, SITE } from '@/lib/data';
import styles from './page.module.css';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', company: '', service: '', message: '', time: '' });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.message.trim()) e.message = 'Message is required';
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSubmitted(true);
  };

  return (
    <>
      <div className="page-hero">
        <div className="page-hero__grid" />
        <span className="page-hero__tag">Contact</span>
        <h1 className="page-hero__title">Let's Work Together</h1>
        <p className="page-hero__sub">
          Ready to grow? Fill out the form and we'll be in touch within 24 hours.
        </p>
      </div>

      <section className="section">
        <div className={styles.grid}>

          {/* Left: info */}
          <div className={styles.info}>
            <h3 className={styles.infoTitle}>Get In Touch</h3>

            {[
              { icon: '✉', label: 'Email', val: SITE.email },
              { icon: '📞', label: 'Phone', val: SITE.phone },
              { icon: '📍', label: 'Location', val: SITE.location },
              { icon: '⏱', label: 'Response Time', val: SITE.responseTime },
            ].map((c, i) => (
              <div key={i} className={styles.infoItem}>
                <span className={styles.infoIcon}>{c.icon}</span>
                <div>
                  <p className={styles.infoLabel}>{c.label}</p>
                  <p className={styles.infoVal}>{c.val}</p>
                </div>
              </div>
            ))}

            <div className={styles.services}>
              <p className={styles.servicesLabel}>We offer:</p>
              <div className={styles.chips}>
                {SERVICES.map((s, i) => (
                  <span key={i} className={styles.chip}>{s.title}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div className={styles.form}>
            {submitted ? (
              <div className={styles.success}>
                <span className={styles.successIcon}>✓</span>
                <h3 className={styles.successTitle}>Message Sent!</h3>
                <p className={styles.successText}>
                  Thanks {form.name}, we'll be in touch within 24 hours.
                </p>
              </div>
            ) : (
              <>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label}>Full Name *</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                      placeholder="John Smith"
                    />
                    {errors.name && <span className={styles.error}>{errors.name}</span>}
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Email Address *</label>
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                      placeholder="john@company.com"
                    />
                    {errors.email && <span className={styles.error}>{errors.email}</span>}
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label}>Company</label>
                    <input
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      className={styles.input}
                      placeholder="Your Company Name"
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Service Interested In</label>
                    <select
                      name="service"
                      value={form.service}
                      onChange={handleChange}
                      className={styles.input}
                    >
                      <option value="">Select a service...</option>
                      {SERVICES.map((s, i) => (
                        <option key={i} value={s.title}>{s.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Message *</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    className={`${styles.input} ${styles.textarea} ${errors.message ? styles.inputError : ''}`}
                    placeholder="Tell us about your project, goals, and timeline..."
                  />
                  {errors.message && <span className={styles.error}>{errors.message}</span>}
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Preferred Consultation Time</label>
                  <select name="time" className={styles.input} onChange={handleChange}>
                    <option value="">Select a 15-min time slot...</option>
                    <optgroup label="Morning">
                      <option>9:00 AM – 9:15 AM</option>
                      <option>9:15 AM – 9:30 AM</option>
                      <option>9:30 AM – 9:45 AM</option>
                      <option>9:45 AM – 10:00 AM</option>
                      <option>10:00 AM – 10:15 AM</option>
                      <option>10:15 AM – 10:30 AM</option>
                      <option>10:30 AM – 10:45 AM</option>
                      <option>10:45 AM – 11:00 AM</option>
                      <option>11:00 AM – 11:15 AM</option>
                      <option>11:15 AM – 11:30 AM</option>
                      <option>11:30 AM – 11:45 AM</option>
                      <option>11:45 AM – 12:00 PM</option>
                    </optgroup>
                    <optgroup label="Afternoon">
                      <option>1:00 PM – 1:15 PM</option>
                      <option>1:15 PM – 1:30 PM</option>
                      <option>1:30 PM – 1:45 PM</option>
                      <option>1:45 PM – 2:00 PM</option>
                      <option>2:00 PM – 2:15 PM</option>
                      <option>2:15 PM – 2:30 PM</option>
                      <option>2:30 PM – 2:45 PM</option>
                      <option>2:45 PM – 3:00 PM</option>
                      <option>3:00 PM – 3:15 PM</option>
                      <option>3:15 PM – 3:30 PM</option>
                      <option>3:30 PM – 3:45 PM</option>
                      <option>3:45 PM – 4:00 PM</option>
                      <option>4:00 PM – 4:15 PM</option>
                      <option>4:15 PM – 4:30 PM</option>
                    </optgroup>
                  </select>
                </div>

                <button className="btn-primary" onClick={handleSubmit} style={{ width: '100%', fontSize: '14px', padding: '16px' }}>
                  Send Message →
                </button>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
