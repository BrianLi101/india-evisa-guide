import { PageIntro } from "@/components/ui";
import Airports from "@/components/Airports";
export const metadata = { title: "Airport & city name finder" };
export default function Page() {
  return (
    <div className="page-width">
      <PageIntro
        eyebrow="Same place, different names"
        title="Airport finder"
        description="Find the portal’s label for an airport or city."
      />
      <Airports />
    </div>
  );
}
