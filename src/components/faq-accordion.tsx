"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import type { FAQ } from "@/lib/content";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

export function FAQAccordion({
  faqs,
  size = "default",
}: {
  faqs: FAQ[];
  size?: "default" | "compact";
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const isCompact = size === "compact";

  return (
    <div>
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <motion.div
            key={faq.question}
            initial={isCompact ? undefined : { opacity: 0, y: 24 }}
            whileInView={isCompact ? undefined : { opacity: 1, y: 0 }}
            viewport={isCompact ? undefined : { once: true, amount: 0.6 }}
            transition={isCompact ? undefined : { duration: 0.8, delay: i * 0.08, ease: EASE }}
            className="border-b border-text-disabled/30"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className={`flex w-full items-center justify-between gap-6 text-left transition-colors duration-200 ${
                isCompact ? "py-4" : "py-6"
              }`}
            >
              <span
                className={`text-text-primary ${
                  isCompact ? "text-subheading-sm font-medium" : "text-subheading-md"
                }`}
              >
                {faq.question}
              </span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="shrink-0 text-text-primary"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M5 7.5L10 12.5L15 7.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div
                    className={`text-text-secondary ${
                      isCompact ? "pb-4 pr-6" : "pb-6 pr-10"
                    }`}
                  >
                    <p className={isCompact ? "text-body-md" : "text-body-xl"}>
                      {faq.answer}
                    </p>
                    {faq.question.includes("How do I register for an upcoming workshop") && (
                      <Link
                        href="/get-involved"
                        className="inline-flex items-center justify-center rounded-full bg-surface-cta px-5 py-2 text-body-sm text-text-inverse font-bold hover:opacity-90 transition-opacity mt-4"
                      >
                        Register
                      </Link>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
