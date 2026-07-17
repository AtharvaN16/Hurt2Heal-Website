import { PageShell } from "@/components/page-shell";
import { getResourcesContent } from "@/lib/content";

export default function ResourcesPage() {
  const content = getResourcesContent();

  return (
    <PageShell>
      <h1 className="text-3xl font-semibold tracking-tight">Resources</h1>
      <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400">
        {content.intro}
      </p>
    </PageShell>
  );
}
