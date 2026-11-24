# Test Home hero and logo strip

Scope: Reproduce https://bruno.work/ from hero through logos only. User explicitly wants original Bruno copy temporarily. Existing standalone Vite site, NOT Next. Parent handles page assembly, assets, header, opening transition and JS. Builder owns only `test-home/hero.html` and `assets/css/test-home-hero.css` under `.preview/test-page-2-recovered/`.

## Reference evidence
Full CSS extracted into `/Users/marcelrosa/Portfolio/docs/research/test-home/reference.css` (readable variant reference-readable.css); exact live DOM `hero.html`, `logos.html`; computed values `desktop.json`, `mobile.json`; screenshots `/Users/marcelrosa/Portfolio/docs/design-references/test-home/{desktop-hero,mobile-hero,tablet-hero}.png`. These absolute paths are accessible outside worktree. These are primary extracted data, not design guesses.

## Structure and desktop styles (1440)
Section hero-section > hero-content-wrapper > hero-header-spacer + hero-body > hero-body__inner > intro + divider + credentials-col. Two credentials, then separate logo row. Keep all same class names to use extracted CSS.
Hero813px high, header spacer160, body653, body width1405 centered with .5px black side lines. Inner height588, column center gap29. Intro padding41.5px 0. Heading width762, Editorial Ultralight200, 48px/1.36, center, two nowrap lines. Divider599px .5px black. Credentials-col padding-top28. Credentials flex row gap85. Anthropic width auto with44px right padding; MIT229px. Blocks gap12,padding-bottom38. Label12px/1.56 #5a5a5a. Logo box58px high; inner27px tall bottom align. Anthropic100x11, MIT114x23. Description12px/1.56 #5a5a5a, widths229 and213. Use actual Portuguese texts from DOM; mobile has separate paragraph copy.
Hero logo row268px high,border-top.5pxblack, width100vw, centered items20vw, two identical groups. Logo widths/heights Mercado119x30,PicPay74x23.718,Creditas84x16,Meiuca65x18.31,Globo39x39.

## Motion
Logo strip is TIME-driven 45s linear translateX(0) -> translateX(-50%) infinite, second group aria-hidden. Reduced motion stops. No click-driven changes.
Desktop heading words masked per line, .8s cubic-bezier(.215,.61,.355,1) translateY(110%) purple#6e15b7 -> translateY(0) black.70ms stagger per word RESET each line. Trigger html.willem-revealed set by parent after intro. Credential logos .7s ease-out opacity0->1, second .18delay. Reduced-motion immediately visible. Native logo img assets, no canvas/mockups.

## Responsive exact values
At390 hero height656.656 with38px side padding; header-spacer102; body display:contents. Inner padding61px0 60px, gap29; heading mobile font30.6px/41.616 centered314px wide, mobile text: Liderança técnica de design focando em eficiência com impacto, utilizando Inteligência Artificial. Intro top163 and height166.469. Desktop rolled copy hidden. Divider/side lines hidden. Credentials-col padding-top58, credential layout row; Anthropic52.6%, MIT47.4%; rightpadding44 persists Anthropic; bottompadding38 each. Labels12px, desc11px/1.56 #4d4d4d. Logo inner36high, Anthropic106px wide, MIT138x27. Desc frames max150px paddingtop12. Logos row autoheight119.5 padding40px0 and item50vw. At768: hero836px,spacer160,body padding40px32px48px,inner588 high,width704; heading26px; credentials gap20, wrapped row. CSS has other breakpoints1000-1100; preserve relevant extracted rules rather than approximate.

## Assets and global contract
Parent downloads all original logos to `/assets/img/test-home/` basename retained (credential-logo-anthropic.svg,credential-logo-mit-v3.svg,mercado-pago.svg,picpay.svg,creditas.svg,meiuca.svg,globo.svg). Font parent provides @font-face PP Editorial New200, body stack Geist,system-ui,-apple-system,BlinkMacSystemFont,sans-serif (original no loaded Geist font). Parent global vars --s:1px, --color-hero-bg:#f2f2f2,--color-line:#000,--color-text-primary:#000,--font-geist above; reset box-sizing/border-box margin/padding0, body16px line1.5. Extract relevant --s responsive rules if needed.
No inline styles in final markup; word stagger via nth-child CSS or JS parent. Do not add other page sections. Use clean HTML fragment (not full document). No links in hero/carousel per original. Create maintainable CSS solely scoped to hero and credential classes, preserving exact extracted cascade/media queries; don't paste unrelated whole reference sheet.

## Validation
This is HTML/CSS, no TypeScript. Parent will assemble and run Vite build plus desktop/mobile visual comparison. Inspect fragment for correct assets/copy and valid markup. Commit ONLY owned two files on worktree branch, report hash. You are not alone; do not revert others' changes.
