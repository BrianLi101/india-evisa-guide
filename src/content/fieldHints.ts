import type { VisaField } from "../lib/schema";

export const WALKTHROUGH =
  "https://www.visatraveler.com/blog/india-e-visa-application/";
export const US_WALKTHROUGH =
  "https://flightoftheeducator.com/tourist-visa-india-for-us-citizens-walkthrough/";

// Search aliases only; preserve the portal's OTHERS label and option count.
export const religionAliases: Record<string, readonly string[]> = {
  OTHERS: ["Agnostic", "Atheist", "Non-religious", "Not religious"],
};

// Published walkthrough labels, checked 2026-10-17. These are REPORTED,
// not captured from the gated live applicant screen. Keep spelling/case intact.
export const reportedChoices: Record<
  string,
  {
    labels: readonly string[];
    source: string;
    checkedAt: string;
    evidenceStatus: "REPORTED";
  }
> = {
  religion: {
    labels: [
      "BAHAI",
      "BUDDHISM",
      "CHRISTIAN",
      "HINDU",
      "ISLAM",
      "JAINISM",
      "JUDAISM",
      "OTHERS",
      "PARSI",
      "SIKH",
      "ZOROASTRIAN",
    ],
    source: WALKTHROUGH,
    checkedAt: "2026-10-17",
    evidenceStatus: "REPORTED",
  },
  education: {
    labels: [
      "BELOW MATRICULATION",
      "GRADUATE",
      "HIGHER SECONDARY",
      "ILLITERATE",
      "MATRICULATION",
      "NA BEING MINOR",
      "OTHERS",
      "POSTGRADUATE",
      "PROFESSIONAL",
    ],
    source: WALKTHROUGH,
    checkedAt: "2026-10-17",
    evidenceStatus: "REPORTED",
  },
  maritalStatus: {
    labels: ["DIVORCEE", "MARRIED", "SINGLE"],
    source: WALKTHROUGH,
    checkedAt: "2026-10-17",
    evidenceStatus: "REPORTED",
  },
  nationalityAcquired: {
    labels: ["By Birth", "Naturalization"],
    source: WALKTHROUGH,
    checkedAt: "2026-10-17",
    evidenceStatus: "REPORTED",
  },
};

