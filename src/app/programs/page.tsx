import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { ProgramAccordionCard } from "@/components/program-accordion-card";

export default function ProgramsPage() {
  return (
    <PageShell>
      <nav className="text-center text-body-md text-text-secondary mb-20 md:mb-40">
        <Link href="/" className="hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-text-primary font-semibold">Programs &amp; Events</span>
      </nav>

      <h1 className="text-title-md font-serif text-text-brand text-center mt-4 mb-20 md:mb-36">
        Our Upcoming events
      </h1>

      {/* Interactive Accordion Program Card */}
      <div className="mt-8 pb-64 md:pb-[360px]">
        <ProgramAccordionCard />
      </div>
    </PageShell>
  );
}
