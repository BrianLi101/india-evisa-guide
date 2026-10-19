# India e-Visa Companion — MVP Product & Technical Specification

**Status:** Search and walkthrough revision (17 October 2026)
**Audience:** Codex and human contributors  
**Project:** Independent, privacy-first helper for India's official e-Visa application  
**Official portal:** https://indianvisaonline.gov.in/evisa/  

## Live metadata collection — 18 October 2026

The user explicitly authorized a synthetic official-portal research session, including the CAPTCHA and later the background declaration. This narrow research authorization supersedes the historical no-test-session restriction below; it does not authorize automation in the companion product. Record all observed metadata even for plain walkthrough rows: headings/order, required markers, HTML limits, exact choices, conditional behavior, help text and validation errors. Keep observations scoped to the tested adult U.S. ordinary-passport, 30-day tourist route and preserve unknowns. No application/session identifiers or applicant answers belong in the saved capture. The session reached initial PhotoUpload without uploading files, final submission or payment.

Use the live capture for applicant, family/employment, travel and background field structure. Purpose precedes derived Purpose/Visa Service summaries and arrival date at registration. Search and walkthrough continue sharing FieldReference. Retain the continuous, collapsed guide and omit the review screen. Detailed raw metadata is exported independently at `/reference/portal-capture.json`; later upload/payment remain sample-based. Existing reported advice retains its attribution.

## Current direction — 17 October 2026

### Home actions — 19 October 2026

Place prominent “Walk through the form” and “Go to official portal” buttons above the home search, side by side on larger screens and stacked on mobile. Search spans the same full content width as the actions and preparation cards. This supersedes the earlier search-first ordering. Keep the walkthrough card as a second way to reach the guide. Home cards have no numbers and appear in this order: Checklist, Common questions (linking to the existing FAQs), Walk through the form, Prepare passport PDF, Prepare photo, After you’re approved.

### Shared field rendering — latest user direction

Dropdown alias presentation (19 October 2026): show secondary names in parentheses in menu options and retain them in the selected display, across home and walkthrough. Include all known aliases and codes, with a wrapping selection hint for narrow screens. Keep canonical option values separate from display text so copying uses the exact official label and conditional behavior is unchanged. Do not add parentheses to choices without aliases or alter parentheses already present in official labels.

Expanded walkthrough help and search must render identical field content through the same component and canonical field records. Walkthrough rows provide the collapsed heading and section context; they must not override the field body's hints, labels, sources or controls. Keep shared control order, styling, conditional behavior and dates. Religion's OTHERS explanation belongs inside Religion in both views, with its existing public deep link preserved and no duplicate input. Source notes stay in the shared Details & source disclosure. Walkthrough-only sample notes and section navigation remain outside the shared field component.

User-provided guidance (19 October 2026): make “Reference Name in India” expandable in the walkthrough and explain that the reference can be a family member or friend in India, or the hotel where the applicant is staying. Share the same hint with search; this copy clarification does not change the recorded live field metadata or verification date.

### Common Problems FAQs — latest user direction

- Payment and trip-preparation additions (19 October 2026): cover separate payment/application IDs, PayPal within SBI ePay, phone formatting that excludes dashes, parentheses and + while allowing that spaces may be accepted, uncertain arrival dates, previous 30-day/1-year/5-year visa validity and reported retry waiting. Explain the reported approximately 12-minute restriction without promising a timeout or overriding the official SBI ePay 25-minute transaction gap. Keep the two-hour payment-status allowance distinct. Add the reported overlapping upload-button warning to the upload FAQ. Share practical phone and arrival help with walkthrough/search; add NONE/NA for no visible marks and previous-passport/entry-stamp tips to travel-history help and the checklist. Preserve evidence scope and literal input.
- India reference FAQ (19 October 2026): include “Who do I use as my reference in India?” with the user-provided family, friend or hotel guidance. Make it searchable and link it from the corresponding field. Record its review date separately from a live portal verification.
- Airport-name FAQ (19 October 2026): include a short introduction and bullet examples mapping alternate city/airport names and airport codes to exact portal labels. Use the existing sourced arrival-port mappings. Render the same examples inline and on the individual FAQ page, and include them in local search. Keep the recorded verification date.
- Present all Common Problems as simple questions with a concise, usually single-sentence answer and a Verified date beneath the answer. Remove the essay sections, evidence badges, source filter and displayed research/provenance commentary, including references to SPEC.md, initial research and “not official evidence.”
- The question list opens answers inline; existing `/problems/[slug]/` links show the same question, answer and date. Search remains local, with no query persistence or transmission.
- Preserve evidence statuses, source records and fuller background internally; this presentation change does not turn applicant reports into official rules. Use each record's existing verification date, with its recorded review date as a fallback. Firsthand confirmations from 17 October retain that date; rewriting copy is not a new live verification.

