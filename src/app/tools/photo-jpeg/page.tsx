import { LocalNote, PageIntro } from "@/components/ui";
import FileTool from "@/components/FileTool";
export const metadata = { title: "Local applicant photo tool" };
export default function Page() {
  return (
    <div className="page-width">
      <PageIntro
        eyebrow="Your files, prepared privately"
        title="Prepare your photo"
        description="Crop and resize your photo to a square JPEG."
      />
      <LocalNote />
      <div className="tool-tabs">
        <a href="/tools/passport-pdf/">Passport PDF</a>
        <a aria-current="page" href="/tools/photo-jpeg/">
          Applicant photo
        </a>
      </div>
      <FileTool mode="photo" />
    </div>
  );
}
