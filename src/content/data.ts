import { liveFields, liveChoices, LIVE_OBSERVED_AT } from "./livePortal";
import { arrivalPorts, PORTS_OBSERVED_AT, PORTS_SOURCE } from "./arrivalPorts";
import type {
  VisaField,
  VisaSection,
  KnownIssue,
  LocationAlias,
  Condition,
} from "../lib/schema";
export const REVIEWED_AT = "2026-10-16";
export const PORTAL = "https://indianvisaonline.gov.in/evisa/";
export const REGISTRATION = `${PORTAL}Registration`;
export const SAMPLE = `${PORTAL}images/SampleForm.pdf`;
export const CLARIFIED_AT = "2026-10-17";
export const FIELD_HELP_REVIEWED_AT = "2026-10-18";
export const VISA_INSTRUCTIONS = `${PORTAL}tvoa.html`;
export const CONTENT_VERSION = 2;
const sectionSeed = [
  [
    "registration",
    "Before you begin",
    "e-Visa Application",
    "Your travel basics. Registration labels were observed on the live portal; choices can depend on nationality.",
  ],
  [
    "identity",
    "Personal & passport",
    "Applicant Details Form",
    "Keep your passport beside you. Names and identity details should match it exactly.",
  ],
  [
    "family",
    "Address & family",
    "Applicant Details Form",
    "Prepare your addresses and family details before opening the government form.",
  ],
  [
    "employment",
    "Occupation details",
    "Profession / Occupation Details of Applicant",
    "Occupation and service fields observed in the synthetic tourist application.",
  ],
  [
    "travel",
    "Visit & references",
    "Visa Details Form",
    "Your plans, earlier visits and two reference contacts.",
  ],
  [
    "background",
    "Additional questions",
    "Additional Question Details",
    "Answer carefully and truthfully. Read the full wording on the official portal before answering.",
  ],
] as const;
export const sections: VisaSection[] = sectionSeed.map(
  ([id, title, officialPageTitle, description], order) => ({
    id,
    title,
    order,
    officialPageTitle,
    description,
    evidenceStatus: "LIVE_VERIFIED",
    sourceUrls: [
      PORTAL +
        (
          {
            registration: "Registration",
            identity: "BasicDetails",
            family: "FamilyDetails",
            employment: "FamilyDetails",
            travel: "VisaDetails",
            background: "AdditionalQuestions",
          } as Record<string, string>
        )[id],
    ],
    verifiedAt: LIVE_OBSERVED_AT,
  }),
);
type FieldSeed = Omit<Partial<VisaField>, "options"> & {
  id: string;
  sectionId: string;
  officialLabel: string;
  description: string;
  options?: string[];
};
const seeds: FieldSeed[] = [];
function add(
  sectionId: string,
  id: string,
  officialLabel: string,
  description: string,
  extras: Omit<
    Partial<FieldSeed>,
    "id" | "sectionId" | "officialLabel" | "description"
  > = {},
) {
  seeds.push({ sectionId, id, officialLabel, description, ...extras });
}
const yesNo = ["Yes", "No"];
const when = (field: string, equals = "Yes"): Condition => ({ field, equals });
const optional = { required: false };
const date = { type: "date" as const, validationRules: ["date" as const] };
const past = { ...date, validationRules: ["date" as const, "past" as const] };
const yn = { type: "select" as const, options: yesNo };
const live = {
  evidenceStatus: "LIVE_VERIFIED" as const,
  verifiedAt: REVIEWED_AT,
  helpSources: [REGISTRATION],
};
add(
  "registration",
  "gatePassport",
  "Passport No",
  "Enter this only on the official portal. The opening gate asks for the passport you will travel on.",
  live,
);
add(
  "registration",
  "gateNationality",
  "Select Country/Region",
  "Select the country/region for your passport on the official portal.",
  live,
);
add(
  "registration",
  "gateName",
  "Name as in passport",
  "Use the name recorded in your passport on the official portal.",
  live,
);
add(
  "registration",
  "nationality",
  "Nationality/Region",
  "Use the nationality of the passport you will travel on. Check eligibility directly on the portal.",
  { ...live, placeholder: "As listed on your passport" },
);
add(
  "registration",
  "passportType",
  "Passport Type",
  "These labels were observed in the registration dropdown. A listed option does not establish eligibility.",
  {
    ...live,
    type: "select",
    options: [
      "ORDINARY PASSPORT",
      "OFFICIAL PASSPORT",
      "DIPLOMATIC PASSPORT",
      "SERVICE PASSPORT",
      "SPECIAL PASSPORT",
    ],
  },
);
add(
  "registration",
  "arrivalPort",
  "Port Of Arrival",
  "Indian cities can have multiple names: Thiruvananthapuram / Trivandrum, Bengaluru / Bangalore, and Kochi / Cochin. Search either name or the airport code to find the matching portal entry.",
  {
    ...live,
    type: "port",
    verifiedAt: PORTS_OBSERVED_AT,
    options: arrivalPorts.map((port) => port.label),
    knownIssueIds: ["airport-names"],
  },
);
add(
  "registration",
  "dob",
  "Date of Birth",
  "Use the date recorded in your passport. The registration screen displays DD/MM/YYYY.",
  { ...live, ...past },
);
add(
  "registration",
  "email",
  "Email ID",
  "Use an address you can access for official messages.",
  { ...live, type: "email", validationRules: ["email"] },
);
add(
  "registration",
  "emailConfirm",
  "Re-enter Email ID",
  "Retype the same email address to catch mistakes.",
  { ...live, type: "email", validationRules: ["email"] },
);
add(
  "registration",
  "arrivalDate",
  "Expected Date of Arrival",
  "Use your planned arrival date. Check the applicable application window on the official portal.",
  {
    ...live,
    ...date,
    validationRules: ["date", "future"],
    helpSources: [REGISTRATION, VISA_INSTRUCTIONS],
    knownIssueIds: ["uncertain-arrival-date"],
  },
);
add(
  "registration",
  "visaService",
  "Visa Service",
  "The portal fills Visa Service from your Visiting India for selection.",
  {
    type: "select",
    helpSources: [VISA_INSTRUCTIONS, SAMPLE],
    verifiedAt: FIELD_HELP_REVIEWED_AT,
  },
);
add(
  "registration",
  "purpose",
  "Visiting India for",
  "Search the exact purpose labels from the public registration form, including their visa service and duration. Availability depends on nationality and service.",
  {
    type: "select",
    evidenceStatus: "LIVE_VERIFIED",
    verifiedAt: FIELD_HELP_REVIEWED_AT,
    helpSources: [REGISTRATION],
  },
);
add(
  "registration",
  "captcha",
  "Please enter above text",
  "Complete the displayed verification on the official website. The companion does not solve or submit it.",
  live,
);
add(
  "registration",
  "instructions",
  "I have read the instructions ,I have all the required documents in scanned pdf format and photograph in jpg/jpeg format.",
  "Read the official instructions and confirm this statement on the official portal only when it is true.",
  live,
);
add(
  "identity",
  "surname",
  "Surname (exactly as in your Passport)",
  "Use the surname field in your passport. If it is blank, consult official guidance; do not move names automatically.",
  optional,
);
add(
  "identity",
  "givenNames",
  "Given Name/s (exactly as in your Passport)",
  "Include all given names as recorded. Keep the spelling, spacing and punctuation accurate.",
);
add(
  "identity",
  "nameChanged",
  "Have you ever changed your name?",
  "If applicable, prepare your previous names.",
  yn,
);
add(
  "identity",
  "previousName",
  "Previous name details",
  "Provisional combined note: the live form may split previous given names and surname.",
  {
    type: "textarea",
    visibleWhen: when("nameChanged"),
    requiredWhen: when("nameChanged"),
    evidenceStatus: "NEEDS_VERIFICATION",
  },
);
add(
  "identity",
  "gender",
  "Gender",
  "Choose the option corresponding to your passport.",
  { type: "select" },
);
add(
  "identity",
  "birthCity",
  "Town/City of birth",
  "Use the place of birth recorded in your documents.",
);
add(
  "identity",
  "birthCountry",
  "Country of birth",
  "Use the country corresponding to your place of birth.",
);
add(
  "identity",
  "nationalId",
  "Citizenship/National Id No.",
  "Enter your national identity number if applicable. U.S. applicants without a national ID can enter NA.",
  { knownIssueIds: ["national-id"], verifiedAt: CLARIFIED_AT },
);
add(
  "identity",
  "religion",
  "Religion",
  "Choose your religion. If you are not religious, select OTHERS and complete the explanation.",
  { placeholder: "As shown in the portal", knownIssueIds: ["religion-other"] },
);
add(
  "identity",
  "religionOther",
  "If Others, Please specify",
  "Explain accurately in your own words. Do not use NA unless it is true and appropriate.",
  {
    visibleWhen: when("religion", "Other"),
    requiredWhen: when("religion", "Other"),
    knownIssueIds: ["religion-other"],
  },
);
add(
  "identity",
  "identificationMarks",
  "Visible identification marks",
  "Describe visible marks accurately. Check official help if none apply.",
);
add(
  "identity",
  "education",
  "Educational Qualification",
  "Choose your highest qualification from the portal options.",
);
add(
  "identity",
  "nationalityAcquired",
  "Did you acquire Nationality by birth or by naturalization?",
  "Use the option that accurately describes how you acquired your nationality.",
  { type: "select", options: ["By birth", "Naturalization"] },
);
add(
  "identity",
  "previousNationality",
  "Previous nationality",
  "If requested after selecting naturalization, enter your previous nationality.",
  {
    visibleWhen: when("nationalityAcquired", "Naturalization"),
    evidenceStatus: "NEEDS_VERIFICATION",
  },
);
add(
  "identity",
  "residentTwoYears",
  "Have you lived for at least two years in the country where you are applying visa?",
  "Answer for your country of application.",
  yn,
);
add(
  "identity",
  "passportNumber",
  "Passport Number",
  "Use the number on the passport you will carry.",
);
add(
  "identity",
  "passportPlace",
  "Place of Issue",
  "Use the issuing place shown in your passport, not your destination airport.",
);
add(
  "identity",
  "passportIssued",
  "Date of Issue",
  "Use the passport issue date.",
  past,
);
add(
  "identity",
  "passportExpiry",
  "Date of Expiry",
  "Check passport validity requirements on the official portal for your trip.",
  { ...date, validationRules: ["date", "future"] },
);
add(
  "identity",
  "otherPassport",
  "Any other valid Passport/Identity Certificate (IC) held",
  "If yes, prepare details of the other valid document.",
  yn,
);
for (const [id, label] of [
  ["otherPassportCountry", "Country of Issue (other passport)"],
  ["otherPassportNumber", "Passport/IC No."],
  ["otherPassportPlace", "Place of Issue (other passport)"],
  ["otherPassportNationality", "Nationality mentioned therein"],
])
  add("identity", id, label, "Use the details on the other valid document.", {
    visibleWhen: when("otherPassport"),
  });
