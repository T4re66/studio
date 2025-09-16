import { PageHeader } from "@/components/page-header";
import { CheckinForm } from "@/components/checkin/checkin-form";

export default function CheckinPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Stress Check-in"
        description="Ein schneller, anonymer Weg, um dein Wohlbefinden zu teilen."
      />
      <div className="w-full">
        <CheckinForm />
      </div>
    </div>
  );
}
