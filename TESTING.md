# Compact verification footer and explanations — 17 October 2026

Build, typecheck, lint, 40 unit tests and all 30 Chromium browser tests passed (22.5 seconds). Field cards show a single Verified At footer with the recorded observation/source-review date; their disclosure contains source and related-help links without research paragraphs. Concise explanations cover airport aliases, Religion OTHERS, citizenship acquisition, employer formatting, postal codes, departure ports and visa identifiers. The standalone airport finder uses the same compact date treatment. The local browser confirmed the arrival explanation and footer; the mobile airport screenshot was visually inspected. Existing clipboard, conditional-field, accessibility and no-upload checks pass.

# Known constraint UI verification — 17 October 2026

Build, typecheck, lint, all 40 unit tests and all 30 Chromium browser tests passed (22.6 seconds). Unknown limits show only a character count; established limits retain their counters. Verification-status boilerplate was removed from fields, source notes and related pages. Source links and provenance remain available, and unknown restrictions stay unset internally. Airport results include only records with observed dropdown labels. Browser checks cover the updated counts, source details and airport results alongside existing clipboard, accessibility and privacy behavior.

# Copy success feedback verification — 17 October 2026

Build, typecheck, lint, 40 unit tests and all 13 affected browser tests passed (9.0 seconds). Successful copying briefly turns only the clicked icon green with a checkmark, then resets after 1.8 seconds. Success announcements are screen-reader-only; clipboard errors remain visible. Browser checks compare field bounding boxes before, during and after Copy original feedback, and before/after airport copying, confirming no added row or layout shift from success feedback. Existing formatting, clipboard, accessibility and privacy tests pass. Screenshot: `test-results/copy-icon-feedback.png`.

# Inline copy icon verification — 17 October 2026

Build, typecheck, lint, 40 unit tests and all 13 affected guide/browser tests passed (8.5 seconds). Copy, format-and-copy and undo are icon-only controls to the right of the input; airport copying uses the same row. Browser assertions verify right-side placement, top alignment and 44px targets on desktop and 390px mobile, including textareas and the airport selector. Accessible names and hover titles retain the action descriptions; existing clipboard, keyboard, axe and privacy checks pass. The local Codex browser visually confirmed the layout. Updated desktop/mobile examples are in `test-results/employer-text-feedback.png` and `test-results/employer-text-feedback-mobile.png`.

# Inline arrival-name lookup verification — 17 October 2026

Build, typecheck, lint, all 40 unit tests and all 30 Chromium browser tests passed (21.4 seconds). The Port of Arrival field now uses the same observed port and alias registry as the standalone airport finder. Home search also indexes mapped names and airport codes.

Browser coverage checks all 86 options; TRV/Trivandrum/Thiruvananthapuram; Bangalore/Kempegowda/BLR; separate Goa Dabolim, Mopa and seaport entries; Cochin airport versus seaport; exact clipboard labels; mouse and arrow/Enter selection; Escape; unmatched text; reopening all choices; selection invalidation after editing; reload clearing; mobile overflow; and axe accessibility with the list open. Interaction makes no runtime requests and writes no browser storage or search text to the URL. Existing alias evidence is reused; no new port identities or eligibility claims were inferred.

The local Codex browser independently searched Thiruvananthapuram and selected TRIVANDRUM AIRPORT by keyboard within the home field. Screenshots: `test-results/arrival-alias-desktop.png` and `test-results/arrival-alias-mobile.png`.

# Copy and formatting verification — 17 October 2026

Build, typecheck, lint and 39 unit tests passed. The full Chromium run passed 28 journeys; its new clipboard-denial test initially used an ambiguous status selector (both the preview output and copy message have status roles). After correcting only that selector, both clipboard journeys passed (2.1 seconds). No product-code changes followed the full run.

Browser tests read the actual clipboard after Format & copy, Copy original, an over-limit literal copy, and date formatting. They verify preserved original text, Undo, keyboard focus, empty-copy disabling, failure instructions without rewriting input, cleared status after editing, mobile accessibility and zero network/storage use. Unit cases cover ampersands, apostrophes, punctuation, extra spaces, accented/non-Latin letters and a 200-character name without truncation. The local Codex browser also successfully formatted and copied a synthetic company name containing extra spaces, an apostrophe, ampersand, comma and period. Clipboard copies can outlive the page; Undo restores only the field text, as documented on Privacy.

