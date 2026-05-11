import React, { useState, useEffect, useRef } from 'react';

// ─── Data ─────────────────────────────────────────────────────────────────────

const HOURS = [
  { day: 'Monday',    label: '10:30 AM – 9:30 PM',  js: 1 },
  { day: 'Tuesday',   label: '10:30 AM – 9:30 PM',  js: 2 },
  { day: 'Wednesday', label: '10:30 AM – 9:30 PM',  js: 3 },
  { day: 'Thursday',  label: '10:30 AM – 9:30 PM',  js: 4 },
  { day: 'Friday',    label: '10:30 AM – 10:00 PM', js: 5 },
  { day: 'Saturday',  label: '10:30 AM – 10:00 PM', js: 6 },
  { day: 'Sunday',    label: '10:30 AM – 9:30 PM',  js: 0 },
];

const MENU = [
  {
    src:   '/chicken.png',
    title: 'Charcoal Chicken',
    desc:  'Whole birds slow-cooked over hardwood charcoal. Our house marinade penetrates deep — the crust caramelises, the flesh stays impossibly moist.',
  },
  {
    src:   '/burger.png',
    title: 'Gourmet Burgers',
    desc:  'House-ground patties grilled to order, stacked with premium toppings, house-made sauces and a toasted brioche bun.',
  },
  {
    src:   '/salad-chips.png',
    title: 'Fresh Salads & Chips',
    desc:  'Vibrant seasonal salads made daily, paired with hand-cut chips fried until golden — the perfect companion to every plate.',
  },
];

// ─── Icons ────────────────────────────────────────────────────────────────────

const IconInstagram = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const IconFacebook = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
  </svg>
);

const IconPhone = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.69 13.5a19.79 19.79 0 01-3.07-8.67A2 2 0 012.6 2.71h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L7.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
  </svg>
);

const IconMapPin = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

