import { initAiHeadlineReveal } from './test-2-ai-execution.js';
import { initSheetStack } from './test-2-sheet-stack.js';
import { initSheetCarousel } from './test-2-sheet-carousel.js';
import { initDecisionChecks } from './test-2-decision-checks.js';
import { initStickyNote } from './test-2-sticky-note.js';
import { initMarkupScrollVideo } from './test-2-markup-video.js';
import { initCardTypes } from './test-2-card-types.js';
import { initHomeAvif } from './test-2-home-avif.js';
import { initTextMotion } from './test-2-text-motion.js';
import { initDecorativeMotion } from './test-2-decorative-motion.js';
import { initAmbientMotion } from './test-2-ambient-motion.js';

initAiHeadlineReveal();
initSheetStack();
initSheetCarousel();
initTextMotion();
initDecisionChecks();
initStickyNote();
initDecorativeMotion();
initAmbientMotion();
initMarkupScrollVideo();

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const desktopMotion = matchMedia('(min-width: 1024px) and (min-height: 720px)');
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const header = document.querySelector('.t2-header');
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
  // Completed cards hold their position while the next card joins the stack.
  const resting = { transform: 'translateY(0)' };
  const waiting = { transform: 'translateY(100vh)' };
  cardAnimations = foundationCards.map((card, index) => {
    const start = index === 0 ? 0 : index === 1 ? .2 : .55;
    const end = index === 0 ? 0 : index === 1 ? .45 : .8;
    const frames = index === 0 ? [resting, resting] : [
      { ...waiting, offset: 0 },
      { ...waiting, offset: start, easing: 'cubic-bezier(.25,.46,.45,.94)' },
      { ...resting, offset: end },
      { ...resting, offset: 1 },
    ];
    const animation = card.animate(frames, { duration: 1000, fill: 'both' });
    animation.pause();
    return animation;
  });
}

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
const waitingToLoop = new WeakSet();
function syncVideos() {
  videos.forEach((video) => {
    const inGallery = Boolean(video.closest('#prototypes'));
    const shouldPlay = visibleVideos.has(video) && !document.hidden && !reducedMotion.matches
      && !manuallyPaused.has(video) && !waitingToLoop.has(video) && (!inGallery || !galleryPaused);
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
    else if (!video.ended || !video.dataset.t2LoopDelay) manuallyPaused.add(video);
  });
  video.addEventListener('play', () => manuallyPaused.delete(video));
  const loopDelay = Number(video.dataset.t2LoopDelay);
  if (loopDelay > 0) {
    // Hold the illustration at its chosen resting frame before replaying.
    const loopAt = Number(video.dataset.t2LoopAt);
    video.addEventListener('timeupdate', () => {
      if (video.currentTime < loopAt || waitingToLoop.has(video)) return;
      waitingToLoop.add(video);
      if (!video.paused) {
        automaticPauses.add(video);
        video.pause();
      }
      video.currentTime = loopAt;
      window.setTimeout(() => {
        waitingToLoop.delete(video);
        video.currentTime = 0;
        syncVideos();
      }, loopDelay);
    });
  }
  videoObserver.observe(video);
});
document.addEventListener('visibilitychange', () => { syncGallery(); syncVideos(); });

initHomeAvif();
initCardTypes();

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
  header.dataset.dark = String(darkBands.some((band) => {
    const rect = band.getBoundingClientRect();
    return rect.top < 50 && rect.bottom > 50;
  }));
  if (cardAnimations.length) {
    const rect = foundation.getBoundingClientRect();
    const progress = clamp(-rect.top / (foundation.offsetHeight - innerHeight));
    cardAnimations.forEach((animation) => { animation.currentTime = progress * 1000; });
    document.querySelector('.t2-foundation-step').textContent = `0${progress < .2 ? 1 : progress < .55 ? 2 : 3} — 03`;
  }
}
function scheduleScroll() {
  if (!scheduled) { scheduled = true; requestAnimationFrame(updateScroll); }
}
function configureMotion() {
  document.documentElement.classList.toggle('t2-motion', !reducedMotion.matches);
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
