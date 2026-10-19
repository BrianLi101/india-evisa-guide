import { liveScreens, liveCapture } from "./livePortal";
import { fields, REGISTRATION, SAMPLE } from "./data";
import { fieldHint } from "./fieldHints";
import { portalObservations } from "./portalObservations";
import type { EvidenceStatus } from "@/lib/schema";

export const WALKTHROUGH_REVIEWED_AT = "2026-10-18";

export type WalkthroughField = {
  id: string;
  label: string;
  hint: string;
  help: boolean;
  fieldId?: string;
  when?: string;
  evidenceStatus: EvidenceStatus;
};
export type WalkthroughGroup = {
  title: string;
  note?: string;
  provisional?: boolean;
  fields: WalkthroughField[];
};
export type WalkthroughPage = {
  id: string;
  title: string;
  portalTitle: string;
  introduction: string;
  source: string;
  evidenceStatus: EvidenceStatus;
  groups: WalkthroughGroup[];
  nextAction: string;
  tool?: { href: string; label: string };
};

// Registration and applicant screens follow the synthetic session on 2026-10-18.
// Document upload and payment still follow the official sample.
// The official review screen is intentionally omitted from the companion.
// Labels omit required asterisks; no current requiredness is inferred.
// Expand only where we offer useful choices, formatting guidance or issue help.
// Other fields stay in form order as plain labels; their full guides remain searchable.
const helpFields = new Set([
  "gatePassport",
  "gateNationality",
  "gateName",
  "nationality",
  "passportType",
  "arrivalPort",
  "arrivalDate",
  "visaService",
  "purpose",
  "surname",
  "givenNames",
  "gender",
  "nationalId",
  "religion",
  "identificationMarks",
  "education",
  "nationalityAcquired",
  "passportPlace",
  "addressStreet",
  "addressCity",
  "addressRegion",
  "addressPostcode",
  "phone",
  "mobile",
  "permanentStreet",
  "permanentCity",
  "permanentRegion",
  "maritalStatus",
  "occupation",
  "employer",
  "designation",
  "visaArrival",
  "exitPort",
  "previousCities",
  "previousVisaNumber",
  "previousVisaPlace",
  "previousVisaType",
  "referenceIndiaState",
  "referenceIndiaDistrict",
  "referenceIndiaAddress",
  "photoFile",
  "photoUpload",
  "documentFile",
  "documentUpload",
  "documentStatus",
  "paymentId",
  "payNow",
]);
type FieldPlacement = Partial<
  Pick<WalkthroughField, "label" | "when" | "evidenceStatus">
>;

