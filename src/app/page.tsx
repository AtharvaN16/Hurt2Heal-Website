"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { TextAnimate } from "@/components/text-animate";
import { FAQAccordion } from "@/components/faq-accordion";
import { TestimonialsCarousel } from "@/components/testimonials-carousel";
import { getHomeContent } from "@/lib/content";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

// Progress (0-1) is driven directly by wheel input, not real scroll distance
// — the page itself never moves, only these two blocks crossfade in place.
// Once progress reaches 1, the wheel lock releases and normal page scroll
// resumes into the sections below; scrolling back up to the very top
// re-engages the lock so the hero can be scrubbed back into view.
const HERO_FADE_END = 0.5;
const SUBHEADING_THRESHOLD = 0.5;
const PROGRESS_PER_WHEEL_UNIT = 0.0015;
const SUBHEADING_STAGGER = 0.08;
const SUBHEADING_WORD_DURATION = 0.6;

export default function Home() {
  const {
    headline,
    subheadline,
    introHeadingPre,
    introHeadingEmphasis,
    introHeadingPost,
    introParagraphs,
    founderName,
    founderTitle,
    promisesHeading,
    promises,
    testimonials,
    faqs,
  } = getHomeContent();
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const [showSubheading, setShowSubheading] = useState(false);
  const subheadingAnimDoneRef = useRef(false);

  // Matches the word-stagger timing TextAnimate uses below, so the wheel
  // lock holds at progress 1 until the subheadline has actually finished
  // animating in, instead of releasing into page scroll mid-animation.
  useEffect(() => {
    if (!showSubheading) {
      subheadingAnimDoneRef.current = false;
      return;
    }
    const wordCount = subheadline.split(" ").filter(Boolean).length;
    const totalMs =
      (SUBHEADING_WORD_DURATION + (wordCount - 1) * SUBHEADING_STAGGER) * 1000;
    const id = setTimeout(() => {
      subheadingAnimDoneRef.current = true;
    }, totalMs);
    return () => clearTimeout(id);
  }, [showSubheading, subheadline]);

  useEffect(() => {
    function handleWheel(event: WheelEvent) {
      const atTop = window.scrollY <= 0;
      const holdingForSubheading =
        progressRef.current >= 1 && !subheadingAnimDoneRef.current;
      const locked =
        progressRef.current < 1 ||
        holdingForSubheading ||
        (atTop && event.deltaY < 0);
      if (!locked) return;

      event.preventDefault();
      if (holdingForSubheading) return;

      const next = Math.min(
        1,
        Math.max(
          0,
          progressRef.current + event.deltaY * PROGRESS_PER_WHEEL_UNIT,
        ),
      );
      progressRef.current = next;
      setProgress(next);
      setShowSubheading(next >= SUBHEADING_THRESHOLD);
    }
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  const heroFade = Math.min(1, progress / HERO_FADE_END);
  const heroVisible = progress < HERO_FADE_END;

  return (
    <>
      <main className="relative flex h-screen items-center justify-center overflow-hidden px-6">
        <div className="relative -mt-32 w-full max-w-2xl text-center">
          {heroVisible && (
            <motion.div
              style={{ opacity: 1 - heroFade, filter: `blur(${heroFade * 12}px)` }}
            >
              <TextAnimate
                as="h1"
                animation="blurIn"
                mode="word"
                stagger={0.08}
                className="text-display-sm text-text-primary"
              >
                {headline}
              </TextAnimate>
            </motion.div>
          )}
          {showSubheading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <TextAnimate
                as="p"
                animation="blurIn"
                mode="word"
                stagger={0.08}
                className="text-subheading-lg text-text-primary"
              >
                {subheadline}
              </TextAnimate>
            </div>
          )}
        </div>
      </main>

      <section className="w-full px-6 md:px-12 lg:px-16 pt-12 pb-32 text-left flex flex-col md:flex-row md:justify-center items-start gap-6 md:gap-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="w-full shrink-0 space-y-4 md:w-96"
        >
          <div className="aspect-[4/5] w-full rounded-lg bg-[var(--neutral-brand-300)]" />
          <div>
            <p className="text-body-lg font-semibold text-text-primary">
              {founderName}
            </p>
            <p className="text-body-md text-text-secondary">{founderTitle}</p>
          </div>
        </motion.div>
        <div className="space-y-8 md:max-w-xl">
          <motion.h2
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.08,
                },
              },
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            className="text-title-sm text-text-primary leading-tight flex flex-wrap"
          >
            <motion.span
              variants={{
                hidden: { opacity: 0, filter: "blur(12px)" },
                visible: { opacity: 1, filter: "blur(0px)" },
              }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mr-[0.25em]"
            >
              You
            </motion.span>
            <motion.span
              variants={{
                hidden: { opacity: 0, filter: "blur(12px)" },
                visible: { opacity: 1, filter: "blur(0px)" },
              }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mr-[0.25em]"
            >
              are
            </motion.span>
            <motion.span
              variants={{
                hidden: { opacity: 0, filter: "blur(12px)" },
                visible: { opacity: 1, filter: "blur(0px)" },
              }}
              transition={{ duration: 0.6, ease: EASE }}
              className="text-text-brand italic font-medium mr-[0.25em]"
            >
              not alone.
            </motion.span>
            <span className="basis-full h-0" />
            <motion.span
              variants={{
                hidden: { opacity: 0, filter: "blur(12px)" },
                visible: { opacity: 1, filter: "blur(0px)" },
              }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mr-[0.25em]"
            >
              You
            </motion.span>
            <motion.span
              variants={{
                hidden: { opacity: 0, filter: "blur(12px)" },
                visible: { opacity: 1, filter: "blur(0px)" },
              }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mr-[0.25em]"
            >
              are
            </motion.span>
            <motion.span
              variants={{
                hidden: { opacity: 0, filter: "blur(12px)" },
                visible: { opacity: 1, filter: "blur(0px)" },
              }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mr-[0.25em]"
            >
              safe
            </motion.span>
            <motion.span
              variants={{
                hidden: { opacity: 0, filter: "blur(12px)" },
                visible: { opacity: 1, filter: "blur(0px)" },
              }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              here.
            </motion.span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
            className="space-y-6"
          >
            <p className="text-subheading-sm text-text-primary">
              {introParagraphs[0]}
            </p>
            <p className="text-body-lg text-text-secondary">
              {introParagraphs[1]}
            </p>
            <p className="text-body-lg text-text-secondary">
              Whether you are here to attend our monthly sessions, access educational resources, or learn how to support a loved one, we are honored to walk alongside you.
            </p>
            <p className="text-body-lg text-text-secondary">
              With deep respect and hope,
              <br />
              <strong className="font-semibold text-text-primary">Hurt 2 Heal</strong>
            </p>
          </motion.div>
        </div>
      </section>

      <section className="px-5 py-32 md:px-10 lg:px-16">
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="text-title-sm text-text-brand"
        >
          {promisesHeading}
        </motion.p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {promises.map((promise, i) => (
            <motion.div
              key={promise.label}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
              className="flex min-h-[420px] flex-col justify-end bg-white p-8"
            >
              <div className="min-h-[170px]">
                <p className="text-title-xs text-text-brand">
                  {promise.label}
                </p>
                <p className="text-body-xl text-text-primary mt-3">
                  {promise.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="w-full bg-[var(--purple-900)] px-6 py-24 md:px-12 lg:px-16">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="text-title-md text-text-inverse text-center"
        >
          Testimonials
        </motion.h2>
        <div className="mt-24">
          <TestimonialsCarousel testimonials={testimonials} />
        </div>
      </section>

      <section className="w-full px-6 md:px-12 lg:px-16 pt-48 pb-32 flex flex-col md:flex-row md:justify-between items-start gap-12">
        <motion.div
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
          className="md:max-w-md"
        >
          <h2 className="text-title-md text-text-primary leading-tight flex flex-wrap">
            <motion.span
              variants={{
                hidden: { opacity: 0, filter: "blur(12px)" },
                visible: { opacity: 1, filter: "blur(0px)" },
              }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mr-[0.25em]"
            >
              Your
            </motion.span>
            <motion.span
              variants={{
                hidden: { opacity: 0, filter: "blur(12px)" },
                visible: { opacity: 1, filter: "blur(0px)" },
              }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mr-[0.25em]"
            >
              questions,
            </motion.span>
            <motion.span
              variants={{
                hidden: { opacity: 0, filter: "blur(12px)" },
                visible: { opacity: 1, filter: "blur(0px)" },
              }}
              transition={{ duration: 0.6, ease: EASE }}
              className="italic font-medium"
            >
              answered.
            </motion.span>
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
            className="text-body-xl text-text-secondary mt-6"
          >
            Everything you need to know before joining a session.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
          >
            <Link
              href="/faq"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-surface-cta px-5 py-2.5 text-body-sm text-text-inverse"
            >
              See all FAQs
              <span aria-hidden="true">→</span>
            </Link>
          </motion.div>
        </motion.div>
        <div className="w-full md:max-w-2xl">
          <FAQAccordion faqs={faqs} />
        </div>
      </section>
    </>
  );
}
