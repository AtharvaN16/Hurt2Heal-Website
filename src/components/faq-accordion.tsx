"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.8, delay: i * 0.08, ease: EASE }}
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
                  <p
                    className={`text-text-secondary ${
                      isCompact ? "text-body-md pb-4 pr-6" : "text-body-xl pb-6 pr-10"
                    }`}
                  >
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
