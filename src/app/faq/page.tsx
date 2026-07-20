import { PageShell } from "@/components/page-shell";
import { FAQAccordion } from "@/components/faq-accordion";
import { getHomeContent } from "@/lib/content";

export default function FAQPage() {
  const { faqs } = getHomeContent();

  return (
    <PageShell>
      <h1 className="text-3xl font-semibold tracking-tight">
        Frequently Asked Questions
      </h1>
      <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400">
        Everything you need to know before joining a session.
      </p>
      <div className="mt-12">
        <FAQAccordion faqs={faqs} />
      </div>
    </PageShell>
  );
}
