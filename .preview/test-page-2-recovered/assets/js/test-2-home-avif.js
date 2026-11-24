// Changing_HQ.avif: 762 frames / 12.7 seconds, matching the original walkthrough.

export async function initHomeAvif() {
  const image = document.querySelector('[data-t2-home-avif]');
  if (!image) return;
  const panel = image.closest('.t2-home-panel');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false;
  let running = false;
  let raf = 0;
  let resume = () => {};
  const syncPlayback = () => {
    const next = visible && !document.hidden && !reduced.matches;
    if (next === running) return;
    running = next;
    if (running) resume();
    else cancelAnimationFrame(raf);
  };

  try {
    const response = await fetch(image.currentSrc || image.src);
    if (!response.ok) throw new Error('Unable to load homepage AVIF');
    const data = await response.arrayBuffer();
    if ('ImageDecoder' in window && await ImageDecoder.isTypeSupported('image/avif')) {
      // Draw the supplied AVIF frames with visibility-aware playback.
      const decoder = new ImageDecoder({ data, type: 'image/avif', preferAnimation: true });
      await decoder.tracks.ready;
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      canvas.setAttribute('role', 'img');
      canvas.setAttribute('aria-label', image.alt);
      const context = canvas.getContext('2d');
      let index = 0;
      let frame = (await decoder.decode({ frameIndex: index })).image;
      canvas.width = frame.displayWidth;
      canvas.height = frame.displayHeight;
      context.drawImage(frame, 0, 0);
      image.hidden = true;
      image.after(canvas);
      let deadline = 0;
      let decoding = false;
      const tick = async (now) => {
        if (!running) return;
        if (now >= deadline) {
          context.drawImage(frame, 0, 0);
          deadline += frame.duration / 1000;
          frame.close();
          index = (index + 1) % decoder.tracks.selectedTrack.frameCount;
          decoding = true;
          try {
            frame = (await decoder.decode({ frameIndex: index })).image;
          } catch {
            running = false;
            resume = () => {};
            canvas.remove();
            image.hidden = false;
            decoder.close();
            return;
          } finally {
            decoding = false;
          }
        }
        if (running) raf = requestAnimationFrame(tick);
      };
      resume = () => {
        deadline = performance.now();
        if (!decoding) raf = requestAnimationFrame(tick);
      };
    } else {
      // Native animated-image fallback: restart playback on re-entry.
      const blob = new Blob([data], { type: 'image/avif' });
      let url;
      resume = () => {
        if (url) URL.revokeObjectURL(url);
        url = URL.createObjectURL(blob);
        image.src = url;
      };
    }
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncPlayback();
    }, { threshold: .15 }).observe(panel);
    document.addEventListener('visibilitychange', syncPlayback);
    reduced.addEventListener('change', syncPlayback);
  } catch {
    // Keep the native AVIF available if enhanced playback cannot initialize.
  }
}