Company cleanup is an explicit user-requested convenience, not a verified portal character whitelist or length constraint. No company maximum was established. Screenshots: `test-results/employer-text-feedback.png` and `test-results/employer-text-feedback-mobile.png`.

# Editable text feedback verification — 17 October 2026

Build, typecheck, lint and all 38 unit tests passed. The initial full Chromium run passed 27 tests and exposed a mistaken expected character count in the new test (the 18-character fixture is four, not three, over a 14-character limit). After correcting that expectation and restoring input focus after Apply/Undo, all 11 affected guide/browser tests passed (7.6 seconds). The other 17 browser journeys passed in the full run; they were not rerun after the focus-only fix.

Coverage includes editable text/textarea controls, literal punctuation and Unicode preservation, scoped gate limits without truncation, sample address limits per line, email syntax, leap-year/calendar validation, explicit ISO-date formatting, employer punctuation warnings with preview/apply/undo, keyboard focus, mobile overflow and axe accessibility. Search/field switching and reload clear text. Entering and formatting synthetic text produces no runtime requests, cookies, Web Storage or IndexedDB entries, and the URL contains only the public field identifier. Religion’s explanation remains editable and preserves text when toggled within that field. Existing source and government-verification limits remain unchanged; unknown restrictions are not invented, and the employer workaround is reported rather than a confirmed portal restriction.

The local Codex browser independently applied and undid employer formatting, confirming exact restoration and focus. Screenshots: `test-results/employer-text-feedback.png` and `test-results/employer-text-feedback-mobile.png`.

# Single-field home search verification — 17 October 2026

Build, typecheck, lint and all 33 unit tests passed. The complete Chromium suite passed all 27 tests (19.8 seconds). Search selects one field directly under the home search, removes the result list and hides preparation cards. Editing search clears that field; keyboard selection opens the next field and moves focus to its guidance. Tests confirm zero runtime requests during search and selection, existing sample privacy checks, exact options/limits, mobile layout and axe accessibility. Old guide links redirect to home and preserve field anchors, including Religion’s conditional OTHERS field. No browse-all directory or section navigation remains in the user flow.

The local Codex browser independently searched Religion, selected it in place, and revealed the OTHERS explanation. Desktop/mobile screenshots of the focused National ID flow are `test-results/home-selected-field.png` and `test-results/home-selected-field-mobile.png`. Live government evidence and browser coverage limits below still apply.

# Interactive field preview verification — 17 October 2026

Build, typecheck, lint and all 33 unit tests passed. The full Chromium suite passed all 26 tests (21.0 seconds). Native sample dropdowns are selectable; Religion OTHERS reveals an editable “If Others, Please specify” field. Tests cover entering NA, hiding/revealing the field without losing its in-memory text, clearing it on reload, direct field links, keyboard focus, axe accessibility and 390px mobile overflow. Interaction produces no network requests, cookies, Web Storage or IndexedDB entries, and answers never enter the URL.

The local Codex browser independently selected OTHERS and entered NA in the revealed field. Screenshots: `test-results/religion-others-sample.png` and `test-results/religion-others-mobile.png`. This verifies the companion interaction, not live government behavior; the Religion choices remain labeled REPORTED.

# Compact field preview verification — 17 October 2026

Build, typecheck, lint and 33 unit tests passed. The complete Chromium suite passed 25 tests (20.2 seconds). After the final spacing and keyboard-focus adjustment, all 4 affected browser tests passed (8.0 seconds), including axe scans with dropdown lists expanded, mobile overflow, source distinctions and read-only example behavior.

The National ID preview displays NA with the conditional hint “U.S. applicant without a national ID? Enter NA.” Keyboard typing cannot replace the read-only example. Interaction produces no network requests or cookies, Web Storage or IndexedDB entries. Religion and education lists match the sourced REPORTED labels; live observations remain separate. The local browser visually confirmed the compact presentation. Current screenshots: `test-results/national-id-hint.png`, `test-results/national-id-hint-mobile.png`, `test-results/field-choices-mobile.png`.

