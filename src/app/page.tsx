"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { TextAnimate } from "@/components/text-animate";
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
  const { headline, subheadline, introHeadingPre, introHeadingEmphasis, introHeadingPost, introParagraphs, promises } =
    getHomeContent();
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
        <div className="relative -mt-32 w-full max-w-3xl text-center">
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

      <section className="mx-auto max-w-3xl px-6 py-32 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="text-title-md text-text-primary"
        >
          {introHeadingPre}
          <em className="text-text-brand italic">
            {introHeadingEmphasis}
          </em>
          {introHeadingPost}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
          className="text-subheading-md text-text-primary mt-4"
        >
          {introParagraphs[0]}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
          className="text-body-xl text-text-secondary mt-16"
        >
          {introParagraphs[1]}
        </motion.p>
      </section>

      <section className="space-y-24 px-5 py-32 md:px-10 lg:px-16">
        {promises.map((promise, i) => (
          <motion.p
            key={promise.label}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
            className={`text-subheading-lg max-w-2xl text-left ${
              i % 2 === 1 ? "ml-auto" : ""
            }`}
          >
            <em className="text-text-brand italic">
              {promise.label}
            </em>{" "}
            <span className="text-text-primary">{promise.text}</span>
          </motion.p>
        ))}
      </section>
    </>
  );
}
