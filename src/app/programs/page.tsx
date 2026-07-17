import { PageShell } from "@/components/page-shell";
import { getProgramsContent } from "@/lib/content";

export default function ProgramsPage() {
  const content = getProgramsContent();

  return (
    <PageShell>
      <h1 className="text-3xl font-semibold tracking-tight">
        Our Healing Spaces
      </h1>
      <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400">
        {content.intro}
      </p>
      <p className="mt-6 rounded-lg border border-black/10 p-4 text-sm dark:border-white/10">
        {content.privacyNote}
      </p>
    </PageShell>
  );
}
