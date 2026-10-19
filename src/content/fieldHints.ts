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
  arrivalDate: {
    hint: "Enter the date you expect to arrive in India, in DD/MM/YYYY format.",
    explanation:
      "Apply at least 4 days before arrival. Once approved, follow the entry dates printed on your ETA.",
    prompt: "DD/MM/YYYY",
  },
  visaService: {
    hint: "Visa Service is filled automatically from your Visiting India for choice.",
    explanation:
      "For a tourist visit, e-Tourist offers 30-day, 1-year and 5-year options. Visa validity and the length of each permitted stay are different; check the conditions for your chosen service.",
  },
  email: {
    hint: "Use an inbox you can access for visa updates.",
    example: "traveler@example.test",
  },
  emailConfirm: {
    hint: "Repeat your email address to catch typos before visa updates are sent.",
    example: "traveler@example.test",
  },
  purpose: {
    hint: "Search your reason for visiting, then match the service and duration on your form.",
    explanation:
      "Tourist purposes include sightseeing, meeting friends or relatives, and short-term yoga. Keep the exact option that fits your plans.",
  },
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
    prompt: "Previous surname",
  },
  gender: {
    hint: "Choose the option that matches the gender recorded in your passport.",
  },
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
    hint: "Use the place or issuing country shown in your passport.",
    explanation:
      "The field allows 20 characters. Use the issuing place or country recorded in your passport; if it shows an issuing authority, follow that wording.",
    prompt: "Place / country of issue",
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
    hint: "Enter your contact number. Complete Mobile No. as well if the portal requires it.",
    prompt: "Contact number",
  },
  mobile: {
    hint: "Enter your mobile number; the tested form required it even with Phone No. filled.",
    prompt: "Mobile number",
  },
  employerPhone: {
    hint: "Your employer’s phone number. This field is optional.",
  },
  referenceIndiaState: {
    hint: "Choose the state in your Indian reference’s address.",
  },
  referenceIndiaDistrict: {
    hint: "Choose the district after selecting the state on the official form.",
  },
  sameAddress: {
    hint: "Use this checkbox on the official form only if your permanent and present addresses are the same.",
  },
  permanentStreet: {
    hint: "Enter your permanent address, including its postal / ZIP code as requested.",
  },
  previousAddress: {
    hint: "Enter the address of your last stay in India across the lines shown.",
  },
  referenceHomeName: {
    hint: "The portal inserts your country in this label. Prepare a contact there.",
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
  designation: {
    hint: "Designation means your job title, such as Software Engineer, Teacher or Manager.",
    prompt: "Your job title",
  },
  visaArrival: {
    hint: "Search by airport code, airport name or city, then choose the label used on your form.",
    explanation:
      "This is carried over from registration on the official form. Use the search here to check its full airport or seaport label.",
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
    hint: "Prepare the country, year and number of visits for each relevant SAARC country.",
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

// The explanation is part of Religion's shared guide, including at its own deep link.
export function fieldGuideId(id: string): string {
  return id === "religionOther" ? "religion" : id;
}
