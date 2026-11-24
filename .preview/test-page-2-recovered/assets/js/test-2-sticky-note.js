import lottie from 'lottie-web/build/player/lottie_light';
import postItPath from '../animations/test-2/post-it-thin.json?url';

export function initStickyNote() {
  const container = document.querySelector('.t2-sticky-note');
  if (!container) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const animation = lottie.loadAnimation({
    container, renderer: 'svg', loop: false, autoplay: false, path: postItPath,
  });
  let ready = false;
  let visible = false;
  let heldThisLoop = false;
  let waiting = false;
  let resumeTimer;
  const holdFrame = 18;

  function sync() {
    if (!ready) return;
    if (reduced.matches) animation.goToAndStop(holdFrame, true);
    else if (visible && !document.hidden && !waiting) animation.play();
    else animation.pause();
  }
  animation.addEventListener('DOMLoaded', () => { ready = true; sync(); });
  animation.addEventListener('enterFrame', () => {
    if (reduced.matches || heldThisLoop || animation.currentFrame < holdFrame) return;
    heldThisLoop = true;
    waiting = true;
    animation.goToAndStop(holdFrame, true);
    resumeTimer = setTimeout(() => {
      waiting = false;
      sync();
    }, 750);
  });
  animation.addEventListener('complete', () => {
    heldThisLoop = false;
    animation.goToAndStop(0, true);
    sync();
  });
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  }, { threshold: .15 }).observe(container);
  reduced.addEventListener('change', () => {
    clearTimeout(resumeTimer);
    waiting = false;
    heldThisLoop = false;
    if (ready && !reduced.matches) animation.goToAndStop(0, true);
    sync();
  });
  document.addEventListener('visibilitychange', sync);
}