// ─── Global CSS (injected as a single <style> tag) ────────────────────────────

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html { scroll-behavior: smooth; font-size: 16px; }

  body {
    background: #111111;
    color: #F5F0EB;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
    line-height: 1.6;
  }

  img { display: block; max-width: 100%; }
  a   { color: inherit; text-decoration: none; }

  /* ─ Reveal system ─ */
  .rv {
    opacity: 0;
    transform: translateY(28px);
    transition:
      opacity  0.75s cubic-bezier(0.22, 1, 0.36, 1),
      transform 0.75s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .rv.in { opacity: 1; transform: none; }
  .d1 { transition-delay: 0.07s; }
  .d2 { transition-delay: 0.16s; }
  .d3 { transition-delay: 0.25s; }
  .d4 { transition-delay: 0.34s; }
  .d5 { transition-delay: 0.43s; }

  /* ─ Navbar ─ */
  .nav {
    position: fixed; inset-inline: 0; top: 0;
    z-index: 900;
    padding: 28px 60px;
    display: flex; align-items: center; justify-content: space-between;
    transition: padding 0.38s ease, background 0.38s ease,
                backdrop-filter 0.38s ease, box-shadow 0.38s ease;
  }
  .nav.stuck {
    padding: 15px 60px;
    background: rgba(11, 11, 11, 0.94);
    backdrop-filter: blur(28px);
    -webkit-backdrop-filter: blur(28px);
    box-shadow: 0 1px 0 rgba(245,240,235,0.045), 0 6px 40px rgba(0,0,0,0.55);
  }
  .nav-brand {
    font-family: 'Playfair Display', serif;
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 0.01em;
    line-height: 1.25;
    color: #F5F0EB;
    max-width: 180px;
    flex-shrink: 0;
  }
  .nav-links {
    display: flex; align-items: center; gap: 42px;
    list-style: none;
  }
  .nav-links a {
    font-size: 0.72rem;
    font-weight: 400;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(245,240,235,0.6);
    position: relative;
    transition: color 0.25s;
  }
  .nav-links a::after {
    content: '';
    position: absolute; left: 0; bottom: -5px;
    width: 0; height: 1px;
    background: #E8521A;
    transition: width 0.32s ease;
  }
  .nav-links a:hover { color: #F5F0EB; }
  .nav-links a:hover::after { width: 100%; }
  .nav-order {
    display: inline-block;
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    padding: 10px 24px;
    background: #E8521A;
    color: #F5F0EB;
    border: 1px solid #E8521A;
    border-radius: 2px;
    transition: background 0.25s, color 0.25s, transform 0.25s, box-shadow 0.25s;
    cursor: pointer;
  }
  .nav-order:hover {
    background: #F5F0EB;
    color: #111111;
    border-color: #F5F0EB;
    transform: translateY(-1px);
    box-shadow: 0 4px 18px rgba(232,82,26,0.38);
  }
  .nav-right {
    display: flex; align-items: center; gap: 16px;
  }
  .hamburger {
    display: none;
    flex-direction: column; gap: 5px;
    background: none; border: none; padding: 5px; cursor: pointer;
  }
  .hamburger span {
    display: block;
    width: 22px; height: 1.5px;
    background: #F5F0EB;
    transition: transform 0.32s ease, opacity 0.32s ease;
    transform-origin: center;
  }
  .hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
  .hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
  .hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

  /* ─ Mobile drawer ─ */
  .drawer {
    position: fixed; inset: 0; z-index: 850;
    background: #0D0D0D;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 44px;
    transform: translateX(100%);
    transition: transform 0.48s cubic-bezier(0.22, 1, 0.36, 1);
    pointer-events: none;
  }
  .drawer.open { transform: none; pointer-events: auto; }
  .drawer a {
    font-family: 'Playfair Display', serif;
    font-size: 2.4rem;
    font-weight: 500;
    color: rgba(245,240,235,0.85);
    transition: color 0.22s;
  }
  .drawer a:hover { color: #E8521A; }
  .drawer-cta {
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    padding: 15px 40px;
    background: #E8521A;
    color: #F5F0EB;
    border-radius: 2px;
    margin-top: 8px;
    cursor: pointer;
  }

  /* ─ Hero ─ */
  .hero {
    position: relative;
    width: 100%; height: 100vh; min-height: 680px;
    display: flex; align-items: center;
    overflow: hidden;
  }
  .hero-bg {
    position: absolute;
    inset: -14% 0;
    background: url('/hero.png') center 30% / cover no-repeat;
    will-change: transform;
  }
  .hero-overlay {
    position: absolute; inset: 0;
    background:
      linear-gradient(108deg, rgba(11,11,11,0.93) 0%, rgba(11,11,11,0.66) 52%, rgba(11,11,11,0.18) 100%),
      linear-gradient(0deg, rgba(11,11,11,0.97) 0%, transparent 32%);
  }
  .hero-content {
    position: relative; z-index: 2;
    padding: 0 92px;
    max-width: 860px;
  }
  .hero-eyebrow {
    display: inline-flex; align-items: center; gap: 14px;
    font-size: 0.66rem;
    font-weight: 500;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: #F2A600;
    margin-bottom: 26px;
    opacity: 0;
    animation: fadeUp 0.8s 0.25s cubic-bezier(0.22,1,0.36,1) forwards;
  }
  .hero-eyebrow::before {
    content: '';
    display: block;
    width: 34px; height: 1px;
    background: #F2A600;
    flex-shrink: 0;
  }
  .hero-h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.6rem, 8vw, 6.8rem);
    font-weight: 700;
    line-height: 1.04;
    letter-spacing: -0.028em;
    color: #F5F0EB;
    margin-bottom: 24px;
    opacity: 0;
    animation: fadeUp 0.9s 0.4s cubic-bezier(0.22,1,0.36,1) forwards;
  }
  .hero-h1 em {
    font-style: italic;
    color: #E8521A;
    display: block;
  }
  .hero-sub {
    font-size: clamp(0.95rem, 1.45vw, 1.15rem);
    font-weight: 300;
    line-height: 1.8;
    color: rgba(245,240,235,0.68);
    max-width: 460px;
    margin-bottom: 48px;
    opacity: 0;
    animation: fadeUp 0.9s 0.56s cubic-bezier(0.22,1,0.36,1) forwards;
  }
  .hero-btns {
    display: flex; gap: 14px; flex-wrap: wrap;
    opacity: 0;
    animation: fadeUp 0.9s 0.72s cubic-bezier(0.22,1,0.36,1) forwards;
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(26px); }
    to   { opacity: 1; transform: none; }
  }
  .btn-ember {
    display: inline-block;
    font-size: 0.74rem;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    padding: 15px 38px;
    background: #E8521A;
    color: #F5F0EB;
    border: 1px solid #E8521A;
    border-radius: 2px;
    transition: background 0.28s, color 0.28s, border-color 0.28s, transform 0.28s, box-shadow 0.28s;
    cursor: pointer;
  }
  .btn-ember:hover {
    background: #F5F0EB;
    color: #111111;
    border-color: #F5F0EB;
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(232,82,26,0.38);
  }
  .btn-outline {
    display: inline-block;
    font-size: 0.74rem;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    padding: 15px 38px;
    background: transparent;
    color: #F5F0EB;
    border: 1px solid rgba(245,240,235,0.3);
    border-radius: 2px;
    transition: border-color 0.28s, background 0.28s, transform 0.28s;
    cursor: pointer;
  }
  .btn-outline:hover {
    border-color: rgba(245,240,235,0.75);
    background: rgba(245,240,235,0.05);
    transform: translateY(-2px);
  }
  .scroll-indicator {
    position: absolute;
    bottom: 44px; left: 92px;
    z-index: 2;
    display: flex; flex-direction: column; align-items: center; gap: 10px;
    opacity: 0;
    animation: fadeUp 0.8s 1.1s ease forwards;
  }
  .scroll-indicator-line {
    width: 1px; height: 56px;
    background: linear-gradient(to bottom, rgba(245,240,235,0.55), transparent);
    animation: lineBreath 2.2s ease-in-out 1.5s infinite;
  }
  .scroll-indicator span {
    font-size: 0.6rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(245,240,235,0.32);
    writing-mode: vertical-rl;
    margin-top: 4px;
  }
  @keyframes lineBreath {
    0%,100% { opacity: 0.5; transform: scaleY(1); }
    50%      { opacity: 1;   transform: scaleY(0.55); }
  }

  /* ─ Section separators ─ */
  .edge-top {
    position: absolute;
    top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(232,82,26,0.22), transparent);
  }
  .edge-top-subtle {
    position: absolute;
    top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(245,240,235,0.055), transparent);
  }

  /* ─ Shared section utilities ─ */
  .eyebrow {
    display: inline-flex; align-items: center; gap: 12px;
    font-size: 0.66rem;
    font-weight: 500;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: #E8521A;
    margin-bottom: 22px;
  }
  .eyebrow::before {
    content: '';
    display: block;
    width: 22px; height: 1px;
    background: #E8521A;
    flex-shrink: 0;
  }
  .eyebrow-gold {
    color: #F2A600;
  }
  .eyebrow-gold::before { background: rgba(242,166,0,0.4); }
  .eyebrow-center {
    display: inline-flex;
    align-items: center; gap: 18px;
  }
  .eyebrow-center::before,
  .eyebrow-center::after {
    content: '';
    display: block;
    width: 40px; height: 1px;
    background: rgba(242,166,0,0.35);
    flex-shrink: 0;
  }
  .section-h2 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2rem, 3vw, 2.8rem);
    font-weight: 600;
    line-height: 1.22;
    letter-spacing: -0.015em;
    color: #F5F0EB;
    margin-bottom: 28px;
  }
  .section-h2-xl {
    font-size: clamp(2.4rem, 4.5vw, 3.6rem);
    letter-spacing: -0.022em;
    line-height: 1.1;
  }

  /* ─ About ─ */
  .about {
    padding: 136px 0;
    background: #111111;
    position: relative;
    overflow: hidden;
  }
  .about-inner {
    max-width: 1240px;
    margin: 0 auto;
    padding: 0 60px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 100px;
    align-items: start;
  }
  /* Atmospheric illustration on the left */
  .about-art {
    position: relative;
    aspect-ratio: 5/6;
    border-radius: 3px;
    overflow: hidden;
    flex-shrink: 0;
  }
  .art-fill {
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse at 28% 68%, rgba(232,82,26,0.3)  0%, transparent 52%),
      radial-gradient(ellipse at 72% 22%, rgba(242,166,0,0.2)  0%, transparent 48%),
      radial-gradient(ellipse at 55% 88%, rgba(232,82,26,0.14) 0%, transparent 42%),
      linear-gradient(150deg, #1D1A17 0%, #0C0A08 100%);
  }
  .art-grid {
    position: absolute; inset: 0;
    opacity: 0.038;
    background-image:
      linear-gradient(rgba(245,240,235,1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(245,240,235,1) 1px, transparent 1px);
    background-size: 52px 52px;
  }
  .art-glow-a {
    position: absolute;
    width: 260px; height: 260px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(232,82,26,0.42) 0%, transparent 70%);
    bottom: 16%; left: 12%;
    filter: blur(56px);
    animation: breathe 5.5s ease-in-out infinite;
  }
  .art-glow-b {
    position: absolute;
    width: 180px; height: 180px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(242,166,0,0.32) 0%, transparent 70%);
    top: 12%; right: 16%;
    filter: blur(44px);
    animation: breathe 7s ease-in-out 2s infinite;
  }
  .about-photo {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover;
    object-position: center;
    filter: brightness(0.88) saturate(1.1);
    transition: transform 0.7s cubic-bezier(0.22,1,0.36,1);
  }
  .about-art:hover .about-photo { transform: scale(1.03); }
  .about-art::after {
    content: '';
    position: absolute; inset: 0;
    background:
      linear-gradient(to top,  rgba(11,11,11,0.55) 0%, transparent 40%),
      linear-gradient(to right, rgba(11,11,11,0.25) 0%, transparent 50%);
    pointer-events: none;
    z-index: 1;
  }
  .art-corner-tl, .art-corner-br, .art-badge { z-index: 2; }
  .art-corner-tl {
    position: absolute; top: 36px; left: 36px;
    width: 64px; height: 64px;
    border-top: 1px solid rgba(242,166,0,0.38);
    border-left: 1px solid rgba(242,166,0,0.38);
  }
  .art-corner-br {
    position: absolute; bottom: 36px; right: 36px;
    width: 64px; height: 64px;
    border-bottom: 1px solid rgba(242,166,0,0.18);
    border-right: 1px solid rgba(242,166,0,0.18);
  }
  .art-numeral {
    position: absolute;
    bottom: 20px; right: 28px;
    font-family: 'Playfair Display', serif;
    font-size: 10rem;
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.06em;
    color: rgba(232,82,26,0.065);
    user-select: none;
    pointer-events: none;
  }
  .art-badge {
    position: absolute;
    top: 36px; right: -1px;
    background: #E8521A;
    color: #F5F0EB;
    padding: 8px 20px 8px 16px;
    font-size: 0.65rem;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }
  @keyframes breathe {
    0%,100% { transform: scale(1);    opacity: 0.65; }
    50%      { transform: scale(1.28); opacity: 1;    }
  }
  .about-copy p {
    font-size: 0.98rem;
    font-weight: 300;
    line-height: 1.88;
    color: rgba(245,240,235,0.6);
    margin-bottom: 20px;
  }
  .stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    border: 1px solid rgba(245,240,235,0.07);
    border-radius: 3px;
    overflow: hidden;
    margin-top: 48px;
  }
  .stat {
    background: #1A1A1A;
    padding: 26px 16px;
    text-align: center;
    border-right: 1px solid rgba(245,240,235,0.07);
  }
  .stat:last-child { border-right: none; }
  .stat-val {
    font-family: 'Playfair Display', serif;
    font-size: 2.1rem;
    font-weight: 700;
    color: #E8521A;
    line-height: 1;
    margin-bottom: 8px;
    letter-spacing: -0.02em;
  }
  .stat-key {
    font-size: 0.63rem;
    font-weight: 400;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(245,240,235,0.38);
  }

  /* ─ Menu ─ */
  .menu-section {
    padding: 136px 0;
    background: #0D0D0D;
    position: relative;
    overflow: hidden;
  }
  .menu-header {
    text-align: center;
    margin-bottom: 72px;
    padding: 0 60px;
  }
  .menu-grid {
    max-width: 1240px;
    margin: 0 auto;
    padding: 0 60px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
  }
  .card {
    position: relative;
    border-radius: 3px;
    overflow: hidden;
    background: #181818;
    cursor: pointer;
    transition:
      transform 0.48s cubic-bezier(0.22,1,0.36,1),
      box-shadow 0.48s ease;
  }
  .card:hover {
    transform: translateY(-10px);
    box-shadow:
      0 30px 60px rgba(0,0,0,0.6),
      0 0 0 1px rgba(232,82,26,0.16),
      0 0 48px rgba(232,82,26,0.05);
  }
  .card-img-wrap {
    position: relative;
    aspect-ratio: 4/3;
    overflow: hidden;
  }
  .card-img {
    width: 100%; height: 100%;
    object-fit: cover;
    transition: transform 0.7s cubic-bezier(0.22,1,0.36,1);
    filter: brightness(0.85) saturate(1.2);
  }
  .card:hover .card-img { transform: scale(1.08); }
  .card-img-shade {
    position: absolute; inset: 0;
    background: linear-gradient(
      to top,
      rgba(13,13,13,0.78) 0%,
      rgba(13,13,13,0.14) 48%,
      transparent 100%
    );
  }
  .card-pip {
    position: absolute;
    top: 18px; right: 18px;
    width: 26px; height: 2px;
    background: #E8521A;
    border-radius: 1px;
    transition: width 0.38s ease;
  }
  .card:hover .card-pip { width: 44px; }
  .card-body {
    padding: 26px 28px 32px;
    border-top: 1px solid rgba(245,240,235,0.038);
  }
  .card-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.4rem;
    font-weight: 600;
    color: #F5F0EB;
    margin-bottom: 10px;
    letter-spacing: -0.01em;
    line-height: 1.22;
  }
  .card-desc {
    font-size: 0.86rem;
    font-weight: 300;
    line-height: 1.68;
    color: rgba(245,240,235,0.48);
  }

  /* ─ Order CTA ─ */
  .order-cta {
    position: relative;
    padding: 116px 60px;
    background: rgba(232, 82, 26, 0.14);
    border-top: 1px solid rgba(232, 82, 26, 0.28);
    border-bottom: 1px solid rgba(232, 82, 26, 0.18);
    overflow: hidden;
    text-align: center;
  }
  .cta-hatch {
    position: absolute; inset: 0;
    opacity: 0.018;
    background-image:
      repeating-linear-gradient(-45deg, #F5F0EB 0, #F5F0EB 1px, transparent 0, transparent 50%);
    background-size: 24px 24px;
  }
  .cta-bloom {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 50% 50%, rgba(232,82,26,0.12) 0%, transparent 70%);
  }
  .cta-bloom-b {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 50% 0%, rgba(242,166,0,0.06) 0%, transparent 55%);
  }
  .cta-inner {
    position: relative; z-index: 2;
    max-width: 620px;
    margin: 0 auto;
  }
  .cta-h2 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(3rem, 6vw, 4.8rem);
    font-weight: 700;
    color: #F5F0EB;
    letter-spacing: -0.028em;
    line-height: 1.07;
    margin-bottom: 18px;
  }
  .cta-sub {
    font-size: 1.05rem;
    font-weight: 300;
    color: rgba(245,240,235,0.68);
    margin-bottom: 44px;
    line-height: 1.65;
  }
  .btn-dark {
    display: inline-block;
    font-size: 0.76rem;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    padding: 18px 54px;
    background: #F5F0EB;
    color: #111111;
    border: 1px solid #F5F0EB;
    border-radius: 2px;
    transition: background 0.28s, color 0.28s, border-color 0.28s, transform 0.28s, box-shadow 0.28s;
    cursor: pointer;
  }
  .btn-dark:hover {
    background: transparent;
    color: #F5F0EB;
    border-color: rgba(245,240,235,0.55);
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(0,0,0,0.28);
  }

  /* ─ Hours & Location ─ */
  .hours-section {
    padding: 136px 0;
    background: #1A1A1A;
    position: relative;
  }
  .hours-inner {
    max-width: 1240px;
    margin: 0 auto;
    padding: 0 60px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 100px;
    align-items: start;
  }
  .hours-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 36px;
  }
  .hours-row td {
    padding: 13px 0;
    font-size: 0.9rem;
    font-weight: 300;
    color: rgba(245,240,235,0.5);
    border-bottom: 1px solid rgba(245,240,235,0.05);
  }
  .hours-row td:last-child { text-align: right; }
  .hours-row.today td         { color: #F5F0EB; font-weight: 400; }
  .hours-row.today td:first-child { color: #E8521A; font-weight: 500; }
  .hours-row.today td:last-child  { color: #F2A600; }
  .hours-today-dot {
    display: inline-block;
    width: 5px; height: 5px;
    border-radius: 50%;
    background: #E8521A;
    margin-left: 8px;
    vertical-align: middle;
    position: relative;
    top: -1px;
  }
  .location-addr {
    font-size: 0.96rem;
    font-weight: 300;
    color: rgba(245,240,235,0.58);
    line-height: 1.85;
    margin-top: 36px;
    margin-bottom: 20px;
  }
  .location-addr span {
    display: flex; align-items: flex-start; gap: 9px;
  }
  .location-addr span svg { flex-shrink: 0; margin-top: 4px; color: #E8521A; }
  .location-phone {
    display: inline-flex; align-items: center; gap: 10px;
    font-size: 1.12rem;
    font-weight: 400;
    color: #F2A600;
    margin-bottom: 36px;
    transition: color 0.22s;
  }
  .location-phone:hover { color: #E8521A; }
  .map-wrap {
    width: 100%; height: 290px;
    border-radius: 3px;
    overflow: hidden;
    border: 1px solid rgba(245,240,235,0.06);
    position: relative;
  }
  .map-wrap iframe {
    width: 100%; height: 100%;
    border: none;
    filter: grayscale(80%) brightness(0.7) contrast(1.05);
  }

  /* ─ Footer ─ */
  .footer {
    background: #0D0D0D;
    border-top: 1px solid rgba(245,240,235,0.05);
    padding-top: 80px;
  }
  .footer-grid {
    max-width: 1240px;
    margin: 0 auto;
    padding: 0 60px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 40px;
  }
  .footer-brand {
    font-family: 'Playfair Display', serif;
    font-size: 1.22rem;
    font-weight: 600;
    color: #F5F0EB;
    line-height: 1.25;
    margin-bottom: 14px;
  }
  .footer-tagline {
    font-size: 0.86rem;
    font-weight: 300;
    color: rgba(245,240,235,0.38);
    line-height: 1.72;
    max-width: 260px;
    margin-bottom: 28px;
  }
  .footer-divider {
    display: none;
  }
  @media (min-width: 769px) {
    .footer-col-brand {
      padding-right: 32px;
      border-right: 1px solid rgba(245,240,235,0.06);
    }
  }
  .socials {
    display: flex; gap: 11px;
  }
  .social-btn {
    width: 36px; height: 36px;
    border-radius: 50%;
    border: 1px solid rgba(245,240,235,0.11);
    display: flex; align-items: center; justify-content: center;
    color: rgba(245,240,235,0.42);
    transition: border-color 0.25s, color 0.25s, transform 0.25s;
    cursor: pointer;
  }
  .social-btn:hover {
    border-color: #E8521A;
    color: #E8521A;
    transform: translateY(-2px);
  }
  .footer-col-head {
    font-size: 0.63rem;
    font-weight: 500;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(245,240,235,0.26);
    margin-bottom: 22px;
  }
  .footer-links { list-style: none; display: flex; flex-direction: column; gap: 11px; }
  .footer-links a {
    font-size: 0.87rem;
    font-weight: 300;
    color: rgba(245,240,235,0.48);
    transition: color 0.22s;
  }
  .footer-links a:hover { color: #F5F0EB; }
  .footer-contact p {
    font-size: 0.87rem;
    font-weight: 300;
    color: rgba(245,240,235,0.48);
    line-height: 1.65;
    margin-bottom: 9px;
  }
  .footer-contact a { transition: color 0.22s; }
  .footer-contact a:hover { color: #E8521A; }
  .footer-bottom {
    max-width: 1240px;
    margin: 64px auto 0;
    padding: 22px 60px;
    border-top: 1px solid rgba(245,240,235,0.05);
    display: flex; align-items: center; justify-content: space-between;
  }
  .footer-copy {
    font-size: 0.76rem;
    font-weight: 300;
    color: rgba(245,240,235,0.22);
    letter-spacing: 0.02em;
  }

  /* ─ Responsive ─ */

  @media (max-width: 1080px) {
    .nav, .nav.stuck  { padding-inline: 40px; }
    .hero-content     { padding: 0 52px; }
    .hero-sub         { max-width: 100%; }
    .scroll-indicator { left: 52px; }
    .about-inner      { padding: 0 40px; gap: 60px; }
    .menu-grid        { padding: 0 40px; gap: 20px; }
    .menu-header      { padding: 0 40px; }
    .hours-inner      { padding: 0 40px; gap: 60px; }
    .footer-grid      { padding: 0 40px; }
    .footer-bottom    { padding-inline: 40px; }
  }

  /* Menu drops to 2-col before cards get too narrow */
  @media (max-width: 960px) {
    .menu-grid { grid-template-columns: repeat(2, 1fr); }
    /* Third card spans full width so it doesn't hang alone */
    .menu-grid .card:last-child { grid-column: 1 / -1; }
    .menu-grid .card:last-child .card-img-wrap { aspect-ratio: 21/9; }
  }

  /* Tablet / mobile — hamburger, single-column layouts */
  @media (max-width: 768px) {
    .nav, .nav.stuck   { padding: 18px 24px; }
    .nav-links,
    .nav-order         { display: none; }
    .hamburger         { display: flex; }

    .hero              { height: 75vh; min-height: 520px; justify-content: center; }
    .hero-bg           { inset: -5% 0; background-position: center center; }
    .hero-content      { padding: 0 24px; max-width: 100%; text-align: center; }
    .hero-eyebrow      { justify-content: center; }
    .hero-sub          { max-width: 100%; margin-bottom: 36px; margin-inline: auto; }
    .hero-btns         { flex-direction: column; align-items: center; gap: 12px; }
    .scroll-indicator  { display: none; }

    .about             { padding: 80px 0; }
    .about-inner       { grid-template-columns: 1fr; padding: 0 24px; gap: 40px; }
    .about-art         { aspect-ratio: 4/3; min-height: 240px; }
    .about-copy p      { font-size: 0.94rem; }

    .menu-section      { padding: 80px 0; }
    .menu-header       { padding: 0 24px; margin-bottom: 48px; }
    .menu-grid         { grid-template-columns: 1fr; padding: 0 24px; gap: 20px; }
    .card-body         { padding: 20px 22px 26px; }
    .card-title        { font-size: 1.25rem; }

    .order-cta         { padding: 72px 24px; }
    .cta-sub           { font-size: 0.95rem; }

    .hours-section     { padding: 80px 0; }
    .hours-inner       { grid-template-columns: 1fr; padding: 0 24px; gap: 52px; }
    .map-wrap          { height: 240px; }

    .footer            { padding-top: 52px; }
    .footer-grid       { grid-template-columns: 1fr; padding: 0 24px; gap: 32px; }
    .footer-tagline    { max-width: 100%; }
    .footer-bottom     { margin-top: 44px; padding: 20px 24px; flex-direction: column; gap: 6px; text-align: center; }

    .section-h2-xl     { font-size: clamp(2rem, 7.5vw, 3rem); }
    .eyebrow-center::before,
    .eyebrow-center::after { width: 24px; }
  }

  /* Small mobile — scale down type & spacing further */
  @media (max-width: 430px) {
    .hero-h1      { font-size: 2.4rem; }
    .hero-sub     { font-size: 0.92rem; }
    .stat-val     { font-size: 1.75rem; }
    .stat         { padding: 20px 12px; }
    .cta-h2       { font-size: 2.4rem; }
    .section-h2   { font-size: 1.9rem; }
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function App() {
  const [scrolled, setScrolled]   = useState(false);
  const [scrollY, setScrollY]     = useState(0);
  const [drawerOpen, setDrawer]   = useState(false);
  const heroBg                    = useRef(null);
  const today                     = new Date().getDay();

  // Navbar + parallax
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 55);
      setScrollY(y);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Parallax — hero bg drifts at 0.22× scroll speed
  useEffect(() => {
    if (heroBg.current) {
      heroBg.current.style.transform = `translateY(${scrollY * 0.22}px)`;
    }
  }, [scrollY]);

  // Scroll-reveal via IntersectionObserver
  useEffect(() => {
    const targets = document.querySelectorAll('.rv');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
    );
    targets.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const closeDrawer = () => setDrawer(false);

  return (
    <>
      <style>{CSS}</style>

      {/* ── Mobile Drawer ─────────────────────────────────────────────── */}
      <div
        className={`drawer${drawerOpen ? ' open' : ''}`}
        aria-hidden={!drawerOpen}
        aria-label="Mobile navigation"
        role="dialog"
      >
        <a href="#home"  onClick={closeDrawer}>Home</a>
        <a href="#about" onClick={closeDrawer}>About</a>
        <a href="#menu"  onClick={closeDrawer}>Menu</a>
        <a href="#hours" onClick={closeDrawer}>Hours</a>
        <a
          href="https://mascotcharcoalchicken.cloveronline.com.au/"
          target="_blank"
          rel="noreferrer"
          className="drawer-cta"
          onClick={closeDrawer}
        >
          Order Online
        </a>
      </div>

      {/* ── Navbar ────────────────────────────────────────────────────── */}
      <nav
        className={`nav${scrolled ? ' stuck' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <a href="#home" className="nav-brand" aria-label="Mascot Charcoal Chickens — home">
          Mascot Charcoal<br />Chickens
        </a>

        <ul className="nav-links" role="list">
          <li><a href="#about">About</a></li>
          <li><a href="#menu">Menu</a></li>
          <li><a href="#hours">Hours</a></li>
        </ul>

        <div className="nav-right">
          <a
            href="https://mascotcharcoalchicken.cloveronline.com.au/"
            target="_blank"
            rel="noreferrer"
            className="nav-order"
          >
            Order Online
          </a>
          <button
            className={`hamburger${drawerOpen ? ' open' : ''}`}
            onClick={() => setDrawer(o => !o)}
            aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={drawerOpen}
            aria-controls="mobile-drawer"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <main>
        {/* ── Hero ──────────────────────────────────────────────────── */}
        <section className="hero" id="home" aria-label="Hero">
          <div className="hero-bg" ref={heroBg} aria-hidden="true" />
          <div className="hero-overlay" aria-hidden="true" />

          <div className="hero-content">
            <p className="hero-eyebrow">Mascot's Favourite Since 2000</p>

            <h1 className="hero-h1">
              Charcoal Chicken.
              <em>Done Right.</em>
            </h1>

            <p className="hero-sub">
              Sydney's Inner-South home for authentic charcoal chicken,
              fresh salads, and gourmet burgers.
            </p>

            <div className="hero-btns">
              <a
                href="https://mascotcharcoalchicken.cloveronline.com.au/"
                target="_blank"
                rel="noreferrer"
                className="btn-ember"
              >
                Order Online
              </a>
              <a href="#menu" className="btn-outline">View Menu</a>
            </div>
          </div>

          <div className="scroll-indicator" aria-hidden="true">
            <div className="scroll-indicator-line" />
            <span>Scroll</span>
          </div>
        </section>

        {/* ── About ─────────────────────────────────────────────────── */}
        <section className="about" id="about" aria-labelledby="about-h2">
          <div className="edge-top" aria-hidden="true" />
          <div className="about-inner">

            {/* Our story photo */}
            <div className="about-art">
              <img
                src="/our-story.png"
                alt="The team at Mascot Charcoal Chickens — over 20 years of family tradition"
                className="about-photo"
                loading="lazy"
              />
              <div className="art-corner-tl" aria-hidden="true" />
              <div className="art-corner-br" aria-hidden="true" />
              <div className="art-badge"     aria-hidden="true">Est. 2000</div>
            </div>

            {/* Copy */}
            <div className="about-copy">
              <p className="eyebrow rv d1">Our Story</p>
              <h2 className="section-h2 rv d2" id="about-h2">
                A Family Tradition,<br />
                Over 20&nbsp;Years<br />
                in the Making
              </h2>
              <p className="rv d3">
                Nestled in the heart of Mascot since 2000, we've spent over two decades
                perfecting the art of charcoal cooking. Every bird is marinated in our
                house blend and slow-cooked over hardwood charcoal until the skin
                caramelises and the smoke works its way deep into the flesh.
              </p>
              <p className="rv d3">
                We're a family-run kitchen with deep roots in Sydney's Inner-South.
                Our menu is built around fresh, daily-sourced ingredients — because
                great food begins long before it reaches the grill. Whether you dine in
                or take away, every meal leaves our kitchen with the same care.
              </p>

              <div className="stats rv d4" role="list" aria-label="At a glance">
                <div className="stat" role="listitem">
                  <div className="stat-val">20+</div>
                  <div className="stat-key">Years Experience</div>
                </div>
                <div className="stat" role="listitem">
                  <div className="stat-val">Daily</div>
                  <div className="stat-key">Fresh Ingredients</div>
                </div>
                <div className="stat" role="listitem">
                  <div className="stat-val">Both</div>
                  <div className="stat-key">Dine In & Takeaway</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Menu ──────────────────────────────────────────────────── */}
        <section className="menu-section" id="menu" aria-labelledby="menu-h2">
          <div className="edge-top-subtle" aria-hidden="true" />

          <div className="menu-header">
            <p className="eyebrow eyebrow-gold eyebrow-center rv">Our Specialties</p>
            <h2 className="section-h2 section-h2-xl rv d1" id="menu-h2">
              From Our Kitchen
            </h2>
          </div>

          <div className="menu-grid">
            {MENU.map(({ src, title, desc }, i) => (
              <article
                key={title}
                className={`card rv d${i + 1}`}
                aria-label={title}
              >
                <div className="card-img-wrap">
                  <img
                    src={src}
                    alt={title}
                    className="card-img"
                    loading={i === 0 ? 'eager' : 'lazy'}
                  />
                  <div className="card-img-shade" aria-hidden="true" />
                  <div className="card-pip"       aria-hidden="true" />
                </div>
                <div className="card-body">
                  <h3 className="card-title">{title}</h3>
                  <p  className="card-desc">{desc}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── Order CTA ─────────────────────────────────────────────── */}
        <section className="order-cta" aria-label="Order online">
          <div className="cta-hatch"  aria-hidden="true" />
          <div className="cta-bloom"  aria-hidden="true" />
          <div className="cta-bloom-b" aria-hidden="true" />

          <div className="cta-inner">
            <h2 className="cta-h2 rv">Ready to Order?</h2>
            <p className="cta-sub rv d1">
              Skip the queue — order online for pickup or delivery.
            </p>
            <a
              href="https://mascotcharcoalchicken.cloveronline.com.au/"
              target="_blank"
              rel="noreferrer"
              className="btn-dark rv d2"
            >
              Order Now
            </a>
          </div>
        </section>

        {/* ── Hours & Location ──────────────────────────────────────── */}
        <section className="hours-section" id="hours" aria-labelledby="hours-h2">
          <div className="edge-top-subtle" aria-hidden="true" />
          <div className="hours-inner">

            {/* Hours */}
            <div>
              <p className="eyebrow rv">Opening Hours</p>
              <h2 className="section-h2 rv d1" id="hours-h2">
                When to Find Us
              </h2>
              <table className="hours-table rv d2" aria-label="Opening hours">
                <tbody>
                  {HOURS.map(({ day, label, js }) => {
                    const isToday = js === today;
                    return (
                      <tr key={day} className={`hours-row${isToday ? ' today' : ''}`}>
                        <td>
                          {day}
                          {isToday && (
                            <span className="hours-today-dot" aria-label="(today)" />
                          )}
                        </td>
                        <td>{label}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Location */}
            <div className="rv d2">
              <p className="eyebrow">Find Us</p>
              <h2 className="section-h2" style={{ marginBottom: 0 }}>
                Visit Our<br />Restaurant
              </h2>

              <address style={{ fontStyle: 'normal' }}>
                <p className="location-addr">
                  <span>
                    <IconMapPin />
                    1173 Botany Rd, Mascot NSW 2020
                  </span>
                </p>
                <a href="tel:0296671982" className="location-phone">
                  <IconPhone />
                  (02) 9667 1982
                </a>
              </address>

              <div className="map-wrap" role="region" aria-label="Map showing restaurant location">
                <iframe
                  src="https://maps.google.com/maps?q=1173+Botany+Rd,+Mascot+NSW+2020,+Australia&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  title="Mascot Charcoal Chickens — 1173 Botany Rd, Mascot NSW 2020"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer className="footer" role="contentinfo">
        <div className="footer-grid">
          {/* Brand column */}
          <div className="footer-col-brand">
            <div className="footer-brand">
              Mascot Charcoal<br />Chickens
            </div>
            <p className="footer-tagline">
              Sydney's Inner-South home for authentic charcoal cooking —
              crafted with fire, family, and more than twenty years of care.
            </p>
            <div className="socials">
              <a href="#" className="social-btn" aria-label="Instagram">
                <IconInstagram />
              </a>
              <a href="#" className="social-btn" aria-label="Facebook">
                <IconFacebook />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer navigation">
            <p className="footer-col-head">Navigate</p>
            <ul className="footer-links" role="list">
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#menu">Menu</a></li>
              <li><a href="#hours">Hours</a></li>
              <li>
                <a
                  href="https://mascotcharcoalchicken.cloveronline.com.au/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Order Online
                </a>
              </li>
            </ul>
          </nav>

          {/* Contact */}
          <div className="footer-contact">
            <p className="footer-col-head">Contact</p>
            <p>1173 Botany Rd<br />Mascot NSW 2020</p>
            <p>
              <a href="tel:0296671982">(02) 9667 1982</a>
            </p>
            <p style={{ marginTop: '14px', fontSize: '0.76rem', color: 'rgba(245,240,235,0.28)', lineHeight: 1.75 }}>
              Mon – Thu &nbsp;10:30 am – 9:30 pm<br />
              Fri – Sat &nbsp;&nbsp;10:30 am – 10:00 pm<br />
              Sunday &nbsp;&nbsp;&nbsp;&nbsp;10:30 am – 9:30 pm
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            © 2025 Mascot Charcoal Chickens. All rights reserved.
          </p>
          <p className="footer-copy">
            Mascot, Sydney NSW
          </p>
        </div>
      </footer>
    </>
  );
}
