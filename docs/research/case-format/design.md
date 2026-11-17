---
version: anydesign-1
name: TruScope case format
source: https://www.figma.com/design/4I7FD5Q1zXcuQseTmtKVqY/Untitled?node-id=49-15645
captured_at: 2026-11-17
description: |
  A product-led construction case study. Large device demonstrations carry the story,
  while restrained dark surfaces, concise section headings, and blue results provide hierarchy.
colors:
  background: "#000000"
  surface: "#1D1D1F"
  control: "#333336"
  text: "#F5F5F7"
  muted: "#86868B"
  eyebrow: "#F5F5F7"
  accent: "#2997FF"
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: 600
  heading:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: 600
  body:
    fontFamily: system-ui
    fontSize: 17px
    fontWeight: 400
    lineHeight: 25px
  eyebrow:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 500
spacing:
  base: 8px
  scale: [8, 10, 16, 18, 20, 24, 26, 32, 40, 48, 56, 64, 80, 96, 112, 120, 128, 144]
rounded:
  button: 8px
  stat: 32px
  panel: 48px
  pill: 99px
components:
  media-panel:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.panel}"
  segmented-control:
    backgroundColor: "{colors.control}"
    rounded: "{rounded.pill}"
---

# Design Analysis — TruScope case format

## Source

- Figma page 49:15645; implementation frame 49:15646, 1728 × 14088.
- Full design context and 982 × 8000 screenshot captured through Figma MCP.
- Behavioral reference: https://www.apple.com/iphone-duo/ and its linked `overview.built.css`, inspected in a browser and at source level on 2026-11-16.
- Figma contains desktop only. Video timing and mobile layouts are not specified; responsive decisions and animation timing are implementation interpretations.

## TL;DR

Build a separate `/test/` route with native HTML, CSS, and JavaScript. Preserve the supplied section sequence, device assets, copy, charcoal surfaces, and generous spacing. Use responsive flow rather than Figma's absolute page coordinates.

## 1. Visual identity

### Surface and brand voice

Product-led, spacious, technical, and restrained. The story assumes the viewer wants to inspect actual design work: screenshots take more space than promotional copy. The case moves from business results into specific interface decisions, making the work itself the evidence.

### The ONE brand thing

Large device demonstrations on rounded charcoal stages. Blue is reserved for numerical results and annotation markers; the devices carry the visual richness. The asymmetric pair of phones breaks up the otherwise centered media panels.

## 2. Design System

Colors, desktop typography, and radii above are measured from Figma context. Body text uses {colors.muted} on {colors.background} or {colors.surface}; headings use {colors.text}. Metrics use {colors.accent}. The CTA is a subtle bordered rectangle, while gallery controls and tabs use pills.

The original Figma type scale was superseded by the user-requested Apple typography pass. Desktop type now uses 48px/600 hero and sections, 28px/600 highlight leads, 21px/29px regular supporting copy, 14px uppercase labels, and 60px regular results. Existing local Inter fonts are reused. The next-case footer uses the existing Montreal book face to match its reference treatment.

Elevation comes from surface tone, not box shadows. Only the next-case footer receives a green atmospheric glow. No general status-color or alpha-overlay system is evidenced. Borders are limited to CTAs, metadata separators, and blue numbered markers.

Metadata labels are kept at the portfolio's current 12px size. Their contrast is raised from the Figma's #636363 to #929292. Focus rings use a light blue outline. Interactive dots have larger hit areas than their visible circles; reduced-motion mode disables reveal and smooth-scroll motion.

## 3. Components Inventory

### media-panel

{colors.surface}, {rounded.panel}; clips oversized device compositions, and scales down to 32px corners on smaller screens. Results invert the panel to the darker page surface. Actual exported product assets are used, never screenshots of the composed page.

### segmented-control

{colors.control}, {rounded.pill}; dark selected segment with native buttons, tab roles, roving tab order, and arrow/Home/End keyboard support. Used for product and AI workflow switching.

### Other generic components

- Split hero with metadata definition list and external prototype links.
- Four metric cards, a two-column scope section, and native disclosure controls for markup categories.
- Numbered annotations linked visually to the phone on desktop and presented in reading order on mobile.

### Signature components

- Five-card highlights rail with visible next-card preview, swipe/trackpad scrolling, scroll snapping, keyboard navigation, and dot controls.
- Large product viewer with three distinct supplied device views. The design shows five placeholder dots but provides one initial viewer image; the implementation exposes only three useful supplied views rather than duplicating frames.
- Staggered AR and sheet-management phone composition.
- Three intentionally empty AI-production media slots, matching the unfinished design.

## 4. Layout and composition

### Desktop geometry

The original Figma used 1446px text containers, 1568px stages, and 77px section padding. The November 17 spacing request supersedes those values: text and stages now share Apple’s 87.5% container capped at 1260px, with 128/96/80px story padding and 48/40/32px heading-to-media gaps. Highlights retain a visible next-card preview. Results occupy a contrasting full-width band. The final device section becomes denser, with a full-width annotated phone, paired phone stages, and issue/RFI/inspection cards.

