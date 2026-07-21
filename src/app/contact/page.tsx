import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { getContactContent } from "@/lib/content";

export default function ContactPage() {
  const content = getContactContent();

  return (
    <PageShell>
      <nav className="text-center text-body-md text-text-secondary mb-20 md:mb-40">
        <Link href="/" className="hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-text-primary font-semibold">Contact</span>
      </nav>
      <h1 className="text-3xl font-semibold tracking-tight mt-4">Contact</h1>
      <p className="mt-6 text-lg text-text-secondary">
        {content.intro}
      </p>
    </PageShell>
  );
}
