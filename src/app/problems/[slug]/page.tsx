import { notFound } from "next/navigation";
import { issues } from "@/content/data";
import { Evidence, OfficialLink } from "@/components/ui";
export function generateStaticParams() {
  return issues.map((i) => ({ slug: i.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const i = issues.find((i) => i.id === slug);
  return { title: i?.title ?? "Troubleshooting", description: i?.symptoms };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const i = issues.find((i) => i.id === slug);
  if (!i) notFound();
  return (
    <article className="page-width narrow article-page">
      <a className="back-link" href="/problems/">
        ← All common problems
      </a>
      <Evidence status={i.evidenceStatus} />
      <h1>{i.title}</h1>
      <p className="lede">{i.symptoms}</p>
      <div className="prose">
        <h2>What we know</h2>
        <p>{i.explanation}</p>
        <div className="article-advice">
          <h2>Your next step</h2>
          <p>{i.workaround}</p>
        </div>
        <h2>Keep in mind</h2>
        <p>{i.caveats}</p>
        <h2>Sources & review</h2>
        <p className="small">
          Reviewed{" "}
          <time dateTime={i.lastReviewedAt}>
            {new Intl.DateTimeFormat("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
              timeZone: "UTC",
            }).format(new Date(`${i.lastReviewedAt}T00:00:00Z`))}
          </time>
          .
        </p>
        {i.officialUrls.map((url, j) => (
          <p key={url}>
            <a href={url} target="_blank" rel="noreferrer">
              {url.endsWith(".pdf")
                ? "Official sample application"
                : url.endsWith("Registration")
                  ? "Official registration screen"
                  : url.includes("gurugram.gov.in")
                    ? "Gurugram district government"
                    : "Official e-Visa portal instructions"}
              {i.officialUrls.length > 1 ? ` (${j + 1})` : ""} ↗
            </a>
          </p>
        ))}
        {i.otherSources.map((s) => (
          <p className="small" key={s}>
            {s} · Not official evidence
          </p>
        ))}
        <div className="related-links">
          <a href="/">Find a field →</a>
        </div>
        <OfficialLink />
      </div>
    </article>
  );
}
