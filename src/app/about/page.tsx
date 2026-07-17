import { PageShell } from "@/components/page-shell";
import { getAboutContent } from "@/lib/content";

export default function AboutPage() {
  const content = getAboutContent();

  return (
    <PageShell>
      <h1 className="text-3xl font-semibold tracking-tight">
        {content.welcomeTitle}
      </h1>
      <div className="mt-6 space-y-4 text-lg text-zinc-600 dark:text-zinc-400">
        {content.welcomeBody.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
      <p className="mt-8 whitespace-pre-line font-medium">{content.signoff}</p>
    </PageShell>
  );
}
