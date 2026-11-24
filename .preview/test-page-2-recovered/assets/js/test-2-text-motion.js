const clamp = (value) => Math.min(1, Math.max(0, value));
const rollEasing = 'cubic-bezier(.215,.61,.355,1)';
const barrierRevealDelay = (element) => {
  const barrier = element.closest('.t2-ai-barrier');
  return barrier ? 650 + (barrier.matches('.t2-ai-barrier + .t2-ai-barrier') ? 180 : 0) : 0;
};

function wrapWords(element, className) {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((node) => {
    const fragment = document.createDocumentFragment();
    node.textContent.split(/(\s+)/).forEach((part) => {
      if (/^\s*$/.test(part)) fragment.append(document.createTextNode(part));
      else {
        const word = document.createElement('span');
        word.className = className;
        word.textContent = part;
        fragment.append(word);
      }
    });
    node.replaceWith(fragment);
  });
  return [...element.querySelectorAll(`.${className}`)];
}

function labelHeading(heading) {
  heading.setAttribute('aria-label', heading.innerText.replace(/\s+/g, ' ').trim());
  heading.classList.remove('t2-reveal');
}

function prepareRollingHeading(heading) {
  labelHeading(heading);
  heading.classList.add('t2-text-heading');
  return wrapWords(heading, 't2-roll-word').map((word) => {
    word.setAttribute('aria-hidden', 'true');
    const inner = document.createElement('span');
    inner.textContent = word.textContent;
    word.replaceChildren(inner);
    return { word, inner };
  });
}

function prepareShiftHeading(heading) {
  if (!heading) return [];
  labelHeading(heading);
  heading.classList.add('t2-shift-heading');
  return wrapWords(heading, 't2-shift-word').flatMap((word) => {
    word.setAttribute('aria-hidden', 'true');
    const parts = word.textContent.match(/.{1,4}/gu) || [];
    const chunks = parts.map((part) => {
      const chunk = document.createElement('span');
      chunk.className = 't2-shift-chunk';
      chunk.textContent = part;
      return chunk;
    });
    word.replaceChildren(...chunks);
    return chunks;
  });
}

function prepareLetterHeading(heading) {
  if (!heading) return [];
  labelHeading(heading);
  heading.classList.add('t2-letter-heading');
  return wrapWords(heading, 't2-letter-word').flatMap((word) => {
    word.setAttribute('aria-hidden', 'true');
    const slots = [...word.textContent].map((character) => {
      const slot = document.createElement('span');
      slot.className = 't2-letter-slot';
      const glyph = document.createElement('span');
      glyph.className = 't2-letter-glyph';
      const original = document.createElement('span');
      original.className = 't2-letter-original';
      original.textContent = character;
      const copy = document.createElement('span');
      copy.className = 't2-letter-copy';
      copy.textContent = character;
      glyph.append(original, copy);
      slot.append(glyph);
      return slot;
    });
    word.replaceChildren(...slots);
    return slots.map((slot) => slot.firstElementChild);
  });
}

