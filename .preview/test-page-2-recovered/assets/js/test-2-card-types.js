export function initCardTypes() {
  const section = document.getElementById('card-types');
  if (!section) return;
  const stage = section.querySelector('.t2-card-types-stage');
  const media = matchMedia('(min-width: 1024px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)');
  let records = [];
  let scheduled = false;

  function update() {
    scheduled = false;
    const rawProgress = -section.getBoundingClientRect().top / (section.offsetHeight - stage.offsetHeight);
    const progress = Math.max(0, Math.min(1, rawProgress));
    records.forEach(({ element, animation, settled, annotated }) => {
      animation.currentTime = progress * 1000;
      if (annotated) element.toggleAttribute('data-callouts-visible', rawProgress >= settled && rawProgress <= 1);
    });
  }

  function schedule() {
    if (scheduled || !records.length) return;
    scheduled = true;
    requestAnimationFrame(update);
  }

  function configure() {
    records.forEach(({ animation }) => animation.cancel());
    records = [];
    section.querySelectorAll('[data-callouts-visible]').forEach((element) => element.removeAttribute('data-callouts-visible'));
    section.toggleAttribute('data-scroll-cards', media.matches);
    if (!media.matches) return;
    const elements = [...section.querySelectorAll('.t2-card-diagram, .t2-card-gallery-item')];
    records = elements.map((element, index) => {
      const start = [ .04, .30, .47, .64 ][index];
      const settled = start + .16;
      const waiting = `translateY(${stage.offsetHeight}px)`;
      const animation = element.animate([
        { transform: waiting, offset: 0 },
        { transform: waiting, offset: start },
        { transform: 'translateY(0)', offset: settled },
        { transform: 'translateY(0)', offset: 1 },
      ], { duration: 1000, fill: 'both' });
      animation.pause();
      return { element, animation, settled, annotated: index === 0 };
    });
    update();
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', configure, { passive: true });
  media.addEventListener('change', configure);
  document.fonts.ready.then(configure);
  configure();
}
