# Codex repository instructions — India e-Visa Companion

- This is an independent, privacy-first e-Visa companion; the official portal alone submits applications and processes payments. Read `SPEC.md` for product requirements and the source/verification policy.
- Your primary task is to **implement and test a functioning static website**, not to return a design-only plan. Work in testable vertical slices; favor practical, working UX over architectural overengineering.
- **Never upload or transmit any applicant answer, document, photo, PDF, or draft.** Do not create server-side APIs for personal data, login, third-party tracking, remote image conversion, or government-site submission. Use static assets and local browser processing only.
- Never store unencrypted sensitive answers in cookies, localStorage, IndexedDB, or URL parameters. Use passphrase-derived authenticated encryption for opt-in persistent drafts and hold plaintext only in memory while unlocked.
- Distinguish source evidence: OFFICIAL, LIVE_VERIFIED, REPORTED, NEEDS_VERIFICATION. Do not assert unverified airport dropdown entries or workaround rules as fact. Preserve applicant input literally by default; don't silently transform names or addresses.
- Source codes, test assets, and screenshots must use synthetic data. Do not put sensitive data into commits, console logs, bug reports, or test snapshots.
- Implement real file conversion in-browser. Explicitly surface unsupported HEIC formats or file size failure instead of silently falling back to an upload or creating an illegible document.
- Write strict TypeScript, accessible responsive components, schema/conditional logic tests, and Playwright end-to-end tests including a privacy/no-upload case.
- Follow the `SPEC.md` implementation phases; keep working software and README instructions after every phase. If government UI details cannot be verified, build a plainly labeled provisional record and list the blocker in `TODO.md`.
- Run build, lint, and tests before reporting completion. Clearly identify what was actually tested and what is incomplete. Don't fabricate observations or test results.

- User-authorized exception (19 October 2026): Vercel visitor counts only, with fixed homepage route/path, URL redaction, and custom events rejected. No form/tool interactions or applicant data may be tracked. See SPEC.md.