function paperBehind(element) {
  for (let node = element; node; node = node.parentElement) {
    const color = getComputedStyle(node).backgroundColor;
    if (color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent') return color;
  }
  return '#f2f2f2';
}

export function initTextMotion() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 768px)');
  const headingRecords = [...document.querySelectorAll('main h1, main h2, main h3')]
    .filter((heading) => !heading.closest('.t2-foundation-card')
      && !heading.classList.contains('t2-sr-only')
      && !['t2-foundations-title', 't2-impact-title', 't2-ai-execution-title'].includes(heading.id))
    .map((heading) => ({ element: heading, words: prepareRollingHeading(heading), animations: [], revealed: false }));
  const paragraphSelector = [
    '.t2-intro-copy p', '.t2-context p', '.t2-before-copy p',
    '.t2-card-types-intro',
    '.t2-foundations-intro', '.t2-experience-intro p', '.t2-markups-copy > p',
    '.t2-ai-execution-copy p', '.t2-ai-barrier p', '.t2-sheet-story-copy p', '.t2-sheet-decision p', '.t2-impact-summary p', '.t2-prototypes-copy > p',
  ].join(',');
  const paragraphs = [...document.querySelectorAll(paragraphSelector)].map((element) => ({
    element, animation: null, revealed: false,
  }));
  const foundation = document.getElementById('foundations');
  const shiftChunks = prepareShiftHeading(document.getElementById('t2-foundations-title'));
  const impact = document.getElementById('impact');
  const letters = prepareLetterHeading(document.getElementById('t2-impact-title'));
  let shiftAnimations = [];
  let letterAnimations = [];
  let frame = 0;
  let lastTime = 0;
  let currentResult = null;

  function setHeadingAnimations(record) {
    if (record.revealed && !reduced.matches) return;
    record.animations.forEach((animation) => animation.cancel());
    record.animations = [];
    if (reduced.matches || record.revealed) return;
    let lineTop = null;
    let lineIndex = 0;
    const ink = getComputedStyle(record.element).color;
    record.words.forEach(({ word, inner }) => {
      const top = word.getBoundingClientRect().top;
      if (lineTop === null || Math.abs(top - lineTop) > 2) { lineTop = top; lineIndex = 0; }
      const animation = inner.animate([
        { transform: 'translateY(110%)', color: '#6e15b7', offset: 0 },
        { color: '#6e15b7', offset: .35 },
        { transform: 'translateY(0)', color: ink, offset: 1 },
      ], { duration: 800, delay: barrierRevealDelay(record.element) + lineIndex++ * 70, easing: rollEasing, fill: 'both' });
      animation.pause();
      animation.currentTime = 0;
      record.animations.push(animation);
    });
  }

  function revealHeading(record) {
    if (record.revealed) return;
    record.revealed = true;
    if (!reduced.matches) record.animations.forEach((animation) => animation.play());
  }

  function setParagraphAnimation(record) {
    if (record.revealed && !reduced.matches) return;
    record.animation?.cancel();
    record.animation = null;
    record.element.classList.remove('t2-shimmer-copy');
    if (reduced.matches || record.revealed) return;
    const ink = getComputedStyle(record.element).color;
    const paper = paperBehind(record.element);
    const fontSize = parseFloat(getComputedStyle(record.element).fontSize);
    const estimatedLineCharacters = Math.min(record.element.textContent.length,
      record.element.clientWidth / (fontSize * .48));
    const duration = Math.max(700, estimatedLineCharacters / 23 * 1000);
    const gradient = `linear-gradient(90deg, ${ink} 0% 33%, #6e15b7 42%, #a1a1a1 49%, #fff 55%, ${paper} 66% 100%)`;
    record.element.classList.add('t2-shimmer-copy');
    record.animation = record.element.animate([
      { backgroundImage: gradient, backgroundPosition: '100% 0' },
      { backgroundImage: gradient, backgroundPosition: '0% 0' },
    ], {
      duration,
      delay: record.element.closest('.t2-ai-execution-copy') ? 0 : 450 + barrierRevealDelay(record.element),
      easing: 'cubic-bezier(.4,0,.2,1)',
      fill: 'both',
    });
    record.animation.pause();
    record.animation.currentTime = 0;
    record.animation.onfinish = () => {
      record.element.classList.remove('t2-shimmer-copy');
      record.animation?.cancel();
      record.animation = null;
    };
  }

  function revealParagraph(record) {
    if (record.revealed) return;
    record.revealed = true;
    if (!reduced.matches) record.animation?.play();
  }

  const headingsByElement = new Map(headingRecords.map((record) => [record.element, record]));
  const paragraphsByElement = new Map(paragraphs.map((record) => [record.element, record]));
  const headingObserver = new IntersectionObserver((entries) => entries.forEach(({ target, isIntersecting }) => {
    if (!isIntersecting) return;
    revealHeading(headingsByElement.get(target));
    headingObserver.unobserve(target);
  }), { threshold: .01, rootMargin: '0px 0px -10% 0px' });
  const paragraphObserver = new IntersectionObserver((entries) => entries.forEach(({ target, isIntersecting }) => {
    if (!isIntersecting) return;
    revealParagraph(paragraphsByElement.get(target));
    paragraphObserver.unobserve(target);
  }), { threshold: .1, rootMargin: '0px 0px -10% 0px' });

  function configureScrub() {
    [...shiftAnimations, ...letterAnimations].forEach((animation) => animation.cancel());
    shiftAnimations = [];
    letterAnimations = [];
    currentResult = null;
    if (reduced.matches || !desktop.matches) return;
    let top = null;
    let index = 0;
    shiftAnimations = shiftChunks.map((chunk) => {
      const wordTop = chunk.getBoundingClientRect().top;
      if (top === null || Math.abs(wordTop - top) > 2) { top = wordTop; index = 0; }
      const distance = Math.min(index++ * .28, 1.5);
      const animation = chunk.animate([
        { transform: `translateX(${distance}em)` }, { transform: 'translateX(0)' },
      ], { duration: 1000, fill: 'both' });
      animation.pause();
      return animation;
    });
    const order = letters.map((_, index) => index).sort((a, b) =>
      Math.sin((a + 1) * 127.1) - Math.sin((b + 1) * 127.1));
    const ranks = new Map(order.map((value, index) => [value, index]));
    letterAnimations = letters.map((glyph, index) => {
      const delay = ranks.get(index) * 50;
      const animation = glyph.animate([
        { opacity: 0, transform: 'translateY(0)' },
        { opacity: 1, transform: 'translateY(100%)' },
      ], { duration: 700, delay, fill: 'both', easing: 'cubic-bezier(.45,0,.55,1)' });
      animation.pause();
      return animation;
    });
  }

  function updateScroll(now) {
    frame = 0;
    if (document.hidden || reduced.matches || !desktop.matches) return;
    if (foundation) {
      const progress = clamp((innerHeight - foundation.getBoundingClientRect().top) / innerHeight);
      shiftAnimations.forEach((animation) => { animation.currentTime = progress * 1000; });
    }
    if (!impact || !letterAnimations.length) return;
    const target = clamp((innerHeight - impact.getBoundingClientRect().top) / innerHeight);
    const elapsed = lastTime ? Math.min(64, now - lastTime) : 16;
    lastTime = now;
    if (currentResult === null) currentResult = target;
    currentResult += (target - currentResult) * (1 - Math.exp(-elapsed / 160));
    if (Math.abs(target - currentResult) < .0005) currentResult = target;
    const totalDuration = 700 + Math.max(0, letters.length - 1) * 50;
    letterAnimations.forEach((animation) => { animation.currentTime = currentResult * totalDuration; });
    if (currentResult !== target) frame = requestAnimationFrame(updateScroll);
  }

  function scheduleScroll() {
    if (!frame) frame = requestAnimationFrame(updateScroll);
  }

  function configure() {
    headingRecords.forEach(setHeadingAnimations);
    paragraphs.forEach(setParagraphAnimation);
    configureScrub();
    scheduleScroll();
  }

  headingRecords.forEach(setHeadingAnimations);
  paragraphs.forEach(setParagraphAnimation);
  configureScrub();
  headingRecords.forEach((record) => headingObserver.observe(record.element));
  paragraphs.forEach((record) => paragraphObserver.observe(record.element));
  reduced.addEventListener('change', configure);
  desktop.addEventListener('change', () => { configureScrub(); scheduleScroll(); });
  window.addEventListener('scroll', scheduleScroll, { passive: true });
  window.addEventListener('resize', configure, { passive: true });
  document.addEventListener('visibilitychange', scheduleScroll);
  document.fonts.ready.then(configure);
  scheduleScroll();
}
