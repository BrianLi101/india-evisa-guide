import { LocalNote, PageIntro } from "@/components/ui";
import FileTool from "@/components/FileTool";
import PassportRequirements from "@/components/PassportRequirements";
export const metadata = { title: "Local passport PDF tool" };
export default function Page() {
  return (
    <div className="page-width">
      <div className="passport-intro">
        <PageIntro
          eyebrow="Your files, prepared privately"
          title="Passport PDF"
          description="The e-Visa website needs your passport’s photo and details page as a PDF, 10–300 KB. Choose an image below and we’ll convert it on your device."
        />
        <PassportRequirements />
      </div>
      <LocalNote />
      <div className="tool-tabs">
        <a aria-current="page" href="/tools/passport-pdf/">
          Passport PDF
        </a>
        <a href="/tools/photo-jpeg/">Applicant photo</a>
      </div>
      <FileTool mode="passport" showPassportRequirements={false} />
    </div>
  );
}
