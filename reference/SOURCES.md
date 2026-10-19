# Source observation log

## Payment and trip-preparation guidance — 19 October 2026

Reviewed the public [official instructions and FAQs](https://indianvisaonline.gov.in/evisa/tvoa.html). General FAQ Q8–Q10 supports checking status and the distinction between the 30-day first-arrival period and the 1-year/5-year grant-based validity periods. The issued ETA and immigration stamp govern entry, expiry, entries and stay limits. The new-application guidance is a practical inference from those conditions, not an eligibility determination.

The same page’s SBI ePay FAQ confirms PayPal as a payment channel, a payment-success reference separate from the application identifier, and a minimum 25-minute interval between transactions (Q11). General payment instructions retain the two-hour status-update allowance. These are OFFICIAL published statements, not a live payment test.

The user supplied the following guidance and firsthand reports on 19 October; preserve them as REPORTED, separately from the official facts:

- PayPal may require scrolling inside SBI ePay after selecting it on the portal.
- A payment retry was temporarily blocked for approximately 12 minutes. This is not a universal or guaranteed timeout and does not override the published SBI ePay interval.
- Phone inputs can reject dashes, parentheses and `+`. The user clarified that spaces may be accepted; do not describe phone input as digits-only or claim spaces are forbidden. Apply this hint to contact, mobile, employer and both reference phones without changing literal applicant input or inventing a country-code rule.
- Expected arrival can be a best estimate; selecting an earlier date does not necessarily expand flexibility. The official ETA entry conditions still apply.
- Applicants without visible identification marks can enter `NONE` or `NA`.
- The tiny orange upload button can overlap the file selector. The official sample separately supports the distinction between choosing and uploading a file.
- Previous passports and entry stamps are practical aids for recalling countries visited in the last ten years; they may not contain every trip.

No files were uploaded, no payment attempted and no live acceptance rule tested for this update. Preserve the earlier field-capture dates and limitations. FAQ and walkthrough payment links share stable issue IDs; source metadata remains available in the exported issue records.

## Authorized synthetic portal inspection — 18 October 2026

This entry supersedes older “no session entered” and sample/provisional claims for the screens actually reached. The user requested a fabricated passport walkthrough and separately authorized the CAPTCHA, then the legally worded background declaration and Continue. A synthetic draft was created. No real applicant data was used. The session reached [Upload Photograph](https://indianvisaonline.gov.in/evisa/PhotoUpload); no photo or document was uploaded, no final application submitted and no payment made. No applicant answers, temporary application IDs or session tokens are retained in the repository.

Scope: adult U.S. ordinary passport; 30-day e-Tourist sightseeing. Read DOM labels, controls, choices, HTML limits, required markers, help text and section hierarchy, and opened the documented conditional branches. `src/content/livePortal.ts` retains field order/structure and validation observations; `src/content/livePortalChoices.json` retains exact choice labels and values. `reference/portal/district-labels-2026-10-18.txt` preserves the initial 821 district entries, including duplicates (each value equaled its label). The static export combines these into `/reference/portal-capture.json`, independently of which fields have walkthrough help. Country and district transcriptions were checked against checksums computed from the captured browser catalogs.

- [Registration](https://indianvisaonline.gov.in/evisa/Registration): after nationality/passport selection, Visiting India for precedes derived read-only Purpose and Visa Service, then Expected Date of Arrival. Public DOM had 67 non-placeholder purpose entries / 62 distinct labels; the U.S. session displayed 55. Do not interpret the unfiltered list as eligibility. On 18 October, the earliest arrival date selectable was 22 October; the year list showed 2026/2027. Full maximum window was not tested. A Congo/South Sudan health question appeared after the passport gate; its complete answer path was not verified.
- [BasicDetails](https://indianvisaonline.gov.in/evisa/BasicDetails): Applicant Details → Passport Details. Gender is MALE / FEMALE / TRANSGENDER. Religion has 11 options, education 9 (including exact `POST GRADUATE`). Country lists contain 263 non-placeholder entries, distinct from the registration nationality list. Captured previous surname/name separately, qualification text (200), nationality acquisition/previous nationality, and five other-passport fields. Passport number 14; passport place 20; dates 10; Religion OTHERS explanation 20; National ID 30; identification marks 35. These are HTML maxlength observations. Surname was unmarked; given names marked required. Hyphenated synthetic surname and dotted given names produced “Enter Alphabets or spaces Only,” and inspected editable answers cleared. This is not a complete character whitelist.
- [FamilyDetails](https://indianvisaonline.gov.in/evisa/FamilyDetails): Applicant’s Address Details (Present/Permanent), Family Details (Father/Mother/Spouse), Profession / Occupation Details of Applicant. Captured occupation 41 choices; STUDENT exposes Father/Spouse selector, OTHERS exposes text; prior occupation and four service details also captured. Designation means job title. Designation, employer Phone, past occupation and parents’ previous nationalities were accepted blank. Phone filled with mobile blank produced “Mobile number is required,” contradicting the displayed “One Contact No is Mandatory” help for this route. Preserve this scope.
- [VisaDetails](https://indianvisaonline.gov.in/evisa/VisaDetails): Details of Visa Sought → Previous Visa/Currently valid Visa Details → Other Information → SAARC Country Visit Details → Reference. Arrival is carried over read-only. Exit has 86 choices, byte-equivalent labels to the shared arrival registry. Four tour-operator text fields each have length 50; previous cities textarea 75; previous visa number 10; Indian reference address lines 200, home-reference address lines 35. Reference includes State (37 choices) and dependent District; DELHI filters to DELHI / NEW DELHI / NOT KNOWN. Initial 821 districts are not a valid option set for every state. A returned save inserted a pipe-delimited district/state suffix into Indian-reference address line 2; the next validation said “Invalid Characters.” Replacing that synthetic line allowed continuation; cause not established. SAARC table country/year/visit-count headers and all eight DOM rows were observed, plus/minus untested; years 2026/2025/2024/2023, visit-count length 3.
- [AdditionalQuestions](https://indianvisaonline.gov.in/evisa/AdditionalQuestions): six exact marked-required Yes/No questions, each with a 200-character conditional explanation. All six Yes branches were opened. The page instructs details when Yes even though explanation textareas have no HTML required attribute. Background declaration was checked only after the user explicitly reversed the earlier stop instruction and authorized Continue.
- [PhotoUpload](https://indianvisaonline.gov.in/evisa/PhotoUpload): Upload Photograph → Choose the Photo To Upload → Upload Photo / Exit. Separate file and submit controls; no HTML accept attribute on file input. Visible specifications confirm JPEG, 10 KB–1 MB, minimum 350 × 350 pixels and clear recent front-facing photo against a white/light background. No file selected or uploaded; crop/document/payment details remain sample-based.

All inspected HTML required attributes were false; required asterisks/CSS markers are stored separately. No absence of a marker/attribute is promoted to proof of server optionality. Radio label-to-value mappings are kept only where explicitly recorded. Country/state legacy spellings, literal TEST entries and duplicates are preserved. Home-country UI heading is generalized while its observed U.S. wording remains in metadata. Source-backed hints about ETA numbers or previous visa place of issue retain their separate attribution; observing a control does not verify every accompanying piece of advice.

## Shared field records — 17 October 2026

Search and walkthrough now render the same field content without walkthrough-specific record overrides. The four existing walkthrough hints (same address, permanent street, previous Indian address and home-country reference name) were moved into shared field hints. The canonical same-address record now includes the checkbox wording and source date already established by the official sample observation below. Purpose placement and background follow-up prompts retain their existing NEEDS_VERIFICATION scope in the canonical records. This is a consolidation of recorded evidence, not a new portal inspection.

## Saved application fields — 17 October 2026

The user reported that some fields may be cleared when returning to the official e-Visa application after Save and Exit. The FAQ advises checking answers and filling in anything missing before continuing. This is recorded as REPORTED guidance dated 17 October 2026; no independent live verification was performed, and the report does not identify every affected field or establish that it happens in every session.

## Page-by-page walkthrough — 17 October 2026

Re-fetched the public [official sample](https://indianvisaonline.gov.in/evisa/images/SampleForm.pdf), rendered all eight PDF sheets locally and visually compared sheets 2–8. These contain nine numbered application screens: registration, Applicant Details, address/family, Visa Details, Additional Questions, photograph upload, document upload, Confirm Details and payment. No sample imagery or sample applicant values are bundled in the product.

`src/content/walkthrough.ts` records their page/group/field order, including date of birth/nationality/email carried from registration, the second itinerary line, displayed visa duration/entries, declarations and separate upload actions. The sample's same-address checkbox reads “Click here for same address”; this label is OFFICIAL sample evidence, not a new live observation. Review repeats the relevant field groups with no applicant values. Source links target the PDF sheet containing each screen, not a conflated PDF/application page number.

Registration retains the earlier LIVE_VERIFIED nationality-before-passport order; the sample shows the reverse. Its passport/name gate remains distinct. The visa-service sample control and conditional purpose location are not treated as a newly verified live sequence. Employer/service questions remain NEEDS_VERIFICATION in a supplementary group, and conditional details absent from the sample retain provisional labels. The live registration web fetch timed out in this pass. No applicant gate was passed, no CAPTCHA was solved, and no application or payment was submitted. Nine sample screens do not establish current live pagination for every applicant.

The companion now omits the Confirm Details screen and its repeated field records at the user's request. Its walkthrough has eight sections; this product change does not alter the nine-screen source observation above.

## Clarified guidance — 17 October 2026

The user confirmed that the ETA (Electronic Travel Authorization) number is the previous visa number for a previous Indian e-Visa; New Delhi can be entered for its place of issue; Gurgaon and Gurugram are alternate place names; and U.S. applicants without a national ID can use NA. These confirmations resolve the corresponding earlier research questions. The two previous-visa fields/articles and the address alias retain REPORTED attribution rather than claiming a new independent live capture. National ID guidance also retains the official sample's instruction to use NA when not applicable.

The official [e-Visa instructions](https://www.indianvisaonline.gov.in/visa/tvoa.html), retrieved through web search on this date, expand ETA as Electronic Travel Authorization. The [Gurugram district history](https://gurugram.gov.in/history/) uses both Gurgaon and Gurugram for the place's history. These sources supplement the user clarification; neither is evidence of live acceptance of New Delhi in a previous-visa field. No applicant session was entered during this update.

User-facing guidance now directly asks for comma-separated previous cities, at least one phone/mobile number, address lines within 35 characters, a photo of at least 350 × 350 pixels, and completion of the displayed upload action. The 35-character guidance, contact requirement, city separator, photo minimum and upload actions remain based on the reviewed official sample; this copy cleanup does not promote them to LIVE_VERIFIED. Address length remains advisory and never truncates or rejects the original input. Source-based field footers now say Reviewed; Verified At is reserved for fields with recorded portal observations.

Earlier observations below are retained as historical context and are superseded where this clarification resolves an open question.

Observed/reviewed **16 October 2026**, America/Toronto. These observations do not establish applicant eligibility or guarantee future UI behavior.

## Official portal instructions

Source: <https://indianvisaonline.gov.in/evisa/>, “Instructions for Applicant” dialog, read in the local Codex browser.

- Published photograph requirements: JPEG, minimum 10 KB and maximum 1 MB, equal height/width, clear front-facing full head, eyes open, no spectacles, plain light/white background, no shadows or borders.
- Published passport biodata scan requirements: PDF, minimum 10 KB and maximum 300 KB; personal details and photograph must be clear.
- Payment instructions say status updates may take two hours; check the official payment-verification flow before retrying.
- These are `OFFICIAL` published requirements, not a live upload-screen acceptance test.

## Live registration

Source: <https://indianvisaonline.gov.in/evisa/Registration>, inspected in the local Codex browser.

Observed registration order: Nationality/Region, Passport Type, Port Of Arrival, Date of Birth, Email ID, Re-enter Email ID, Expected Date of Arrival; a dependent purpose selector appears after nationality selection. A passport/name gate appeared after selecting CANADA, along with nationality notices. No passport, name, birth date, email, CAPTCHA or document was entered in the government form.

Observed Passport Type choices: ORDINARY PASSPORT, OFFICIAL PASSPORT, DIPLOMATIC PASSPORT, SERVICE PASSPORT, SPECIAL PASSPORT. Presence in this dropdown does not establish eligibility.

Observed Port Of Arrival labels relevant to the initial alias seeds:

- TRIVANDRUM AIRPORT
- BENGALURU AIRPORT
- COCHIN AIRPORT
- CALICUT AIRPORT

These exact labels are `LIVE_VERIFIED` for the registration screen before completing the applicant gate. No claim is made that they remain present for every nationality/session, or that dropdown presence proves authorized entry. At that point common-name/IATA relationships were research seeds; the follow-up below supersedes this for the sourced mappings.

## Official sample application

Source: <https://indianvisaonline.gov.in/evisa/images/SampleForm.pdf>, eight-page PDF downloaded temporarily and visually inspected with rendered page images. The first document page is a cover; form screenshots start on document page 2. No government sample images or applicant records are bundled with the product.

- Document page 2: registration and Applicant Details Form, including names, changed name, gender, birth details, national ID, religion, visible marks, education, nationality acquisition, residence question, passport details, and other passport/IC details.
- Document page 3: present/permanent addresses and family details. The sample says one contact number is mandatory. Current limits/options need live verification.
- Document page 4: visit plans, previous Indian visas, refusal history, other countries, SAARC visits and reference contacts.
- Document page 5: six additional background questions; photo upload screenshot with separate Upload Photo action and a stated 350 × 350 minimum dimension.
- Document page 6: passport document upload screenshot with separate Upload Document action and status.
- Its document instructions specify PDF, minimum 10 KB and maximum 300 KB; the passport photograph/details page (name, birth date, nationality, expiry); the same passport entered in Passport Details; English-language documents, including business cards and invitations; and possible rejection for unclear or noncompliant documents. All seven numbered instructions are paraphrased in the passport tool’s disclosure (the two size rules share one bullet). This is published sample evidence, not a live upload-screen test. The converter’s 30 MB image-input limit and existing-PDF single-page restriction are separate app limits.
- Document pages 7–8: final review and payment, which the companion intentionally does not reproduce as submission controls.

The sample lacks the occupation section described in initial user research. That section is provisional and not attributed to the sample. Later current-page order and dynamic validation were not observed live. Individual `OFFICIAL` field records mean that the label/help is supported by the sample, not that every conditional control or dropdown has been verified.

## Reported behavior

### After approval — 17 October 2026

- OFFICIAL: [e-Visa portal](https://indianvisaonline.gov.in/evisa/tvoa.html), “Fly To India” step, instructs travellers to print their ETA and present it at immigration.
- LIVE_VERIFIED: opening [Status Enquiry](https://indianvisaonline.gov.in/evisa/StatusEnquiry) initially redirected to the landing page. Following “Check your Visa Status” opened the form, displaying Application Id, Passport No, CAPTCHA and Check Status. Its public notes say the application ID is in the acknowledgement email/printed application form and that this page can print an e-Visa (ETA). No fields were filled or submitted.
- REPORTED: user feedback in this chat describes a “Print Status” button that downloads a PDF, varying airline acceptance of email/application ID/screenshots, and needing airport printing when no paper copy is carried. No airline policy or approved result screen was independently inspected. `/after-approval/` labels these limits and recommends printing ahead rather than relying on airport facilities.

Source: project `SPEC.md`, firsthand user observations. The user confirmed that supplied behavior had already been verified in their own session. Employer punctuation resets, religion-related resets, and radio/dropdown clearing remain `REPORTED` to identify their source, not to question whether the user observed them. These observations do not establish universal official requirements. Suggested values such as NA are never inserted automatically.

## Draft KDF reference

<https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html>, checked 16 October 2026: the published PBKDF2-HMAC-SHA-256 recommendation is 600,000 iterations. The implementation uses browser Web Crypto and authenticated AES-GCM. This reference is not an independent audit of the app.

## Preparation checklist

The `/before-you-start/` checklist uses the official sample’s family, previous-visit, ten-year travel-history and reference-contact prompts. Sample document pages 3 and 4 were visually rechecked. The passport/photo reminder is also supported by official e-Visa instructions, retrieved through the search index at <https://www.indianvisaonline.gov.in/visa/tvoa.html>; direct page retrieval timed out during this pass. No new live government-form fields were claimed.

Accommodation is the user-requested practical preparation reminder; the checklist separately lists the sample’s India reference and does not claim that any hotel is automatically accepted. Employment remains NEEDS_VERIFICATION from project research. The checklist is scoped to adult tourist preparation, with conditional items disclosed separately and a reminder to check additional documents for other purposes.


## Arrival selector and shared name mappings — 17 October 2026

Opened the official landing page, followed **Apply here for e-visa**, and read all 86 non-placeholder option labels and portal IDs from the registration `missioncode_id` dropdown before the applicant gate. No applicant fields, CAPTCHA, or Continue button were used. Exact observations are retained in `src/content/arrivalPorts.ts` and exported to `/reference/arrival-ports.json`. These are LIVE_VERIFIED interface choices, not an eligibility list. Land ports, sea ports and similarly named entries (including both Vizhinjam entries) remain separate.

Name/code mappings have separate primary-source evidence, recorded per airport in `portAliases`. Sources checked:

- Thiruvananthapuram / Trivandrum / TRV: [airport operator](https://thiruvananthapuram.adaniairports.com/en/).
- Bengaluru / Bangalore / Kempegowda / BLR: [airport operator](https://www.bengaluruairport.com/).
- Kochi / Cochin / COK: [CIAL](https://www.cial.aero/About-Us).
- Kozhikode / Calicut / CCJ: [AAI airport profile](https://www.aai.aero/sites/default/files/newspaper_articles_images/Airport_International_8.pdf). Historical source used for identity only, not traffic or eligibility.
- Goa Dabolim / GOI and Goa Mopa / Manohar / GOX: [AAI aeronautical circular](https://aim-india.aai.aero/eaip-v2-01-2025/pdf/Official%20AIC/AIC2023/AIC14_2023.pdf) and [Mopa airport operator](https://www.miagoaairport.com/contact). Distinct airports, never deduplicated together.
- Tiruchirappalli / Trichy / TRZ: [AAI aeronautical circular](https://aim-india.aai.aero/eaip-v2-06-2024/pdf/Official%20AIC/AIC2021/AIC_2021_04.pdf). The portal spelling remains TIRUCHIRAPALLI AIRPORT exactly.
- Mangaluru / Mangalore / IXE: [airport operator](https://mangaluru.adaniairports.com/en/) and [AAI rename notice](https://aim-india.aai.aero/eaip-v2-01-2023/pdf/SUPs/AIPS_2022_177.pdf).
- Chennai / Madras: [Ministry of Tourism](https://www.incredibleindia.gov.in/en/tamil-nadu/chennai). Kolkata / Calcutta: [West Bengal government](https://industry.wb.gov.in/state_profile.html). MAA and CCU: [AAI schedule code legend](https://www.aai.aero/sites/default/files/flight_schedule/Arrival_FLIGHT%20SCHEDULE.pdf), used for identity, not current services.
- Mumbai / Bombay: [Mumbai district government](https://mumbaicity.gov.in/en/about-district/). BOM and Chhatrapati Shivaji Maharaj International Airport: [Ministry of Tourism travel directions](https://www.incredibleindia.gov.in/en/maharashtra/mumbai/chhatrapati-shivaji-maharaj-terminus).

Alias mapping does not establish airport/seaport interchangeability, authorized entry, or current flight service. Other ports remain searchable by their observed labels; unknown names are not silently assigned. Gurgaon/Gurugram administrative details remain provisional.


## Search-first field audit — 17 October 2026

Opened `https://indianvisaonline.gov.in/evisa/Registration` in the local browser. It initially redirected to the official landing page; following **Apply here for e-visa** opened Registration. The initial gate asked for **Passport No**, **Select Country/Region**, and **Name as in passport**. No values were entered and neither Continue button nor CAPTCHA was used.

Read public rendered DOM labels, select options and HTML maxlength attributes. Captured facts are in `src/content/portalObservations.ts`. Required asterisks are excluded from headings; option case/spelling are retained, including `TEST` and the literal backslash in `COTE D\'IVOIRE`. Empty selection prompts are excluded from choice counts.

- Nationality and gate country/region: 179 non-placeholder labels.
- Passport Type: 5 labels, unchanged from the earlier observation.
- Port Of Arrival: 86 labels, matching the existing registry; nationality-dependent alternate controls are not represented as generally selectable.
- Date of Birth and Expected Date of Arrival display DD/MM/YYYY.
- HTML maxlength: gate Passport No 14, gate Name as in passport 100, Email ID and Re-enter Email ID 50 each, CAPTCHA 6. These are input attributes, not a complete validation contract. No absence of maxlength is interpreted as unlimited input.
- Religion was not reachable without passing the applicant gate. Its current choices and exact label/limits were not independently inspected. The conditional explanation behavior is supported by the user’s firsthand observation. The user accepted keeping this gap explicit. The sample’s “If Others, Please specify” wording is retained as sample evidence only.

The guide shows only observed choice lists. Sample/provisional seed options remain in the internal compatibility schema, clearly separated from observed public facts. No broad claim of matching every current field is made.


## Compact field hints and published lists — 17 October 2026

Reopened the official e-Visa landing page and followed Apply here for e-visa. The passport/name gate still prevents inspection of the Religion dropdown; no applicant answers, CAPTCHA or Continue were submitted.

[Visa Traveler’s e-Visa walkthrough](https://www.visatraveler.com/blog/india-e-visa-application/) (page says updated 4 May 2026) enumerates 11 Religion labels, 9 Educational Qualification labels, 3 marital-status labels and 2 nationality-acquisition labels. Transcribed the exact spelling/case into `reportedChoices` in `src/content/fieldHints.ts`; these are REPORTED observations from a published walkthrough, not LIVE_VERIFIED government dropdowns. Other recommendations on that page were not adopted. The live public registration lists remain separately observed.

[Official sample form](https://www.indianvisaonline.gov.in/evisa/images/SampleForm.pdf), re-opened through web research, states “If not applicable Please Type NA” for Citizenship/National Id No. [Flight of the Educator’s U.S. applicant walkthrough](https://flightoftheeducator.com/tourist-visa-india-for-us-citizens-walkthrough/) also recommends NA when the applicant has no such ID. The compact hint is explicitly conditional: “U.S. applicant without a national ID? Enter NA.” This is not a verified rule exempting all U.S. citizens or residents, nor a statement that citizenship alone determines the answer. Source detail is expandable, and the example field is read-only.


## Firsthand session clarification — 17 October 2026

The user reconfirmed that they completed an actual applicant session to check the reported issues. Earlier notes about the agent being blocked at the gate describe only the agent's access, not an absence of live user verification. The conditional OTHERS explanation, use of NA, and reported reset issues are firsthand observations. The full option-list transcription retains its published walkthrough source; this clarification does not invent a separate capture of every option or limit. Do not present the observed issues as unchecked in the UI.

## Interactive Religion sample — 17 October 2026

User reported that selecting OTHERS on the official form reveals a secondary field in which NA can be entered. The companion now reproduces this as an interactive sample. The option list remains REPORTED; the conditional explanation is supported by the official sample and user observation. The hint says “Enter your explanation, or NA if not applicable”; no unconditional acceptance of NA or full live validation is claimed. All sample selections/text stay in memory and are never persisted or transmitted. The existing religionOther link opens the dependent sample field.
