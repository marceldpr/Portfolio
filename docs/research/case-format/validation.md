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

## Carousel control follow-up

Apple's live control was re-inspected after the request to match its behavior. The highlights now use a 56px frosted pill and separate 56px playback button, a 48px expanding progress track (32px on mobile), 32px desktop/20px mobile sticky bottom offsets, and a 6.25-second static-slide duration based on the reference's CSS fallback. Manual dot selection pauses playback. Play resumes, automatic progression stops at the final card, and Replay returns to the start. Playback suspends off-screen and in hidden browser tabs. Reduced-motion users start paused.

Verified locally: timed advancement, pause preserving progress, manual selection pausing, final-slide completion and replay, off-screen suspension, arrow-key selection, reduced-motion initial state, and mobile overflow. Desktop/mobile screenshots reviewed. Build and JavaScript syntax checks passed.

The user's 19-second screen recording clarified the dock's scroll positioning: it floats at the viewport bottom while the gallery extends below the fold, then settles into normal flow beneath the cards. Removed the negative overlay margin. The resting gap is now 48px on desktop and 32px on mobile. Forward/reverse scrolling was measured: the desktop dock stays 32px above the viewport bottom before settling 48px below the cards; mobile uses 20px and 32px respectively. No horizontal overflow, and manual slide selection still pauses playback.

## Final-result carousel

Applied the same shared carousel controller and floating dock to “Final result / Take a closer look.” Its three product views now slide horizontally and support independent playback, progress, keyboard navigation, and manual-selection pause. Verified desktop docking (32px viewport bottom, 48px resting gap), mobile rendering without overflow, manual selection, timed advancement, and independence from the highlights carousel. Removed the superseded image-swap controller and dot styles. Production build and syntax checks passed.

## AR scroll reveal

Replaced the static image in “From augmented reality to sheet management” with the supplied `TruScope_scroll_reveal_transparent.webm` (1424 × 750, 7.5 seconds). The video stays paused: scroll progress seeks its timeline forward or backward while the visual stage is sticky, then releases into the explanatory text. The original alpha channel is preserved. First/final poster frames were extracted from the supplied clip.

Validated at 1440px and 390px: start, quarter, halfway, end, reverse scrubbing, sticky positioning, transparent corners, and no horizontal overflow. Reduced-motion mode removes the scroll runway and shows the final poster; a deliberately failed video request also falls back to that image. Build and syntax checks passed.

## Pending content

The remaining videos are not yet supplied. Static product images remain in the demonstration panels; the three AI-production slots intentionally retain the empty surfaces in Figma. No simulated video playback or false play buttons are shown. Mobile composition and alternate tab/disclosure content are implementation interpretations and can be refined during review.

## Apple typography pass

Compared live Apple iPhone Duo and MacBook Pro PROLED XDR text styles at desktop, tablet, and mobile sizes. Updated the test route's type scale, semibold headings, regular supporting copy, off-white/gray text colors, and blue result values. Verified local Inter files contain the declared 400/500/600 weights. Checked widths 1728, 1440, 1068, 734, 390, and 320px for horizontal overflow and highlight text clipping; none found. Reviewed desktop hero and desktop/mobile problem-heading screenshots. Production build and diff whitespace checks passed.

## Two-products phone parallax

Matched the camera-stat composition in the user's 11:56:44 recording of Apple's iPhone Duo page. The sheet-management phone and desktop principles move upward faster than normal scrolling while the AR phone drifts gently in the opposite direction. Paused Web Animations are scrubbed from section position, so forward/reverse scrolling is deterministic and no animation runs while idle. Desktop travel scales with the composition width; mobile uses a gentler 48px range and stationary principles. Removed the phones' competing one-shot reveal transforms.

Verified forward/reverse samples at 1440, 768, and 390px; returning to the same scroll position restores the same transforms. No horizontal overflow. Changing reduced-motion preference cancels all three animations and restores the static composition. Reviewed desktop/mobile screenshots. Build, JavaScript syntax, and diff checks passed.

## Phone spacing and text reveal refinement

Reduced the composition's top margin from 48px to 32px and moved the lower phone up 96px on desktop (64px on tablet), reducing the feature-label-to-phone gap from 282px to 186px at 1440px. The composition height follows that change; mobile row spacing is reduced to 16px. Added independent staggered fade/30px rise transitions to the introduction's text elements and each feature item, with 100ms steps. Child transitions leave the parent's scroll-linked parallax transform intact.

Verified intermediate staggered opacity values, final fully visible state, no overflow at 1440/768/390/320px, and cancellation of motion with fully visible content under reduced-motion preference. Reviewed the tighter desktop composition. Build, syntax, and whitespace checks passed.
