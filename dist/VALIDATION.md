# V4 validation

- 12 model tests passed.
- 17 prototype browser regression scenarios passed.
- Six grouped review checks passed: all five stories and anchors, selection retention and browser history, Delivery tabs, 320px/390px layouts, past-month guard and v3 backup integrity.
- All 11 pages retained their v3 main text, excluding decorative elements and reformatted story navigation. All 406 source-marked text units were unchanged; 192 links/resources and unique IDs checked.
- Usability checks passed: switching from deep content to the newly selected story summary, keyboard navigation with visible focus, 600px calendar containment, keyboard month selection and Escape, reduced-motion styling.
- Desktop and mobile screenshots reviewed. Previous v3 file hashes matched the pre-change snapshot.

Single-browser checks use Microsoft Edge/Chromium. No formal UAT, exhaustive accessibility certification or production integration is claimed. Main content and prototype behavior remain the v3 baseline. Presentation uses original vector artwork and local assets.

Fullscreen review: the demo can expand with its Home Page context and the existing Reset control. Native fullscreen is used when available; a viewport-filling modal is the fallback. Exit button and Escape restore the original location and focus without clearing selections. tests/fullscreen.cjs passed native/fallback, preservation, date selection, reset, repeated entry, Escape/focus restoration and mobile port selection. Footer/header are hidden while expanded.
