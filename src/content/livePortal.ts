import choices from "./livePortalChoices.json" with { type: "json" };
import { arrivalPorts } from "./arrivalPorts";

export const LIVE_OBSERVED_AT = "2026-10-18";
export const LIVE_SCOPE =
  "Synthetic adult U.S. ordinary-passport application; 30-day e-Tourist visa for tourism/recreation/sightseeing. Branches listed below were opened; other nationalities, services and server rules were not exhaustively tested.";
const base = "https://indianvisaonline.gov.in/evisa/";
export type LiveControl =
  "text" | "textarea" | "date" | "select" | "radio" | "checkbox" | "readonly";
export type LiveField = {
  id: string;
  elementId: string;
  label: string;
  control: LiveControl;
  requiredMarker: boolean;
  htmlRequired: false;
  maxLength?: number;
  choiceList?: keyof typeof choices | "ports";
  when?: string;
  help?: string;
  radioValues?: readonly string[];
  multiple?: boolean;
  labelSource?: "companion";
};
export type LiveGroup = { headings: string[]; fields: LiveField[] };
export type LiveScreen = {
  id: string;
  sectionId: string;
  title: string;
  source: string;
  groups: LiveGroup[];
};
const f = (
  id: string,
  elementId: string,
  label: string,
  requiredMarker: boolean,
  maxLength?: number,
  extras: Partial<LiveField> = {},
): LiveField => ({
  id,
  elementId,
  label,
  requiredMarker,
  htmlRequired: false,
  control: "text",
  ...(maxLength === undefined ? {} : { maxLength }),
  ...extras,
});
const select = (choiceList: LiveField["choiceList"]): Partial<LiveField> => ({
  control: "select",
  choiceList,
});
const yn: Partial<LiveField> = { control: "radio" };
const otherPassport = "If another valid Passport/Identity Certificate is held";
const changedName = "If name change is checked";
const previousVisit = "If you have visited India before";
const tour = "If booked through a tour operator";
const military = "If military / police / security service is Yes";
const spouse = "If marital status is MARRIED";
const date: Partial<LiveField> = {
  control: "date",
  help: "In DD/MM/YYYY format",
};
const parent = (prefix: "father" | "mother", ids: string[]): LiveField[] => [
  f(`${prefix}Name`, ids[0], "Name", true, 50),
  f(
    `${prefix}Nationality`,
    ids[1],
    "Nationality/Region",
    true,
    undefined,
    select("countries"),
  ),
  f(
    `${prefix}PreviousNationality`,
    ids[2],
    "Previous Nationality/Region",
    false,
    undefined,
    select("countries"),
  ),
  f(`${prefix}Birthplace`, ids[3], "Place of birth", true, 50),
  f(
    `${prefix}BirthCountry`,
    ids[4],
    "Country/Region of birth",
    true,
    undefined,
    select("countries"),
  ),
];
export const liveScreens: LiveScreen[] = [
  {
    id: "applicant",
    sectionId: "identity",
    title: "Applicant Details Form",
    source: `${base}BasicDetails`,
    groups: [
      {
        headings: ["Applicant Details"],
        fields: [
          f(
            "surname",
            "surname",
            "Surname (exactly as in your Passport)",
            false,
            50,
            { help: "Surname/Family Name (exactly as in Passport)" },
          ),
          f(
            "givenNames",
            "givenName",
            "Given Name/s (exactly as in your Passport)",
            true,
            50,
            {
              help: "Given Name/s (exactly as in Passport).Visa may not be granted if name in passport and application do not match.",
            },
          ),
          f(
            "nameChanged",
            "changedSurnameCheck",
            "Have you ever changed your name? If yes, click the box and give details.",
            false,
            undefined,
            {
              control: "checkbox",
              help: "If You have ever changed your Name Please tell us.",
            },
          ),
          f("previousName", "prev_surname", "Previous Surname", true, 50, {
            when: changedName,
          }),
          f(
            "previousGivenNames",
            "prev_given_name",
            "Previous Name",
            true,
            50,
            { when: changedName, help: "Previous given name" },
          ),
          f("gender", "gender", "Gender", true, undefined, select("gender")),
          f("applicantDob", "", "Date of Birth", true, undefined, {
            control: "readonly",
            help: "Date of Birth as in Passport in DD/MM/YYYY format",
          }),
          f("birthCity", "birth_place", "Town/City of birth", true, 50, {
            help: "Province/Town/City of birth",
          }),
          f(
            "birthCountry",
            "country_birth",
            "Country/Region of birth",
            true,
            undefined,
            select("countries"),
          ),
          f(
            "nationalId",
            "nic_number",
            "Citizenship/National Id No.",
            true,
            30,
            { help: "If not applicable Please Type NA" },
          ),
          f(
            "religion",
            "religion",
            "Religion",
            true,
            undefined,
            select("religion"),
          ),
          f(
            "religionOther",
            "religion_other",
            "If Others, Please specify",
            true,
            20,
            {
              when: "If Religion is OTHERS",
              help: "Please specify religion",
              labelSource: "companion",
            },
          ),
          f(
            "identificationMarks",
            "identity_marks",
            "Visible identification marks",
            true,
            35,
          ),
          f(
            "education",
            "education",
            "Educational Qualification",
            true,
            undefined,
            select("education"),
          ),
          f(
            "acquiredQualification",
            "acquired_qualification",
            "Qualification acquired from College/University",
            true,
            200,
          ),
          f("applicantNationality", "", "Nationality/Region", true, undefined, {
            control: "readonly",
          }),
          f(
            "nationalityAcquired",
            "nationality_by",
            "Did you acquire Nationality by birth or by naturalization?",
            true,
            undefined,
            select("nationalityAcquired"),
          ),
          f(
            "previousNationality",
            "prev_nationality",
            "Prev. Nationality/Region",
            true,
            undefined,
            {
              ...select("countries"),
              when: "If nationality acquired by Naturalization",
              help: "Specify Previous Nationality/Region",
            },
          ),
          f(
            "residentTwoYears",
            "refer_flag1",
            "Have you lived for at least two years in the country where you are applying visa?",
            false,
            undefined,
            { control: "radio", radioValues: ["N", "Y"] },
          ),
        ],
      },
      {
        headings: ["Passport Details"],
        fields: [
          f("passportNumber", "passport_no", "Passport Number", true, 14, {
            help: "Applicant's Passport Number",
          }),
          f(
            "passportPlace",
            "passport_issue_place",
            "Place of Issue",
            true,
            20,
          ),
          f(
            "passportIssued",
            "passport_issue_date",
            "Date of Issue",
            true,
            10,
            date,
          ),
          f(
            "passportExpiry",
            "passport_expiry_date",
            "Date of Expiry",
            true,
            10,
            {
              ...date,
              help: "In DD/MM/YYYY format.Minimum Six Months Validity is Required from journey date.",
            },
          ),
          f(
            "otherPassport",
            "other_ppt_1",
            "Any other valid Passport/Identity Certificate(IC) held,",
            false,
            undefined,
            {
              control: "radio",
              radioValues: ["YES", "NO"],
              help: "If Yes Please give Details",
            },
          ),
          f(
            "otherPassportCountry",
            "other_ppt_country_issue",
            "Country of Issue",
            true,
            undefined,
            {
              ...select("countries"),
              when: otherPassport,
              help: "Country/Region of Issue",
            },
          ),
          f(
            "otherPassportNumber",
            "other_ppt_no",
            "Passport/IC No.",
            true,
            14,
            { when: otherPassport },
          ),
          f(
            "otherPassportIssued",
            "other_ppt_issue_date",
            "Date of Issue",
            true,
            10,
            { ...date, when: otherPassport },
          ),
          f(
            "otherPassportPlace",
            "other_ppt_issue_place",
            "Place of Issue",
            true,
            20,
            { when: otherPassport },
          ),
          f(
            "otherPassportNationality",
            "other_ppt_nat",
            "Nationality mentioned therein",
            true,
            undefined,
            {
              ...select("countries"),
              when: otherPassport,
              help: "Nationality described therein",
            },
          ),
        ],
      },
    ],
  },
  {
    id: "address-family",
    sectionId: "family",
    title: "Applicant Details Form",
    source: `${base}FamilyDetails`,
    groups: [
      {
        headings: ["Applicant's Address Details", "Present Address"],
        fields: [
          f("addressStreet", "pres_add1", "House No./Street", true, 35, {
            help: "Applicant's Present Address. Maximum 35 characters (Each Line)",
          }),
          f("addressCity", "pres_add2", "Village/Town/City", true, 35),
          f(
            "addressCountry",
            "pres_country",
            "Country",
            true,
            undefined,
            select("countries"),
          ),
          f("addressRegion", "pres_add3", "State/Province/District", true, 35),
          f("addressPostcode", "pincode", "Postal/Zip Code", true, 15),
          f("phone", "pres_phone", "Phone No.", true, 15, {
            help: "One Contact No is Mandatory",
          }),
          f("mobile", "mobile", "Mobile No.", true, 15),
          f("addressEmail", "", "Email Address", false, undefined, {
            control: "readonly",
          }),
          f(
            "sameAddress",
            "sameAddress_id",
            "Click here for same address",
            false,
            undefined,
            { control: "checkbox" },
          ),
        ],
      },
      {
        headings: ["Applicant's Address Details", "Permanent Address"],
        fields: [
          f("permanentStreet", "perm_address1", "House No./Street", true, 35),
          f("permanentCity", "perm_address2", "Village/Town/City", false, 35),
          f(
            "permanentRegion",
            "perm_address3",
            "State/Province/District",
            false,
            35,
          ),
        ],
      },
      {
        headings: ["Family Details", "Father's Details"],
        fields: parent("father", [
          "fthrname",
          "father_nationality",
          "father_previous_nationality",
          "father_place_of_birth",
          "father_country_of_birth",
        ]),
      },
      {
        headings: ["Family Details", "Mother's Details"],
        fields: parent("mother", [
          "mother_name",
          "mother_nationality",
          "mother_previous_nationality",
          "mother_place_of_birth",
          "mother_country_of_birth",
        ]),
      },
      {
        headings: ["Family Details"],
        fields: [
          f(
            "maritalStatus",
            "marital_status",
            "Applicant's Marital Status",
            true,
            undefined,
            select("maritalStatus"),
          ),
        ],
      },
      {
        headings: ["Family Details", "Spouse's Details"],
        fields: [
          f("spouseName", "spouse_name", "Name", true, 50, { when: spouse }),
          f(
            "spouseNationality",
            "spouse_nationality",
            "Nationality/Region",
            true,
            undefined,
            { ...select("countries"), when: spouse },
          ),
          f(
            "spousePreviousNationality",
            "spouse_previous_nationality",
            "Previous Nationality/Region",
            false,
            undefined,
            { ...select("countries"), when: spouse },
          ),
          f(
            "spouseBirthplace",
            "spouse_place_of_birth",
            "Place of birth",
            true,
            50,
            { when: spouse },
          ),
          f(
            "spouseBirthCountry",
            "spouse_country_of_birth",
            "Country/Region of birth",
            true,
            undefined,
            { ...select("countries"), when: spouse },
          ),
        ],
      },
      {
        headings: ["Family Details"],
        fields: [
          f(
            "pakistanFamily",
            "grandparent_flag1",
            "Were your Parents/Grandparents (paternal/maternal) Pakistan Nationals or Belong to Pakistan held area.",
            true,
            undefined,
            yn,
          ),
          f(
            "pakistanDetails",
            "grandparent_details",
            "If Yes, give details",
            true,
            50,
            { when: "If Pakistan family question is Yes" },
          ),
        ],
      },
      {
        headings: ["Profession / Occupation Details of Applicant"],
        fields: [
          f(
            "occupation",
            "occupation",
            "Present Occupation",
            true,
            undefined,
            select("occupation"),
          ),
          f(
            "occupationOther",
            "occupationOther",
            "Other occupation",
            false,
            30,
            {
              when: "If Present Occupation is OTHERS",
              labelSource: "companion",
            },
          ),
          f(
            "occupationOwner",
            "occ_flag",
            "Specify below occupation details of",
            true,
            undefined,
            {
              ...select("occupationOwner"),
              when: "Shown for STUDENT; help also mentions HouseWife/Student/Minor",
              help: "In case of HouseWife/Student/Minor Please specify Spouse/Parent's Occupation details.",
            },
          ),
          f("employer", "empname", "Employer Name/business", true, 50),
          f("designation", "empdesignation", "Designation", false, 50),
          f("employerAddress", "empaddress", "Address", true, 50),
          f("employerPhone", "empphone", "Phone", false, 15),
          f(
            "pastOccupation",
            "previous_occupation",
            "Past Occupation, if any",
            false,
            undefined,
            select("occupation"),
          ),
          f(
            "pastOccupationOther",
            "previous_occupation_details",
            "Other past occupation",
            false,
            100,
            { when: "If Past Occupation is OTHERS", labelSource: "companion" },
          ),
          f(
            "military",
            "prev_org1",
            "Are/were you in a Military/Semi-Military/Police/Security. Organization?",
            false,
            undefined,
            yn,
          ),
          f(
            "militaryDetails",
            "previous_organization",
            "Organization",
            true,
            50,
            { when: military },
          ),
          f(
            "militaryDesignation",
            "previous_designation",
            "Designation",
            true,
            50,
            { when: military },
          ),
          f("militaryRank", "previous_rank", "Rank", true, 50, {
            when: military,
          }),
          f(
            "militaryPosting",
            "previous_posting",
            "Place of Posting",
            true,
            50,
            { when: military },
          ),
        ],
      },
    ],
  },
  {
    id: "visa",
    sectionId: "travel",
    title: "Visa Details Form",
    source: `${base}VisaDetails`,
    groups: [
      {
        headings: ["Details of Visa Sought"],
        fields: [
          f(
            "places",
            "placesToBeVisited1_id",
            "Places to be visited",
            true,
            50,
            {
              help: "If you intend to visit Protected/Restricted/Cantonment areas, you would require prior permission from the Civil Authority. Please visit this website.",
            },
          ),
          f(
            "placesLine2",
            "placesToBeVisited2_id",
            "Places to be visited line 2",
            false,
            50,
          ),
          f(
            "tourOperator",
            "haveYouBookedRoomInHotel_yes_id",
            "Have you booked any room in Hotel/Resort etc. through any Tour Operator?",
            false,
            undefined,
            yn,
          ),
          f(
            "operatorDetails",
            "nameTourOperator_id",
            "Name of the tour operator",
            false,
            50,
            { when: tour },
          ),
          f(
            "operatorAddress",
            "addressTourOperator_id",
            "Address of the tour operator",
            false,
            50,
            { when: tour },
          ),
          f(
            "operatorHotel",
            "nameOfHotelResort_id",
            "Name of Hotel/Resort etc",
            false,
            50,
            { when: tour },
          ),
          f(
            "operatorHotelCity",
            "placeOfHotelResort_id",
            "Place/City of Hotel/Resort etc",
            false,
            50,
            { when: tour },
          ),
          f("visaArrival", "", "Port of Arrival in India", true, undefined, {
            control: "readonly",
          }),
          f(
            "exitPort",
            "exitpoint",
            "Expected Port of Exit from India",
            false,
            undefined,
            select("ports"),
          ),
        ],
      },
      {
        headings: ["Previous Visa/Currently valid Visa Details"],
        fields: [
          f(
            "visitedIndia",
            "old_visa_flag1",
            "Have you ever visited India before?",
            true,
            undefined,
            yn,
          ),
          f("previousAddress", "prv_visit_add1", "Address", true, 35, {
            when: previousVisit,
          }),
          f(
            "previousAddressLine2",
            "prv_visit_add2",
            "Address line 2",
            false,
            35,
            { when: previousVisit, labelSource: "companion" },
          ),
          f(
            "previousAddressLine3",
            "prv_visit_add3",
            "Address line 3",
            false,
            35,
            { when: previousVisit, labelSource: "companion" },
          ),
          f(
            "previousCities",
            "visited_city",
            "Cities previously visited in India",
            true,
            75,
            {
              control: "textarea",
              when: previousVisit,
              help: "Cities in India visited (comma separated)",
            },
          ),
          f(
            "previousVisaNumber",
            "old_visa_no",
            "Last Indian Visa No/Currently valid Indian Visa No.",
            true,
            10,
            { when: previousVisit },
          ),
          f(
            "previousVisaType",
            "old_visa_type_id",
            "Type of Visa",
            true,
            undefined,
            { ...select("previousVisaType"), when: previousVisit },
          ),
          f(
            "previousVisaPlace",
            "oldvisaissueplace",
            "Place of Issue",
            true,
            50,
            { when: previousVisit },
          ),
          f("previousVisaDate", "oldvisaissuedate", "Date of Issue", true, 10, {
            ...date,
            when: previousVisit,
          }),
          f(
            "refusedIndia",
            "refuse_flag1",
            "Has permission to visit or to extend stay in India previously been refused?",
            false,
            undefined,
            yn,
          ),
          f(
            "refusalDetails",
            "refuse_details",
            "If so, when and by whom (Mention Control No. and date also)",
            true,
            100,
            { when: "If permission was refused" },
          ),
        ],
      },
      {
        headings: ["Other Information"],
        fields: [
          f(
            "countriesVisited",
            "country_visited",
            "Countries Visited in Last 10 years",
            false,
            undefined,
            {
              ...select("countriesVisited"),
              multiple: true,
              help: "If information furnished is found to be incorrect at the time of entry or anytime during stay in India, you will be refused entry.",
            },
          ),
        ],
      },
      {
        headings: ["SAARC Country Visit Details"],
        fields: [
          f(
            "saarcVisited",
            "saarc_flag1",
            "Have you visited SAARC countries (except your own country) during last 3 years?",
            false,
            undefined,
            yn,
          ),
          f(
            "saarcDetails",
            "saarcCountry1",
            "Name of SAARC country",
            true,
            undefined,
            { ...select("saarcCountry"), when: "If SAARC visits is Yes" },
          ),
          f("saarcYear", "saarcYear1", "Year", true, undefined, {
            ...select("saarcYear"),
            when: "If SAARC visits is Yes",
          }),
          f("saarcVisitCount", "saarcVisitNo1", "No. of visits", true, 3, {
            when: "If SAARC visits is Yes",
          }),
        ],
      },
      {
        headings: ["Reference"],
        fields: [
          f(
            "referenceIndiaName",
            "nameofsponsor_ind",
            "Reference Name in India",
            true,
            50,
          ),
          f("referenceIndiaAddress", "add1ofsponsor_ind", "Address", true, 200),
          f(
            "referenceIndiaAddressLine2",
            "add2ofsponsor_ind",
            "Address line 2",
            false,
            200,
            { labelSource: "companion" },
          ),
          f(
            "referenceIndiaState",
            "stateofsponsor_ind",
            "State",
            true,
            undefined,
            select("referenceIndiaState"),
          ),
          f(
            "referenceIndiaDistrict",
            "districtofsponsor_ind",
            "District",
            true,
            undefined,
            {
              control: "select",
              help: "District options depend on State. DELHI was tested: DELHI, NEW DELHI, NOT KNOWN.",
            },
          ),
          f(
            "referenceIndiaPhone",
            "phoneofsponsor_ind",
            "Phone No/Mobile No",
            true,
            15,
          ),
          f(
            "referenceHomeName",
            "nameofsponsor_msn",
            "Reference Name in UNITED STATES OF AMERICA",
            true,
            50,
            {
              help: "Please mention one contact details in Home Country to be contacted in case of emergency",
            },
          ),
          f("referenceHomeAddress", "add1ofsponsor_msn", "Address", true, 35),
          f(
            "referenceHomeAddressLine2",
            "add2ofsponsor_msn",
            "Address line 2",
            false,
            35,
            { labelSource: "companion" },
          ),
          f(
            "referenceHomePhone",
            "phoneofsponsor_msn",
            "Phone No/Mobile No",
            true,
            15,
          ),
        ],
      },
    ],
  },
  {
    id: "background",
    sectionId: "background",
    title: "Additional Question Details",
    source: `${base}AdditionalQuestions`,
    groups: [
      {
        headings: [
          "Please provide below given details. Please give details if marked YES.",
        ],
        fields: [
          ...(
            [
              [
                "arrested",
                "Have you ever been arrested/ prosecuted/ convicted by Court of Law of any country?",
              ],
              [
                "deported",
                "Have you ever been refused entry / deported by any country including India?",
              ],
              [
                "trafficking",
                "Have you ever been engaged in Human trafficking/ Drug trafficking/ Child abuse/ Crime against women/ Economic offense / Financial fraud?",
              ],
              [
                "violence",
                "Have you ever been engaged in Cyber crime/ Terrorist activities/ Sabotage/ Espionage/ Genocide/ Political killing/ other act of violence?",
              ],
              [
                "terrorViews",
                "Have you ever by any means or medium, expressed views that justify or glorify terrorist violence or that may encourage others to terrorist acts or other serious criminal acts?",
              ],
              [
                "asylum",
                "Have you sought asylum (political or otherwise)in any country?",
              ],
            ] as const
          ).flatMap(([id, label], index) => [
            f(id, `question_yes_${index + 1}`, label, true, undefined, {
              control: "radio",
              radioValues: ["YES", "NO"],
            }),
            f(
              `${id}Details`,
              `answer_${index + 1}`,
              "Please give details",
              false,
              200,
              {
                control: "textarea",
                when: `If question ${index + 1} is Yes`,
                help: "Please give details",
              },
            ),
          ]),
          f(
            "backgroundDeclaration",
            "verifyQuestions",
            "Declaration",
            false,
            undefined,
            {
              control: "checkbox",
              help: "I [applicant name], hereby declare that the information furnished above is correct to the best of my knowledge and belief. in case the information is found false at any stage, I am liable for legal action/deportation/blacklisting or any other action as deemed fit by the Government of India.",
            },
          ),
        ],
      },
    ],
  },
];
export const liveFields = liveScreens.flatMap((screen) =>
  screen.groups.flatMap((group) =>
    group.fields.map((field) => ({
      ...field,
      screenId: screen.id,
      sectionId:
        group.headings[0] === "Profession / Occupation Details of Applicant"
          ? "employment"
          : screen.sectionId,
      headings: group.headings,
      source: screen.source,
      observedAt: LIVE_OBSERVED_AT,
    })),
  ),
);
export function liveChoices(field: LiveField): readonly string[] | undefined {
  if (field.choiceList === "ports")
    return arrivalPorts.map((port) => port.label);
  if (field.choiceList)
    return choices[field.choiceList].map((choice) => choice.label);
  if (field.control === "radio") return ["Yes", "No"];
}
export const liveCapture = {
  observedAt: LIVE_OBSERVED_AT,
  evidenceStatus: "LIVE_VERIFIED",
  scope: LIVE_SCOPE,
  method:
    "Read-only DOM metadata and explicit synthetic form interactions. No answers, application IDs, session tokens or files retained. HTML whitespace collapsed in labels. Placeholder options excluded from choice catalogs.",
  limitations: [
    "Required markers and HTML required attributes are separate observations. Neither alone proves server enforcement; HTML maxlength is not a complete validation contract.",
    "No complete allowed-character whitelist established. Absence of a pattern attribute does not establish unrestricted input.",
    "Applicant controls inspected for pattern, onkeypress, onkeydown, onkeyup, onblur, onchange, onpaste, title and inputmode. Only religion/nationality onchange handlers were present among these attributes.",
    "Surname is unmarked; given names are marked required. No claim that a blank surname passes every case.",
    "Education qualification text was visible initially and with GRADUATE; other education branches not exhaustively tested.",
    "SAARC DOM contained eight repeat rows, only the first visible after Yes. Plus/minus buttons were observed but not exercised. Year options are a dated snapshot.",
    "Initial District DOM contained 821 entries including duplicate labels, plus Select District. These are not valid options for every state. Only DELHI filtering was tested.",
    "Religion Other shares the Religion required row; its individual requiredness was not tested. Additional-question explanations have no separate required marker, but the page instructs details for Yes.",
    "Reference home-country heading varies by nationality. Visa type, duration and entries appeared in the page header, not separate travel fields.",
  ],
  branchesTested: [
    "Name change",
    "Religion OTHERS",
    "Nationality by Naturalization",
    "Other passport Yes/No",
    "Marital status MARRIED/SINGLE",
    "Pakistan family Yes/No",
    "Occupation OTHERS/STUDENT",
    "Past occupation OTHERS",
    "Military Yes/No",
    "Tour operator Yes/No",
    "Previous visit Yes/No",
    "Refusal Yes/No",
    "SAARC Yes/No",
    "Reference State DELHI",
    "All six background Yes explanations",
  ],
  validationObservations: [
    {
      screen: "applicant",
      fields: ["surname", "givenNames"],
      probe: "Hyphen in synthetic surname; period in synthetic given names",
      message: "Enter Alphabets or spaces Only",
      result:
        "Both name errors returned after Save and Continue. All inspected editable text, select and radio answers cleared. Complete allowed character set not established.",
    },
    {
      screen: "address-family",
      fields: ["mobile"],
      probe: "Phone filled, mobile empty",
      message: "Mobile number is required",
      result:
        "Page did not advance until mobile was supplied, despite One Contact No is Mandatory help.",
    },
    {
      screen: "address-family",
      fields: [
        "designation",
        "employerPhone",
        "pastOccupation",
        "fatherPreviousNationality",
        "motherPreviousNationality",
      ],
      probe: "Left blank",
      result: "Page advanced successfully on the tested route.",
    },
    {
      screen: "visa",
      fields: ["referenceIndiaAddressLine2"],
      probe:
        "Second Indian-reference address line blank; save returned to page with pipe-delimited district/state suffix in that line",
      message: "Invalid Characters",
      result:
        "Next save rejected that text; replacing the line with synthetic city text allowed advancement. Cause not established.",
    },
  ],
  screens: liveScreens,
  photo: {
    title: "Upload Photograph",
    source: `${base}PhotoUpload`,
    observedAt: LIVE_OBSERVED_AT,
    field: {
      label: "Choose the Photo To Upload",
      elementId: "image_error_id",
      name: "appl.image",
      type: "file",
      accept: null,
      htmlRequired: false,
    },
    actions: [
      { label: "Upload Photo", elementId: "continue" },
      { label: "Exit", elementId: "exit" },
    ],
    specifications: [
      "Format – JPEG",
      "Size – Minimum 10 KB , Maximum 1 MB",
      "The minimum dimensions are 350 pixels (width) x 350 pixels (height).",
      "Recent front facing photograph with white background to be uploaded by the applicant.",
      "Do not crop the Passport Image to use it as your recent photograph. Upload clear front facing photograph with preferable white/light coloured background.",
      "The application is liable to be rejected if the uploaded photograph are not clear and as per specification.",
    ],
    resumeInstructions:
      "The page says photo upload can be done later using Complete Partially Filled Form on the home page and the Temporary Application ID.",
    stoppingPoint:
      "Reached PhotoUpload after the user explicitly authorized the background declaration and Continue. No file uploaded. Crop, document upload, final review and payment were not inspected in this synthetic session.",
  },
};
