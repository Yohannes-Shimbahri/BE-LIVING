// lib/adminStore.js
// ─────────────────────────────────────────────────────────────────────────────
// All site content reads/writes go through Supabase.
// Auth uses Supabase Auth (email + password).
// Site content is stored in the `site_content` table (key/value).
// Blog posts are stored in the `posts` table.
// ─────────────────────────────────────────────────────────────────────────────

import { supabase } from './supabase';
import { STATS, SERVICES, PORTFOLIO, INDUSTRIES, SITE } from './data';

// ── Default content (fallback if Supabase not set up yet) ─────────────────────
export const DEFAULTS = {
  hero: {
    badge:    'Full Service Digital Marketing Agency',
    title:    'We Build Brands That Move People.',
    subtitle: 'We help grow your business, naturally.',
    btn1:     'Book a Consultation',
    btn2:     'View Our Work',
  },
  stats:      STATS,
  services:   SERVICES,
  portfolio:  PORTFOLIO,
  industries: INDUSTRIES,
  about: {
    heading: "Marketing That's Equal Parts Art & Science",
    p1: "Be-Living Marketing Agency was founded on a simple belief — great marketing is equal parts art and science. We blend storytelling, analytics, and customer-focused strategies to build strong brand identities, increase engagement, and drive measurable business results.",
    p2: "Our approach is rooted in understanding each client's unique goals and delivering tailored solutions that align with their target audience, industry trends, and long-term vision. We don't do cookie-cutter — every strategy is built from scratch, for you.",
    p3: "We prioritize both creativity and performance, ensuring that every campaign is not only visually compelling but also results-oriented. When you work with Be-Living, you get a true partner, not just a vendor.",
  },
  contact: {
    email:        'beliving1000@gmail.com',
    phone:        '647-574-8350',
    location:     'Available Worldwide',
    responseTime: 'Within 24 hours',
  },
  theme: {
    blue:      '#1A56DB',
    blueDark:  '#1040B0',
    blueLight: '#EBF2FF',
    accent:    '#06B6D4',
    dark:      '#0F172A',
    offwhite:  '#F8FAFF',
  },
};

// ── READ a content section from Supabase ─────────────────────────────────────
export async function getContent(key) {
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('value')
      .eq('key', key)
      .single();

    if (error || !data) return DEFAULTS[key];
    return data.value;
  } catch {
    return DEFAULTS[key];
  }
}

// ── SAVE a content section to Supabase ───────────────────────────────────────
export async function saveContent(key, value) {
  const { error } = await supabase
    .from('site_content')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });

  if (error) throw error;
}

// ── GET all content sections at once ─────────────────────────────────────────
export async function getAllContent() {
  try {
    const { data } = await supabase.from('site_content').select('key, value');
    const result = { ...DEFAULTS };
    if (data) {
      data.forEach(row => { result[row.key] = row.value; });
    }
    return result;
  } catch {
    return DEFAULTS;
  }
}

// ── BLOG POSTS ────────────────────────────────────────────────────────────────
export async function getAllPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getPublishedPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getPostBySlug(slug) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();
  if (error) return null;
  return data;
}

export async function savePost(post) {
  if (post.id) {
    const { error } = await supabase
      .from('posts')
      .update({ ...post, updated_at: new Date().toISOString() })
      .eq('id', post.id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('posts')
      .insert([{ ...post, created_at: new Date().toISOString() }]);
    if (error) throw error;
  }
}

export async function deletePost(id) {
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) throw error;
}

export async function togglePublishPost(id, published) {
  const { error } = await supabase
    .from('posts')
    .update({ published })
    .eq('id', id);
  if (error) throw error;
}

// ── AUTH ──────────────────────────────────────────────────────────────────────
export async function loginAdmin(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
}

export async function logoutAdmin() {
  await supabase.auth.signOut();
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

// ── IMAGE UPLOAD to Supabase Storage ─────────────────────────────────────────
export async function uploadImage(file, bucket = 'blog-images') {
  const ext      = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, { cacheControl: '3600', upsert: false });

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return data.publicUrl;
}
