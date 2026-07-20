import { PageShell } from "@/components/page-shell";
import { getAboutContent } from "@/lib/content";

export default function AboutPage() {
  const content = getAboutContent();

  return (
    <PageShell>
      <h1 className="text-3xl font-semibold tracking-tight">
        {content.welcomeTitle}
      </h1>
      <div className="mt-6 space-y-4 text-lg text-text-secondary">
        {content.welcomeBody.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
        <p>
          With deep respect and hope,
          <br />
          <strong className="font-semibold text-text-primary">{content.signoff}</strong>
        </p>
      </div>
    </PageShell>
  );
}
