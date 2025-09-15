import { PageHeader } from "@/components/page-header";
import { FocusTimer } from "@/components/focus/focus-timer";
import { FakeCall } from "@/components/focus/fake-call";

export default function FocusPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Fokus"
        description="Werkzeuge, die dir helfen, konzentriert und ungestört zu arbeiten."
      />
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <FocusTimer />
        <FakeCall />
      </div>
    </div>
  );
}
