import { ArrowUpRight, ShieldCheck } from "lucide-react";
import type { EvidenceStatus } from "@/lib/schema";
import { PORTAL, REVIEWED_AT } from "@/content/data";
export function Evidence({ status }: { status: EvidenceStatus }) {
  if (status === "NEEDS_VERIFICATION") return null;
  const labels = {
    OFFICIAL: "Official source",
    LIVE_VERIFIED: "Live checked",
    REPORTED: "Reported issue",
  };
  return (
    <span className={`evidence ${status.toLowerCase()}`}>
      <span aria-hidden="true" />
      {labels[status]}
    </span>
  );
}
export function OfficialLink({
  children = "Open official portal",
}: {
  children?: React.ReactNode;
}) {
  return (
    <a
      className="official-link"
      href={PORTAL}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <ArrowUpRight size={16} />
      <span className="sr-only"> (opens a new tab)</span>
    </a>
  );
}
export function PageIntro({
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="page-intro">
      <h1>{title}</h1>
      <p className="lede">{description}</p>
    </div>
  );
}
export function LocalNote() {
  return (
    <div className="local-note">
      <ShieldCheck size={19} />
      <span>On your device. Never uploaded.</span>
    </div>
  );
}
export function SourceNote({ sample = false }: { sample?: boolean }) {
  return (
    <p className="source-note">
      {sample ? "Official sample reviewed." : "Official instructions checked."}{" "}
      <time dateTime={REVIEWED_AT}>16 October 2026</time>.{" "}
      <a
        href={sample ? `${PORTAL}images/SampleForm.pdf` : PORTAL}
        target="_blank"
        rel="noreferrer"
      >
        View source ↗
      </a>
    </p>
  );
}
