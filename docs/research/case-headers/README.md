# Case headers — November 2026

Source: https://www.figma.com/design/4I7FD5Q1zXcuQseTmtKVqY/Untitled?node-id=0-1

Implemented in the production static HTML/Vite site, using shared, header-scoped CSS. Existing navigation and all content after the former introduction container are preserved.

| Case | Figma header | Image | Text width |
| --- | --- | --- | --- |
| Copilot | 4:60 | 0004e.png | 525px |
| TidalHaus | 4:185 | 282bc.png | 521px |
| Alana Platform | 4:221 | 50eb1.png | 559px |
| Alana Design System | 4:257 | cb2e9.png | 478px |
| UI Forge | Same layout, existing content approved by owner | ../uif_00.avif | 559px |

At the 1728px reference width, the layout starts at (141,112), spans 1446px, and has a 721×607px image slot at (866,112). Copilot text is 589px high at y121; TidalHaus and Alana Platform are 573px high at y129. Image layers preserve the Figma crop offsets. Local SVG assets provide the original dividers and button icon. Inter 400/500/600 is locally hosted with its OFL license.

Owner decisions: use Figma's TidalHaus dates and market (2024-2025; USA, UAEM); link Copilot to the supplied YouTube launch video; link Alana Platform and TidalHaus to their supplied Figma prototypes; omit Alana Design System's button; apply this layout to UI Forge using its existing title, introduction, metadata, and image.

Responsive adaptation: stack text and image at 1024px, constrain text to its reference width, and use 24px side gutters. Below 480px, use 16px gutters, 32px titles, 18/26px body text, and wrapping metadata values. Buttons open new tabs with noopener/noreferrer, screen-reader context, and visible keyboard focus.

Verification: inspected all five desktop and 390px renders; measured all five at 1728, 1024, 390, and 320px. Header images load successfully, desktop geometry matches the reference, and header content does not overflow. Confirmed one H1 per page and byte-identical case content after each header. Production build and whitespace validation pass.

Existing observations outside this change: Alana Design System's body impact card overflows slightly at 320px. The Figma metadata label color (#636363) has low contrast on #1c1c1c and is preserved to match the supplied design. The development clean-URL middleware also rewrites Vite's HMR endpoint; QA uses explicit navigation and production builds.