add(
  "identity",
  "otherPassportIssued",
  "Date of Issue (other passport)",
  "Use the issue date of the other document.",
  { ...past, visibleWhen: when("otherPassport") },
);
add(
  "family",
  "addressStreet",
  "House No./Street (present address)",
  "Keep each address line within 35 characters without omitting details.",
  { type: "textarea", knownIssueIds: ["address-mapping"] },
);
add(
  "family",
  "addressCity",
  "Village/Town/City (present address)",
  "Use your city or town; a neighborhood is not necessarily a city.",
  { knownIssueIds: ["address-mapping"], verifiedAt: CLARIFIED_AT },
);
add(
  "family",
  "addressCountry",
  "Country (present address)",
  "Country of your current residence.",
);
add(
  "family",
  "addressRegion",
  "State/Province/District (present address)",
  "Use the administrative area appropriate to your address.",
  { knownIssueIds: ["address-mapping"], verifiedAt: CLARIFIED_AT },
);
add(
  "family",
  "addressPostcode",
  "Postal/Zip Code",
  "Keep letters, spaces and leading zeros exactly as needed.",
);
add(
  "family",
  "phone",
  "Phone No.",
  "Provide at least one contact number. Fill Phone No. or Mobile No.",
  { required: false, requiredWhen: when("mobile", "") },
);
add(
  "family",
  "mobile",
  "Mobile No.",
  "Provide either a phone number or mobile number.",
  { required: false, requiredWhen: when("phone", "") },
);
add(
  "family",
  "sameAddress",
  "Click here for same address",
  "The official sample shows a checkbox for using your present address as your permanent address.",
  { ...yn, verifiedAt: CLARIFIED_AT },
);
for (const [id, label] of [
  ["permanentStreet", "House No./Street (permanent address)"],
  ["permanentCity", "Village/Town/City (permanent address)"],
  ["permanentRegion", "State/Province/District (permanent address)"],
])
  add(
    "family",
    id,
    label,
    "Prepare your permanent address as requested on the live form.",
    { visibleWhen: when("sameAddress", "No") },
  );