### Continuous walkthrough — latest user direction

Header revision (19 October 2026): remove the Search a field / Walk through the form mode switch and the “A little help, when you need it” heading. Use the visible title “Walk through the form”, followed by “Click on a field to get guidance on common issues or how to answer the question.” Place a prominent colored “Open official form” button below the description. Keep the existing section navigation.

The user requested a simpler structure based on their responsive form mockup: one continuous guide with section headings and a clickable step bar. This supersedes earlier pagination and always-visible input requirements. Preserve the existing search experience, field order, source boundaries and legacy links.

- Render eight guide sections in one page at `/walkthrough/`; no Previous/Next buttons, sidebar or page picker. The sticky top step bar jumps to each section, highlights the current section as the user scrolls, and remains usable in narrow windows.
- Lead Upload photograph and Upload passport with large blue and green tool callouts, respectively, including a short description, local-processing note and prominent action button. Open each preparation tool in a separate tab so the walkthrough stays available.
- Omit the entire “Verify your details” section, its repeated field records and its step link. Reviewing the completed application is up to the user on the official portal.
- Keep section headings concise and lead directly into the fields. Omit section introduction paragraphs and “About these fields” disclosures; practical assistance belongs inside the field toggles.
- Keep self-explanatory fields as plain labels without a chevron or hidden controls, including email, repeated email and town/city of birth. Curate expandable rows for useful choices, formatting guidance and common issues, such as arrival ports, Religion, National ID, employer punctuation, previous visas and uploads. These rows start closed; opening one reveals the shared guidance and optional controls. All fields remain searchable. The user never has to enter an answer to browse or navigate. Source links remain in a secondary disclosure inside expanded help. Preserve optional text and selections when collapsing or jumping; clear on reload/leaving.
- Preserve all public `#page-...` and field anchors. A field deep link focuses its plain row or opens and focuses its expandable help; section links focus the heading. Keep browser Back/Forward working. Only public IDs go into URLs; no input or tracking state is persisted.
- All available dropdowns retain the Port of Arrival visual style: searchable input, inset chevron, rounded menu and consistent highlighting. Preserve exact labels, aliases, keyboard operation and memory-only state; do not invent choices for unknown lists.
- Keep the recorded registration order, separate passport/name gate and provisional employment supplement. Later sections follow the nine official sample screens; do not claim a complete current live mapping. Preserve conditional labels, carried-over prompts, upload actions, evidence metadata and TODO coverage gaps.
- Use the mockup as structural inspiration with existing colors. Do not introduce the mockup's Save draft or Continue actions; the guide remains optional help beside the official portal.
- Test collapsed defaults, complete field coverage, section navigation and scroll highlighting, history/deep links, keyboard operation, retained text/selection, reload clearing, no runtime transmission/storage, and responsive accessibility.

### Search behavior retained from the earlier revision

This revision supersedes the worksheet/draft requirements in the original brief below. The product is a searchable field guide alongside the official application, with optional local file tools. Individual fields accept optional text for local feedback; no application-wide draft, transfer checklist or worksheet navigation is exposed. `/worksheet/` is a compatibility page linking old field anchors to the guide, with explicit export/delete actions for existing encrypted backups only. Existing ciphertext is never deleted automatically.

