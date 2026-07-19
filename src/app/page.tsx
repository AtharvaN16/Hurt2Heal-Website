"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { TextAnimate } from "@/components/text-animate";
import { getHomeContent } from "@/lib/content";

// Kept well clear of the hero's own fade-out range ([0, HERO_FADE_END])
// so the two can never visibly overlap even if the state update below lags
// a frame or two behind the continuously-updated scroll motion value.
const HERO_FADE_END = 0.25;
const SUBHEADING_THRESHOLD = 0.5;

export default function Home() {
  const { headline, subheadline } = getHomeContent();
  const scrollRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, HERO_FADE_END], [1, 0]);
  const heroBlur = useTransform(
    scrollYProgress,
    [0, HERO_FADE_END],
    ["blur(0px)", "blur(12px)"],
  );

  const [heroVisible, setHeroVisible] = useState(
    () => scrollYProgress.get() < HERO_FADE_END,
  );
  const [showSubheading, setShowSubheading] = useState(
    () => scrollYProgress.get() >= SUBHEADING_THRESHOLD,
  );
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    // Unmount the hero outright once fully faded (not just opacity: 0) so
    // it's structurally impossible for it to still be visible/hoverable
    // behind the subheading, regardless of how the fade style resolves.
    setHeroVisible(value < HERO_FADE_END);
    setShowSubheading(value >= SUBHEADING_THRESHOLD);
  });

  return (
    <div ref={scrollRef} className="relative h-[200vh]">
      <main className="sticky top-0 flex min-h-screen items-center justify-center px-6">
        <div className="relative -mt-32 w-full max-w-3xl text-center">
          {heroVisible && (
            <motion.div style={{ opacity: heroOpacity, filter: heroBlur }}>
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
    </div>
  );
}
