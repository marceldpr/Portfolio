export function initAiHeadlineReveal() {
  const section = document.querySelector('.t2-ai-execution');
  const title = document.getElementById('t2-ai-execution-title');
  if (!section || !title) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let animation;
  let scheduled = false;
  function update() {
    scheduled = false;
    if (!animation) return;
    const progress = Math.max(0, Math.min(1, (innerHeight * .9 - section.getBoundingClientRect().top) / (innerHeight * .7)));
    animation.currentTime = progress * 1000;
  }
  function schedule() {
    if (!scheduled) { scheduled = true; requestAnimationFrame(update); }
  }
  function configure() {
    animation?.cancel();
    animation = null;
    if (reduced.matches) return;
    const overlap = title.offsetHeight * .85 + parseFloat(getComputedStyle(section).paddingTop);
    animation = title.animate([
      { transform: `translateY(${-overlap}px)` },
      { transform: 'translateY(0)' },
    ], { duration: 1000, fill: 'both' });
    animation.pause();
    update();
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', configure);
  reduced.addEventListener('change', configure);
  new ResizeObserver(configure).observe(title);
  configure();
}
