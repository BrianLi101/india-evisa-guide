# Remaining verification and follow-up

This is a searchable field guide and continuous walkthrough with local file tools, not a fully live-verified mapping of every government flow.

## Official form research blockers

- Completed 18 October 2026: user-authorized synthetic U.S. ordinary-passport, 30-day tourist inspection through initial PhotoUpload. Saved screen/header/field order, required markers, all observed choices, HTML limits, conditional branches and three validation outcomes. See `public/reference/portal-capture.json` and `reference/SOURCES.md`.
- Stopped at file selection. No photo/document uploaded, crop/confirmation flow inspected, final application submitted or payment attempted. Later document upload, review and payment remain sample-based. Further traversal requires a file upload; do not silently promote those pages to live evidence.
- Recheck nationality/service variants. Registration exposed 62 unique unfiltered purpose labels, while the U.S. session showed 55 choices. The complete nationality-to-purpose mapping was not captured. Gate health-question behavior, all education branches and minor/non-tourist categories are not fully tested.
- HTML maxlength and required markers are not comprehensive server validation. Tested rejections: a hyphen in surname, a period in given names, mobile left blank with Phone filled, and pipe characters introduced into an Indian-reference address line after a failed save. Do not infer a universal whitelist or a guaranteed workaround.
- The country catalog and all 821 initial District entries are preserved; only the DELHI State filter was exercised. Do not use the unfiltered catalog as a state-to-district mapping. SAARC displayed eight possible DOM rows; plus/minus operations were not exercised.
- Employer punctuation and dependent-radio reset reports retain REPORTED attribution. The separate name-punctuation reset observed in this session does not verify every reported reset cause.
- After-approval result screen still needs verification of Print Status and PDF download. Earlier public instructions and applicant-reported airport/airline experiences retain their own evidence scope.
- User-confirmed ETA-number/New Delhi guidance and the U.S. National ID example remain attributed to the user. Live National ID help independently says “If not applicable Please Type NA.”
- Expand the 11 source-backed airport alias/code mappings. Arrival and exit lists match exactly in this capture, but dropdown presence does not establish entry eligibility.
- Neighborhood-to-district and PIN mappings remain outside this guide. Gurgaon/Gurugram are alternate names; do not infer an address mapping from that alone.
- Initial PhotoUpload independently confirms JPEG, 10 KB–1 MB and at least 350 × 350 pixels. Passport PDF limits and actual upload acceptance have not been retested in the live upload flow.
- The 19 October PayPal scrolling, approximately 12-minute retry restriction, phone punctuation guidance, no-marks entries and overlapping upload button remain user-reported guidance. Official public instructions support SBI ePay’s PayPal channel and 25-minute transaction interval; no live payment/upload acceptance was tested. Keep those timings distinct from the two-hour payment-status allowance.

## Browser and product coverage

- Expand HEIC coverage beyond the synthetic macOS-encoded fixtures: native Safari decoding, older/newer iPhone encodings, HDR and multi-image variants. Chromium software decoding, offline conversion, invalid files and failed decoder downloads are tested; universal HEIC compatibility is not claimed.
- Cross-browser real-device QA on Safari/iOS and Firefox; current automated browser coverage is Chromium, including narrow mobile viewports. Pointer panning is implemented, but a real touchscreen has not been tested.
- Consider local PDF recompression and perspective correction if needed. Existing PDFs currently require one page and compliant size and remain unchanged.
- Add adult tourist subcategory variants as their exact fields are verified; minor, business, medical and other visa categories are not comprehensively covered.
- The worksheet is retired. Legacy ciphertext can be exported or explicitly deleted; decrypt/import/edit are not exposed in the guide. Keep original passphrases with backups.
- Independent security review before broad public launch. Inspect the actual hosting configuration and disable provider analytics. Current review and tests are local; no production host has been verified.
- Set a real `SITE_URL` before publishing so the sitemap contains canonical URLs. This work has not been deployed.

## Intentional boundaries

No submission automation, government-site autofill, CAPTCHA solving, payment handling, cloud conversion, OCR service, analytics, account system, or remote applicant storage. No automatic assertion that a converted image/PDF is readable or officially acceptable. No guarantee of saving changes after a force-quit while an encrypted save is pending.
