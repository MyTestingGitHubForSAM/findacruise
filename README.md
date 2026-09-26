# Find a Cruise — v6

Open index.html directly, or run node server.cjs and visit http://127.0.0.1:4186/.

V6 extends the approved photographic cover into a consistent deep-navy, white and turquoise presentation. The cover retains its original styling, with the repeated signature removed and Q&A label corrected. V5 remains in its separate directory.

Requested refinements: outline actor tile with user icon, target icon for Product goal, removal of redundant Open badges, Illustrative Reference label, Q&A naming throughout. No other content was rewritten.

The overview and Q&A use a new original overhead island/cruise image. The demo uses a matching panoramic overhead asset. These are AI-generated fictional vessels, not official Royal Caribbean photographs. Manrope is bundled locally with its license in assets/Manrope-LICENSE.txt. Runtime is fully local.

Build: node build.cjs (baseline → upgrade.cjs → theme.cjs).
Package: node package.cjs.
Theme: dark.css. Entry: index.html. Case overview: overview.html.

Reference alignment: the consumer search component follows the supplied white/blue reference styling, while the surrounding presentation remains dark. About this prototype has responsive interior padding. Demo dates and behavior are unchanged.

Content addition: US2 AC5, US3 AC6 and US4 AC9 document independent reset to the unrestricted default as an author assumption pending Product Owner / UX confirmation. Each has a linked blocking question with rationale. The existing non-blocking questions about the reset mechanism remain separate from the blocking decision about whether independent reset is required. UI styles and prototype interactions were not changed.

Functional clarification: US4 AC10–AC12 and US5 AC6 formalize existing demo behavior. ASM-01–ASM-07 distinguish author assumptions from source requirements. Blocking scope, reset transitions and the US5 integration-evidence boundary are explicit. No UI stylesheet or runtime interaction logic changed.