The live Religion dropdown remains gated; published walkthrough labels are not a substitute for a live verification claim. No applicant details, CAPTCHA or government submission were used.

# Current verification — search-first revision

The worksheet UI and its browser journeys are retired. Current checks cover local field search, exact observed choice rendering and scoped limits, Religion’s unverified status, old field links and encrypted backup export/delete, local PNG and HEIC conversion in both tools, file-quality regressions, mobile layout and axe accessibility. Validation completed 17 October 2026 (America/Toronto): `npm run build`, `npm run typecheck`, `npm run lint`, and `npm test` passed (32 unit tests). `npm run test:e2e` passed all 24 Chromium tests in 19.4 seconds. The first sandboxed browser-test attempt could not bind the preview port; the successful run used the existing loopback preview outside the sandbox.

Search tests assert zero runtime requests, no query in the URL, and empty cookies, Web Storage and IndexedDB. PNG conversion tests check real downloaded PDF/JPEG bytes and sizes with all requests blocked. HEIC tests allow only same-origin decoder scripts initially, then block all requests and verify repeat conversion/download; worker network access remains blocked by CSP. New guide routes pass mobile overflow and axe checks. Old encrypted backup export is byte-content equivalent to its envelope; deletion requires the explicit UI confirmation and persists after reload.

The local Codex browser independently opened the updated home, searched Religion and followed its field anchor. Desktop and 390px screenshots are in ignored `test-results/`. This does not verify later government fields, every conditional branch, Safari/Firefox, real touch hardware or production hosting.

## Historical verification (before the search-first revision)

The following is retained as historical evidence; worksheet behavior is no longer exposed or part of current acceptance.

# Verification record

Tested on 17 October 2026 (America/Toronto), on macOS ARM64 with Node 24.20.0. All applicant answers, images and drafts used for testing were synthetic.

## Passing checks

- `npm run build`: successful static export; 29 HTML documents hardened with CSP, including generated error pages. No application API or server action routes.
- `npm run typecheck`: passed after the completed build.
- `npm run lint`: passed with zero warnings.
- `npm test`: 31 tests passed in six files. Conditional visibility/requiredness, exact text, explicit date formatting, date/email consistency, schema references, encryption round trips, random nonces, non-extractable keys, wrong passphrases, ciphertext/metadata tampering, rejected KDF parameters, import schema bounds and passphrase minimums. Image tests cover native HEIC preference, software fallback, safe error text, input/decoded size limits and image resource release. Crop tests cover independent resizing, square aspect constraints, fixed opposite corners, centered portrait/landscape crops, movement bounds, viewport changes and rotation of the same selected area.
- `npm run test:e2e`: 26 Chromium journeys passed against the production static export and its CSP.
- `npm audit --omit=dev --audit-level=high`: zero reported production-dependency vulnerabilities at test time.
- Local Codex browser: inspected the simplified home, worksheet, file tool and help directory. Entered synthetic registration answers, moved between question groups, and verified that earlier answers remained intact. Native keyboard date edits were used because the browser automation fill operation did not trigger React’s date change event. The prior verification also checked synthetic name/religion entries and the employer punctuation warning.

## Browser journeys

