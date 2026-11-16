# Case format validation — 2026-11-16

## Scope

New `/test/` route only. Existing homepage and five case HTML files, shared stylesheets, and assets are unchanged. The test route is marked `noindex, nofollow` and is not added to the main portfolio navigation.

## Checks completed

- `npm run build`: passed. Existing classic Webflow script bundling notices remain; the deployment's static asset copy preserves those scripts.
- `node --check assets/js/case-format.js`: passed.
- `git diff --check`: passed.
- AnyDesign document contract: passed; token references manually checked against frontmatter.
- Browser viewport widths: 1728, 1440, 1068, 768, 734, 390, and 320px. No document overflow or clipped panel text.
- Desktop screenshot review: split hero, annotation stage, and markup composition checked against the supplied Figma screenshot.
- Mobile screenshot review: stacked layout, swipe rail, result cards, and annotation reading order.
- All loaded product images resolve and decode. Lazy images were scrolled into view before inspection.
- Highlights: dot selection, selected state, native horizontal scrolling, and keyboard navigation.
- Product viewer: switching changes the image and its alternative text.
- Product tabs: selected state, correct image, and homepage annotations hidden in the BIM view.
- AI tabs: keyboard arrow activation changes image, heading, description, and selected state.
- Markup disclosures: one open panel at a time.
- Reduced motion: no hero animation; pending reveals are cleared when preference changes.
- JavaScript disabled: core heading/content remains visible.
- No page JavaScript errors during interaction checks.
- Prototype links use the existing iOS URL and the user-supplied web URL, opening in a new tab with `noopener noreferrer`.

## Pending content

Final videos are not yet supplied. Static product images remain in the demonstration panels; the three AI-production slots intentionally retain the empty surfaces in Figma. No simulated video playback or false play buttons are shown. Mobile composition and alternate tab/disclosure content are implementation interpretations and can be refined during review.
