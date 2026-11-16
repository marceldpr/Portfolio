---
version: anydesign-1
name: TruScope case format
source: https://www.figma.com/design/4I7FD5Q1zXcuQseTmtKVqY/Untitled?node-id=49-15645
captured_at: 2026-11-16
description: |
  A product-led construction case study. Large device demonstrations carry the story,
  while restrained dark surfaces, concise section headings, and blue results provide hierarchy.
colors:
  background: "#1C1C1C"
  surface: "#2A2929"
  control: "#3B3B3B"
  text: "#FFFFFF"
  muted: "#AAAAAA"
  eyebrow: "#9E9B9B"
  accent: "#0095FF"
typography:
  display:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: 600
  heading:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: 600
  body:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: 400
    lineHeight: 28px
  eyebrow:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 500
spacing:
  base: 8px
  scale: [8, 16, 24, 32, 48, 64, 77, 96]
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

Desktop type: 40px/600 hero, 32px/600 sections, 26px/600 highlight copy, 20px/28px regular body, 14px uppercase eyebrow, 60px regular results. Existing local Inter fonts are reused. The next-case footer uses the existing Montreal book face to match its reference treatment.

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

At 1728px, body copy is approximately 1446px wide and media stages 1568px wide. Hero media is 721 × 607. Highlights are 1260 × 616, with 32px between cards. Results occupy a contrasting full-width band. Typical sections have 77px vertical padding; section titles sit 48px above media. The final device section becomes denser, with a full-width annotated phone, paired phone stages, and issue/RFI/inspection cards.

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
