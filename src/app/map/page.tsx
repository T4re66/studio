import { PageHeader } from "@/components/page-header";
import { OfficeMap } from "@/components/office-map";

export default function MapPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Bürokarte"
        description="Finde heraus, wer heute wo im Büro sitzt."
      />
      <div className="max-w-4xl mx-auto w-full">
         <OfficeMap />
      </div>
    </div>
  );
}
