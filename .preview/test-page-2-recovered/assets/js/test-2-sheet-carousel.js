export function initSheetCarousel() {
  document.querySelectorAll('.t2-sheet-carousel').forEach(initCarousel);
}

function initCarousel(section) {
  const stage = section.querySelector('.t2-sheet-carousel-stage');
  const track = section.querySelector('.t2-sheet-carousel-track');
  const panels = [...track.children];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const enoughHeight = matchMedia('(min-height: 650px)');
  let motion;
  let stepDistance = 0;
  let top = 0;
  let frame = 0;
  let index = -1;
  let transitionStart = 0;
  let transitionFrom = 0;
  let transitioning = false;
  const hold = 60;

  function update(now) {
    frame = 0;
    if (!motion) return;
    const rect = section.getBoundingClientRect();
    const progress = Math.max(0, Math.min(panels.length - 1, (top - rect.top - hold) / stepDistance));
    const next = Math.round(progress);
    if (next !== index) {
      index = next;
      transitionFrom = Number(motion.currentTime) || 0;
      transitionStart = now;
      transitioning = true;
      section.dataset.carouselPanel = String(index + 1);
    }
    if (transitioning) {
      const amount = Math.min(1, (now - transitionStart) / 320);
      const target = index / (panels.length - 1) * 1000;
      motion.currentTime = transitionFrom + (target - transitionFrom) * (1 - (1 - amount) ** 3);
      transitioning = amount < 1;
      if (transitioning) schedule();
    }
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(update);
  }

  function configure() {
    motion?.cancel();
    motion = null;
    index = -1;
    transitioning = false;
    const enabled = !reduced.matches && enoughHeight.matches;
    section.toggleAttribute('data-scroll-carousel', enabled);
    if (!enabled) {
      section.style.removeProperty('--carousel-height');
      return;
    }
    const distance = panels.at(-1).offsetLeft - panels[0].offsetLeft;
    stepDistance = Math.min(600, innerHeight * .65);
    top = parseFloat(getComputedStyle(stage).top);
    section.style.setProperty('--carousel-height', `${stage.offsetHeight + stepDistance * (panels.length - 1) + hold * 2}px`);
    motion = track.animate([
      { transform: 'translateX(0)' },
      { transform: `translateX(${-distance}px)` },
    ], { duration: 1000, fill: 'both', easing: 'linear' });
    motion.pause();
    schedule();
  }

  // Native vertical scrolling selects the snapped panel. Never capture wheel,
  // touch, or keyboard input: continuous trackpad momentum must always exit.
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', configure, { passive: true });
  reduced.addEventListener('change', configure);
  enoughHeight.addEventListener('change', configure);
  configure();
}
