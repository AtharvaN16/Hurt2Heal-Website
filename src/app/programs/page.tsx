"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PageShell } from "@/components/page-shell";
import { ProgramAccordionCard } from "@/components/program-accordion-card";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

export default function ProgramsPage() {
  return (
    <PageShell>
      <nav className="text-center text-body-md text-text-secondary mb-20 md:mb-40">
        <Link href="/" className="hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-text-primary font-semibold">Programs &amp; Events</span>
      </nav>

      <h1 className="text-title-md font-serif text-text-brand text-center mt-4 mb-10 md:mb-18">
        Our Upcoming events
      </h1>

      {/* Interactive Accordion Program Card with blurIn entry animation */}
      <motion.div
        initial={{ opacity: 0, filter: "blur(12px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
        className="pb-64 md:pb-[360px]"
      >
        <ProgramAccordionCard />
      </motion.div>
    </PageShell>
  );
}
