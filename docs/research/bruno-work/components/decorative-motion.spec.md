# Decorative motion completion

Ownership: assets/js/test-2-decorative-motion.js and assets/css/test-2-decorative-motion.css only. Export initDecorativeMotion(). Root imports/calls module and stylesheet. Do not edit main JS/HTML/CSS.

Reference case has black pixel reveal across intro to AI/agent band, subtle white outline pixels over principle cards, white low-opacity pulse behind cards, and animated flowing connector lines. Adapt these to current .t2-ai-principles band, .t2-ai-principle-grid, .t2-ai-grid-art; preserve all content/layout.

Pixel reveal reference: 60 columns x20 rows desktop, 20columns mobile; top-down order with priority row*50 + random*300 + sin(column*.3)*30. Black overlay cells opacity1 to0, stagger amount1.5s each duration .1, scrub .3. Scroll start section top at viewport center+270px; end top at viewport top. Screen-relative interpolation, reversible on scroll. At viewport<=767 use fewer rows if needed for cost, preserve effect.

Cards subtle outlined pixel overlay reference: same grid, paper #f2f2f2 opacity .2, border .5px, reveal top viewport bottom-120 to top top. Keep pointer-events:none aria-hidden and clipping inside band. Pulse reference60x15, opacity .05 white to black verticalgradient, .7 overlap. Need not create overlapping three expensive grids: one visible-time canvas may efficiently draw reveal and subtle outline/pulse regions using equivalent timing.

Flowing connectors: .t2-ai-grid-art currently static. Add looping stroke/dash animation along a handful of curved SVG/canvas paths across existing art area, matching reference animated Rive connector role. White strokes on black, low visual intensity. No Bruno-specific avatars or copy. Pause when band offscreen, document hidden, or reduced motion; static fallback in reduced motion.

Reference includes interactive knowledge graph. Adapt small connected-context graph within existing .t2-ai-grid-art area using TruScope entity labels Drawings, Issues, Tasks, Inspections, Media, RFI; subtle drifting nodes/edges, pointer response. Keep labels legible and decorative aria-hidden; never cover main text. Prefer unified SVG so graph and moving connector lines are one cohesive element. Do not create new content claims or section.

CSS: position relative band, absolute overlay with pointer-events:none, no body overflow, final layout unchanged. Reduced motion reveals content immediately and disables all continuous loops. No libraries. node --check and diff --check, commit only assigned files. Root browser QA; do not use shared browser.
