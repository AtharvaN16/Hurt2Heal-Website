"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Globe,
  CaretDown,
  Handshake,
  ChatCircleText,
  ShieldCheck,
  Plant,
  ArrowRight,
} from "@phosphor-icons/react";

export function ProgramAccordionCard() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="group bg-grain relative overflow-hidden bg-white rounded-none border-none shadow-none md:-mx-20 lg:-mx-[160px] md:w-[calc(100%+160px)] lg:w-[calc(100%+320px)] transition-colors">
      {/* Collapsed Header Bar / Main Row with increased vertical padding & row height */}
      <div className="py-10 md:py-14 px-6 md:px-12 lg:px-16 min-h-[220px] md:min-h-[260px] flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-12 border-y border-black/10">
        {/* Left Section: Date Badge & Title/Metadata */}
        <div
          className="flex flex-col sm:flex-row items-start gap-8 md:gap-12 lg:gap-14 cursor-pointer flex-1 w-full"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {/* Date Badge Box with explicit vertical and horizontal padding */}
          <div className="px-8 py-8 md:px-10 md:py-10 shrink-0 flex flex-col items-center justify-center rounded-none bg-[var(--magenta-100)]/60 border border-[var(--purple-200)]/60 text-center">
            <span className="text-subheading-lg font-bold text-text-brand leading-none">
              July 25
            </span>
            <span className="text-subheading-sm font-medium text-text-brand mt-2">
              Friday
            </span>
          </div>

          {/* Title, Subheading & Metadata */}
          <div className="pt-0.5 flex flex-col justify-between self-stretch flex-1">
            <div>
              <h2 className="text-heading-md text-text-brand font-bold leading-snug">
                The Healing Lab
              </h2>
              <p className="text-subheading-xs text-text-secondary mt-1 max-w-xs sm:max-w-sm md:max-w-md leading-relaxed">
                A Safe Space to Connect, Reflect, and Heal Together
              </p>
            </div>

            {/* Enlarged Bold Gray Inline Metadata (No Pills) */}
            <div className="mt-6 md:mt-8 flex flex-wrap items-center gap-6 text-body-md !font-bold text-text-secondary">
              <span className="inline-flex items-center gap-2">
                <Calendar size={20} className="text-text-secondary" />
                Monthly
              </span>
              <span className="inline-flex items-center gap-2">
                <Globe size={20} className="text-text-secondary" />
                Virtual
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: Register Button + Learn More centered horizontally under Register & aligned with Metadata */}
        <div className="pt-0.5 flex flex-row md:flex-col items-center md:items-center justify-between self-stretch w-full md:w-auto border-t border-black/5 md:border-t-0 gap-6 shrink-0">
          <a
            href="https://gforms.app/r/UN9N9Fp"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center justify-center rounded-full bg-[var(--purple-900)] px-10 py-3.5 text-body-md font-bold text-white transition-all duration-200 hover:bg-[var(--purple-800)] hover:scale-[1.02] shadow-xs min-w-[150px] md:min-w-[170px] text-center"
          >
            Register
          </a>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center justify-center gap-2 text-body-md !font-bold text-text-brand hover:underline cursor-pointer"
            aria-expanded={isExpanded}
          >
            {isExpanded ? "Show Less" : "Learn More"}
            <motion.span
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="inline-block"
            >
              <CaretDown size={18} />
            </motion.span>
          </button>
        </div>
      </div>

      {/* Expanded Accordion Body */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden border-b border-black/10 bg-white"
          >
            <motion.div
              initial={{ opacity: 0, filter: "blur(12px)", y: 16 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              exit={{ opacity: 0, filter: "blur(8px)", y: 8 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="py-10 md:py-14 px-6 md:px-12 lg:px-16 space-y-14 max-w-5xl"
            >
              {/* Section 1: What Is The Healing Lab? */}
              <div>
                <h3 className="text-serif-heading-md text-text-brand">
                  What Is The Healing Lab?
                </h3>
                <p className="text-[16px] text-text-primary mt-3.5 leading-relaxed">
                  The Healing Lab is a recurring monthly virtual gathering created to ensure no one has to navigate their personal journey in isolation. Hosted in a supportive, private virtual environment, each session brings people together to share real-world experiences, gain perspective from featured guests, and build meaningful communities.
                </p>
                <p className="text-[16px] text-text-primary mt-3.5 leading-relaxed">
                  Whether you are looking to process life's challenges, gain encouragement, or simply be in a space with people who truly understand, The Healing Lab offers the tools, community, and heart to support your growth.
                </p>
              </div>

              {/* Section 2: Our Core Purpose (Mission & Vision - Heading Style) */}
              <div>
                <h3 className="text-serif-heading-md text-text-brand mb-6">
                  Our Core Purpose
                </h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-heading-xs text-text-brand font-bold mb-1.5">
                      Mission
                    </h4>
                    <p className="text-[16px] text-text-primary leading-relaxed">
                      To create a compassionate, non-judgmental virtual space where individuals can process, share, and navigate their personal healing journeys alongside a supportive community.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-heading-xs text-text-brand font-bold mb-1.5">
                      Vision
                    </h4>
                    <p className="text-[16px] text-text-primary leading-relaxed">
                      A world where no one heals alone—where lived experience, authentic dialogue, and shared connection empower every person to reclaim their strength, peace, and wholeness.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 3: Why You Should Register */}
              <div>
                <h3 className="text-serif-heading-md text-text-brand mb-8">
                  Why You Should Register
                </h3>
                <div className="grid gap-x-12 gap-y-8 sm:grid-cols-2 md:gap-x-16 lg:gap-x-20 md:gap-y-12">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--purple-50)] text-text-brand">
                      <Handshake size={22} weight="duotone" />
                    </div>
                    <div>
                      <h4 className="text-[16px] font-bold text-text-brand">
                        Real Connection, No Judgment
                      </h4>
                      <p className="text-[16px] text-text-primary mt-1.5 leading-relaxed">
                        Connect with individuals who share relatable experiences in an environment built on empathy and mutual support.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--purple-50)] text-text-brand">
                      <ChatCircleText size={22} weight="duotone" />
                    </div>
                    <div>
                      <h4 className="text-[16px] font-bold text-text-brand">
                        Diverse Perspectives
                      </h4>
                      <p className="text-[16px] text-text-primary mt-1.5 leading-relaxed">
                        Learn from guest speakers sharing authentic, lived experiences and practical insight for everyday life.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--purple-50)] text-text-brand">
                      <ShieldCheck size={22} weight="duotone" />
                    </div>
                    <div>
                      <h4 className="text-[16px] font-bold text-text-brand">
                        Privacy Guaranteed
                      </h4>
                      <p className="text-[16px] text-text-primary mt-1.5 leading-relaxed">
                        Your comfort and confidentiality come first. Every session is strictly private, and sessions are never recorded, allowing you to show up as your authentic self.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--purple-50)] text-text-brand">
                      <Plant size={22} weight="duotone" />
                    </div>
                    <div>
                      <h4 className="text-[16px] font-bold text-text-brand">
                        Consistent Support
                      </h4>
                      <p className="text-[16px] text-text-primary mt-1.5 leading-relaxed">
                        A monthly space dedicated entirely to your personal growth, reflection, and emotional well-being.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Reserve Your Spot */}
              <div className="pt-8 border-t border-black/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-serif-heading-md text-text-brand">
                    Reserve Your Spot
                  </h3>
                  <p className="text-subheading-sm text-text-primary mt-2">
                    Ready to take the next step in your healing journey?
                  </p>
                  <p className="text-[16px] text-text-secondary mt-2 leading-relaxed max-w-md">
                    Space in each monthly session is intentionally limited to ensure an intimate, supportive environment for all participants.
                  </p>
                </div>

                <div className="shrink-0 mt-2 md:mt-0">
                  <a
                    href="https://gforms.app/r/UN9N9Fp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--purple-900)] px-7 py-3.5 text-body-md font-bold text-white transition-all duration-200 hover:bg-[var(--purple-800)] hover:scale-[1.02] shadow-xs"
                  >
                    Reserve Your Spot
                    <ArrowRight size={18} />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
