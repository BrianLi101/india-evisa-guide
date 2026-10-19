import Search from "@/components/Search";
import { OfficialLink } from "@/components/ui";
import {
  ArrowRight,
  ClipboardCheck,
  FileText,
  Image as ImageIcon,
  LockKeyhole,
  PanelsTopLeft,
  Printer,
} from "lucide-react";

export default function Home() {
  return (
    <div className="home-simple page-width">
      <section className="home-start">
        <h1>
          Your e-Visa,
          <br />a little clearer.
        </h1>
        <p>
          Complete the official form. Find a field or follow along with the guide.
        </p>
        <Search />
        <div className="home-start-actions">
          <OfficialLink />
        </div>
        <span className="home-privacy">
          <LockKeyhole size={14} /> No personal answers needed.
        </span>
      </section>
      <nav className="home-tools" aria-label="Preparation tools">
        <a className="home-tool-card checklist-card" href="/before-you-start/">
          <span className="home-step" aria-hidden="true">
            01 · Before you apply
          </span>
          <ClipboardCheck
            className="home-tool-icon"
            size={48}
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <span className="home-tool-label">
            Checklist <ArrowRight size={20} aria-hidden="true" />
          </span>
        </a>
        <a className="home-tool-card walkthrough-card" href="/walkthrough/">
          <span className="home-step" aria-hidden="true">
            02 · Follow along
          </span>
          <PanelsTopLeft
            className="home-tool-icon"
            size={48}
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <span className="home-tool-label">
            Walk through the form <ArrowRight size={20} aria-hidden="true" />
          </span>
        </a>
        <a className="home-tool-card passport-card" href="/tools/passport-pdf/">
          <span className="home-step" aria-hidden="true">
            03 · Your document
          </span>
          <FileText
            className="home-tool-icon"
            size={48}
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <span className="home-tool-label">
            Prepare passport PDF <ArrowRight size={20} aria-hidden="true" />
          </span>
        </a>
        <a className="home-tool-card photo-card" href="/tools/photo-jpeg/">
          <span className="home-step" aria-hidden="true">
            04 · Your photo
          </span>
          <ImageIcon
            className="home-tool-icon"
            size={48}
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <span className="home-tool-label">
            Prepare photo <ArrowRight size={20} aria-hidden="true" />
          </span>
        </a>
        <a className="home-tool-card approval-card" href="/after-approval/">
          <span className="home-step" aria-hidden="true">
            05 · Before you fly
          </span>
          <Printer
            className="home-tool-icon"
            size={48}
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <span className="home-tool-label">
            After you’re approved <ArrowRight size={20} aria-hidden="true" />
          </span>
        </a>
      </nav>
    </div>
  );
}
