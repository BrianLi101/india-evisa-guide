import { notFound } from "next/navigation";
import { sections } from "@/content/data";
import LegacyGuideRedirect from "@/components/LegacyGuideRedirect";
export const metadata = { title: "Find a field", robots: { index: false } };
export function generateStaticParams() {
  return sections.map((section) => ({ section: section.id }));
}
export default async function Page({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (!sections.some((item) => item.id === section)) notFound();
  return <LegacyGuideRedirect />;
}