1. Required-field errors, valid registration, conditional Other explanation, retained hidden answers, navigation, literal clipboard copying and punctuation warning.
2. Encrypted local save; inspected IndexedDB for absence of plaintext; wrong-password failure; lock/unlock; encrypted export/import; delete; tab closure and restoration of the latest **completed** save.
3. After initial static assets loaded, blocked all network requests, entered synthetic identity data, enabled encrypted saving, generated passport PDF and photo JPEG, downloaded them and checked file signatures/size. **Zero runtime requests were observed.** Answers remained intact while switching file tools.
4. Unsupported/corrupt HEIC, undersized applicant photos and invalid-size existing PDF errors; failed photo conversion triggers no download and leaves the editor available. Passport images have no minimum pixel-dimension guard.
5. Search to a public troubleshooting page and airport lookup, preserving source distinctions.
6. Production `connect-src 'none'`; no horizontal overflow at 390px; axe WCAG 2 A/AA and 2.1 AA checks on home, preparation checklist, worksheet, both file tools and airport finder. Passport purpose and requirements appear above the file picker; the disclosure is initially closed, opens by keyboard, and contains all published sample requirements with its source link. Desktop screenshots at 1440px and collapsed/expanded passport screenshots at 390px. Home now has three colored preparation cards with larger icons, a three-column desktop grid and two-column mobile grid; the checklist card opens the existing checklist. The passport layout and disclosure were also inspected in the local Codex browser.
7. Conflicting browser tabs: stale saves cannot overwrite a newer draft or resurrect a draft deleted in the other tab.
8. Denied IndexedDB access: session answers remain editable and encrypted backup export succeeds.
9. Complete synthetic adult tourist worksheet through every answer section and final review, including mobile-only contact number, transfer-check invalidation after edits, and an axe scan of expanded review content. No submission/payment control exists.

10. Small question groups: required-field focus, help disclosures, next/back answer retention, conditional name-change details, field deep links, and mobile section selection. Unit coverage confirms every schema field appears exactly once and conditional questions stay with their trigger.
11. Preparation checklist: home link, keyboard checkbox use, conditional disclosure, unchecked items do not block the worksheet, no network requests or browser storage writes during interaction, and desktop/mobile screenshots. Also visually inspected in the local Codex browser.
12. Real synthetic HEIC fixtures: a PNG loads without requesting the decoder; the first HEIC loads only same-origin static JavaScript through GET requests with no body. A blob worker appears, and an attempted fetch from inside it is rejected by its inherited CSP. Subsequent HEIC-to-PDF and HEIF-to-JPEG conversions and downloads succeed with **all requests blocked and zero requests observed**, including a MIME-less uppercase `.HEIF` filename. Cleared images leave no canvas, cookies or Web Storage data. Both outputs meet the file-size limits.
13. If the first decoder download is blocked, a useful error appears without an output download; choosing PNG then succeeds. Corrupt HEIC also fails visibly. The local Codex browser independently decoded the synthetic passport HEIC and produced a 200.1 KB PDF.
14. Visual passport crop: removed sliders are absent; mouse corner resizing and moving produce the expected selection and PDF page dimensions. Keyboard arrow/Shift adjustments, preserved selection through rotation, regeneration after edits, expanded-tool axe scan, responsive screenshots and Chromium-emulated touch dragging pass with zero network requests. The local Codex browser also confirmed keyboard resizing and direct corner dragging. Real touch hardware remains untested.
15. An 800 × 500 synthetic passport produces a PDF at 800 × 500 without upscaling or a minimum-resolution rejection. The top button generates and downloads it directly.

16. One-click PDF download: the top Download PDF button generates the current edits and triggers a normal browser download, with no bottom result panel, checkbox or extra tab. A second download reflects rotation; existing PDFs download byte-identically. Desktop/mobile screenshots, no mobile horizontal overflow, axe, and zero runtime requests are checked. PNG/HEIC conversion and quality tests inspect the downloaded PDF bytes. The local Codex browser independently saved `evisa-passport.pdf` to the system Downloads folder from one click.

17. Square photo crop: no sliders; the square grid has four draggable corners and an accessible move control. Mouse resizing and movement preserve the aspect, exported JPEG dimensions match the selection, and sampled output pixels match that region of the source preview. One click on Download JPEG exports directly with no result panel. The local Codex browser also saved `evisa-photo.jpg` directly to Downloads. Keyboard resizing followed by another download produces the new crop; rotation preserves the selected area and selecting a fresh file starts with the largest centered square. Chromium-emulated touch resizing/moving, desktop/mobile screenshots, no horizontal overflow, axe and zero runtime network requests pass. The local Codex browser also confirmed keyboard movement and direct corner dragging. Real touch hardware remains untested.

