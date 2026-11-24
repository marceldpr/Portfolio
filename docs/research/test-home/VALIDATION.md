# Test Home validation

Implemented on the existing Vite preview at `/test-home/`, with Bruno's content temporarily retained per the user's answer. Original home and case study are unchanged by this task.

## Scope and artifacts

- Two content sections: hero with credentials, and looping company-logo carousel.
- Four components including the fixed header and opening sequence.
- Two specifications: `hero.spec.md` and `header-and-intro.spec.md`.
- Thirteen local reference assets: three portraits, avatar, two credential marks, five company logos, animated bell JSON, and LinkedIn arrow SVG. Existing Editorial Ultralight font reused.
- `scripts/assemble-test-home.mjs` assembles the page and extracts only the header's original CSS cascade. It does not fetch or execute reference JavaScript. Research bundles are inspection evidence only.

## Verification

- Vite production build passed.
- No local page JavaScript errors observed.
- Compared ten element bounding boxes against live reference at 1440, 768, and 390px widths: no differences exceeding 0.5px. These cover header/avatar, hero, both heading variants, divider, credentials and carousel.
- Desktop and mobile screenshots visually reviewed; screenshots saved in `docs/design-references/test-home`.
- All rendered images loaded. Carousel traverses -720px at22.5s, returning to0 at45s on a1440px viewport; duplicate group prevents a seam.
- Opening portrait measures237.5×256.664px at x307.703,y212.5; name50.4px. Overlay removed and scroll unlocked after completion.
- PT/EN switch updates headline, mobile copy, credentials, notification, link and accessible labels.
- Notification hover reveals LinkedIn action without sending any message or opening that link during testing.
- Header condenses from160px to84px after24px scroll; avatar returns to top.
- Reduced-motion skips the opening and stops carousel animation. English mobile has no horizontal overflow.
- `git diff --check` passed.

## Deliberate scope limits

The four later-project navigation dots remain visually present but inactive (`aria-disabled=true`), because those project sections are outside this excerpt. Floating WhatsApp and later case sections are not included. Carousel screenshots differ in phase because it continuously animates; its dimensions and speed match.
