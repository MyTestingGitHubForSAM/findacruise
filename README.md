# Find a Cruise — v4

Independent visual redesign of v3. Open index.html or run `node server.cjs` and visit http://127.0.0.1:4184. V3 remains unchanged on port 4183.

Visual direction: light surfaces, navy typography, blue actions and restrained turquoise accents. Shared geometry, spacing, focus and selected states across eleven pages. Overview and Q&As feature an original local ocean illustration. Stories use a persistent desktop sidebar and a compact mobile selector. No copied third-party CSS, external asset service or downloaded commercial image is required.

Content and functional behavior are preserved from v3. `source/baseline` contains the frozen v3 HTML used by the build; tests/content.cjs compares main content and every source-marked unit, excluding decorative elements and the reformatted story selector. Prototype and selected-story storage use separate v4 keys.

Build: `node build.cjs` (Playwright + Microsoft Edge required; PLAYWRIGHT_PATH can specify Playwright).
Run: `node server.cjs`.
Tests: `node --test tests/model.test.cjs`, `node tests/prototype-regression.cjs`, `node tests/review.cjs`, `node tests/content.cjs`, `node tests/usability.cjs`.
Package: `node package.cjs`.

All runtime assets are local. Without JavaScript, the story selector links open standalone pages and all Delivery modules remain available; the functional prototype requires JavaScript. Source references are original and unchanged. The drawing in assets/ocean.svg is decorative and was authored for this case study.
