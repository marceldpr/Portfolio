---
version: anydesign-element-1
name: TruScope alternating workflow story
source: User screenshots and supplied workflow illustrations, 2026-11-18
captured_at: 2026-11-18
kind: hybrid
target:
  description: Replace the AR video and supporting notes with two alternating illustration/copy rows
  selector: .t2-before
colors:
  surface: '#f2f2f2'
  text-primary: '#000000'
  tag-surface: '#e9e9e9'
typography:
  body:
    fontFamily: system-ui, Helvetica Neue, Arial, sans-serif
    fontSize: 14px
    fontWeight: 300
spacing-used: [10, 20, 24, 32, 100, 120, 180, 200, 210]
rounded-used: { tag: 2px }
---

# Element — alternating workflow story

Generated with the anydesign skill, element mode.

## Source and target

The user's second screenshot supplies the alternating composition: visual left/copy right, then copy left/visual right, with uppercase tags beneath each visual. Targeting is visual (medium confidence); existing page colors, typography, and container widths are read directly from CSS (high confidence).

Supplied assets are used unchanged:

- Construction Workflow Design Sprint Infographic.webp, 1774 × 887, copied to workflow-friction.webp.
- Hand-Drawn Construction App Flow Map.webp, 1672 × 941, copied to connected-workflows.webp.

## Identity and composition

The reference uses open space and plain text rather than enclosing each story in a card. The alternating placement is the defining gesture. Illustrations carry the detail; no oversized title competes with them. The section remains on the surrounding paper surface.

## Specification

- Two rows within the existing 1147px maximum width, with 38px desktop gutters.
- Desktop columns: flexible illustration (779px at the full container width) and 320px copy, separated by 48px and reversed for row two. Vertically centered; 200px between rows.
- Paragraphs use the existing 14px body style, 1.52 line-height, .14px tracking, and 20px paragraph separation. User wording is preserved exactly.
- Tags: 10px uppercase, 1px tracking, 400 weight, #e9e9e9 surface, 6px vertical and 10px horizontal padding, 2px corners. These are descriptive labels, not buttons.
- Illustrations retain their intrinsic aspect ratios and all artwork. CSS clips only the empty side margins (11% per side for the first asset, 7% for the second), enlarging the visible diagrams and aligning their edges with the tags. Multiply blending integrates the light image backgrounds with the page; original raster files remain unchanged.
- At 900px and below, each row stacks copy first, then illustration and tags. Mobile uses the existing 24px gutters, 100px between stories, and wrapping tags. This is an implementation adaptation, not a mobile reference measurement.
- Images open at their original resolution in a new tab, with descriptive accessible link labels, for reading small annotations. Existing focus styles apply.
- Existing scroll reveal and paragraph shimmer apply to the new content. Reduced motion displays the final visible state.

## Reconstruction contract

Use semantic HTML and existing static Vite assets. Build two CSS grid rows, each containing a copy block and figure with linked image and a tag list in its caption. Reverse desktop columns for row two. Maintain full image proportions, responsive stacking, and the supplied text verbatim. Remove the previous AR video, caption, and In the field/Across the project notes from this section.

## Asset handling

No generative image prompt is needed: the user supplied the final illustrations. Preserve the source WebP files byte-for-byte.

## Consistency and art-direction QA

- Preserve the shared neutral surface and body typography.
- Keep uppercase tracking confined to tags; paragraphs remain sentence case.
- Keep the alternating asymmetric layout and wide row separation.
- Use flat tags without shadows or pill corners.
- Do not crop diagrams, add gradients, or invent graph animations over the supplied artwork.
- Retain image-specific color accents instead of adding new decorative colors.

## Confidence and open questions

High confidence: supplied copy, asset dimensions, existing page tokens, requested placement, and tag wording. Medium confidence: spacing inferred from the desktop screenshot. Mobile stacking is an authored adaptation. No unresolved questions block implementation.
