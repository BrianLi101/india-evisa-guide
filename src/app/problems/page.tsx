import { PageIntro } from "@/components/ui";
import ProblemLibrary from "@/components/ProblemLibrary";
export const metadata = { title: "Common problems · FAQ" };
export default function Page() {
  return (
    <div className="page-width">
      <PageIntro
        eyebrow="Small snags, clearer next steps"
        title="Common problems"
        description="Quick answers to common questions."
      />
      <ProblemLibrary />
    </div>
  );
}