18. Compact Adjust popover: brightness and contrast are hidden initially; keyboard opening leaves crop geometry unchanged. Tone changes alter the preview, survive reopening and are applied when generating the next download. Escape restores trigger focus; outside clicks and tabbing out close the panel. Rotation remains directly visible in both file tools. Desktop/mobile screenshots, viewport bounds, expanded-panel axe and zero runtime requests pass. The local Codex browser also confirmed opening and Escape dismissal. The simplified layout places the privacy note above the tabs, removes crop captions/reset/preview labels, and aligns left-side adjustments with the right-side Download PDF action above the image on desktop and mobile. This toolbar was also inspected in the local Codex browser.

19. Adaptive passport JPEG quality: compared the actual embedded image against the source and the previous converter’s 0.90-to-0.82 fallback. The initial 0.90 JPEG exceeds 300 KB; the previous accepted JPEG is 201,712 bytes. The improved complete PDF is 297,331 bytes, with mean squared pixel error reduced from 14.42 to 10.26 for this synthetic fixture. The output preserves 1600 × 1000 pixels and stays under the complete-file limit. This is a fixture comparison, not a guarantee of readability for every document.
20. A clean synthetic 3200 × 2000 scan fits in a lossless PDF, retaining its original dimensions and using Flate rather than JPEG image compression.
21. A separate noisy 3200 × 2000 scan requires downscaling, then produces a PDF within 10–300 KB. All three quality journeys run with requests blocked and observe zero runtime network requests.

22. A tiny image produces a specific below-10-KB error, leaves the source editable, and triggers no download.
23–24. Detailed synthetic 1400px and 1000px images exceed 300 KB at JPEG quality 0.85 before PDF wrapping, reproducing the former cutoff failure. Both now resize further and download single-page PDFs within 10–300 KB, preserving aspect ratio and matching embedded-image dimensions, with zero runtime requests. Outputs were 730 × 584 at 299,588 bytes and 722 × 578 at 295,041 bytes. The local Codex browser also successfully downloaded the 1400px stress-test image after automatic resizing.

25. Arrival selector: all 86 options, case/diacritic/punctuation-tolerant alias search, one result per identity, distinct Goa airports/seaport, keyboard/mouse selection, Escape, exact clipboard output, unmatched-input validation, encrypted save/lock/unlock of both selected labels and unmatched text, zero runtime requests, expanded-list axe and mobile/desktop screenshots. The local Codex browser independently selected TRIVANDRUM AIRPORT from Thiruvananthapuram by keyboard and showed three distinct Goa choices.
26. Finder and worksheet share the same port/name registry. TRV, Trivandrum and Thiruvananthapuram resolve once; Goa and Cochin retain their distinct ports; COK links its name/code evidence. Unit tests cover unique source IDs, duplicate records, known aliases/codes, empty/unknown and saved-text handling.

## Output inspection

Before the adaptive quality update, the generated synthetic passport PDF was about 198 KiB and rendered with Poppler. Its biodata text and machine-readable test lines were visually readable with the complete border present. The synthetic square JPEG was about 221 KiB; inspection confirmed the requested crop/rotation. These are fixture results, not a guarantee of readability for arbitrary real documents.

Before the adaptive quality update, the HEIC fixture produced a 200,141-byte passport PDF and a 335,774-byte square photo JPEG. The PDF was rendered with Poppler; visual inspection showed readable synthetic biodata/MRZ text, correct orientation and the full page border. The JPEG retained the synthetic face and expected square crop. These tests cover macOS-encoded synthetic fixtures, not every iPhone/HDR/multi-image encoding.

Ignored local QA outputs are in `test-results/`, including desktop/mobile screenshots and synthetic converted files. They are regenerated by the browser tests and are not intended for deployment.

## Limits

No official government application was created or submitted, no CAPTCHA was solved, and no payment was made. Live registration and public instructions were inspected; later form coverage is sample-based and explicitly provisional. Positive native HEIC decoding, real mobile touch hardware, Safari/Firefox, every possible conditional form branch and a deployed hosting configuration were not verified. Pending autosaves cannot survive a forced process termination before the write completes. See `TODO.md` and `reference/SOURCES.md` for the remaining work.
