import type { KnownIssue } from "@/lib/schema";

export default function ProblemAnswer({ issue }: { issue: KnownIssue }) {
  const verifiedAt = issue.lastVerifiedAt ?? issue.lastReviewedAt;
  return (
    <>
      <div className="faq-answer">
        <p>{issue.answer}</p>
        {issue.answerBullets?.length ? (
          <ul>
            {issue.answerBullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        ) : null}
      </div>
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
