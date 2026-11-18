import { initTextMotion } from './test-2-text-motion.js';
import { initDecorativeMotion } from './test-2-decorative-motion.js';
import { initAmbientMotion } from './test-2-ambient-motion.js';

initTextMotion();
initDecorativeMotion();
initAmbientMotion();

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const desktopMotion = matchMedia('(min-width: 1024px) and (min-height: 720px)');
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const header = document.querySelector('.t2-header');
const chapterLinks = [...document.querySelectorAll('.t2-progress a')];
const chapters = chapterLinks.map((link) => document.querySelector(link.hash)).filter(Boolean);
const progressAnimation = document.querySelector('[data-t2-progress-fill]').animate([
  { transform: 'scaleX(0)' }, { transform: 'scaleX(1)' },
], { duration: 1000, fill: 'both' });
progressAnimation.pause();

// Content remains visible without scripting and when motion is reduced.
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(({ target, isIntersecting, boundingClientRect }) => {
    if (isIntersecting) target.classList.add('is-visible');
    else if (boundingClientRect.top > innerHeight) target.classList.remove('is-visible');
  });
}, { rootMargin: '0px 0px -5% 0px', threshold: 0 });
document.querySelectorAll('.t2-reveal').forEach((element) => revealObserver.observe(element));

const foundation = document.querySelector('.t2-foundations');
const foundationCards = [...document.querySelectorAll('.t2-foundation-card')];
let cardAnimations = [];
function configureCards() {
  cardAnimations.forEach((animation) => animation.cancel());
  cardAnimations = [];
  if (reducedMotion.matches || !desktopMotion.matches) return;
  const resting = { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 };
  const waiting = { transform: 'translate(240px, 650px) rotate(18deg)', opacity: 0 };
  const exited = { transform: 'translate(-420px, -180px) rotate(-18deg)', opacity: 0 };
  const timelines = [
    [{ ...resting, offset: 0 }, { ...resting, offset: .2 }, { ...exited, offset: .4 }, { ...exited, offset: 1 }],
    [{ ...waiting, offset: 0 }, { ...waiting, offset: .2 }, { ...resting, offset: .4 }, { ...resting, offset: .6 }, { ...exited, offset: .8 }, { ...exited, offset: 1 }],
    [{ ...waiting, offset: 0 }, { ...waiting, offset: .6 }, { ...resting, offset: .8 }, { ...resting, offset: 1 }],
  ];
  cardAnimations = foundationCards.map((card, index) => {
    const animation = card.animate(timelines[index], { duration: 1000, fill: 'both', easing: 'linear' });
    animation.pause();
    return animation;
  });
}

const homeTabs = [...document.querySelectorAll('[data-t2-home]')];
let homeTransition;
function selectHome(tab) {
  homeTabs.forEach((item) => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
  });
  const image = document.querySelector('[data-t2-home-image]');
  const bim = tab.dataset.t2Home === 'bim';
  image.src = `/assets/img/case-format/navigation-${bim ? 'bim' : 'sheets'}.avif`;
  image.alt = `${bim ? '3D BIM' : 'Sheet management'} For You homepage with deadlines, assigned work, and project navigation`;
  document.getElementById('t2-home-panel').setAttribute('aria-labelledby', tab.id);
  homeTransition?.cancel();
  if (!reducedMotion.matches) homeTransition = image.animate([
    { opacity: .25, transform: 'translateY(8px)' },
    { opacity: 1, transform: 'translateY(0)' },
  ], { duration: 450, easing: 'cubic-bezier(.215,.61,.355,1)' });
}
homeTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectHome(tab));
  tab.addEventListener('keydown', (event) => {
    let next;
    if (event.key === 'ArrowRight') next = homeTabs[(index + 1) % homeTabs.length];
    if (event.key === 'ArrowLeft') next = homeTabs[(index - 1 + homeTabs.length) % homeTabs.length];
    if (event.key === 'Home') next = homeTabs[0];
    if (event.key === 'End') next = homeTabs.at(-1);
    if (!next) return;
    event.preventDefault();
    selectHome(next);
    next.focus();
  });
});

// Original groups remain accessible; the repeated visual copies are inert.
document.querySelectorAll('[data-t2-marquee-column]').forEach((column) => {
  const group = column.querySelector('[data-t2-marquee-group]');
  if (!group) return;
  const clone = group.cloneNode(true);
  clone.dataset.t2Clone = '';
  clone.setAttribute('aria-hidden', 'true');
  clone.inert = true;
  clone.querySelectorAll('[id]').forEach((element) => element.removeAttribute('id'));
  clone.querySelectorAll('video').forEach((video) => video.removeAttribute('controls'));
  column.append(clone);
  column.closest('#prototypes').dataset.ready = 'true';
});
const gallery = document.getElementById('prototypes');
const motionToggle = document.querySelector('[data-t2-motion-toggle]');
let galleryVisible = false;
let galleryPaused = reducedMotion.matches;
function syncGallery() {
  if (!gallery) return;
  gallery.dataset.paused = String(galleryPaused || !galleryVisible || document.hidden || reducedMotion.matches);
  if (motionToggle) {
    motionToggle.setAttribute('aria-pressed', String(galleryPaused));
    motionToggle.disabled = reducedMotion.matches;
    const label = reducedMotion.matches ? 'Animation paused' : galleryPaused ? 'Play gallery' : 'Pause gallery';
    motionToggle.querySelector('[data-t2-motion-label]').textContent = label;
    motionToggle.setAttribute('aria-label', label);
  }
}
if (gallery) new IntersectionObserver(([entry]) => {
  galleryVisible = entry.isIntersecting;
  syncGallery();
}, { threshold: 0 }).observe(gallery);
motionToggle?.addEventListener('click', () => {
  galleryPaused = !galleryPaused;
  syncGallery();
  syncVideos();
});
gallery?.addEventListener('focusin', (event) => {
  if (event.target.closest('.t2-prototype-track')) {
    galleryPaused = true;
    syncGallery();
    syncVideos();
  }
});

