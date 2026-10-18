# India e-Visa Companion

An independent static field guide for India’s official e-Visa form. Search a confusing field and view only that field beneath the home search, look up airport names, or prepare a passport PDF/photo locally. Old guide links open the matching field on home. Enter application answers and make payments only on the government portal.

## Run locally

Use Node.js 22.13+ (Node 24 recommended) and npm.

```sh
npm ci
npm run build
npm run start
```

Open <http://127.0.0.1:4173/>. The preview binds only to loopback. `npm run dev` serves a development build on port 3000; use the production preview to test the actual privacy policy. The development server has its own hot-reload connections.

```sh
npm run build
npm run typecheck
npm run lint
npm test
npx playwright install chromium
npm run test:e2e
```

Run build before typecheck/e2e; do not run build and standalone typecheck concurrently because Next regenerates `.next/types`. Playwright starts the static preview automatically if port 4173 is free. All checked-in fixtures and automated-test answers are synthetic. Tests do not visit or submit anything to the government portal.

## Current experience

- Search-first home and section guides with stable field links, multiword search, aliases and expandable results. Search runs entirely in memory; no query goes into URLs or storage.
- Exact observed choice lists for nationality (179 entries, including the portal’s literal TEST entry), passport type (5) and arrival port (86). These are interface observations, not eligibility lists.
- Field-specific evidence for registration/gate labels, date format and HTML limits: gate passport 14, gate name 100, email/repeated email 50, CAPTCHA 6. Server validation and conditional nationality behavior are untested.
- Religion, education, marital status and nationality-acquisition choice transcriptions retain their walkthrough source links. The user verified the reported issues in an applicant session, including Religion’s OTHERS explanation and use of NA. Detailed source scope lives in `reference/SOURCES.md` and `TODO.md`; unknown choices/limits are not invented.
- Each field has a compact “Verified At” footer using its recorded observation or source-review date. Short explanations cover useful distinctions such as city/airport aliases, conditional fields and employer punctuation. Source links stay in the disclosure; raw research caveats are not rendered as field help.
- Compact field previews show one-line hints; source notes stay under Details & source. Available lists are real selectable dropdowns. Religion → OTHERS reveals an editable “If Others, Please specify” field with an NA-if-applicable hint. Sample state stays in memory, survives toggling in the current page, and clears on reload/navigation. Text fields accept optional input and display concise local feedback. No saved worksheet or submission flow. `/worksheet/` preserves old field destinations and offers explicit encrypted backup export/delete for older saved drafts. It does not unlock, import, edit or create drafts, and never deletes existing data automatically. Keep the original passphrase with a backup.
- Optional preparation checklist, common-problem articles, after-approval guidance, and airport aliases.
- Local passport PDF/photo JPEG conversion, crop/rotate/tone controls, HEIC software decoding, real downloads and explicit file-size/unsupported-format errors. Existing compliant single-page PDFs are downloaded unchanged.

## Privacy and implementation

Next.js App Router, React, strict TypeScript and static export. The local preview serves GET/HEAD files only. There are no application APIs, server actions, analytics, remote fonts, accounts or submission/payment flows.

Queries and selected files stay in volatile browser memory. Optional file tools never upload documents. HEIC may download bundled same-origin decoder code; after relevant static assets load, processing works with networking blocked. No service worker means fresh-page offline navigation is not supported.

Production CSP uses hashed scripts, `connect-src 'none'`, `form-action 'none'`, and `worker-src blob:` for the bundled decoder. Hosting request logs may contain ordinary network metadata. Disable host analytics and set `SITE_URL` before deployment. Downloaded files are managed by the user; local processing cannot protect against a compromised device or extension.

Legacy drafts use PBKDF2-SHA-256 (600,000 iterations) and AES-256-GCM. The existing crypto/schema code and unit tests remain for backup compatibility; no new drafts can be created in the UI. Export preserves ciphertext exactly. Deletion checks the previous nonce to avoid deleting a draft changed by another tab.

## Sources and validation

Build generates static public JSON references. `portalObservations` contains directly observed control facts, with a shared date/source and per-field context. Older internal field seeds contain sample/provisional metadata and must not be treated as a complete live form schema. The UI and public JSON distinguish observed lists from separately sourced reported lists; legacy preparation options/validation rules are excluded. The National ID example reads “U.S. applicant without a national ID? Enter NA.” The official sample supports NA when not applicable; the U.S. scenario is a reported walkthrough example, not a blanket exemption.

Run the commands above for build, typecheck, lint, unit tests and Chromium end-to-end tests. `TESTING.md` records the current verification pass and historical checks; `TODO.md` lists coverage limits. No government application was created, submitted or paid for. No CAPTCHA was solved. This project has not been deployed.

Text fields accept optional in-memory input with character counts, known limits, email/date checks and employer punctuation feedback. Formatting suggestions are explicit and undoable; unknown portal restrictions are not treated as validation rules. Switching fields clears the input.

Every text field supports Copy. If a formatting preview is available, Format & copy applies it after a successful clipboard write; Copy original preserves the literal text. Undo restores the field, not the clipboard. Company cleanup removes punctuation/symbols, expands & to AND and tidies spaces; it preserves letters/numbers and never truncates to an unverified length.

Port of Arrival has an inline searchable dropdown: alternate airport names and IATA codes resolve to the exact observed portal label. Distinct ports remain separate (including the two Goa airports and Goa seaport). A selected label can be copied without leaving the home field view. Home search indexes the same mapped names and codes.

Field UI shows character counts and established limits only; verification-status labels are omitted. Unset restrictions remain unset in the data, and source provenance stays under Details & source. Airport results only include records with observed portal entries.

Field footers distinguish directly observed portal fields (Verified At) from sourced or user-confirmed guidance (Reviewed). Previous e-Visa hints explain the ETA number and New Delhi issuance location. City/region/reference-address hints explain alternate place names such as Gurgaon/Gurugram; home search indexes these explanations. Remaining research gaps are tracked in TODO.md.

Religion uses a searchable dropdown with keyboard navigation. Agnostic, atheist, non-religious and not religious all match the single OTHERS option and reveal its explanation field when selected. The original 11 portal labels are preserved; aliases do not create additional options or fill an answer automatically.
