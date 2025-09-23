
'use client';

import { PageHeader } from "@/components/page-header";
import { CheckinForm } from "@/components/checkin/checkin-form";

export default function CheckinPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Check-in"
        description="Ein schneller Weg, um dein Wohlbefinden und deinen Arbeitsplatz zu teilen."
      />
      <div className="w-full">
        <CheckinForm />
      </div>
    </div>
  );
}
