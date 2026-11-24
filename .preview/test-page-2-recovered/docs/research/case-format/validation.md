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

## More visible spacing/reveal refinement

Confirmed the previous CSS was live. Reduced the desktop feature-label-to-phone gap again, from 186px to 90px, and the composition top margin to 24px. Revised tablet phone position and container height to prevent label overlap while keeping the full phone inside the composition.

Staggered groups now use a separate observer with an 18% bottom inset and 15% visibility threshold; they re-arm when scrolled back below the reading area. Child fade/rise duration is 1s with 150ms stagger, and hidden setup is instantaneous. Repeated scroll-out/scroll-in checks measured opacity 0 → staggered intermediate values → 1 on both passes. Reduced-motion content stays fully visible. Checked tablet containment and widths 1728/1068/768/735/390/320 for horizontal overflow. Build, syntax, and whitespace checks passed.

## Body and subtitle correction

Re-measured Apple iPhone Duo's text styles: standard body 17px/25px regular, intro 21px/29px regular, feature captions 14px regular, and antialiased smoothing. Replaced the overly broad 21px Inter body treatment with a native system-font stack and 17px regular body. Hero description is 19px regular; secondary text headings are regular, and feature captions are 14px. Retained the 90px desktop feature-to-phone gap after captions shrank.

Reviewed updated hero and two-product screenshots. Checked 1728, 1440, 1068, 768, 390, and 320px: no horizontal overflow; computed body 17px, hero description weight 400, captions 14px. Production build and whitespace checks passed.

## Results count-up

The four main results count from 0% to +58%, +103%, -92%, and +34% over 1.1 seconds with cubic ease-out, once per card when at least 55% visible. Tabular figures keep digit widths stable. Final text stays in the HTML and in a screen-reader-only span; only the aria-hidden visual span animates. Reduced motion shows final values immediately and cancels active counts if enabled.

Verified initial zeros, intermediate signed values, exact final values, no replay on revisiting, reduced-motion values, accessible final text, and no mobile overflow. Build, JavaScript syntax, and diff checks passed.

## Full-width AR video v7

Replaced the active scroll reveal with the supplied `TruScope_AR_scroll_reveal_v7.mp4` (8.2 seconds, about 24 MB), retaining its existing fast-start MP4 layout. Updated codec detection to read the actual source MIME type. Extracted new start/final JPEG posters from that clip. The media now sits outside the text-width wrapper and reaches both viewport edges, with square edges and centered cover framing; headings and explanatory copy retain their reading widths.

Verified start, midpoint, end, and reverse seeks at 1440px and 390px. Video remains paused and is controlled by scrolling. Media bounds are exactly 0 to viewport width, with no horizontal overflow. Reviewed desktop/mobile frames; reduced-motion mode uses the new final poster. Build, syntax, and diff checks passed.

## AR video height correction

Removed the desktop 76svh height cap that cropped the full-width clip. The stage now follows its native 1424:750 ratio with contain sizing, and its sticky offset centers shorter frames or aligns taller frames to the viewport top. Mobile retains its portrait presentation, which preserves the source's full vertical extent. Verified full phone framing at the final frame, full-width bounds, forward seeking, and no overflow at 1728/1440/1068/390px. Desktop heights are now 910px at 1728px width and 758px at 1440px width. Build and diff checks passed.

## Navigation asset refresh

Updated only “From navigation to prioritization” with all nine supplied assets from `06 Navigation`: Sheet Management and 3D BIM viewer AVIFs, Issue/RFI/Inspection card AVIFs, and the two MP4 demos with their AVIF posters. The existing product tabs now load the new screens. Paired videos loop muted while in view, pause offscreen/in a hidden tab, and expose individual play/pause controls. Explicit pause persists on revisit; reduced-motion users start paused with posters, with manual playback available. Native controls remain available without JavaScript.

Verified both tab images decode, all three card images decode, both videos play, manual/offscreen/reduced-motion pause, and 44px mobile controls without horizontal overflow. Reviewed desktop homepage and demo panels plus the mobile layout. Build, syntax, and whitespace checks passed.

Confirmed the user's clarification: Changing is the left looping MP4 and Add is the right looping MP4; AVIFs are posters/fallbacks. Added explicit image fallbacks for failed video requests or unsupported MP4 playback. Tested both clips wrapping from their final frames back to the beginning while playing, then deliberately blocked both MP4 requests and verified each corresponding AVIF becomes visible.

## Apple spacing audit — 2026-11-17

Compared reference source CSS and computed geometry, then applied common section, chapter, heading, intro, and gutter values. Checked 1728/1440/1069/1068/768/735/734/390/320px: no horizontal overflow or clipped homepage/Issue annotations. Computed story padding is 128/96/80px, header gap 48/40/32px, intro gap 64/56/40px, and eyebrow gap 20/18/10px. Reviewed desktop highlights, results, annotation panel, and mobile results/products screenshots. Matching BIM/Sheets annotations and Issue connectors remain present. Build and diff checks passed.

## PROLED XDR palette

Read Apple’s source CSS and computed dark/light section colors. Applied black canvas, #1d1d1f cards, #161617 secondary stages, #f5f5f7 headings, gray copy, #0071e3 filled actions, white selected tabs, and light closing area. Retained #2a2a2a for baked video backgrounds. Reviewed desktop hero/navigation/next-case screenshots and mobile navigation. Verified tab selection, black text on the light active pill, blue metrics on charcoal cards, no mobile horizontal overflow, build, and diff checks.

## Outlined product containers

Matched the reference source outline (1px #424245, 28px radius) and screenshot black fill on all three final-result slides and the Markups panel. Reviewed desktop carousel/Markups and mobile Markups screenshots. Verified computed fills, radii, outline colors, pointer-events:none, no mobile overflow, carousel selection, and accordion expansion. Production build and diff checks passed.

## Light narrative after AR

Reviewed the video-to-copy transition, desktop annotated panel, and mobile products section. Verified light canvas #f8f8f8, dark headings #1d1d1f, gray body #6e6e73, white cards, readable selected tabs, and preserved dark Markups text. Checked 320/390/768/1068/1440/1728px for horizontal overflow; none. Verified BIM tab selection, normal-motion scroll video seeking while paused, and product heading fade-in. Production build and diff checks passed.

## Unified light containers — 2026-11-17

Verified all eleven light-section media panels compute to rgb(245,245,247), with dark text and the #f8f8f8 canvas preserved. Reviewed the Markups panel and checked mobile overflow. Production build and diff checks passed. Browser validation used a temporary isolated context that was closed afterward to avoid leaving viewport overrides in the user-facing browser.

## Scroll-driven principle fades — 2026-11-17

Replaced the three principle items’ timed stagger entrance with paused opacity animations driven by their viewport position. Each icon/caption pair fades at the bottom and top edges, stays fully visible in the middle, and reverses with scroll direction. Existing parent parallax stays separate. Verified hidden, intermediate, fully visible, exiting, and reverse-scroll states at 1440px and 390px; reduced-motion changes restore opacity 1 immediately. Build, JavaScript syntax, and diff checks passed.

## Subtle Markups-to-AI background transition — 2026-11-17

Added a full-width white-to-#f5f5f7 gradient through Markups. The AI and production sections continue on #f5f5f7 with #fff media panels. Earlier narrative sections retain their white canvas and gray panels. Desktop section positions and heights are unchanged. Reviewed desktop/mobile AI panels and the Markups transition; verified computed colors, working AI tabs, and no horizontal overflow at 320/390/768/1068/1440px. Production build and diff checks passed. All browser checks used temporary contexts closed after inspection.
