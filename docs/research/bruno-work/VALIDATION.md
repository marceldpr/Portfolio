# Test 2 validation

Implemented `/test-2/` using TruScope content and assets, with Bruno's first-case typography, spacing, chapter navigation, sticky narrative, and prototype gallery as the reference. Existing `/test/` files are unchanged.

## Checks

- `npm run build`: passed.
- `node --check assets/js/test-2.js`: passed.
- `git diff --check`: passed.
- Browser checks at 320, 390, 768, 1024, 1440, and 1728px: no page overflow or clipped headings.
- Desktop scroll card progress at 0, 0.5, and 1 reveals the first, second, and third cards respectively.
- Homepage tabs switch images with clicks and arrow keys; native markup disclosures open and close.
- Results finish at +58%, +103%, -92%, and +34%.
- Gallery has two inert visual clones. Pause/play controls stop and resume both animation columns.
- Reduced motion presents static cards and a horizontal gallery, suppresses autoplay, and disables the animation toggle.
- Chapter links update the active marker and reach the intended section.
- Built production page returns 200 with the expected typography/colors, no JavaScript errors, and no broken loaded images.
- Desktop results/gallery and mobile gallery screenshots reviewed; corrected spaces at responsive line breaks and mobile reduced-motion gallery padding.

## Adaptation

The content, product images, prototype destinations, and identity belong to Marcel Rosa's TruScope case. The decorative helix is rendered locally with canvas; the reference's personal branding and contact widget are not used. A no-script fallback keeps the full gallery reachable without motion.
