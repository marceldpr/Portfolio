import lottie from 'lottie-web';
import Lenis from 'lenis';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const header = document.querySelector('.hero-header');
const glow = document.querySelector('.sticky-glow');
const notification = document.querySelector('.hero-header__notification');
const intro = document.querySelector('.home-intro');
const copy = {
  pt: {
    lines: ['Liderança técnica de design focado em craft', 'com fluência em Inteligência Artificial.'],
    mobile: 'Liderança técnica de design focando em eficiência com impacto, utilizando Inteligência Artificial.',
    labels: ['Certificação:', 'Cursando:'],
    anthropicMobile: 'Fluência completa em IA com Claude Code e fundamentos',
    mit: 'Inteligência Artificial Agêntica Aplicada à Transformação Empresarial.',
    mitMobile: 'Inteligência Artificial Agêntica Aplicada à Empresa.',
    notification: 'Bruno ativou as notificações', linkedin: 'abrir linkedin',
    linkedinLabel: 'Abrir o LinkedIn de Bruno em uma nova aba', top: 'Voltar ao início', brands: 'Empresas e marcas',
  },
  en: {
    lines: ['Design technical leadership focused on craft', 'with fluency in Artificial Intelligence.'],
    mobile: 'Design technical leadership focused on efficiency with impact, powered by Artificial Intelligence.',
    labels: ['Certification:', 'Currently studying:'],
    anthropicMobile: 'Complete AI fluency with Claude Code and foundations',
    mit: 'Agentic AI Applied to Business Transformation.',
    mitMobile: 'Agentic AI Applied to Business.',
    notification: 'Bruno turned on notifications', linkedin: 'open linkedin',
    linkedinLabel: "Open Bruno's LinkedIn in a new tab", top: 'Back to top', brands: 'Companies and brands',
  },
};

function setLanguage(language) {
  const text = copy[language];
  document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en';
  document.querySelectorAll('[data-language]').forEach(button => {
    const active = button.dataset.language === language;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  document.querySelectorAll('.hero-description__line').forEach((line, lineIndex) => {
    line.replaceChildren();
    text.lines[lineIndex].split(' ').forEach((word, index) => {
      if (index) line.append('\u00a0');
      const mask = document.createElement('span');
      mask.className = 'hero-description__word';
      const inner = document.createElement('span');
      inner.className = 'hero-description__word-inner';
      inner.dataset.wordInner = 'true';
      inner.dataset.wordLinePos = String(index);
      inner.textContent = word;
      mask.append(inner);
      line.append(mask);
    });
  });
  document.querySelector('.hero-description--xs').textContent = text.mobile;
  document.querySelectorAll('.credential-label').forEach((label, index) => { label.textContent = text.labels[index]; });
  document.querySelector('.credential-block--anthropic .credential-desc--mobile').textContent = text.anthropicMobile;
  document.querySelector('.credential-block--mit .credential-desc--desktop').textContent = text.mit;
  document.querySelector('.credential-block--mit .credential-desc--mobile').textContent = text.mitMobile;
  document.querySelector('.hero-header__notification-text').textContent = text.notification;
  document.querySelector('.hero-cta-pill__text').textContent = text.linkedin;
  document.querySelector('.hero-cta-pill').setAttribute('aria-label', text.linkedinLabel);
  document.querySelector('.hero-header__avatar').setAttribute('aria-label', text.top);
  document.querySelector('.hero-header__avatar').title = text.top;
  document.querySelector('.hero-logos-row').setAttribute('aria-label', text.brands);
  try { localStorage.setItem('test-home-language', language); } catch { /* Storage is optional. */ }
}
let language = 'pt';
try { if (localStorage.getItem('test-home-language') === 'en') language = 'en'; } catch { /* Use reference default. */ }
if (language === 'en') setLanguage(language);
document.querySelectorAll('[data-language]').forEach(button => {
  button.addEventListener('click', () => setLanguage(button.dataset.language));
});

let lenis;
if (!reducedMotion.matches) lenis = new Lenis({ autoRaf: true });
const returnToTop = () => {
  if (lenis) lenis.scrollTo(0);
  else window.scrollTo({ top: 0, behavior: 'instant' });
};
document.querySelector('.hero-header__avatar').addEventListener('click', returnToTop);
document.querySelector('.header-stepper__dot.is-active').addEventListener('click', returnToTop);
function updateHeader() {
  const scrolled = window.scrollY > 24;
  header.classList.toggle('is-condensed', scrolled);
  glow.classList.toggle('is-visible', scrolled);
  const progress = Math.min(1, window.scrollY / document.querySelector('.hero-section').offsetHeight);
  document.querySelector('.header-stepper__line-fill').style.transform = `scaleX(${progress})`;
}
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();
notification.addEventListener('pointerenter', event => {
  if (event.pointerType !== 'touch') notification.classList.add('is-cta');
});
notification.addEventListener('pointerleave', () => notification.classList.remove('is-cta'));

const bell = lottie.loadAnimation({
  container: document.querySelector('.hero-header__bell-lottie'),
  renderer: 'svg', loop: true, autoplay: false,
  path: '/assets/img/test-home/bell-v2.json',
});
let revealed = false;
function reveal() {
  revealed = true;
  document.documentElement.classList.add('willem-revealed');
  document.querySelector('.hero-header__notification-text').classList.add('is-shimmering');
  if (!reducedMotion.matches) bell.play();
}
bell.addEventListener('DOMLoaded', () => {
  if (revealed && !reducedMotion.matches) bell.play();
});
function finishIntro() {
  document.body.classList.remove('intro-loading', 'intro-playing');
  intro.remove();
  lenis?.start();
  if (!revealed) reveal();
}

async function startIntro() {
  if (reducedMotion.matches || new URLSearchParams(location.search).has('nointro')) {
    finishIntro();
    return;
  }
  history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
  lenis?.stop();
  // Start together once portraits and typography are ready; never leave the page locked.
  await Promise.race([
    Promise.all([document.fonts.ready, ...[...intro.querySelectorAll('img')].map(img => img.decode().catch(() => {}))]),
    new Promise(resolve => setTimeout(resolve, 1200)),
  ]);
  document.body.classList.replace('intro-loading', 'intro-playing');
  setTimeout(reveal, 2200);
  setTimeout(finishIntro, 2850);
}
startIntro();
reducedMotion.addEventListener('change', event => {
  if (event.matches) {
    finishIntro();
    bell.pause();
    lenis?.destroy();
    lenis = undefined;
  }
});
