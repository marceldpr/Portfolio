import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import lottie from 'lottie-web/build/player/lottie_light';

export function initAmbientMotion() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let smoothScroll;
  function configureScroll() {
    smoothScroll?.destroy();
    smoothScroll = reduced.matches ? null : new Lenis({
      duration: 1,
      smoothWheel: true,
      syncTouch: false,
      autoRaf: true,
      anchors: true,
      prevent: (node) => node.matches('.t2-prototype-track, .t2-foundation-cards, video'),
    });
  }
  configureScroll();
  reduced.addEventListener('change', configureScroll);
  initSketches(reduced);
  initHelix(reduced);
  initMobileCards(reduced);
  initCardArtwork(reduced);
  initScrollLayers(reduced);
}

function initScrollLayers(reduced) {
  const desktop = matchMedia('(min-width: 768px)');
  const layers = [
    { selector: '.t2-helix', from: 'translateY(15px)', to: 'translateY(-15px)' },
    { selector: '#t2-impact-title', from: 'translateY(-70px)', to: 'translateY(0)' },
    { selector: '.t2-metrics', from: 'translateY(65px)', to: 'translateY(0)' },
    { selector: '.t2-ai-media', from: 'translateY(45px) scale(.96)', to: 'translateY(-15px) scale(1)' },
  ].flatMap((config) => [...document.querySelectorAll(config.selector)].map((element) => ({ ...config, element, animation: null })));
  let frame;
  function update() {
    frame = 0;
    layers.forEach(({ element, animation }) => {
      if (!animation) return;
      const rect = element.parentElement.getBoundingClientRect();
      const distance = element.matches('.t2-helix') ? innerHeight + rect.height : innerHeight * .8;
      const progress = Math.max(0, Math.min(1, (innerHeight - rect.top) / distance));
      animation.currentTime = progress * 1000;
    });
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(update); }
  function configure() {
    layers.forEach((layer) => {
      layer.animation?.cancel();
      layer.animation = null;
      if (reduced.matches || !desktop.matches) return;
      layer.animation = layer.element.animate([{ transform: layer.from }, { transform: layer.to }], { duration: 1000, fill: 'both' });
      layer.animation.pause();
    });
    schedule();
  }
  configure();
  reduced.addEventListener('change', configure);
  desktop.addEventListener('change', configure);
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
}

function initSketches(reduced) {
  const sketches = [];
  const sync = () => sketches.forEach(({ animation, container, visible }) => {
    container.dataset.static = String(reduced.matches);
    if (visible && !document.hidden && !reduced.matches) animation.play();
    else animation.pause();
  });
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      const sketch = sketches.find(({ container }) => container === target);
      if (sketch) sketch.visible = isIntersecting;
    });
    sync();
  });
  document.querySelectorAll('svg.t2-scribble').forEach((fallback, index) => {
    const container = document.createElement('div');
    container.className = 't2-scribble';
    container.setAttribute('aria-hidden', 'true');
    const drawing = document.createElement('div');
    drawing.className = 't2-scribble-animation';
    fallback.replaceWith(container);
    fallback.classList.replace('t2-scribble', 't2-scribble-fallback');
    container.append(fallback, drawing);
    const animation = lottie.loadAnimation({
      container: drawing,
      renderer: 'svg',
      loop: true,
      autoplay: false,
      path: `/assets/animations/test-2/scribble-${[11, 3, 8][index]}.json`,
    });
    animation.setSpeed(.6);
    animation.addEventListener('DOMLoaded', () => {
      container.dataset.ready = 'true';
      sync();
    });
    sketches.push({ animation, container, visible: false });
    observer.observe(container);
  });
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', sync);
  sync();
}

function initHelix(reduced) {
  const canvas = document.querySelector('.t2-helix');
  const context = canvas?.getContext('2d');
  if (!context) return;
  let visible = false;
  let frame = 0;
  let lastDraw = 0;
  let elapsed = 0;
  let pointer = 0;
  let easedPointer = 0;
  function draw(time = 0) {
    frame = 0;
    const active = visible && !document.hidden && !reduced.matches;
    if (active) frame = requestAnimationFrame(draw);
    if (active && time - lastDraw < 32) return;
    if (active) elapsed += Math.min(64, time - lastDraw);
    lastDraw = time;
    easedPointer += (pointer - easedPointer) * .06;
    const width = 900, height = 1100;
    const ratio = Math.min(devicePixelRatio, 2);
    if (canvas.width !== width * ratio) {
      canvas.width = width * ratio;
      canvas.height = height * ratio;
    }
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);
    const phase = reduced.matches ? 0 : elapsed * .00012 + scrollY * .00025 + easedPointer * .12;
    for (let row = -10; row < 115; row++) {
      const turn = row * .035 + phase;
      for (let col = 0; col < 50; col++) {
        const angle = col / 50 * Math.PI * 2;
        const radius = 210 + 42 * Math.cos(turn * 2);
        const x = 430 + Math.sin(turn) * 190 + Math.cos(angle) * radius;
        const y = 80 + row * 10 + Math.sin(angle) * 45;
        const depth = (Math.sin(angle) + 1) / 2;
        const size = 1 + depth * 2.2;
        context.fillStyle = `rgba(120,120,120,${.15 + depth * .45})`;
        context.beginPath();
        context.moveTo(x, y - size);
        context.lineTo(x + size, y);
        context.lineTo(x, y + size);
        context.lineTo(x - size, y);
        context.closePath();
        context.fill();
      }
    }
  }
  function sync() {
    cancelAnimationFrame(frame);
    frame = 0;
    if (reduced.matches) draw();
    else if (visible && !document.hidden) frame = requestAnimationFrame(draw);
  }
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }).observe(canvas);
  document.querySelector('.t2-intro').addEventListener('pointermove', (event) => {
    pointer = (event.clientX / innerWidth - .5) * 2;
  }, { passive: true });
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', sync);
  window.addEventListener('resize', sync, { passive: true });
  draw();
}

function initMobileCards(reduced) {
  const rail = document.querySelector('.t2-foundation-cards');
  const mobile = matchMedia('(max-width: 767px)');
  let visible = false;
  let resumeAt = 0;
  let timer;
  const hold = () => { resumeAt = performance.now() + 7000; };
  function sync() {
    clearInterval(timer);
    if (!mobile.matches || reduced.matches || document.hidden || !visible) return;
    timer = setInterval(() => {
      if (performance.now() < resumeAt || rail.contains(document.activeElement)) return;
      const cards = [...rail.children];
      const center = rail.getBoundingClientRect().left + rail.clientWidth / 2;
      const distances = cards.map((card) => Math.abs(card.getBoundingClientRect().left + card.clientWidth / 2 - center));
      const current = distances.indexOf(Math.min(...distances));
      const next = cards[(current + 1) % cards.length];
      rail.scrollTo({ left: rail.scrollLeft + next.getBoundingClientRect().left + next.clientWidth / 2 - center, behavior: 'smooth' });
    }, 3500);
  }
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: .5 }).observe(rail);
  ['pointerdown', 'touchstart', 'wheel', 'keydown'].forEach((event) => rail.addEventListener(event, hold, { passive: true }));
  reduced.addEventListener('change', sync);
  mobile.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
}

function initCardArtwork(reduced) {
  const artwork = [...document.querySelectorAll('.t2-foundation-art')];
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => { target.dataset.visible = String(isIntersecting); });
  });
  artwork.forEach((element) => observer.observe(element));
  const sync = () => artwork.forEach((element) => {
    element.dataset.paused = String(document.hidden || reduced.matches);
  });
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', sync);
  sync();
}
