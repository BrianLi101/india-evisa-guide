# Source observation log

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
