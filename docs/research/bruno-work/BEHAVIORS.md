# First-case motion audit — 2026-11-17

Scope: the first case from the centered AI-agent introduction through the prototype gallery, adapted to TruScope. Inspected the live page at 1440×1000, including scroll states, computed animation timing, and public implementation definitions. The home-page loader and later cases are outside this page's scope.

| Reference behavior | Extracted timing/model | Test 2 implementation |
| --- | --- | --- |
| Smooth wheel scrolling | Lenis, duration 1 second, native touch | Lenis with anchor offsets; removed when reduced motion is requested |
| Intro background | Moving spiral canvas plus 30px scroll parallax | Existing native diamond helix now continuously moves, responds to pointer position, and shifts with scroll |
| Heading rolls | 800ms, 70ms per-word stagger reset per line, cubic-bezier(.215,.61,.355,1), purple #6e15b7 through 35% | Word masks on editorial headings; scroll entry with bottom root margin -10% |
| Paragraph shimmer | 450ms delay, approximately 23 characters/second, purple/gray/white sweep into final ink | Responsive horizontal text sweep, preserving inline emphasis and final text metrics |
| Insight sketches | Three looping Lottie JSONs, speed .6, 200 frames at 100fps | Original decorative sketch animations served locally; static SVG fallback for reduced motion |
| Process title | Scrubbed four-letter chunks settle as section top moves from viewport bottom to top | Foundation title spacing settles on scroll |
| Process cards | Pinned sequential cards with rotation/translation; mobile cycles every 3500ms | Existing desktop card timeline retained; added mobile cycling with a pause after touch, wheel, keyboard, or pointer interaction |
| Card artwork | Looping media in the reference's card headers | TruScope icon artwork has subtle looping motion and a passing highlight |
| Black pixel reveal | 60×20 cells desktop, 20 columns mobile, randomized top-down order; section top at center+270px through top | Canvas overlay over the AI band, reversible on scroll |
| Principle cards | 700ms fade/28px rise, 0/180/360ms stagger; outlined pixel reveal and .05-opacity pulse | Staggered existing cards plus subtle outline/pulse canvas regions |
| Moving connectors / knowledge graph | Animated Rive lines and interactive graph | Flowing SVG connections between TruScope drawings, issues, tasks, inspections, media, and RFIs; subtle drift and pointer response |
| Results | Randomized 50ms letter stagger with duplicate rolling characters, scroll scrub, independent parallax layers | Rolling results headline plus title/metric parallax; static on mobile/reduced motion |
| Prototype gallery | Two vertical loops at 40s and 32s, fading edges and looping videos | Existing two-column gallery retained, with pause/play and accessible original items |
| Interaction polish | Animated state changes and hover effects | Homepage image transitions, animated disclosure heights, and link-arrow hover motion |

## Local assets

Decorative sketches were downloaded from:

- `https://bruno.work/assets/lotties/scribble-line-11-b.json`
- `https://bruno.work/assets/lotties/scribble-line-3-b.json`
- `https://bruno.work/assets/lotties/scribble-line-8-b.json`

Case-specific Bruno product videos and avatars remain replaced with existing TruScope content. The spiral and connected graph are native-code adaptations, not the reference's proprietary shader/Rive scene.

## Verification

- Production build and JavaScript syntax checks passed; no browser page errors.
- Animated canvas and sketch SVG changed between timed samples.
- Pixel overlay mean alpha measured 222 → 1 → 221 while scrolling forward and back.
- Mobile card rail advanced from 0 to 281px after the 3.5-second interval.
- No horizontal page overflow or clipped headings at 320, 390, 768, 1024, 1440, and 1728px.
- Live reduced-motion change removed Lenis, hid pixel overlays, removed paragraph shimmer, and left zero running infinite CSS/WAAPI animations.
- Reviewed desktop intro, partially revealed AI band, finished results, mobile intro, and mobile AI screenshots. Corrected duplicate-letter ink leaking outside the results mask.
