import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { getProgramsContent } from "@/lib/content";

export default function ProgramsPage() {
  const content = getProgramsContent();

  return (
    <PageShell>
      <nav className="text-center text-body-md text-text-secondary pt-4 mb-8">
        <Link href="/" className="hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-text-primary font-semibold">Programs &amp; Events</span>
      </nav>
      <h1 className="text-3xl font-semibold tracking-tight mt-4">
        Our Healing Spaces
      </h1>
      <p className="mt-6 text-lg text-text-secondary">
        {content.intro}
      </p>
      <p className="mt-6 rounded-lg border border-black/10 p-4 text-sm dark:border-white/10">
        {content.privacyNote}
      </p>
    </PageShell>
  );
}
