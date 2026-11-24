# Test Home: header and opening

Reference: https://bruno.work/ (24 November 2026). Scope ends after the logo carousel. Use reference content temporarily, as requested.

Header is fixed, 160px tall on desktop, with a 1405px centered inner wrapper, 38px horizontal padding, 52×54px avatar, 14px notification text, 22px animated bell, five 9px navigation dots separated by 75px lines, and PT/EN switch. At scrollY > 24 it condenses to 84px with #f2f2f2bd background and five progressively blurred layers. Mobile uses 102px / 72px heights, hides notification text and dots, and keeps 38px side padding. Captured source CSS is reference-readable.css; preserve its media-query cascade.

Notification hover reveals an animated gradient-ring LinkedIn link. Language switch updates all hero/credential text and accessible labels. Avatar returns to top. Only the first navigation dot is active in this excerpt; the four later projects are outside the requested page scope.

Opening: black masks, portrait cycling through open_img_01–03.webp, and a gradient reveal of Bruno Gonçalves. Portrait rectangle scales from 1728px design width: x369.25, y255, w285, h308. Name is 50.4px Editorial Ultralight, 20px right of portrait, bottom aligned. Wipe begins .6s, portraits switch .9s and 1.2s, masks open at1.55s over1.3s using cubic-bezier(.87,0,.13,1). Name fades over .7s; portrait fades at2.05s over.4s. Hero word roll starts2.2s. Scroll unlocks2.85s. Mobile hides name. Reduced-motion and ?nointro skip opening.

Hero and carousel contract: hero.spec.md. Desktop, tablet, and mobile screenshots are in docs/design-references/test-home. All live assets are local in assets/img/test-home; existing Editorial font is reused.