for (const parent of ["Father", "Mother"])
  for (const [suffix, label, desc, req] of [
    ["Name", "Name", "Name as recorded in your family documents.", true],
    ["Nationality", "Nationality", "Current nationality.", true],
    [
      "PreviousNationality",
      "Previous Nationality",
      "Previous nationality, if applicable.",
      false,
    ],
    ["Birthplace", "Place of birth", "Town or city of birth.", true],
    ["BirthCountry", "Country of birth", "Country of birth.", true],
  ] as const)
    add(
      "family",
      `${parent.toLowerCase()}${suffix}`,
      `${parent}’s ${label}`,
      desc,
      { required: req },
    );
add(
  "family",
  "maritalStatus",
  "Applicant's Marital Status",
  "Enter the current portal option. Married applicants may be asked for spouse details.",
);
for (const [id, label] of [
  ["spouseName", "Spouse name"],
  ["spouseNationality", "Spouse nationality"],
  ["spouseBirthplace", "Spouse place of birth"],
  ["spouseBirthCountry", "Spouse country of birth"],
])
  add("family", id, label, "Use your spouse’s details.", {
    visibleWhen: when("maritalStatus", "Married"),
    evidenceStatus: "NEEDS_VERIFICATION",
  });
add(
  "family",
  "pakistanFamily",
  "Were your Parents/Grandparents Pakistan Nationals or belong to a Pakistan held area?",
  "Read the full live question and answer accurately.",
  yn,
);
add(
  "family",
  "pakistanDetails",
  "If yes, give details",
  "Provide the details requested by the portal.",
  { type: "textarea", visibleWhen: when("pakistanFamily") },
);
for (const [id, label, help] of [
  [
    "occupation",
    "Present occupation",
    "Select your current occupation on the official form.",
  ],
  [
    "employer",
    "Employer name / business",
    "Preserve the legal name. Punctuation problems are reported, not established government rules.",
  ],
  ["designation", "Designation", "Your role or title, if requested."],
  [
    "employerAddress",
    "Employer address",
    "Use the full accurate address before considering any explicit formatting change.",
  ],
])
  add("employment", id, label, help, {
    required: false,
    evidenceStatus: "NEEDS_VERIFICATION",
    helpSources: [],
    ...(id === "employer"
      ? {
          validationRules: ["punctuation"] as VisaField["validationRules"],
          knownIssueIds: ["employer-punctuation"],
        }
      : {}),
  });
add(
  "employment",
  "military",
  "Military / police / security background",
  "Provisional preparation note. Check nationality-specific eligibility and the exact official question; no eligibility decision is made here.",
  {
    ...yn,
    required: false,
    evidenceStatus: "NEEDS_VERIFICATION",
    helpSources: [],
  },
);
add(
  "employment",
  "militaryDetails",
  "Service details",
  "Prepare details if requested. Consult the portal if eligibility is unclear.",
  {
    type: "textarea",
    visibleWhen: when("military"),
    evidenceStatus: "NEEDS_VERIFICATION",
    helpSources: [],
  },
);
add(
  "travel",
  "visaArrival",
  "Port of Arrival in India",
  "The port is carried over from registration. Search the shared registry to check its airport code, city or alternate name.",
  {
    type: "port",
    helpSources: [SAMPLE, REGISTRATION],
    knownIssueIds: ["airport-names"],
    verifiedAt: PORTS_OBSERVED_AT,
  },
);
add(
  "travel",
  "places",
  "Places to be visited",
  "List your planned places. Check official guidance before visiting restricted areas.",
  { type: "textarea" },
);
add(
  "travel",
  "tourOperator",
  "Have you booked any room in Hotel/Resort etc. through any Tour Operator?",
  "Answer based on your actual booking.",
  yn,
);
add(
  "travel",
  "operatorDetails",
  "Tour operator / booking details",
  "Provisional note for follow-up questions shown by the live portal.",
  {
    type: "textarea",
    visibleWhen: when("tourOperator"),
    evidenceStatus: "NEEDS_VERIFICATION",
  },
);
add(
  "travel",
  "exitPort",
  "Expected Port of Exit from India",
  "Verify the live exit dropdown separately from arrival ports.",
  optional,
);
add(
  "travel",
  "visitedIndia",
  "Have you ever visited India before?",
  "If yes, gather earlier visa and visit records.",
  yn,
);
for (const [id, label, help] of [
  [
    "previousAddress",
    "Address during previous visit",
    "Use your previous accommodation address.",
  ],
  [
    "previousCities",
    "Cities previously visited in India",
    "Separate the cities you previously visited with commas.",
  ],
  [
    "previousVisaNumber",
    "Last Indian Visa No/Currently valid Indian Visa No.",
    "For a previous e-Visa, use the ETA (Electronic Travel Authorization) number as the previous visa number. The Application ID is a separate tracking number.",
  ],
  [
    "previousVisaType",
    "Type of Visa (previous visa)",
    "Select the appropriate type on the current portal.",
  ],
  [
    "previousVisaPlace",
    "Place of Issue (previous visa)",
    "For a previous Indian e-Visa, you can enter New Delhi. For a regular visa, use the place of issue printed on it.",
  ],
])
  add("travel", id, label, help, {
    visibleWhen: when("visitedIndia"),
    ...(["previousVisaNumber", "previousVisaPlace"].includes(id)
      ? { evidenceStatus: "REPORTED" as const, verifiedAt: CLARIFIED_AT }
      : {}),
    knownIssueIds:
      id === "previousVisaNumber"
        ? ["eta-or-application-id", "previous-visa-validity"]
        : id === "previousVisaPlace"
          ? ["visa-place-of-issue"]
          : id === "previousVisaType"
            ? ["previous-visa-validity"]
            : [],
  });