### Apple reference observations

The reference uses horizontal mandatory scroll snapping, tab-based gallery navigation, rounded media surfaces, and a sticky product navigation. Clicking the iOS highlight updates selected state and scrolls the gallery. Its stylesheet's main breakpoints are 1068px and 734px, with larger-screen adjustments at 1441px. Measured highlight headings were 48/40/32px at desktop/tablet/mobile; cards measured 1260px at 1440, 934.5px at 1068, and 321.25px at 390. These patterns inform responsive behavior; Figma remains the visual source. The test does not add a product purchase bar, scroll locking, or video playback without final videos. The highlights slideshow now auto-advances its static cards with a 6.25-second fallback and explicit play/pause/replay control, following the subsequent user request.

### Responsive interpretation

- Above 1068px: full desktop compositions and callout lines.
- 735–1068px: reduced typography, simplified callouts, flexible grids, contained media.
- At 734px and below: stacked hero, text above images in swipe cards, 2 × 2 results, numbered annotation lists, stacked supporting cards, and horizontally scrollable production slots.
- All text remains HTML, with natural wrapping. Text and media do not scale as one flattened canvas.

### Image behavior

Hero uses the exact Figma crop. Device screenshots preserve their aspect ratios. The AR environment is cropped inside a wide stage. Phone and laptop compositions are intentionally clipped at the panel edge on desktop, then rearranged on smaller screens. Images below the hero are lazy loaded. The design's flipped laptop reflection is represented by a subtle CSS reflection.

## 5. Reconstruction Notes and confidence

The deployed repository is Vite/static HTML, so this route uses that stack and adds one build entry. No framework, dependency, or shared existing-case stylesheet is changed. New styles and scripts are only linked from `/test/`.

| Area | Confidence | Evidence |
| --- | --- | --- |
| Desktop layout, colors, copy | High | Figma context and screenshot |
| Asset identity and initial states | High | Downloaded Figma assets |
| Reference breakpoints and gallery behavior | High | Source CSS and browser measurements |
| Mobile composition | Medium | Adapted from desktop and reference patterns |
| Motion timing | Medium | 800–900ms reveal is an implementation choice |
| Alternate tab/disclosure content | Medium | Uses available screenshots and short contextual copy; no alternate Figma states supplied |
| Final video playback | Pending | Videos not yet supplied |

## 6. Do's and Don'ts

### Do
- Keep product demonstrations visually dominant.
- Use {colors.accent} for metric values and numbered markers.
- Alternate dark surfaces around the results band.
- Preserve the asymmetric two-phone composition on desktop.
- Keep pill controls separate from rectangular prototype buttons.
- Keep the atmospheric glow confined to the next-case link.

### Don't
- Replace the device work with generic imagery.
- Add gradients to every section or card.
- Promote display weights beyond the measured 600.
- Flatten text and annotations into a page screenshot.
- Use the unfinished video slots as pretend play buttons.
- Hide core content when JavaScript or motion support is unavailable.

## 7. Open Questions

- Final videos and their poster frames will replace the corresponding static media or empty production slots.
- Mobile art direction is inferred and ready for review; no mobile Figma frame was provided.
- Alternate markup illustrations were not supplied. Disclosure copy expands while retaining the shared product composition.

## 8. Companion files

- `test/index.html`: content and semantic structure.
- `assets/css/case-format.css`: scoped page styling and breakpoints.
- `assets/js/case-format.js`: galleries, tabs, and progressive reveal.
- `assets/img/case-format/`: downloaded product assets and icons.
- `validation.md`: responsive and interaction checks.

Art-direction QA completed: dark band inversion, scoped footer glow, density changes, radius coexistence, weight ceiling, surface-tone elevation, and asymmetric whitespace are documented above. No monochrome code typography or general shadow system is present.

## Apple typography follow-up

The user explicitly selected the Apple reference for font sizes, colors, and weights. Measured live at 1440, 1068, and 390px on 2026-11-16:

- iPhone Duo section headers: 48px/52px, weight 600 on desktop; 40px tablet and 32px mobile.
- MacBook Pro PROLED XDR Performance heading: 64px/68px desktop, 48px/52px tablet, 40px/44px mobile, weight 600; label 21px/600 (19px mobile).
- Performance body: 21px/29px regular desktop/tablet, 19px/27px mobile, #6e6e73.
- Dark text palette: #f5f5f7 primary, #86868b secondary, #2997ff blue.

Applied the Performance treatment to the scroll-reveal problem section, including its centered heading. Other section headings follow the iPhone Duo scale. Local Inter is retained, so font metrics are an adaptation rather than a claim of identical SF Pro rendering. Longer highlight explanations use regular body text beneath semibold leads. Existing dark surfaces, imagery, and controls remain intact. Confidence: high for sampled source values; medium for the mapping to this case study's longer copy.

## Body and subtitle correction