- Home leads with local search. Selecting a result shows only that field directly below the search, with its conditional controls and short hints. Editing the search replaces the selected field; no browse-all or section directory is exposed. Older guide links redirect to the selected field on home. Public field IDs may appear in URL fragments; search terms and answers never do. Preparation cards hide while a field is selected.
- Field guides explain the question, show observed choices verbatim, and distinguish directly observed labels/limits from sample guidance and unknown details. Never use an invented option list to fill a verification gap.
- Port of Arrival uses an in-place searchable dropdown backed by the shared port registry. Match alternate airport names and codes, show exact observed portal labels, preserve distinct airports/seaports in the same city, and copy only a selected portal label. The main home search also indexes those aliases.
- Scope each observation to its actual field and context. An HTML maxlength is not proof of server validation; a gate limit must not be applied to a later passport field.
- Compact field previews should show one short hint, with research detail folded under Details & source. All text fields accept input with concise local feedback. Examples are placeholders, never prefilled answers. Show observed character counts/limits, sample limits with their scope, email/date format checks and employer punctuation warnings. Only display known limits and formatting rules; omit verification-status messages from the field UI. Unknown restrictions remain unset in the underlying records. Source provenance stays available under Details & source. Every text field has Copy. Formatting suggestions show the resulting text before Format & copy, with Copy original and Undo; never silently change or truncate input. Company cleanup removes punctuation/symbols, expands & to AND and collapses whitespace, while preserving letters and numbers in all scripts. This is user-requested formatting, not a verified character whitelist. No company length limit is established. Clipboard writes occur only on explicit clicks; failures leave input intact and provide manual-copy instructions. Selecting Religion OTHERS reveals an editable explanation. All available option lists use searchable controls matching Port of Arrival. Sample state is memory-only, never persisted or transmitted. Religion and education may show sourced REPORTED option lists, clearly distinguished from LIVE_VERIFIED observations.
- The user verified the reported issues in an actual applicant session, including Religion OTHERS revealing an explanation field and use of NA. A blocked agent inspection does not negate that firsthand evidence. Preserve the separate source of the full option-list transcription internally; do not describe the user's observed behavior as unchecked or add verification-status boilerplate to the UI.
- Search terms remain in memory, never URLs or storage. Keep privacy/no-upload tests for search and both local converters, plus mobile accessibility checks.
- Field cards use “Verified At” for directly observed portal fields and “Reviewed” for source-based or user-confirmed guidance. Keep detailed evidence scope in the research records, source links in the disclosure, and short practical explanations beside the controls. Do not render raw research descriptions or verification caveats as field help. Explain useful distinctions such as city aliases, conditional explanation fields, and the reason for formatting suggestions.
- User clarification on 17 October 2026: ETA means Electronic Travel Authorization, and its number is the previous visa number for an e-Visa. New Delhi can be entered as a previous Indian e-Visa’s place of issue. Gurgaon/Gurugram are alternate place names; explain this beside address fields. U.S. applicants without a national ID can enter NA. Preserve user attribution in research records and use direct instructions in the UI. These confirmations supersede the corresponding open questions in the historical brief below.
- Preserve the original brief below as historical context; its worksheet implementation phases and acceptance tests are retired.
- Religion uses a searchable combobox matching the arrival selector. Agnostic, atheist, non-religious and not religious appear together as search aliases beneath OTHERS, not as new portal options. Selecting OTHERS opens the editable explanation; searches and selections remain memory-only.

## 1. Product goal

Build a polished, trustworthy, free-to-use companion website that helps a traveler prepare and complete India's official e-Visa application. The government website remains the only place to submit an application, complete CAPTCHA, make payment, and receive a visa. This is NOT an unofficial visa application service, a government site, a proxy, an autofill extension, or a visa submission service.

Visitors should be able to: (a) look up a confusing question immediately; (b) prepare a compliant passport PDF and applicant photograph entirely in-browser; (c) work through a page-by-page, field-by-field guided worksheet matching the official form; (d) optionally save their worksheet as a passphrase-encrypted local draft; (e) copy answers manually into the official government form; and (f) resolve city/airport/region name discrepancies.

Prioritize an excellent UX and security, not unnecessary features. Ship a functioning end-to-end MVP, not a collection of placeholder cards or a speculative roadmap.

## 2. Product principles

