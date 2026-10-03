(() => {
  'use strict';
  const root = document.documentElement;
  const hero = document.getElementById('hero');
  const sticky = document.getElementById('sticky');
  const toggle = document.getElementById('motion-toggle');
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = media.matches;
  function setMotion() {
    root.classList.toggle('motion-paused', paused);
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.textContent = paused ? '動きを再開する ▷' : '動きを止める Ⅱ';
  }
  setMotion();
  toggle.addEventListener('click', () => { paused = !paused; setMotion(); });
  media.addEventListener('change', () => { paused = media.matches; setMotion(); });
  if ('IntersectionObserver' in window) {
    root.classList.add('js-motion');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); observer.unobserve(entry.target); }
    }), { threshold: 0.05 });
    document.querySelectorAll('.rv').forEach(el => observer.observe(el));
  }
  let scheduled = false;
  function updateScroll() {
    const past = hero.getBoundingClientRect().bottom < 80;
    const end = window.innerHeight + window.scrollY > document.documentElement.scrollHeight - 480;
    const hidden = !past || end;
    sticky.classList.toggle('hide', hidden);
    sticky.inert = hidden;
    sticky.setAttribute('aria-hidden', String(hidden));
    scheduled = false;
  }
  window.addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; window.requestAnimationFrame(updateScroll); }
  }, { passive: true });
  window.addEventListener('resize', updateScroll);
  updateScroll();
  // Keep navigation intact; record only when the production analytics helper exists.
  document.querySelectorAll('.js-line').forEach(link => link.addEventListener('click', () => {
    if (typeof window.va === 'function') window.va('event', { name: 'line_cta', data: { position: link.dataset.pos || 'unknown' } });
  }));
})();
// Load existing Vercel analytics only on the production host.
if (location.hostname === 'nagi-genjitsu.vercel.app') {
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
  const analytics = document.createElement('script');
  analytics.defer = true;
  analytics.src = '/_vercel/insights/script.js';
  document.head.appendChild(analytics);
}
(() => {
  const root = document.documentElement;
  const hero = document.getElementById('hero');
  const desktop = matchMedia('(min-width:801px) and (prefers-reduced-motion:no-preference)');
  let x = 0, y = 0, pending = false;
  const enabled = () => desktop.matches && !root.classList.contains('motion-paused');
  function paint() {
    pending = false;
    const height = document.documentElement.scrollHeight - innerHeight;
    root.style.setProperty('--read-progress', height > 0 ? Math.min(1,scrollY/height) : 0);
    root.classList.toggle('past-hero',hero.getBoundingClientRect().bottom < 80);
    const offset = enabled() ? Math.min(scrollY,hero.offsetHeight) : 0;
    hero.style.setProperty('--portrait-x', enabled() ? x+'px' : '0px');
    hero.style.setProperty('--portrait-y', enabled() ? (y+offset*.10)+'px' : '0px');
    hero.style.setProperty('--copy-y', offset*.045+'px');
    hero.style.setProperty('--caption-y', -offset*.04+'px');
  }
  function requestPaint(){if(!pending){pending=true;requestAnimationFrame(paint);}}
  hero.addEventListener('pointermove', e => {
    if(!enabled() || e.pointerType !== 'mouse') return;
    const box=hero.getBoundingClientRect();
    x=((e.clientX-box.left)/box.width-.5)*16;
    y=((e.clientY-box.top)/box.height-.5)*12;
    requestPaint();
  },{passive:true});
  hero.addEventListener('pointerleave',()=>{x=0;y=0;requestPaint();});
  addEventListener('scroll',requestPaint,{passive:true});
  addEventListener('resize',requestPaint);
  desktop.addEventListener('change',requestPaint);
  document.getElementById('motion-toggle').addEventListener('click',requestPaint);
  if('IntersectionObserver' in window){
    const steps = new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('is-current',entry.isIntersecting)),{rootMargin:'-20% 0px -25% 0px',threshold:.25});
    document.querySelectorAll('.concept .col').forEach(el=>steps.observe(el));
  }
  paint();
})();
