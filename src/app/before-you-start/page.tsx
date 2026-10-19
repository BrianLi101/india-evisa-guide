import { ArrowRight } from "lucide-react";
import { PORTAL, SAMPLE, REVIEWED_AT } from "@/content/data";
import type { ReactNode } from "react";

export const metadata = {
  title: "Before you start · Preparation checklist",
  description:
    "What to gather before preparing an adult tourist e-Visa: documents, parents’ details, travel plans and reference contacts.",
};

function Item({ title, children }: { title: string; children: ReactNode }) {
  return (
    <label className="prep-item">
      <input type="checkbox" autoComplete="off" />
      <span>
        <strong>{title}</strong>
        <span>{children}</span>
      </span>
    </label>
  );
}

export default function Page() {
  return (
    <div className="page-width prep-page">
      <div className="page-intro">
        <h1>Before you start</h1>
        <p className="lede">A few things to gather. You can start with gaps.</p>
      </div>
      <div className="prep-grid">
        <section aria-labelledby="prep-documents">
          <h2 id="prep-documents">Documents</h2>
          <Item title="Passport">
            Keep it handy, with a clear scan of the photo/details page.
          </Item>
          <Item title="Digital photo">
            Recent, front-facing, with a plain light background.
          </Item>
          <div className="prep-tool-links">
            <a href="/tools/passport-pdf/" target="_blank" rel="noreferrer">
              Prepare PDF ↗
            </a>
            <a href="/tools/photo-jpeg/" target="_blank" rel="noreferrer">
              Prepare photo ↗
            </a>
          </div>
        </section>
        <section aria-labelledby="prep-parents">
          <h2 id="prep-parents">Parents</h2>
          <Item title="Mother’s details">
            Full name, current and previous citizenship, birthplace and country.
          </Item>
          <Item title="Father’s details">
            Full name, current and previous citizenship, birthplace and country.
          </Item>
        </section>
        <section aria-labelledby="prep-travel">
          <h2 id="prep-travel">Travel details</h2>
          <Item title="Your plans">
            Arrival date, entry airport and places you’ll visit.
          </Item>
          <Item title="Hotel or place you’ll stay">
            Name, full address and phone number.
          </Item>
          <Item title="Travel history">
            Countries visited in the last 10 years. Check previous passports and
            entry stamps to help recall trips; stamps may not record every visit.
          </Item>
        </section>
        <section aria-labelledby="prep-contacts">
          <h2 id="prep-contacts">Reference contacts</h2>
          <Item title="A reference in India">
            Name, address and phone. Confirm the accepted reference on the live
            form.
          </Item>
          <Item title="A contact in your home country">
            Name, full address and phone number.
          </Item>
        </section>
      </div>
      <details className="prep-extra quiet-disclosure">
        <summary>Also gather, if applicable</summary>
        <Item title="Previous Indian visa / ETA">
          The issued document, plus earlier stay addresses and cities visited.
        </Item>
        <Item title="Spouse’s details">
          Name, citizenship, birthplace and country, if requested.
        </Item>
        <Item title="Other identity documents">
          Other valid passports or identity certificates, and your national ID
          if applicable.
        </Item>
        <Item title="Recent SAARC visits">
          Visit records for the last 3 years, excluding your own country.
        </Item>
        <Item title="Work details">
          Employer name, address, phone and job title, if requested.
        </Item>
      </details>
      <div className="prep-actions">
        <a className="button primary" href="/">
          Find a field <ArrowRight size={17} />
        </a>
        <p>Ticks are just a gathering aid, not part of your application.</p>
      </div>
      <details className="prep-sources quiet-disclosure">
        <summary>Official sample · Sources & limits</summary>
        <p>
          For adult tourist preparation. The{" "}
          <a href={SAMPLE} target="_blank" rel="noreferrer">
            official sample form
          </a>{" "}
          supports the family, travel-history and reference prompts; current
          questions may differ. Accommodation is a practical preparation
          reminder, not a verified rule that a hotel is always an accepted
          reference.
        </p>
        <p>
          <a href={PORTAL} target="_blank" rel="noreferrer">
            Official document instructions
          </a>{" "}
          cover the passport scan and photo. Other purposes may need additional
          documents. The work-details reminder comes from project research.
        </p>
        <p>
          Evidence: <strong>Official source</strong> published guidance, not a
          complete live walkthrough. Reviewed{" "}
          <time dateTime={REVIEWED_AT}>16 October 2026</time>. No details or
          files are collected on this checklist.
        </p>
      </details>
    </div>
  );
}