type FieldHint = {
  hint: string;
  explanation?: string;
  example?: string;
  prompt?: string;
};
const hints: Record<string, FieldHint> = {
  gatePassport: {
    hint: "Use the passport you’ll travel with.",
    prompt: "Passport number",
  },
  gateNationality: { hint: "Choose the country/region of your passport." },
  gateName: {
    hint: "Match the full name in your passport.",
    prompt: "Full name as printed",
  },
  nationality: {
    hint: "Use the nationality of the passport you’ll travel on.",
  },
  passportType: {
    hint: "Check the passport type printed in your travel document.",
  },
  arrivalPort: {
    hint: "Search by city, airport name or code. Choose the matching portal entry.",
    explanation:
      "Some Indian cities go by multiple names: Thiruvananthapuram is also Trivandrum, Bengaluru is Bangalore, and Kochi is Cochin. Search either name or the airport code to find the label used on the form.",
  },
  dob: { hint: "Day first, then month and year.", prompt: "DD/MM/YYYY" },
  arrivalDate: { hint: "Use your planned arrival date.", prompt: "DD/MM/YYYY" },
  email: {
    hint: "Use an inbox you can access for visa updates.",
    example: "traveler@example.test",
  },
  emailConfirm: {
    hint: "Repeat your email address to catch typos before visa updates are sent.",
    example: "traveler@example.test",
  },
  purpose: { hint: "Choose the purpose that matches your visit." },
  captcha: {
    hint: "Type the code displayed on the official page.",
    prompt: "Code from the image",
  },
  instructions: {
    hint: "Read the instructions and have your files ready before checking this box.",
  },
  surname: {
    hint: "Your family name, exactly as printed in your passport.",
    prompt: "Surname / family name",
  },
  givenNames: {
    hint: "Include all first and middle names in passport order.",
    prompt: "First and middle names",
  },
  nameChanged: {
    hint: "Include a legal name change, such as a surname changed after marriage.",
  },
  previousName: {
    hint: "Use your former names if the form asks for them.",
    prompt: "Previous given names and surname",
  },
  gender: { hint: "Use the applicable option on your official form." },
  birthCity: {
    hint: "Match the place of birth recorded in your passport.",
    prompt: "Place of birth",
  },
  birthCountry: { hint: "Choose your country of birth." },
  nationalId: {
    example: "NA",
    hint: "U.S. applicant without a national ID? Enter NA.",
    explanation:
      "Enter your national identity number if you have one. If it does not apply, enter NA.",
  },
  religion: {
    hint: "Agnostic, atheist or non-religious? Choose OTHERS and fill in the explanation.",
    explanation:
      "OTHERS opens an explanation field. Leaving it blank can cause the form to reset; enter NA if not applicable.",
  },
  religionOther: {
    hint: "Enter your explanation, or NA if not applicable.",
    prompt: "Your explanation",
  },
  identificationMarks: {
    hint: "Describe a visible identifying mark, such as a scar or mole.",
    prompt: "Visible scar or mole, if applicable",
  },
  education: {
    hint: "Choose the option that matches your highest qualification.",
  },
  nationalityAcquired: {
    hint: "Choose how you acquired your current citizenship.",
    explanation:
      "By Birth means you held that citizenship from birth. Naturalization means you became a citizen later through an application process.",
  },
  previousNationality: {
    hint: "If naturalized, give your previous nationality when requested.",
  },
  passportNumber: {
    hint: "Use the number on the passport you’ll travel with.",
    prompt: "Passport number",
  },
  passportPlace: {
    hint: "Use the issuing place in your passport, not your arrival airport.",
    prompt: "Place of issue",
  },
  passportExpiry: { hint: "Use the expiry date printed in your passport." },
  addressStreet: {
    hint: "Keep each address line within 35 characters.",
    prompt: "House number and street",
  },
  addressCity: {
    hint: "Use your city or town, not your neighborhood.",
    explanation:
      "Some cities have multiple names. Gurgaon and Gurugram refer to the same city in Haryana; either name may appear in an address or dropdown.",
    prompt: "City / town",
  },
  addressRegion: {
    hint: "Use the state, province or district for your address.",
    explanation:
      "Places can appear under older or newer names, such as Gurgaon and Gurugram. Choose the matching place for the level requested: city, district or state.",
    prompt: "State / province / district",
  },
  addressPostcode: {
    hint: "Keep leading zeros and any required letters or spaces.",
    explanation:
      "A postal code is an identifier, so a leading zero is part of the code.",
    prompt: "Postal / ZIP code",
  },
  permanentCity: {
    hint: "Use the city or town in your permanent address.",
    explanation:
      "Some places have multiple names, such as Gurgaon and Gurugram. Match the place in your address to the name shown on the form.",
  },
  permanentRegion: {
    hint: "Use the state, province or district for your permanent address.",
    explanation:
      "Older and newer place names can refer to the same area. Match both the place and the administrative level requested.",
  },
  referenceIndiaAddress: {
    hint: "Enter your Indian reference’s full address, including the PIN code.",
    explanation:
      "Some cities have multiple names: Gurgaon is also called Gurugram. Use the address your reference provides and match any dropdown to the same place.",
  },
  phone: {
    hint: "Provide at least one contact number: phone or mobile.",
    prompt: "Contact number",
  },
  sameAddress: {
    hint: "Use the same-address option only if both addresses match.",
  },
  maritalStatus: {
    hint: "Use your current status. Married applicants may need spouse details.",
  },
  spouseName: { hint: "Use your spouse’s full name.", prompt: "Spouse’s name" },
  spouseNationality: { hint: "Use your spouse’s citizenship." },
  spouseBirthplace: {
    hint: "Use your spouse’s place of birth.",
    prompt: "Place of birth",
  },
  spouseBirthCountry: { hint: "Use your spouse’s country of birth." },
  occupation: {
    hint: "Choose your current occupation from the official form.",
  },
  employer: {
    hint: "Keep the employer or business name accurate.",
    explanation:
      "Periods and commas can cause Save and Next to clear the form. Format & copy removes punctuation and changes & to AND; check that the result still identifies your employer.",
    prompt: "Employer / business name",
  },
  employerAddress: {
    hint: "Use your employer’s full address.",
    prompt: "Employer address",
  },
  military: { hint: "Read the full question; include past service if asked." },
  militaryDetails: {
    hint: "Give the service details requested on the official form.",
  },
  operatorDetails: { hint: "Use the tour operator details from your booking." },
  exitPort: {
    hint: "Enter the airport or port you plan to leave India from.",
    explanation:
      "Your departure port can differ from your arrival port. Use your return or onward itinerary.",
  },
  countriesVisited: {
    hint: "List the countries you visited in the last 10 years.",
  },
  previousCities: {
    hint: "Separate the cities you previously visited with commas.",
    example: "New Delhi, Jaipur, Agra",
  },
  saarcVisited: {
    hint: "Answer for visits in the last 3 years, excluding your own country.",
  },
  saarcDetails: {
    hint: "Have the country, year and length of each relevant visit ready.",
  },
  previousVisaNumber: {
    hint: "For a previous e-Visa, enter the ETA number as your previous visa number.",
    explanation:
      "ETA means Electronic Travel Authorization. Use the ETA number on your issued e-Visa; the Application ID is the application’s tracking number. For a regular visa, use the visa number printed on it.",
    prompt: "Previous visa / ETA number",
  },
  previousVisaPlace: {
    hint: "For a previous Indian e-Visa, you can enter New Delhi.",
    explanation:
      "For a regular visa, use the place of issue printed on it. The place of issue is separate from the airport where you arrived.",
    prompt: "Place of issue on the visa",
  },
};

export function fieldHint(field: VisaField): FieldHint {
  if (hints[field.id]) return hints[field.id];
  if (field.sectionId === "background" && !field.id.endsWith("Details")) {
    return {
      hint: "Answer the full question. If you select Yes, complete the details below it.",
    };
  }
  return { hint: field.description };
}
