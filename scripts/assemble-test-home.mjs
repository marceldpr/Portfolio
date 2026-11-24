// Assemble the isolated Vite preview from the extracted header styles and hero fragment.
import fs from 'node:fs';
import { createRequire } from 'node:module';
const root = new URL('../', import.meta.url);
const preview = new URL('.preview/test-page-2-recovered/', root);
const require = createRequire(new URL('package.json', preview));
const postcss = require('postcss');
const css = postcss.parse(fs.readFileSync(new URL('docs/research/test-home/reference.css', root), 'utf8'));
const matches = selector => /\.(hero-header(?!-spacer)|lang-switch|header-stepper|sticky-glow|hero-cta-pill)/.test(selector);
function filter(container) {
  for (const node of [...container.nodes]) {
    if (node.type === 'rule') {
      const selectors = node.selectors.filter(matches);
      if (selectors.length) node.selectors = selectors;
      else node.remove();
    } else if (node.type === 'atrule' && node.name === 'keyframes') {
      if (!/^(loading-gradient-loop|hero-cta-)/.test(node.params)) node.remove();
    } else if (node.type === 'atrule' && node.name === 'property') {
      if (node.params !== '--hero-cta-draw') node.remove();
    } else if (node.type === 'atrule' && node.nodes) {
      filter(node);
      if (!node.nodes.length) node.remove();
    } else node.remove();
  }
}
filter(css);
fs.writeFileSync(new URL('assets/css/test-home-header.css', preview), '/* Header cascade extracted from bruno.work, scoped to Test Home. */\n' + css.toString().replaceAll('}', '}\n').trimEnd() + '\n');

const hero = fs.readFileSync(new URL('test-home/hero.html', preview), 'utf8').replaceAll(' loading="lazy"', '');
const header = `<header class="hero-header">
  <div class="hero-header__inner"><div class="hero-header__content"><div class="hero-header__row">
    <div class="hero-header__left">
      <button class="hero-header__avatar" type="button" aria-label="Voltar ao início" title="Voltar ao início"><img src="/assets/img/test-home/hero-avatar.webp" alt="Bruno Gonçalves" class="hero-header__avatar-img"></button>
      <div class="hero-header__notification" tabindex="0">
        <span class="hero-header__notification-text">Bruno ativou as notificações</span>
        <span class="hero-header__bell-icon" aria-hidden="true"><span class="hero-header__bell-lottie"></span></span>
        <a class="hero-cta-pill" href="https://www.linkedin.com/in/brunonerv/" target="_blank" rel="noopener noreferrer" aria-label="Abrir o LinkedIn de Bruno em uma nova aba">
          <span class="hero-cta-pill__ring" aria-hidden="true"><span class="hero-cta-pill__gradient"></span></span><span class="hero-cta-pill__mask" aria-hidden="true"></span>
          <span class="hero-cta-pill__content"><span class="hero-cta-pill__line"><span class="hero-cta-pill__text">abrir linkedin</span><img src="/assets/img/test-home/icon-cta-seta.svg" class="hero-cta-pill__icon" alt="" aria-hidden="true"></span></span>
        </a>
      </div>
    </div>
    <nav class="header-stepper" aria-label="Seleção de projetos e progresso">
      <button type="button" class="header-stepper__dot is-active" aria-label="Início" title="Início"></button>
      ${['Case Agentes', 'Case UX Summit', 'Case Hub Newbies', 'Case Scale Ops'].map(label => `<span class="header-stepper__line" aria-hidden="true"><span class="header-stepper__line-fill"></span></span><button type="button" class="header-stepper__dot" aria-label="${label}" aria-disabled="true" title="${label} — outside this preview"></button>`).join('\n')}
    </nav>
    <div class="hero-header__right"><div class="lang-switch" role="group" aria-label="Idioma / Language">
      <button type="button" class="lang-switch__btn is-active" data-language="pt" aria-pressed="true" aria-label="Português">PT</button><span class="lang-switch__sep" aria-hidden="true"></span><button type="button" class="lang-switch__btn" data-language="en" aria-pressed="false" aria-label="English">EN</button>
    </div></div>
  </div></div></div>
</header>`;
const intro = `<div class="home-intro" aria-hidden="true">
  <div class="home-intro__mask home-intro__mask--top"></div><div class="home-intro__mask home-intro__mask--bottom"></div><div class="home-intro__mask home-intro__mask--left"></div><div class="home-intro__mask home-intro__mask--right"></div><div class="home-intro__center"></div>
  <div class="home-intro__lines"><span class="home-intro__line home-intro__line--top"></span><span class="home-intro__line home-intro__line--bottom"></span><span class="home-intro__line home-intro__line--left"></span><span class="home-intro__line home-intro__line--right"></span></div>
  <div class="home-intro__name"><span>Bruno Gonçalves</span></div>
  <div class="home-intro__photo">${['01','02','03'].map(n => `<img src="/assets/img/test-home/open_img_${n}.webp" alt="" class="home-intro__image home-intro__image--${n}">`).join('')}</div>
</div>`;
const html = `<!doctype html>
<html lang="pt-BR"><head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow"><title>Test Home — Bruno reference</title>
  <link rel="icon" href="data:,">
  <link rel="preload" href="/assets/fonts/test-2/PPEditorialNew-Ultralight.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/assets/css/test-home.css">
  <link rel="stylesheet" href="/assets/css/test-home-header.css">
  <link rel="stylesheet" href="/assets/css/test-home-hero.css">
  <noscript><style>.home-intro { display: none !important; } body.intro-loading { position: static; overflow: auto; } .hero-description__word-inner, .credential-logo { animation: none; opacity: 1; transform: none; }</style></noscript>
</head><body class="test-home intro-loading">
${intro}
<div class="sticky-glow" aria-hidden="true">${[1,2,3,4,5].map(n=>`<div class="sticky-glow__layer is--${n}"></div>`).join('')}</div>
${header}
<main id="top">${hero}</main>
<script type="module" src="/assets/js/test-home.js"></script>
</body></html>\n`;
fs.writeFileSync(new URL('test-home/index.html', preview), html);
