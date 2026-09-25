# Find a Cruise — v3

Independent presentation edition. Start with index.html or run `node server.cjs` and open http://127.0.0.1:4183. The previous edition remains unchanged in deliverable-v2.1 and runs on port 4181.

Navigation: Case overview → Scope & value → User stories → Interactive demo → Delivery plan → Q&As.

V3 implements all five approved improvements: descriptive section names and consistent page headings; sequential page buttons; persistent compact story selection and section links with a mobile selector; reduced story spacing and repeated explanatory text; direct Delivery module access; consolidated prototype guidance. Story selection and prototype state use separate v3 session keys. Functional behavior and the 26 acceptance criteria are preserved.

Eleven public HTML files include five standalone story fallbacks. The site can be opened locally without a server. JavaScript enables in-page story selection, Delivery tabs and the prototype. Without JavaScript, the story links open standalone pages and all Delivery modules remain visible. The prototype requires JavaScript.

Regenerate: `node build.cjs`. Build and browser checks require Playwright and Microsoft Edge; set PLAYWRIGHT_PATH for another installed Playwright location. Frozen previous-edition HTML in source/baseline is build input, not a runtime dependency on the backup directory.

Validate: `node --test tests/model.test.cjs`, `node tests/prototype-regression.cjs`, `node tests/review.cjs`, `node tests/links.cjs`. The browser tests use port 4183. Review tests additionally compare all backup files to the pre-change hashes when the sibling backup directory is present.

Package: `node package.cjs`. No remote Google Doc was edited. This is a presentation revision; the previously supplied manual content amendments remain applicable.
