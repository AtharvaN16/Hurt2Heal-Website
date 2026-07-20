"use client";

import { motion } from "framer-motion";
import { FAQAccordion } from "@/components/faq-accordion";
import { getFAQSections } from "@/lib/content";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

export default function FAQPage() {
  const sections = getFAQSections();

  return (
    <div className="w-full min-h-screen flex flex-col pb-24">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            body {
              background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.35' numOctaves='1' stitchTiles='stitch' result='noise'/><feColorMatrix in='noise' type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.18 0.18 0.18 0 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>") !important;
            }
          `,
        }}
      />
      {/* Hero Header Section - Transparent & Centered (No birds, clouds, or section backgrounds/gradients) */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 bg-transparent">
        <div className="mx-auto max-w-4xl px-6 relative z-10 flex flex-col">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="text-title-md font-serif text-text-primary leading-tight"
          >
            Have questions?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
            className="text-body-xl text-text-secondary leading-relaxed max-w-5xl mt-6 text-pretty"
          >
            Navigating trauma and taking the first steps toward healing can feel overwhelming, and it’s completely natural to have questions about how our spaces work. We’ve gathered our most common questions here so you and your loved ones can quickly understand how our peer-led support advocates protect your privacy, walk alongside you in your journey.
          </motion.p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="mx-auto max-w-4xl px-6 mt-16 md:mt-20 space-y-16">
          {sections.map((section) => (
            <motion.div
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="scroll-mt-24 space-y-6"
            >
              <h3 className="text-title-xs text-text-primary pb-3 font-serif">
                {section.title}
              </h3>
              <FAQAccordion faqs={section.faqs} size="compact" />
            </motion.div>
          ))}
      </section>
    </div>
  );
}
