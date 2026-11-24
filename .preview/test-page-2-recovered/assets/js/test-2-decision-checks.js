import lottie from 'lottie-web/build/player/lottie_light';
import checkmarkPath from '../animations/test-2/checkmark.json?url';

export function initDecisionChecks() {
  const decisions = [...document.querySelectorAll('.t2-sheet-decision')];
  if (!decisions.length) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 768px)');
  const records = decisions.map((decision) => {
    const animation = lottie.loadAnimation({
      container: decision.querySelector('.t2-decision-check'),
      renderer: 'svg', loop: false, autoplay: false, path: checkmarkPath,
      rendererSettings: { viewBoxSize: '250 200 500 500' },
    });
    return { decision, animation, ready: false, checked: false };
  });
  let frame = 0;

  function update() {
    frame = 0;
    records.forEach((record, index) => {
      const { decision, animation, ready } = record;
      if (!ready) return;
      const threshold = desktop.matches ? .72 - index * .12 : .72;
      const top = decision.querySelector('h3').getBoundingClientRect().top;
      const checked = reduced.matches || top < innerHeight * threshold;
      decision.classList.toggle('is-checked', checked);
      if (reduced.matches) animation.goToAndStop(animation.totalFrames - 1, true);
      else if (checked !== record.checked) {
        if (checked) animation.goToAndPlay(0, true);
        else animation.goToAndStop(0, true);
      }
      record.checked = checked;
    });
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(update);
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  reduced.addEventListener('change', schedule);
  records.forEach((record) => record.animation.addEventListener('DOMLoaded', () => {
    record.ready = true;
    schedule();
  }));
  update();
}
