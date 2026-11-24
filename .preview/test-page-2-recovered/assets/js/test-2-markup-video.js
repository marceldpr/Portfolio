export function initMarkupScrollVideo() {
  const panels = [...document.querySelectorAll('.t2-markup-devices')];
  if (!panels.length) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const visible = new Set();
  const videos = panels.map(panel => panel.querySelector('video'));

  function sync() {
    videos.forEach((video, index) => {
      const panel = panels[index];
      if (visible.has(panel) && !document.hidden && !reduced.matches && !video.ended) {
        video.play().catch(() => { video.controls = true; });
      } else {
        video.pause();
      }
      panel.toggleAttribute('data-info-visible', reduced.matches || video.currentTime >= Number(panel.dataset.revealAt));
    });
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) visible.add(entry.target);
      else visible.delete(entry.target);
    });
    sync();
  }, { threshold: 0, rootMargin: '-25% 0px -25% 0px' });

  panels.forEach((panel, index) => {
    const video = videos[index];
    video.addEventListener('timeupdate', () => {
      panel.toggleAttribute('data-info-visible', reduced.matches || video.currentTime >= Number(panel.dataset.revealAt));
    });
    video.addEventListener('error', () => { video.controls = true; });
    observer.observe(panel);
  });
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', sync);
}