const videos = [...document.querySelectorAll('[data-t2-video]')];
const visibleVideos = new Set();
const manuallyPaused = new WeakSet();
const automaticPauses = new WeakSet();
function syncVideos() {
  videos.forEach((video) => {
    const inGallery = Boolean(video.closest('#prototypes'));
    const shouldPlay = visibleVideos.has(video) && !document.hidden && !reducedMotion.matches
      && !manuallyPaused.has(video) && (!inGallery || !galleryPaused);
    if (shouldPlay && video.paused) video.play().catch(() => {});
    else if (!shouldPlay && !video.paused) {
      automaticPauses.add(video);
      video.pause();
    }
  });
}
const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach(({ target, isIntersecting }) => {
    if (isIntersecting) visibleVideos.add(target);
    else visibleVideos.delete(target);
  });
  syncVideos();
}, { threshold: .15 });
videos.forEach((video) => {
  video.addEventListener('pause', () => {
    if (automaticPauses.has(video)) automaticPauses.delete(video);
    else manuallyPaused.add(video);
  });
  video.addEventListener('play', () => manuallyPaused.delete(video));
  videoObserver.observe(video);
});
document.addEventListener('visibilitychange', () => { syncGallery(); syncVideos(); });

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(({ target, isIntersecting }) => {
    if (!isIntersecting) return;
    countObserver.unobserve(target);
    const final = target.textContent.trim();
    const value = Number(final.replace(/[^\d.-]/g, ''));
    if (!Number.isFinite(value) || reducedMotion.matches) return;
    target.setAttribute('aria-label', final);
    const start = performance.now();
    function tick(now) {
      if (reducedMotion.matches) { target.textContent = final; return; }
      const progress = clamp((now - start) / 1200);
      const current = Math.round(value * (1 - Math.pow(1 - progress, 3)));
      target.textContent = `${final.startsWith('+') ? '+' : ''}${current}%`;
      if (progress < 1) requestAnimationFrame(tick);
      else target.textContent = final;
    }
    requestAnimationFrame(tick);
  });
}, { threshold: .6 });
document.querySelectorAll('[data-t2-count]').forEach((element) => countObserver.observe(element));

const darkBands = [...document.querySelectorAll('[data-t2-theme="dark"]')];
let scheduled = false;
function updateScroll() {
  scheduled = false;
  const positions = chapters.map((section) => section.getBoundingClientRect().top);
  let active = 0;
  positions.forEach((top, index) => { if (top <= innerHeight * .35) active = index; });
  chapterLinks.forEach((link, index) => {
    link.dataset.visited = String(index <= active);
    if (index === active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  const next = positions[active + 1];
  const sectionProgress = next === undefined ? 0 : clamp((innerHeight * .35 - positions[active]) / (next - positions[active]));
  progressAnimation.currentTime = ((active + sectionProgress) / Math.max(1, chapters.length - 1)) * 1000;
  header.dataset.dark = String(darkBands.some((band) => {
    const rect = band.getBoundingClientRect();
    return rect.top < 50 && rect.bottom > 50;
  }));
  if (cardAnimations.length) {
    const rect = foundation.getBoundingClientRect();
    const progress = clamp(-rect.top / (foundation.offsetHeight - innerHeight));
    cardAnimations.forEach((animation) => { animation.currentTime = progress * 1000; });
    document.querySelector('.t2-foundation-step').textContent = `0${Math.min(3, Math.floor(progress * 2.9) + 1)} — 03`;
  }
}
function scheduleScroll() {
  if (!scheduled) { scheduled = true; requestAnimationFrame(updateScroll); }
}
function configureMotion() {
  document.documentElement.classList.toggle('t2-motion', !reducedMotion.matches);
  if (reducedMotion.matches) homeTransition?.cancel();
  galleryPaused = reducedMotion.matches;
  configureCards();
  syncGallery();
  syncVideos();
  scheduleScroll();
}
window.addEventListener('scroll', scheduleScroll, { passive: true });
window.addEventListener('resize', scheduleScroll, { passive: true });
reducedMotion.addEventListener('change', configureMotion);
desktopMotion.addEventListener('change', () => { configureCards(); scheduleScroll(); });
configureMotion();