1. **Private by design:** Applicant-provided data, photos, PDFs, and draft answers NEVER leave the user's device. No server endpoints to receive them. No analytics, behavioral tracking, crash-report SDKs, remote fonts, third-party scripts, ads, or embedded chat assistants on application/tool pages. Avoid application-data logging entirely. Ordinary hosting/network request logs for page assets may still exist; don't falsely claim no server metadata exists.
2. **Use the official form, not a substitute:** Clear independent-site disclaimer and a visible link to the official portal. No account/login, remote storage, payment collection, CAPTCHA solving, or automated submission.
3. **Evidence-aware guidance:** Differentiate official documented requirements, directly verified live-form behavior, firsthand user-reported behavior and workarounds, and unverified questions. Show source, date of verification, and caveats. Never fabricate dropdown labels, official rules, visa advice, or confirmations.
4. **Meet people where they are:** Search to a specific field/problem without requiring a full worksheet. Let people start at any screen and resume.
5. **Match the official screen-by-screen order:** Worksheet groups and labels should mirror the live portal as closely as possible, while presenting clear explanations and inline warnings. Do not invent exact current field order; gather or verify it first. Use documented placeholders flagged as such where live verification is impossible.
6. **Legal/identity accuracy:** Do not silently sanitize or rewrite passport names, employer identities, addresses, or legal details. Offer explicit, transparent formatting suggestions, allowing users to confirm accuracy.
7. **Accessible and responsive:** Mobile-first, keyboard-friendly, screen-reader labels, accessible validation, desktop layout suitable for two side-by-side browser windows.

## 3. Four must-have features

### A. Passport PDF preparation

- Upload locally (drag/drop + file picker): JPEG, PNG, WebP, HEIC/HEIF when locally decodable, existing PDF where feasible; clearly explain unsupported formats and browser differences.
- Show local preview; allow rotation, cropping, optional perspective correction if reasonable, and brightness/contrast adjustments if feasible.
- Produce a PDF that preserves a readable passport biodata page, preferably 10–300 KB **subject to current official verification**. Auto-tune JPEG resolution/quality within the PDF and display output size.
- DO NOT produce illegibly compressed text or MRZ merely to hit a size target. Show a failure/warning with actionable next steps if legible output cannot fit.
- Download resulting PDF without a network upload. Clear/revoke object URLs and image buffers when appropriate. Avoid preserving identifying EXIF where possible.

### B. Applicant photograph preparation

- Accept common formats (JPEG, PNG, WebP, HEIC/HEIF if locally decodable); local conversion to JPEG.
- Interactive square crop with zoom, pan, rotate, composition guides, mobile touch support, output preview.
- Validate file type, dimensions, and file size against current official requirements; provisional guidance from published documents is JPEG, square, approximately 10 KB–1 MB (reverify; do not hardcode as unquestioned).
- Explain visual photo requirements (full face, light/plain background, etc.) with source. Provide manual checks; don't imply an automatic crop proves official acceptance.
- Generate downloadable local JPEG. Strip metadata where practical. Give clear warnings when processing is unsupported.

### C. Common mistakes and troubleshooting guide

- Fast searchable library of specific questions and failures, grouped by screen and category; short answers with optional details.
- Each issue: `id`, title, relevant screen/field IDs, symptoms, explanation, safest workaround, evidence type, source URLs, last-verified date, caveats.
- Seed articles from section 6 below; label reported vs official. Support anchor URLs to individual issues for search engines and AI agents.
- Keep content in version-controlled local Markdown/JSON, not a backend CMS for MVP.

### D. Guided line-by-line application worksheet

- Replicate the *structure and field semantics* of the current e-Visa form in its screen order. Focus initial coverage on adult tourist e-Visa and clearly label variations requiring future research.
- Each field shows: official label, input, help/explanation, when required, official format expectations (if verified), known issues, example, and one-click copy of the user's literal answer.
- Conditional fields should appear/require values based on answers. Important: e.g. `Religion = Other` requires explanation; detect empty explanation.
- Inline validation before moving to next screen; no resetting or losing inputs; autosave encrypted drafts only when explicitly enabled.
- Dropdowns use the verified government options where known; unverified options must not be presented as guaranteed. Show aliases and user-friendly explanations.
- Field-by-field copy and a page-level "ready to transfer" checklist; no automated interaction with official website.
- "Open official website" link and optional instructions explaining exactly which button to click when a known issue is present, preferably using appropriately redacted screenshots that are verified against live site.
- Two modes: **Quick guide** (no personal data) and **Worksheet** (can enter personal data, optionally save locally).

