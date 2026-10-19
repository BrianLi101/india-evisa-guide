import type { KnownIssue } from "@/lib/schema";

export default function ProblemAnswer({ issue }: { issue: KnownIssue }) {
  const verifiedAt = issue.lastVerifiedAt ?? issue.lastReviewedAt;
  return (
    <>
      <p className="faq-answer">{issue.answer}</p>
      <p className="faq-verified">
        Verified:{" "}
        <time dateTime={verifiedAt}>
          {new Intl.DateTimeFormat("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
            timeZone: "UTC",
          }).format(new Date(`${verifiedAt}T00:00:00Z`))}
        </time>
      </p>
    </>
  );
}
