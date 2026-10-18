import { PageIntro } from "@/components/ui";
import LegacyDraft from "@/components/LegacyDraft";
import LegacyFieldLink from "@/components/LegacyFieldLink";
export const metadata = {
  title: "The worksheet has become a field guide",
  robots: { index: false, follow: true },
};
export default function Page() {
  return (
    <div className="page-width narrow">
      <PageIntro
        eyebrow="Field guidance"
        title="Help without another form."
        description="The worksheet has been replaced with searchable field guidance. Enter your answers only on the official portal."
      />
      <LegacyFieldLink />
      <LegacyDraft />
    </div>
  );
}
