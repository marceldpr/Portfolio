# Text motion completion

Ownership: assets/js/test-2-text-motion.js and assets/css/test-2-text-motion.css only. Export initTextMotion() returning nothing; module self-manages observers, scroll rAF, resize, reduced motion. Root imports/calls it and removes old word observer.

Reference public WordRollText: 800ms cubic-bezier(.215,.61,.355,1), 70ms stagger per word per visual line, translateY(110%) to 0; purple #6e15b7 through 35%, then inherited ink. Trigger IO threshold .01, bottom root margin -10%. Once per page visit. Match on intro h1 and all ordinary h2/h3; preserve semantic words/br/strong, aria label and mobile spaces. Remove t2-reveal from headings only to avoid double animation. Do not animate card headings hidden in sticky cards.

Reference ShimmerText: paragraph line-by-line sweep purple #6e15b7, gray #a1a1a1, white, then final inherited ink. Delay 450ms, speed based on 23 characters/sec; lines simultaneously (lineStagger 0). Trigger .1 intersection and bottom -10%. Apply to intro paragraphs, context paragraphs, before copy, foundation intro, experience intro, markup intro, AI execution intro, impact summary and prototype copy. Preserve inline strong and wrapping; prefer span words grouped by actual visual line, rebuild on resize without replaying already-read text. No layout shifts or permanent unreadable text. Reduced motion final visible text.

Reference process headline WordsShift: scroll scrub top bottom to top top; text chunks progressively remove exaggerated horizontal spacing and settle. Apply #t2-foundations-title as scroll-driven alternative to WordRoll; responsive no horizontal page overflow.

Reference results heading: letter-027 duplicate rolling chars, random 50ms stagger, scroll scrub .5, top bottom to top top. Original letter translates down 100% while copy above replaces it. Opacity 0 to 1 with power1.inOut. Apply #t2-impact-title. Preserve words so line breaking works; no animation mobile <=767 or reduced motion.

Keep same final appearance/layout/content. No new dependencies. Use WAAPI for dynamic values, CSS classes, avoid inline style attributes. Handle live reduced motion changes and resize. Never resize shared browser page; root will QA. Verify node --check module and git diff --check, commit assigned files only.