add(
  "travel",
  "previousVisaDate",
  "Date of Issue (previous visa)",
  "Use the issue date on the earlier visa.",
  { ...past, visibleWhen: when("visitedIndia") },
);
add(
  "travel",
  "refusedIndia",
  "Has permission to visit or to extend stay in India previously been refused?",
  "Answer truthfully based on your history.",
  yn,
);
add(
  "travel",
  "refusalDetails",
  "If so, when and by whom",
  "Include the control number and date if requested.",
  { type: "textarea", visibleWhen: when("refusedIndia") },
);
add(
  "travel",
  "countriesVisited",
  "Countries Visited in Last 10 years",
  "Prepare a list to compare with the live selector.",
  { type: "textarea", required: false },
);
add(
  "travel",
  "saarcVisited",
  "Have you visited SAARC countries (except your own country) during last 3 years?",
  "Check the exact country list and time period on the current form.",
  yn,
);
add(
  "travel",
  "saarcDetails",
  "SAARC visit details",
  "Prepare the country, year and number of visits requested on your form.",
  {
    type: "textarea",
    visibleWhen: when("saarcVisited"),
    evidenceStatus: "NEEDS_VERIFICATION",
  },
);
for (const place of ["India", "home country"])
  for (const [suffix, label] of [
    ["Name", "Reference Name"],
    ["Address", "Reference Address"],
    ["Phone", "Reference Phone"],
  ])
    add(
      "travel",
      `reference${place === "India" ? "India" : "Home"}${suffix}`,
      `${label} in ${place}`,
      place === "India"
        ? "Prepare the reference details requested for your stay."
        : "Prepare contact details for a reference in your home country.",
      {
        type: suffix === "Address" ? "textarea" : "text",
        knownIssueIds:
          place === "India" && suffix === "Name" ? ["reference-in-india"] : [],
      },
    );
const questions = [
  [
    "arrested",
    "Have you ever been arrested / prosecuted / convicted by Court of Law of any country?",
  ],
  [
    "deported",
    "Have you ever been refused entry / deported by any country including India?",
  ],
  [
    "trafficking",
    "Have you ever been engaged in Human trafficking / Drug trafficking / Child abuse / Crime against women / Economic offense / Financial fraud?",
  ],
  [
    "violence",
    "Have you ever been engaged in Cyber crime / Terrorist activities / Sabotage / Espionage / Genocide / Political killing / other act of violence?",
  ],
  [
    "terrorViews",
    "Have you ever expressed views that justify or glorify terrorist violence or may encourage others to terrorist acts or other serious criminal acts?",
  ],
  ["asylum", "Have you sought asylum (political or otherwise) in any country?"],
];
for (const [id, label] of questions) {
  add(
    "background",
    id,
    label,
    "Read the full question and answer accurately on the official form.",
    yn,
  );
  add(
    "background",
    `${id}Details`,
    "Details for the preceding question",
    "Give accurate details if you answered Yes.",
    {
      type: "textarea",
      visibleWhen: when(id),
      evidenceStatus: "NEEDS_VERIFICATION",
    },
  );
}
// Keep metadata for every observed control, including fields without walkthrough help.
for (const observed of liveFields) {
  let seed = seeds.find((item) => item.id === observed.id);
  if (!seed) {
    seed = {
      id: observed.id,
      sectionId: observed.sectionId,
      officialLabel: observed.label,
      description:
        observed.help ??
        `Complete ${observed.label} as requested on the official form.`,
    };
    seeds.push(seed);
  }
  seed.officialLabel = observed.label;
  seed.evidenceStatus = "LIVE_VERIFIED";
  seed.verifiedAt = LIVE_OBSERVED_AT;
  seed.helpSources = [
    ...new Set([observed.source, ...(seed.helpSources ?? [])]),
  ];
  // The guide does not enforce completion; this represents the visible required marker.
  seed.required = observed.requiredMarker;
  const condition =
    observed.when &&
    (
      {
        "If name change is checked": when("nameChanged"),
        "If Religion is OTHERS": when("religion", "OTHERS"),
        "If nationality acquired by Naturalization": when(
          "nationalityAcquired",
          "Naturalization",
        ),
        "If another valid Passport/Identity Certificate is held":
          when("otherPassport"),
        "If marital status is MARRIED": when("maritalStatus", "MARRIED"),
        "If Pakistan family question is Yes": when("pakistanFamily"),
        "If Present Occupation is OTHERS": when("occupation", "OTHERS"),
        "Shown for STUDENT; help also mentions HouseWife/Student/Minor": when(
          "occupation",
          "STUDENT",
        ),
        "If Past Occupation is OTHERS": when("pastOccupation", "OTHERS"),
        "If military / police / security service is Yes": when("military"),
        "If booked through a tour operator": when("tourOperator"),
        "If you have visited India before": when("visitedIndia"),
        "If permission was refused": when("refusedIndia"),
        "If SAARC visits is Yes": when("saarcVisited"),
      } as Record<string, Condition>
    )[observed.when];
  if (condition) seed.visibleWhen = condition;
  if (observed.id === "religionOther")
    seed.requiredWhen = when("religion", "OTHERS");
  seed.options = liveChoices(observed)?.slice();
  if (observed.control === "select" || observed.control === "radio")
    seed.type = "select";
  else if (observed.control === "date") seed.type = "date";
  else if (observed.control === "textarea") seed.type = "textarea";
  else if (observed.id !== "visaArrival") seed.type = "text";
  if (seed.description.startsWith("Provisional"))
    seed.description =
      observed.help ??
      `Use the ${observed.label.toLowerCase()} requested by the form.`;
}
// These phone fields share the reported punctuation advice, without changing
// the independently captured field metadata or silently formatting answers.
for (const id of [
  "phone",
  "mobile",
  "employerPhone",
  "referenceIndiaPhone",
  "referenceHomePhone",
]) {
  const seed = seeds.find((field) => field.id === id);
  if (seed) seed.knownIssueIds = ["phone-format"];
}