function field(id: string, overrides: FieldPlacement = {}): WalkthroughField {
  const record = fields.find((item) => item.id === id);
  if (!record) throw new Error(`Unknown walkthrough field: ${id}`);
  return {
    id,
    fieldId: id,
    label:
      portalObservations[id]?.displayLabel ??
      portalObservations[id]?.label ??
      record.officialLabel,
    hint: fieldHint(record).hint,
    help: helpFields.has(id),
    evidenceStatus: portalObservations[id]
      ? "LIVE_VERIFIED"
      : record.evidenceStatus,
    ...overrides,
  };
}
function note(id: string, label: string, hint: string): WalkthroughField {
  return {
    id,
    label,
    hint,
    help: helpFields.has(id),
    evidenceStatus: "OFFICIAL",
  };
}
export const walkthroughPages: WalkthroughPage[] = [
  {
    id: "registration",
    title: "Registration",
    portalTitle: "e-Visa Application",
    introduction:
      "Start with your passport and travel basics. If a passport/name gate appears, complete it on the official portal first.",
    source: REGISTRATION,
    evidenceStatus: "LIVE_VERIFIED",
    groups: [
      {
        title: "Passport / name gate",
        note: "Before registration, if shown. Observed separately from the main form.",
        fields: [
          field("gatePassport"),
          field("gateNationality"),
          field("gateName"),
        ],
      },
      {
        title: "Application registration",
        note: "Order observed on 18 October 2026 after selecting U.S. nationality and an ordinary passport. Purpose and Visa Service are derived read-only summaries.",
        fields: [
          field("nationality"),
          field("passportType"),
          field("arrivalPort"),
          field("dob"),
          field("email"),
          field("emailConfirm"),
          field("purpose"),
          note(
            "purposeSummary",
            "Purpose",
            "The portal fills this from Visiting India for.",
          ),
          field("visaService"),
          field("arrivalDate"),
        ],
      },
    ],
    nextAction:
      "On the official portal, review the details and use Continue. Complete the CAPTCHA there.",
  },
  ...liveScreens.map((screen): WalkthroughPage => ({
    id: screen.id,
    title: (
      {
        applicant: "Personal & passport",
        "address-family": "Address & family",
        visa: "Visit & references",
        background: "Additional questions",
      } as Record<string, string>
    )[screen.id],
    portalTitle: screen.title,
    introduction: "",
    source: screen.source,
    evidenceStatus: "LIVE_VERIFIED",
    groups: screen.groups.map((group) => ({
      title: group.headings.at(-1)!,
      fields: group.fields.map((item) => field(item.id, { when: item.when })),
    })),
    nextAction: "Continue on the official portal after checking your answers.",
  })),
  {
    id: "photo",
    title: "Upload photograph",
    portalTitle: "Upload Photograph",
    introduction:
      "Prepare your photo locally, then choose and upload the finished JPEG on the official portal.",
    source: liveCapture.photo.source,
    evidenceStatus: "LIVE_VERIFIED",
    groups: [
      {
        title: "Photograph",
        fields: [
          note(
            "photoFile",
            "Choose the Photo To Upload",
            "Choose a clear, front-facing JPEG, 10 KB–1 MB and at least 350 × 350 pixels, with a white or light background.",
          ),
          note(
            "photoUpload",
            "Upload Photo",
            "Choosing a file is only the first step. Use the separate Upload Photo action shown on the official page and check the result.",
          ),
        ],
      },
    ],
    nextAction:
      "Follow the official photo preview and any crop/confirmation steps it displays. Continue after the portal accepts the upload.",
    tool: { href: "/tools/photo-jpeg/", label: "Prepare photo locally" },
  },
  {
    id: "documents",
    title: "Upload passport",
    portalTitle: "Document Upload",
    introduction:
      "Use the biodata page of the same passport entered in Passport Details. Check the document is legible before uploading it on the official portal.",
    source: `${SAMPLE}#page=6`,
    evidenceStatus: "OFFICIAL",
    groups: [
      {
        title: "Document description",
        fields: [
          note(
            "documentFile",
            "Copy of Passport page containing personal particulars",
            "Choose your passport PDF on the official page. Published guidance specifies 10 KB–300 KB.",
          ),
          note(
            "documentUpload",
            "Upload Document",
            "Use the separate upload action after choosing the file.",
          ),
          note(
            "documentStatus",
            "Status",
            "Check the upload status; do not continue while it still shows Not Uploaded.",
          ),
          note(
            "documentDeclaration",
            "I have verified that all the documents are uploaded as per the requirement.",
            "Check the uploaded file and all document requirements before selecting this confirmation on the official page.",
          ),
        ],
      },
    ],
    nextAction:
      "Use Confirm on the official page once the upload and document checks are complete.",
    tool: {
      href: "/tools/passport-pdf/",
      label: "Prepare passport PDF locally",
    },
  },
  {
    id: "payment",
    title: "Payment",
    portalTitle: "Online VISA Fee Payment",
    introduction:
      "Finish payment only through the official portal. The companion never collects payment details or submits your application.",
    source: `${SAMPLE}#page=8`,
    evidenceStatus: "OFFICIAL",
    groups: [
      {
        title: "Official payment page",
        fields: [
          note(
            "paymentApplicant",
            "Applicant Name",
            "Check the name displayed on the official page.",
          ),
          note(
            "paymentId",
            "Application Id",
            "Keep the application ID from the portal for status checks.",
          ),
          note(
            "generateApplication",
            "Generate Application Form",
            "Use the official page’s download action if you want a copy of the application.",
          ),
          note(
            "paymentDisclaimer",
            "Disclaimer",
            "Read the complete current disclaimer on the portal.",
          ),
          note(
            "paymentUndertaking",
            "Undertaking",
            "Read the full undertaking before selecting Yes or No on the official page.",
          ),
          note(
            "payNow",
            "Pay Now / Pay Later",
            "Follow the current official payment instructions and check payment status before retrying a payment.",
          ),
        ],
      },
    ],
    nextAction:
      "Completing this guide does not mean your visa is approved. Check your application status on the official portal and keep your ETA when approved.",
    tool: {
      href: "/after-approval/",
      label: "After approval: prepare your ETA",
    },
  },
];

export function walkthroughPageForHash(hash: string): number {
  const id = hash.replace(/^#/, "");
  const index = walkthroughPages.findIndex(
    (page) =>
      `page-${page.id}` === id ||
      page.groups.some((group) => group.fields.some((item) => item.id === id)),
  );
  return index < 0 ? 0 : index;
}
