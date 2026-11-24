export function initSheetStack() {
  document.querySelectorAll('.t2-sheet-stack').forEach(initStack);
}

function initStack(stack) {

  const sheets = [...stack.querySelectorAll('img')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let animations = [];
  let revealed = false;

  function configure() {
    animations.forEach((animation) => animation.cancel());
    animations = [];
    if (reduced.matches || revealed) return;

    animations = sheets.map((sheet, index) => {
      const animation = sheet.animate([
        { opacity: 0, transform: 'translate(28%, 22%) rotate(6deg)' },
        { opacity: 1, offset: .25 },
        { opacity: 1, transform: 'translate(0, 0) rotate(0deg)' },
      ], {
        duration: 850,
        delay: index * 360,
        easing: 'cubic-bezier(.215,.61,.355,1)',
        fill: 'both',
      });
      animation.pause();
      animation.currentTime = 0;
      return animation;
    });
  }

  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    revealed = true;
    if (!reduced.matches) animations.forEach((animation) => animation.play());
    observer.disconnect();
  }, { threshold: .2, rootMargin: '0px 0px -10% 0px' });

  configure();
  observer.observe(stack);
  reduced.addEventListener('change', configure);
}