## 4. Geographic / name mapping feature (integrated into guide and worksheet)

- Search by current city, former/alternate spelling, airport common name, IATA code, and relevant state/district. Return clearly separated: (1) common name, (2) alternate names, (3) applicable official published name, (4) **verified live form dropdown label if actually observed**, (5) source and verification date.
- Candidate alias seeds to research: Trivandrum / Thiruvananthapuram (TRV); Bangalore / Bengaluru (BLR); Cochin / Kochi (COK); Calicut / Kozhikode (CCJ); Gurgaon / Gurugram (district/address context).
- Never conflate "authorized e-Visa port of entry" with "currently selectable option in a particular form dropdown". These may be inconsistent.
- Help with Indian addresses: explain address lines, city/town, state, district, PIN/postal code; use government-backed administrative mappings only when verified.
- Search and mappings work offline/client-side using bundled static data. Do not geocode a user's private address using a third-party API.

## 5. Optional encrypted local drafts

- Never store applicant answers as plaintext in cookies, localStorage, IndexedDB, URLs, analytics, logs, or server storage.
- Use browser IndexedDB for **encrypted ciphertext only**. Encrypt with Web Crypto API (AES-GCM with unique random nonce per encryption) and a user passphrase-derived key using an appropriately tuned, reviewed password KDF (e.g., Argon2id via audited maintained library, or carefully configured PBKDF2 if no suitable safe dependency). Persist per-draft salt/KDF parameters/nonces/ciphertext, not raw password/key. Keep unlocked key and plaintext only in volatile memory during a session; explicit Lock clears unlocked state.
- Opt-in only: allow a session-only draft for visitors who do not want storage. Enable autosave after an encrypted draft is created/unlocked. Show saved / saving / error state and test abrupt tab closure. Support export/import of encrypted draft as local file and a clear "Delete local data" action.
- Warn that forgetting the passphrase means no recovery; also that browser storage may be cleared and ordinary browser software/extensions/local malware may still pose risks, especially while unlocked. Don't claim impossible guarantees like "no other app can intercept anything".
- Default to not persisting the actual uploaded passport photo or passport PDF; downloaded files are managed by the user. Never log clipboard contents. Clearly explain the OS clipboard exposure after copying sensitive fields.
- Simple non-sensitive navigation progress may live in memory; avoid persistent identifiers or tracking cookies.

## 6. Known pain points from initial user research

Behavior supplied by the user reflects firsthand verification. Preserve it as REPORTED evidence with clear attribution; do not describe it as hypothetical or require independent reproduction to acknowledge it. Keep questions the user raised distinct from observations they confirmed. Official requirements and independently observed portal details retain their separate evidence labels. Use generic examples rather than personal address or itinerary details.

1. **Silent reset on punctuation:** Entering periods or commas in an employer/company name reportedly causes "Save and Next" to clear inputs without explaining the error. Flag punctuation as a reported risk; do NOT silently alter answers. Provide clear copyable suggested formatting only with disclosure.
2. **Other religion requires additional text:** Selecting "Other" without filling the adjacent text box reportedly causes the government form to reset. Reported workaround: `NA` if truly applicable; label as reported, not official universal guidance.
3. **Field order / dependent radio reset:** Choosing some radio/multiple-choice selections before completing fields above can cause the choice to clear when the page rerenders. Preserve answers on our worksheet; advise checking selections again in the government form.
4. **ETA Number vs Application ID:** "Last Indian Visa No/Currently valid Indian Visa No." is confusing for previous e-Visa holders; need careful, sourced explanation of ETA number vs previous application ID. Do not rely solely on unverified anecdotes for official claims.
5. **Previous e-Visa place of issue:** Applicants ask how to determine the issuing location versus arrival airport. Verify official help guidance; do not invent a location.
6. **Airport names and dropdowns:** Trivandrum/Thiruvananthapuram and other aliases can differ across site pages; published authorized ports do not necessarily match live form options.
7. **Address mappings:** Gurugram/Gurgaon, district selection, state and PIN code placement can be confusing; explain fields without copying any real person's address into demo content.
8. **National identity number vs citizenship:** Explain what the field means, and whether unavailable values are allowed, based on official source, not inference.
9. **File upload pitfalls:** Some government screens may require a separate "Upload" action after choosing a file; verify live steps and present precise annotated walkthroughs.
10. **Visa photographs/passport formats:** Users need reliable format and size transformations, not only descriptions.
11. **Payment and retry issues:** If documenting these, use current official payment help, warnings about checking status before retrying, and never handle payment information directly.

