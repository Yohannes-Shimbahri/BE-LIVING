// lib/adminStore.js
// ─────────────────────────────────────────────────────────────────────────────
// Central store for all editable site content.
// Reads from localStorage so changes persist without a database.
// When you connect Supabase later, replace get/set with Supabase calls.
// ─────────────────────────────────────────────────────────────────────────────

import { STATS, SERVICES, PORTFOLIO, INDUSTRIES, SITE } from './data';

// Default content pulled from your existing data.js
const DEFAULTS = {
  hero: {
    badge:    'Full Service Digital Marketing Agency',
    title:    'We Build Brands That Move People.',
    subtitle: 'We help grow your business, naturally.',
    btn1:     'Book a Consultation',
    btn2:     'View Our Work',
  },
  stats: STATS,
  services: SERVICES,
  portfolio: PORTFOLIO,
  industries: INDUSTRIES,
  about: {
    heading: 'Marketing That\'s Equal Parts Art & Science',
    p1: 'Be-Living Marketing Agency was founded on a simple belief — great marketing is equal parts art and science. We blend storytelling, analytics, and customer-focused strategies to build strong brand identities, increase engagement, and drive measurable business results.',
    p2: 'Our approach is rooted in understanding each client\'s unique goals and delivering tailored solutions that align with their target audience, industry trends, and long-term vision. We don\'t do cookie-cutter — every strategy is built from scratch, for you.',
    p3: 'We prioritize both creativity and performance, ensuring that every campaign is not only visually compelling but also results-oriented. When you work with Be-Living, you get a true partner, not just a vendor.',
  },
  contact: {
    email:        SITE.email,
    phone:        SITE.phone,
    location:     SITE.location,
    responseTime: SITE.responseTime,
  },
  theme: {
    blue:      '#1A56DB',
    blueDark:  '#1040B0',
    blueLight: '#EBF2FF',
    accent:    '#06B6D4',
    dark:      '#0F172A',
    offwhite:  '#F8FAFF',
  },
  blog: [],
};

// ── Read ──────────────────────────────────────────────────────────────────────
export function getContent(key) {
  if (typeof window === 'undefined') return DEFAULTS[key];
  try {
    const stored = localStorage.getItem(`beliving_${key}`);
    return stored ? JSON.parse(stored) : DEFAULTS[key];
  } catch {
    return DEFAULTS[key];
  }
}

export function getAllContent() {
  return {
    hero:       getContent('hero'),
    stats:      getContent('stats'),
    services:   getContent('services'),
    portfolio:  getContent('portfolio'),
    industries: getContent('industries'),
    about:      getContent('about'),
    contact:    getContent('contact'),
    theme:      getContent('theme'),
    blog:       getContent('blog'),
  };
}

// ── Write ─────────────────────────────────────────────────────────────────────
export function saveContent(key, value) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`beliving_${key}`, JSON.stringify(value));
  // Dispatch event so other tabs/components can react
  window.dispatchEvent(new CustomEvent('beliving_update', { detail: { key, value } }));
}

// ── Reset a section to defaults ───────────────────────────────────────────────
export function resetContent(key) {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(`beliving_${key}`);
}

// ── Admin auth ────────────────────────────────────────────────────────────────
export function getAdmins() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('beliving_admins') || '[]');
  } catch { return []; }
}

export function saveAdmins(admins) {
  localStorage.setItem('beliving_admins', JSON.stringify(admins));
}

export function isSetupDone() {
  return getAdmins().length > 0;
}

export function loginAdmin(username, password) {
  const admins = getAdmins();
  return admins.find(a => a.username === username && a.password === password) || null;
}

export function getCurrentAdmin() {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(sessionStorage.getItem('beliving_current_admin') || 'null');
  } catch { return null; }
}

export function setCurrentAdmin(admin) {
  sessionStorage.setItem('beliving_current_admin', JSON.stringify(admin));
}

export function logoutAdmin() {
  sessionStorage.removeItem('beliving_current_admin');
}