A second comparison found that the initial Apple pass applied the 21px introductory style too broadly. Apple's iPhone Duo standard product-view copy is 17px/25px at weight 400; camera-stat captions are 14px at weight 400. Its 21px/29px introductory copy uses SF Pro Display, whereas our Inter rendering was visibly different.

The test route now uses a native system-font stack for body and supporting text, with 17px/25px regular body, 19px/27px regular hero description, 14px/20px feature captions, and regular annotation/subtitle headings. Apple-style antialiasing is enabled. Display headings retain Inter. The 19px hero description is a deliberate adaptation requested for smaller supporting text, not an exact desktop reference size. Platform font rendering varies; we do not claim a pixel-identical SF Pro web-font match.

## Apple spacing audit — 2026-11-17

Source: https://www.apple.com/iphone-duo/ and `/v/iphone-duo/f/built/styles/overview.built.css`, retrieved November 17. Source rules and computed styles inspected at 1728, 1440, 1068, 734, and 390px. ✅ High confidence for the measurements below. ⚠️ Medium confidence for mapping product marketing sections to this longer portfolio narrative.

| Role | Desktop >1068 | Tablet 735–1068 | Mobile ≤734 |
| --- | --- | --- | --- |
| Product-story section padding | 128px | 96px | 80px |
| Chapter / highlights intro | 144px | 120px | 112px |
| Section header → media | 48px | 40px | 32px |
| Camera intro → composition, enhanced mode | 64px | 56px | 40px |
| Eyebrow → headline | 20px | 18px | 10px |
| Headline → supporting copy | 26px | 24px | 18px |
| Content width | 87.5%, max 1260px | 87.5%, max 1260px | 87.5%, max 420px |
| Highlights media → section end, including control area | 224px | 176px | 144px |

Measured mismatch before correction: 48px highlights top padding, 72px results padding, 77px general sections, 32px products padding, zero navigation top padding, and alternating 1205/1307px text/media containers at 1440px. Tablet section headings retained the desktop 48px gap instead of 40px. Several neighboring sections added both bottom and top padding, while others used special zero-padding rules.

Implementation now uses shared spacing variables rather than isolated overrides. Same-surface consecutive stories omit bottom padding, following Apple’s adjacent-section rule; the incoming section supplies the gap. The contrasting results band keeps padding on both sides. The case-scope chapter uses the 144/120/112px rhythm. Results cards use the section header’s margin instead of a second competing margin. Media and headings share gutters; narrative insets follow the reference’s one-column offset on desktop. Desktop annotated and markup panels use their existing compact layout to fit the 1260px content cap. Full-width AR media retains its native aspect ratio and scroll runway.

Art-direction QA: spacious chapter introductions alternate with denser 24px supporting-card clusters; the results band still establishes a surface change; asymmetric phones remain asymmetric; no new typography weights, decorative gradients, or shadows were introduced. Pill controls keep their independent sticky behavior. This is a measured spacing adaptation, not a claim that the case’s different content and device compositions are identical to Apple’s page.

Do: use the shared variables, align headings with gallery gutters, and count a same-surface section boundary once. Don’t: reinstate ad hoc 77px padding, shrink the AR stage to make a spacing change, or remove the deliberate compact gaps between related UI panels. Open question: long portfolio copy has no one-to-one Apple counterpart; its reading widths and section mapping remain an explicit adaptation.

## PROLED XDR color scheme — 2026-11-17

The user's color reference supersedes the original Figma palette: https://www.apple.com/macbook-pro/proled-xdr-display/ and `/v/macbook-pro/proled-xdr-display/b/built/styles/overview.built.css`. ✅ High confidence: sampled rendered sections plus authored `.theme-dark`, button, tab, and control variables.

- Main canvas: #000000; charcoal cards: #1d1d1f; secondary dark surface: #161617.
- Headings: #f5f5f7; secondary copy: #86868b; introductory copy: #6e6e73.
- Accent text: #2997ff; filled actions: #0071e3 (hover #0076df), white labels.
- Controls: #333336; selected pill: #f5f5f7 with black text; borders #424245.
- The reference’s closing shopping/exploration area uses #f5f5f7 with #1d1d1f text. Applied to the next-case link/footer, replacing the green glow.

Results now sit on the continuous black canvas with charcoal metric cards, matching the reference’s product storytelling treatment. Existing sizes, spacing, imagery, motion, and content are retained. The two looping navigation video panels deliberately retain #2a2a2a because that background is baked into the supplied MP4s; recoloring those assets is outside this CSS palette update.

Art-direction QA: neutral dark surfaces establish depth; blue is reserved for actions/results/annotations; no new decorative color is introduced; light closing polarity follows the reference. Do use semantic color tokens and high-contrast selected tabs. Don’t change product screenshot colors or mismatch the supplied video backgrounds. Mapping Apple’s shopping footer to a portfolio next-case area is an adaptation (⚠️ medium confidence). Contrast measurements are in `design-a11y.md`; the source’s #6e6e73 on black measures 4.14:1, so an exact palette match is not a blanket AA-normal-text claim.