## 7. Information architecture / routes

Suggested routes; adapt to your framework:

- `/` — simple value proposition, four tools, clear independent disclaimer, start worksheet / search problem actions.
- `/guide` and `/guide/[page-or-section]` — SEO-friendly step-by-step explanations; link directly to fields.
- `/problems` and `/problems/[slug]` — searchable issues with citations and confidence label.
- `/worksheet` — private client-side multi-step form; individual questions deep-linked via stable ids if possible (do not place answers in URL).
- `/tools/passport-pdf` — upload, preview, adjust, download.
- `/tools/photo-jpeg` — upload, crop, convert, download.
- `/reference/airports` — alias lookup and source notes.
- `/privacy` — concise explanation of local processing/storage, clipboard risks, host logs, and limitations.
- `/robots.txt`, `/sitemap.xml` and static public structured JSON / Markdown for AI agents, e.g. `/reference/fields.json`, `/reference/known-issues.json`, `/reference/airports.json` and `/agents/index.md`.

Clearly distinguish an official government website link from any on-site button. Make search and quick field explanations available without entering a single personal answer.

## 8. Data model / content shape

Define typed, versioned content schemas (e.g. Zod or TS):

- `VisaSection`: id, title, order, officialPageTitle?, description, verifiedAt?, sourceUrls[]
- `VisaField`: id, sectionId, order, officialLabel, type, description, placeholder, options? (each includes official status), requiredWhen? condition expression, validationRules[], knownIssueIds[], helpSources[], verifiedAt?
- `KnownIssue`: id, title, sectionIds, fieldIds, symptoms, reason?, workaround, evidenceStatus (`OFFICIAL`, `LIVE_VERIFIED`, `REPORTED`, `NEEDS_VERIFICATION`), officialUrls[], otherSources[], lastVerifiedAt?, lastReviewedAt
- `LocationAlias`: id, canonicalName, aliases[], airportCode?, locationKind, publishedName?, publishedSource?, liveDropdownLabels? (with form field/context, observedAt, source), confidence
- `EncryptedDraft`: version, id, createdAt, updatedAt, cryptoAlgorithm, kdfAlgorithm, kdfParameters, salt, nonce, ciphertext; never plaintext in storage

Include a deterministic conditional-field rule engine and tests. Treat live-form schema as incomplete until verified; don't fabricate options as if official.

## 9. Technical choices

Preferred starting stack: **Next.js App Router + TypeScript + Tailwind**, configured as **static export** (`output: 'export'`), with client components for document transforms, private drafts, and interactive worksheet. No API routes/server actions in deployed build. SEO-readable pages for public guides and issue articles.

You may choose an equivalently suitable static framework if necessary, but document why. Prefer maintained, license-compatible libraries for HEIC decoding, image cropping, `pdf-lib` or equivalent for client-side PDFs, IndexedDB wrapper, Web Crypto and unit/e2e testing. No dependence on image-conversion cloud APIs. Don't use React image components that require an image-optimization server for static export.

Security hardening: no remote third-party runtime code; self-host local assets/fonts; CSP as strict as practical for static Next builds (production `connect-src 'none'`, unless truly essential browser functionality requires a narrowly scoped exception; document any exception), prevent form data in error logging and URL params, don't enable service worker caching of sensitive content without explicit review. Disable hosting analytics and document CDN edge logs limitation. Sanitize rendered Markdown and ensure safe escaping. Use strict TypeScript, linting, tests, and responsive/accessibility checks.

## 10. Implementation sequence

