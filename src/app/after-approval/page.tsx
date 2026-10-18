import { ArrowUpRight, Printer } from "lucide-react";
import { Evidence, PageIntro } from "@/components/ui";
import { PORTAL } from "@/content/data";

export const metadata = {
  title: "After you’re approved",
  description:
    "Check your India e-Visa status, download your ETA and print a physical copy before travelling.",
};

export default function Page() {
  return (
    <div className="page-width narrow approval-page">
      <a href="/" className="back-link">
        ← Your checklist
      </a>
      <div className="approval-icon">
        <Printer size={28} strokeWidth={1.5} aria-hidden="true" />
      </div>
      <PageIntro
        eyebrow="Before you travel"
        title="After you’re approved"
        description="One last thing: a paper copy for your trip."
      />
      <ol className="approval-steps" role="list">
        <li>
          <h2>Check your status</h2>
          <p>
            You’ll need your <strong>application ID</strong> and{" "}
            <strong>passport number</strong>.
          </p>
          <a
            className="button primary"
            href={`${PORTAL}StatusEnquiry`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open official status page{" "}
            <ArrowUpRight size={17} aria-hidden="true" />
            <span className="sr-only"> (opens a new tab)</span>
          </a>
        </li>
        <li>
          <h2>Save the PDF</h2>
          <p>
            Once approved, look for <strong>Print Status</strong> to download
            your ETA.
          </p>
        </li>
        <li>
          <h2>Print & pack it</h2>
          <p>
            Keep a paper copy with your passport. Print before leaving for the
            airport.
          </p>
        </li>
      </ol>
      <details className="quiet-disclosure approval-help">
        <summary>Can I just show the email or a screenshot?</summary>
        <p>
          Print it to be safe. Keep a paper copy of your ETA with your passport
          before leaving for the airport.
        </p>
      </details>
      <details className="quiet-disclosure approval-help">
        <summary>Help finding your status</summary>
        <p>
          Your application ID is in your acknowledgement email or printed
          application form. Enter it, your passport number and the CAPTCHA on
          the government website, then choose “Check Status”.
        </p>
        <p>
          If the link opens the portal homepage, choose “Check your Visa
          Status”.
        </p>
      </details>
      <details className="source-policy quiet-disclosure">
        <summary>Sources & verification</summary>
        <div>
          <p>Checked 17 October 2026.</p>
          <p>
            <Evidence status="LIVE_VERIFIED" /> The{" "}
            <a href={`${PORTAL}StatusEnquiry`} target="_blank" rel="noreferrer">
              status enquiry page
            </a>{" "}
            showed application ID, passport number, CAPTCHA and Check Status. No
            applicant details were entered.
          </p>
          <p>
            <Evidence status="OFFICIAL" /> The{" "}
            <a href={`${PORTAL}tvoa.html`} target="_blank" rel="noreferrer">
              official e-Visa instructions
            </a>{" "}
            say to print the ETA and present it at immigration.
          </p>
          <p>
            REPORTED: “Print Status”, its PDF download, varying airline
            acceptance of digital alternatives and airport printing experiences
            come from applicant feedback received on 17 October 2026.
          </p>
        </div>
      </details>
    </div>
  );
}
