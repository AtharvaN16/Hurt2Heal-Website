"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { TextAnimate } from "@/components/text-animate";
import { FAQAccordion } from "@/components/faq-accordion";
import { TestimonialsCarousel } from "@/components/testimonials-carousel";
import { FeaturedInLogoMark } from "@/components/featured-in";
import { getHomeContent } from "@/lib/content";
import { VideoCameraSlash, ShieldCheck, Heart, ShareNetwork, Handshake } from "@phosphor-icons/react";
import { SiteFooter } from "@/components/site-footer";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;
const PROMISE_ICONS = [VideoCameraSlash, ShieldCheck, Heart];

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
    featuredInHeading,
    featuredIn,
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
          className="text-title-sm text-text-brand text-center"
        >
          {promisesHeading}
        </motion.p>
        <div className="mt-24 grid gap-6 md:grid-cols-3">
          {promises.map((promise, i) => {
            const Icon = PROMISE_ICONS[i % PROMISE_ICONS.length];
            return (
              <motion.div
                key={promise.label}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
                className="group bg-grain relative overflow-hidden rounded-2xl bg-white p-8 md:p-10 flex min-h-[420px] flex-col justify-between transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.02] shadow-sm hover:shadow-xl border border-black/5 hover:border-[var(--magenta-200)]/60"
              >
                {/* Glow gradient inside the card on hover */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-20 left-1/2 -translate-x-1/2 w-[130%] h-64 rounded-full bg-[radial-gradient(ellipse_at_bottom,_rgba(230,96,217,0.3)_0%,_rgba(223,52,206,0.15)_45%,_transparent_75%)] blur-2xl opacity-0 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-110"
                />

                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--purple-200)] bg-[var(--purple-50)] text-text-brand transition-all duration-300 group-hover:scale-110 group-hover:bg-[var(--magenta-100)] group-hover:border-[var(--magenta-300)]">
                  <Icon size={30} weight="duotone" />
                </div>

                <div className="relative z-10 min-h-[170px]">
                  <p className="text-title-xs text-text-brand">
                    {promise.label}
                  </p>
                  <p className="text-body-xl text-text-primary mt-3">
                    {promise.text}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="px-5 py-40 md:px-10 lg:px-16">
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="text-title-sm text-text-tertiary text-center"
        >
          {featuredInHeading}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          className="mt-20 flex flex-wrap items-center justify-center gap-x-12 gap-y-8"
        >
          {featuredIn.map((logo) => (
            <FeaturedInLogoMark key={logo.name} {...logo} />
          ))}
        </motion.div>
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

      <section className="w-full px-6 md:px-12 lg:px-16 pt-32 pb-20 md:pb-28 flex flex-col md:flex-row md:justify-between items-start gap-12">
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

      {/* Help Us Build a Sanctuary for Healing - Bento Grid (Silna Health Inspired) */}
      <section className="w-full px-6 py-24 md:px-12 md:py-32 lg:px-16">
        <div className="mx-auto max-w-3xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="text-title-sm text-text-brand md:text-title-md"
          >
            Help Us Build a Sanctuary for Healing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="text-body-xl text-text-secondary mt-5"
          >
            Every survivor deserves the opportunity to heal, rebuild, and thrive—no matter where they are on their journey.
          </motion.p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8 md:mt-20">
          {/* Card 1: DONATE (Large Hero Card - Spans 7 columns on desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="group bg-grain relative overflow-hidden rounded-2xl bg-white p-8 md:p-12 lg:col-span-7 flex flex-col justify-between transition-all duration-500 ease-out hover:-translate-y-1.5 shadow-sm hover:shadow-xl border border-black/5 hover:border-[var(--magenta-200)]/60"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-24 left-1/2 -translate-x-1/2 w-[140%] h-80 rounded-full bg-[radial-gradient(ellipse_at_bottom,_rgba(230,96,217,0.25)_0%,_rgba(223,52,206,0.12)_45%,_transparent_75%)] blur-3xl opacity-60 transition-all duration-500 group-hover:opacity-100"
            />

            <div className="relative z-10">
              <div className="inline-flex items-center rounded-full bg-[var(--purple-50)] px-3.5 py-1 text-body-xs font-bold text-text-brand border border-[var(--purple-200)]/60">
                DONATE
              </div>

              {/* Impact Stat Callout */}
              <div className="mt-8 border-l-2 border-[var(--magenta-400)] pl-6">
                <span className="font-serif text-5xl font-bold tracking-tight text-text-brand md:text-6xl lg:text-7xl block">
                  321,500
                </span>
                <p className="text-body-md text-text-secondary mt-2 max-w-md">
                  The average number of sexual assault and rape victims each year in the U.S. alone.
                </p>
              </div>

              <p className="text-body-lg text-text-primary mt-8 leading-relaxed">
                At Hurt 2 Heal, we believe change starts with community. Every act of kindness, every dollar, and every contribution helps keep our peer-led digital spaces free, safe, and accessible to those who need them most. Together, we can ensure no survivor has to walk the path to healing alone.
              </p>
            </div>

            <div className="relative z-10 mt-10">
              <a
                href="https://www.zeffy.com/en-US/donation-form/donate-to-make-a-difference-for-hurt-2-heal"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-surface-cta px-7 py-3.5 text-body-md font-bold text-text-inverse transition-all duration-200 hover:scale-[1.02] hover:bg-[var(--purple-900)] shadow-md"
              >
                Donate Now
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </motion.div>

          {/* Right Column Stack: SHARE + VOLUNTEER (Spans 5 columns on desktop) */}
          <div className="grid grid-cols-1 gap-6 lg:col-span-5 lg:flex lg:flex-col lg:justify-between">
            {/* Card 2: SHARE (Top Right - Light Gradient Card) */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
              className="group bg-grain relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-[var(--purple-50)]/40 to-[var(--magenta-50)]/30 p-8 md:p-10 flex flex-col justify-between flex-1 transition-all duration-500 ease-out hover:-translate-y-1.5 shadow-sm hover:shadow-xl border border-black/5 hover:border-[var(--magenta-200)]/60"
            >
              <div className="relative z-10">
                <div className="flex items-start justify-between gap-4">
                  <span className="inline-flex items-center rounded-full bg-white px-3.5 py-1 text-body-xs font-bold text-text-brand border border-[var(--purple-200)]/60 shadow-xs">
                    SHARE
                  </span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-text-brand border border-[var(--purple-200)]/60 shadow-xs group-hover:scale-105 transition-transform">
                    <ShareNetwork size={24} weight="duotone" />
                  </div>
                </div>

                <h3 className="text-title-xs text-text-brand mt-6 font-semibold">
                  Share Our Campaign
                </h3>
                <p className="text-body-md text-text-secondary mt-3 leading-relaxed">
                  Share our campaign with your friends, family, and on social media. Your advocacy can amplify our impact.
                </p>
              </div>

              <div className="relative z-10 mt-8">
                <a
                  href="https://www.instagram.com/_hurt2heal/?hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-body-md font-bold text-text-brand hover:underline"
                >
                  Share Campaign <span aria-hidden="true">→</span>
                </a>
              </div>
            </motion.div>

            {/* Card 3: VOLUNTEER (Bottom Right - Dark Purple Silna Style Card with Radial Glow) */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
              className="group bg-grain relative overflow-hidden rounded-2xl bg-[var(--purple-900)] p-8 md:p-10 flex flex-col justify-between flex-1 transition-all duration-500 ease-out hover:-translate-y-1.5 shadow-md hover:shadow-2xl"
            >
              {/* Silna bottom glow effect */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-20 left-1/2 -translate-x-1/2 w-[130%] h-48 rounded-full bg-[radial-gradient(ellipse_at_bottom,_rgba(230,96,217,0.5)_0%,_rgba(169,46,184,0.25)_45%,_transparent_75%)] blur-xl opacity-40 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-110"
              />

              <div className="relative z-10">
                <div className="flex items-start justify-between gap-4">
                  <span className="inline-flex items-center rounded-full bg-white/10 px-3.5 py-1 text-body-xs font-bold text-[var(--magenta-100)] border border-white/10">
                    VOLUNTEER
                  </span>
                  <Handshake size={28} className="text-[var(--magenta-200)] opacity-85 shrink-0" weight="duotone" />
                </div>

                <h3 className="text-title-xs text-[var(--magenta-50)] mt-6 font-semibold">
                  Volunteer Your Time & Skills
                </h3>
                <p className="text-body-md text-white/80 mt-3 leading-relaxed">
                  Your time and skills can make an impact too. Join our dedicated community of advocates and volunteers.
                </p>
              </div>

              <div className="relative z-10 mt-8">
                <a
                  href="https://www.idealist.org/en/nonprofit/22ea980b0d044873bc551ce5532e1bf5-hurt-2-heal-inc-kennesaw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white hover:text-[var(--purple-900)]"
                  aria-label="Become a Volunteer"
                >
                  <span aria-hidden="true" className="text-lg font-bold">→</span>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