Work in functioning vertical slices. Keep application runnable and incrementally tested:

1. **Foundation/design:** Bootstrap static site, routes, style system, navigation, search, independent disclaimer and privacy page; add schema scaffolding and sample guide records. Implement substantial UI, not empty placeholder pages.
2. **Guide / content engine:** Structured field records, conditional rules, issue detail pages, evidence labels, searchable reference; seed the observed issues and explicitly mark what needs verification.
3. **Worksheet:** Guided steps, contextual validation, copying, conditional fields, navigation and progress. Build against checked seed schema; don't pretend the live form is completely mapped.
4. **Converters:** Local passport PDF and applicant-photo JPEG flows, quality/dimension/size constraints, graceful HEIC support and user-facing warnings.
5. **Encrypted draft:** Opt-in IndexedDB encryption, passphrase setup/unlock, autosave, export/import/delete, lock, recovery from refresh, cryptographic tamper/wrong-passphrase behavior.
6. **Verification / polish:** Automated privacy checks, security-focused review, end-to-end tests, mobile UX, copy accessibility, build production export, README with commands and remaining sources to verify.

If scope is too large for a single implementation turn, build a demonstrably usable vertical slice and maintain a `TODO.md` clearly listing incomplete features and verification blockers. Do not quietly mark features complete when they are placeholders.

## 11. Acceptance criteria / tests

- User can open and read public issue/field pages without creating a draft or sending sensitive data.
- User can navigate worksheet page-to-page, reveal required conditional inputs, see validation warnings and copy individual answers.
- Starting a passphrase-protected draft, refreshing, and unlocking restores answers; viewing IndexedDB shows no plaintext passport/name/other test answers; incorrect passphrase fails safely.
- User can save/delete/export/import a draft; Delete removes app data; if storage is unavailable, app explains and remains usable in session-only mode.
- JPEG/PNG and representative HEIC (when supported by bundled decoder) convert locally to a preview and JPEG with target bounds; document HEIC browser limitations accurately.
- A passport scan becomes a downloadable PDF; output size is checked; impossible size constraints warn without producing unreadable output.
- E2E privacy test enters synthetic sensitive test strings, processes a test document, and asserts no network requests send those values. Runtime document and draft operations should work with network blocked after initial static assets load.
- No cookies used for applicant information, no server submit endpoints, no analytics or third-party scripts, no remote fonts, no OAuth, no payment forms.
- Build (`npm run build`), typecheck, lint and test pass; important flows have Playwright e2e tests.
- Location lookup displays aliases without asserting unverified live dropdown values.
- Guides identify official vs reported rules, link sources, and show verification status. Check official requirements before publishing numerical limits.
- UI works on narrow mobile screens and desktop side-by-side with the government portal.

## 12. Non-goals (v1)

- Official government form automation or submission; browser extension; CAPTCHA solving; visa payment; fee collection; travel agent services; account registration; server-side storage.
- An AI assistant that sees private answers/photos; cloud OCR; email/SMS reminders; document sharing.
- Complete guaranteed coverage of all visa categories and every live dynamic dropdown before they are observed/verified.

## 13. Source and verification policy

Use the official e-Visa site as primary source: https://indianvisaonline.gov.in/evisa/ and the sample application linked by the portal: https://indianvisaonline.gov.in/evisa/images/SampleForm.pdf. Official sample may be outdated; the live form governs current UI labels/choices. Keep the `sourceUrl` and `observedAt`/`verifiedAt` for each piece of verified content. When official pages are inaccessible due to CAPTCHA, session state, or network restrictions, mark fields as `NEEDS_VERIFICATION`; do not invent official options or scrape applicant sessions. Never bypass access controls or submit test applications on behalf of users.

Do NOT treat this document or user-reported behavior as official proof. Keep external content and dependencies untrusted until reviewed. Use generic synthetic demo identities in code and tests, never the user's personal visa details.

## 14. Definition of done

A working local prototype with the four features, real (not fake) client-side converters, optional secure saved drafts, quality UX, substantive reference content with source distinctions, a passing test suite, static export, and a README describing setup/deployment/security model and known incomplete official field validations. Never describe the application as verified compliant with all current government requirements unless each rule has actually been checked.