export const fields: VisaField[] = seeds.map((f, order) => ({
  type: "text",
  required: true,
  validationRules: [],
  knownIssueIds: [],
  helpSources: [SAMPLE],
  evidenceStatus: "OFFICIAL",
  ...f,
  order,
  options: f.options?.map((label) => ({
    label,
    evidenceStatus: f.evidenceStatus ?? "OFFICIAL",
  })),
}));
const issueSeed: (Omit<KnownIssue, "lastReviewedAt" | "otherSources"> & {
  lastReviewedAt?: string;
  otherSources?: string[];
})[] = [
  {
    id: "employer-punctuation",
    title: "Why does the form clear after I enter my employer’s name?",
    answer:
      "When the employer name’s formatting is rejected, clicking Next may reset the form instead of showing an error. Remove periods and commas while keeping the name accurate, then re-enter any cleared fields and try again.",
    lastVerifiedAt: CLARIFIED_AT,
    otherSources: [
      "Firsthand applicant confirmation · 17 October 2026",
      "User clarification · 19 October 2026: clicking Next may reset the form instead of displaying a formatting error.",
    ],
    sectionIds: ["employment"],
    fieldIds: ["employer"],
    symptoms:
      "Save and Next clears fields after you enter a company name with periods or commas.",
    explanation:
      "A user confirmed firsthand that periods or commas in an employer name caused Save and Next to clear fields, and later clarified that the form may reset instead of displaying the formatting error.",
    workaround:
      "Keep a record of your original answer. Check all entries before retrying. If you consider removing punctuation, first confirm that the resulting name remains accurate. Ask official support when a legal name cannot be entered correctly.",
    evidenceStatus: "REPORTED",
    officialUrls: [],
    caveats:
      "Not a universal punctuation restriction. No silent substitutions or automatic name rewriting.",
  },
  {
    id: "religion-other",
    title: "What if my religion isn’t available?",
    answer:
      "Just select 'Others' and specify either 'NA' or your religion. You can also specify 'not religious' or 'atheist.'",
    lastVerifiedAt: CLARIFIED_AT,
    otherSources: ["Firsthand applicant confirmation · 17 October 2026"],
    sectionIds: ["identity"],
    fieldIds: ["religion", "religionOther"],
    symptoms: "The form resets or refuses to continue after Other is selected.",
    explanation:
      "The official sample shows an “If Others, Please specify” prompt. A user confirmed firsthand that leaving the explanation empty caused the form to reset.",
    workaround:
      "Fill the explanation before continuing. Enter NA if not applicable. Recheck the selection and explanation after a page refresh.",
    evidenceStatus: "REPORTED",
    officialUrls: [SAMPLE],
    caveats:
      "The user confirmed the conditional explanation field and use of NA in their session. Use NA only when it accurately applies.",
  },
  {
    id: "selections-reset",
    title: "Why did my selection disappear?",
    answer:
      "Complete the form from top to bottom and recheck dropdowns and radio buttons after changing an earlier field.",
    lastVerifiedAt: CLARIFIED_AT,
    otherSources: ["Firsthand applicant confirmation · 17 October 2026"],
    sectionIds: ["identity", "family", "travel"],
    fieldIds: [],
    symptoms:
      "A radio button or dropdown returns to blank after the page changes.",
    explanation:
      "A user confirmed firsthand that selecting dependent controls before completing earlier fields could cause those selections to clear.",
    workaround:
      "Work from the top of the government page downward, then recheck every selection before saving.",
    evidenceStatus: "REPORTED",
    officialUrls: [],
    caveats:
      "This describes the user’s observed sequence; recheck selections after changing earlier fields.",
  },
  {
    id: "saved-application-fields",
    title: "Why are some fields blank after Save and Exit?",
    answer:
      "Save and Exit can be inconsistent and does not always save every field. When you return, recheck every section and re-enter any missing answers before continuing.",
    lastVerifiedAt: CLARIFIED_AT,
    otherSources: [
      "User-reported Save and Exit behavior · 17 October 2026",
      "User clarification · 19 October 2026: saving is inconsistent and does not always retain all fields.",
    ],
    sectionIds: [],
    fieldIds: [],
    symptoms:
      "Fields or answers are cleared, blank or missing when you return to resume a saved application after Save and Exit.",
    explanation:
      "The user reported that some fields may be cleared when returning to the official application after Save and Exit, and clarified that saving can inconsistently retain only some fields.",
    workaround:
      "Check each section when reopening the application and fill in any missing answers before continuing.",
    evidenceStatus: "REPORTED",
    officialUrls: [],
    caveats:
      "The report does not identify every affected field or establish that this happens in every session.",
  },
  {
    id: "eta-or-application-id",
    title:
      "What value do I use for my previous visa? Should I enter my ETA number or Application ID?",
    answer:
      "For a previous Indian e-Visa, enter the ETA number from the issued document in the previous visa field, not the Application ID.",
    sectionIds: ["travel"],
    fieldIds: ["previousVisaNumber"],
    symptoms:
      "You cannot tell which number belongs in the previous visa field.",
    explanation:
      "ETA means Electronic Travel Authorization. For a previous Indian e-Visa, the ETA number is the previous visa number. The Application ID tracks the application.",
    workaround:
      "Enter the ETA number from your previously issued e-Visa. For a regular visa, enter the visa number printed on the document.",
    evidenceStatus: "REPORTED",
    lastVerifiedAt: CLARIFIED_AT,
    otherSources: ["User-confirmed guidance · 17 October 2026"],
    officialUrls: [SAMPLE, PORTAL],
    caveats:
      "Copy the number from the issued document, keeping its letters and digits intact.",
  },
  {
    id: "visa-place-of-issue",
    title: "What is the place of issue for my previous visa?",
    answer:
      "Enter New Delhi for a previous Indian e-Visa, or the place printed on your visa for a regular visa.",
    sectionIds: ["travel"],
    fieldIds: ["previousVisaPlace"],
    symptoms: "You arrived through one airport but applied online.",
    explanation:
      "For a previous Indian e-Visa, you can enter New Delhi as the place of issue.",
    workaround:
      "Enter New Delhi for a previous e-Visa. For a regular visa, use the place of issue printed on the visa.",
    evidenceStatus: "REPORTED",
    lastVerifiedAt: CLARIFIED_AT,
    otherSources: ["User-confirmed guidance · 17 October 2026"],
    officialUrls: [SAMPLE, PORTAL],
    caveats: "The place of issue is separate from your arrival airport.",
  },
  {
    id: "airport-names",
    title: "Why is my arrival airport listed under a different name?",
    answer:
      "Indian cities and airports may be listed under alternate names. Match your ticket’s airport code to the corresponding portal entry:",
    answerBullets: [
      "Thiruvananthapuram / Trivandrum (TRV) — TRIVANDRUM AIRPORT.",
      "Bengaluru / Bangalore / Kempegowda (BLR) — BENGALURU AIRPORT.",
      "Kochi / Cochin (COK) — COCHIN AIRPORT.",
      "Kozhikode / Calicut (CCJ) — CALICUT AIRPORT.",
      "Mangaluru / Mangalore (IXE) — MANGALORE AIRPORT.",
    ],
    sectionIds: ["registration"],
    fieldIds: ["arrivalPort"],
    symptoms: "Your ticket’s city name differs from the arrival dropdown.",
    explanation:
      "The live registration dropdown observed on 17 October 2026 contains 86 choices. Our arrival selector searches those exact labels plus separately sourced names and airport codes. Multiple names for one port share a result; different ports in one city remain separate.",
    workaround:
      "Use the airport finder to compare aliases and the observed dropdown label, then check the choice in your current form. Verify authorized entry separately on the official portal.",
    evidenceStatus: "LIVE_VERIFIED",
    officialUrls: [REGISTRATION, PORTAL],
    lastVerifiedAt: PORTS_OBSERVED_AT,
    caveats:
      "Dropdown presence is not proof of authorized entry or eligibility. Choices may change with your session.",
  },
  {
    id: "address-mapping",
    title:
      "I don’t see my city in the toggle options or in the dropdown options.",
    answer:
      "Some Indian cities go by multiple names—for example, Gurgaon is also called Gurugram. Google your city’s name plus “alternate names” to find other names to look for in the options.",
    sectionIds: ["family"],
    fieldIds: ["addressStreet", "addressCity", "addressRegion"],
    symptoms:
      "Your city is missing from the toggle or dropdown options, or appears under a different name.",
    explanation:
      "Some places have multiple names: Gurgaon and Gurugram refer to the same city in Haryana. Older and newer names can appear in addresses and dropdowns. City, district and state are separate parts of an address.",
    workaround:
      "Google the city’s name with alternate names to find other names to look for. Confirm that the option refers to the same place; city, district and state are separate address fields.",
    evidenceStatus: "REPORTED",
    lastVerifiedAt: CLARIFIED_AT,
    otherSources: ["User-confirmed place-name alias · 17 October 2026"],
    officialUrls: ["https://gurugram.gov.in/history/"],
    caveats:
      "A city name alone does not identify a street’s PIN code. Keep the PIN supplied with the full address.",
  },
  {
    id: "reference-in-india",
    title: "Who do I use as my reference in India?",
    answer:
      "You can provide the name of a family member or friend in India, or the hotel where you’re staying.",
    sectionIds: ["travel"],
    fieldIds: ["referenceIndiaName"],
    symptoms:
      "You are unsure who to list as your Indian reference or whether you can use your hotel.",
    explanation:
      "The user supplied guidance that a reference can be a family member or friend in India, or the hotel where the applicant is staying.",
    workaround:
      "Provide the name of your family member, friend or hotel in India.",
    evidenceStatus: "REPORTED",
    officialUrls: [],
    otherSources: ["User-provided reference guidance · 19 October 2026"],
    lastReviewedAt: "2026-10-19",
    caveats:
      "This is user-provided guidance, not an independently verified portal acceptance rule.",
  },
  {
    id: "national-id",
    title: "What if I don’t have a National ID number?",
    answer:
      "Enter your national identity number if you have one, or NA if it does not apply. Americans, for example, do not have national ID numbers and should specify “NA”.",
    sectionIds: ["identity"],
    fieldIds: ["nationalId"],
    symptoms: "You are unsure what number to enter or whether you have one.",
    explanation:
      "This field asks for a national identity number. Enter NA when it does not apply; U.S. applicants without a national ID can use NA.",
    workaround:
      "Enter your applicable national identity number, or NA if you do not have one.",
    evidenceStatus: "OFFICIAL",
    officialUrls: [SAMPLE],
    lastVerifiedAt: REVIEWED_AT,
    otherSources: [
      "U.S. applicant NA guidance confirmed by the user · 17 October 2026",
    ],
    caveats:
      "Enter a number or NA here; your nationality belongs in the separate nationality field.",
  },
  {
    id: "upload-action",
    title: "Why does my file still say “Not Uploaded”?",
    answer:
      "After choosing the file, click Upload Photo or Upload Document and check that the uploaded preview appears before continuing.",
    answerBullets: [
      "The tiny orange upload button has been reported to overlap the file selector. Look carefully for the separate upload action; choosing a filename alone does not upload it.",
    ],
    sectionIds: [],
    fieldIds: [],
    symptoms:
      "A selected filename appears but the official site still says Not Uploaded.",
    explanation:
      "The official sample distinguishes choosing a file from uploading it. The user reported an overlapping orange upload button on 19 October 2026; that layout was not independently reproduced.",
    workaround:
      "On the official site, select the prepared file, perform the displayed upload action, and inspect its status and preview before continuing.",
    evidenceStatus: "REPORTED",
    officialUrls: [SAMPLE],
    otherSources: [
      "User-reported overlapping upload controls · 19 October 2026",
    ],
    lastReviewedAt: "2026-10-19",
    caveats:
      "Before continuing, make sure the file status shows it has uploaded and the preview displays the correct file. This companion never performs the upload.",
  },
  {
    id: "document-requirements",
    title: "What file types and sizes do I need?",
    answer:
      "Use a square JPEG photo of 10 KB–1 MB and at least 350 × 350 pixels, and a passport biodata PDF of 10–300 KB.",
    sectionIds: [],
    fieldIds: [],
    symptoms: "A photo or passport scan is rejected for format or file size.",
    explanation:
      "Prepare a square JPEG photo of 10 KB–1 MB and at least 350 × 350 pixels. Prepare the passport biodata page as a PDF of 10–300 KB.",
    workaround:
      "Use the local file tools, inspect the full-size output, and check the current upload screen. Your face must be clear and the passport text and machine-readable lines legible.",
    evidenceStatus: "OFFICIAL",
    officialUrls: [PORTAL, SAMPLE],
    lastVerifiedAt: REVIEWED_AT,
    caveats:
      "Passing technical bounds cannot establish visual quality or official acceptance. HEIC/HEIF decoding runs locally; damaged or unsupported files need a fresh JPEG/PNG export.",
  },
  {
    id: "phone-format",
    title: "Why is the portal rejecting my phone number?",
    answer:
      "Avoid dashes, parentheses and + in phone numbers, including reference and employer numbers. Spaces may be accepted. Follow any separate country-code prompt.",
    sectionIds: ["family", "employment", "travel"],
    fieldIds: [
      "phone",
      "mobile",
      "employerPhone",
      "referenceIndiaPhone",
      "referenceHomePhone",
    ],
    symptoms:
      "A contact, mobile or reference phone number with punctuation is rejected.",
    explanation:
      "The user reported rejection of dashes, parentheses and +, and clarified that spaces may be accepted. A complete server-side character whitelist has not been independently tested.",
    workaround:
      "Remove dashes, parentheses and + yourself; the companion preserves the number you type.",
    evidenceStatus: "REPORTED",
    officialUrls: [],
    otherSources: ["User-reported phone formatting guidance · 19 October 2026"],
    lastReviewedAt: "2026-10-19",
    caveats:
      "Do not infer a country-code prefix or universal phone-length rule from this report.",
  },
  {
    id: "uncertain-arrival-date",
    title: "What if I don’t know my exact arrival date yet?",
    answer:
      "Use your best estimate of arrival. Entering an earlier date does not necessarily increase flexibility: you must travel within the entry window on your approved ETA.",
    sectionIds: ["registration"],
    fieldIds: ["arrivalDate"],
    symptoms:
      "My travel plans are uncertain and my expected arrival date may change.",
    explanation:
      "Using an estimate is user-provided preparation guidance. The official FAQ distinguishes the ETA’s first-entry window from visa validity; an estimated date does not override the issued conditions.",
    workaround:
      "Use a realistic planned arrival date and check the approved ETA before booking or changing travel.",
    evidenceStatus: "REPORTED",
    officialUrls: [VISA_INSTRUCTIONS],
    otherSources: [
      "User-provided estimated arrival guidance · 19 October 2026; official FAQ Q9 reviewed the same day",
    ],
    lastReviewedAt: "2026-10-19",
    caveats:
      "This does not promise a particular entry window or guarantee that every date change is permitted.",
  },
  {
    id: "previous-visa-validity",
    title: "Is my previous e-Visa still valid, or do I need a new one?",
    answer:
      "Check your issued ETA, passport entry stamp and official visa status before applying again. The visa’s duration alone does not tell you whether it covers another trip.",
    answerBullets: [
      "30-day e-Tourist: first entry must fall within the ETA’s entry window. After first arrival, validity runs for 30 days; check the stamped expiry and permitted entries.",
      "1-year e-Tourist: validity runs for 365 days from the grant of the ETA, not your first arrival.",
      "5-year e-Tourist: validity runs for five years from the grant of the ETA. Check its expiry and stay limits before each trip.",
      "If it has expired or no longer covers your trip, you need a new appropriate visa. If it is still valid and your trip meets its entry and stay conditions, a new application may not be needed.",
    ],
    sectionIds: ["travel"],
    fieldIds: ["previousVisaNumber", "previousVisaType"],
    symptoms:
      "I have an old or expired 30-day, 1-year or 5-year tourist e-Visa and want to return to India.",
    explanation:
      "Official FAQ Q8–Q10 describes status checks, validity and non-extension. The application decision is a practical inference from those conditions, not an assessment of a particular traveler’s eligibility.",
    workaround:
      "Check the ETA and official visa status; contact the official helpdesk if the dates or conditions are unclear.",
    evidenceStatus: "OFFICIAL",
    officialUrls: [VISA_INSTRUCTIONS],
    lastVerifiedAt: "2026-10-19",
    lastReviewedAt: "2026-10-19",
    caveats:
      "Visa validity is distinct from permitted length of stay. Follow the conditions on the issued document; this guide cannot decide individual eligibility.",
  },
  {
    id: "payment-reference",
    title: "Is my Payment ID the same as my Application ID?",
    answer:
      "No. Payment may generate a separate reference or transaction ID. Save it and the receipt alongside your Application ID: one identifies the payment, the other your visa application.",
    sectionIds: [],
    fieldIds: [],
    symptoms:
      "The payment gateway shows a different ID or transaction number from the application.",
    explanation:
      "The official SBI ePay FAQ describes a payment-success reference number and transactions against an application ID.",
    workaround:
      "Save both identifiers and the receipt on your own device for status checks or payment support.",
    evidenceStatus: "OFFICIAL",
    officialUrls: [VISA_INSTRUCTIONS],
    lastVerifiedAt: "2026-10-19",
    lastReviewedAt: "2026-10-19",
    caveats:
      "Payment references are not ETA numbers or evidence that the visa has been granted.",
  },
  {
    id: "paypal-sbi-epay",
    title: "Why does choosing PayPal take me to SBI ePay?",
    answer:
      "SBI ePay offers PayPal within its payment page, so selecting PayPal may still take you there. If PayPal is not immediately visible, scroll down through the payment options to find it.",
    sectionIds: [],
    fieldIds: [],
    symptoms:
      "PayPal seems missing or hidden after the portal opens the SBI ePay gateway.",
    explanation:
      "The official SBI ePay FAQ confirms PayPal is an offered channel. The user reported that its option required scrolling; that layout was not independently reproduced.",
    workaround:
      "Look through the SBI ePay payment options and scroll for PayPal, if offered in your session.",
    evidenceStatus: "REPORTED",
    officialUrls: [VISA_INSTRUCTIONS],
    otherSources: [
      "User-reported PayPal placement inside SBI ePay · 19 October 2026",
    ],
    lastReviewedAt: "2026-10-19",
    caveats: "Gateway layout and available payment methods can change.",
  },
  {
    id: "payment-retry",
    title: "Why can’t I retry my payment straight away?",
    answer:
      "A reported session temporarily blocked retries for about 12 minutes. That is not a guaranteed timeout; follow the portal’s current message and check payment status before trying again.",
    answerBullets: [
      "The official SBI ePay FAQ specifies a minimum 25-minute gap between transactions. The reported 12-minute restriction is not permission to retry earlier.",
      "If you were charged or payment is pending, allow up to two hours for the status update and use Verify Payment / Pay e-Visa Fee before another attempt.",
    ],
    sectionIds: [],
    fieldIds: [],
    symptoms:
      "The payment retry is locked, disabled or shows a waiting period after an attempt.",
    explanation:
      "The user reported an approximately 12-minute retry restriction. Official SBI ePay FAQ 11 separately specifies a 25-minute transaction gap; general instructions allow two hours for status updates.",
    workaround:
      "Follow the displayed wait and official gateway instructions, then verify status before retrying. Contact payment support if unresolved.",
    evidenceStatus: "REPORTED",
    officialUrls: [VISA_INSTRUCTIONS],
    otherSources: [
      "User-reported temporary payment retry restriction · 19 October 2026",
    ],
    lastReviewedAt: "2026-10-19",
    caveats:
      "The report does not establish a universal timeout or guarantee that a retry is safe when that time has elapsed.",
  },
  {
    id: "payment-pending",
    title: "What if I was charged but payment is still pending?",
    answer:
      "Allow up to two hours for the status to update, then use Verify Payment / Pay e-Visa Fee on the official portal before trying another payment.",
    sectionIds: [],
    fieldIds: [],
    symptoms: "The bank shows a charge but the government status is pending.",
    explanation:
      "The official instructions say payment status updates can take up to two hours.",
    workaround:
      "Wait for the stated update period and use Verify Payment / Pay e-Visa Fee on the official portal before attempting another payment or application. Contact the official helpdesk if unresolved.",
    evidenceStatus: "OFFICIAL",
    officialUrls: [PORTAL],
    lastVerifiedAt: REVIEWED_AT,
    caveats:
      "We do not process payments or collect payment details. Recheck current official instructions.",
  },
];
export const issues: KnownIssue[] = issueSeed.map((i) => ({
  ...i,
  lastReviewedAt:
    i.lastReviewedAt ?? (i.otherSources ? CLARIFIED_AT : REVIEWED_AT),
  otherSources: i.otherSources ?? [],
}));
export const locations: LocationAlias[] = arrivalPorts.map((port) => ({
  id: port.id,
  canonicalName: port.names[0] ?? port.label,
  aliases: port.names.slice(1),
  airportCode: port.code,
  region: "Registration arrival option",
  locationKind: port.kind,
  confidence: "LIVE_VERIFIED",
  aliasSources: port.aliasSources,
  liveDropdownLabels: [
    {
      label: port.label,
      context: "Registration · Port Of Arrival · before applicant gate",
      observedAt: PORTS_OBSERVED_AT,
      source: PORTS_SOURCE,
    },
  ],
  caveat:
    "Dropdown presence does not establish entry eligibility. Confirm the choice and authorized entry on your current official form.",
}));
locations.push({
  id: "gurugram",
  canonicalName: "Gurugram",
  aliases: ["Gurgaon"],
  region: "Haryana",
  locationKind: "district",
  confidence: "REPORTED",
  aliasSources: ["https://gurugram.gov.in/history/"],
  liveDropdownLabels: [],
  caveat:
    "Gurgaon and Gurugram are alternate names. Match the city or district requested by the field and use the PIN from the full address.",
});
