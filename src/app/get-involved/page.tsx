import { PageShell } from "@/components/page-shell";
import { getGetInvolvedContent } from "@/lib/content";

export default function GetInvolvedPage() {
  const content = getGetInvolvedContent();

  return (
    <PageShell>
      <h1 className="text-3xl font-semibold tracking-tight">
        Get Involved
      </h1>
      <p className="mt-6 text-lg text-text-secondary">
        {content.intro}
      </p>
    </PageShell>
  );
}
