import { PageIntro } from "@/components/ui";
import ProblemLibrary from "@/components/ProblemLibrary";
export const metadata = { title: "Common problems & troubleshooting" };
export default function Page() {
  return (
    <div className="page-width">
      <PageIntro
        eyebrow="Small snags, clearer next steps"
        title="Common problems"
        description="Find help for the part that’s stuck."
      />
      <ProblemLibrary />
    </div>
  );
}
