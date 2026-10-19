import { notFound } from "next/navigation";
import { issues } from "@/content/data";
import ProblemAnswer from "@/components/ProblemAnswer";

export function generateStaticParams() {
  return issues.map((issue) => ({ slug: issue.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const issue = issues.find((item) => item.id === slug);
  return {
    title: issue?.title ?? "Common problems",
    description: issue?.answer,
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const issue = issues.find((item) => item.id === slug);
  if (!issue) notFound();
  return (
    <article className="page-width narrow faq-page">
      <a className="back-link" href="/problems/">
        ← All common problems
      </a>
      <h1>{issue.title}</h1>
      <ProblemAnswer issue={issue} />
    </article>
  );
}
