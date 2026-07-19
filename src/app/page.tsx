"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { TextAnimate } from "@/components/text-animate";
import { getHomeContent } from "@/lib/content";

// Progress (0-1) is driven directly by wheel input, not real scroll distance
// — the page itself never moves, only these two blocks crossfade in place.
const HERO_FADE_END = 0.5;
const SUBHEADING_THRESHOLD = 0.5;
const PROGRESS_PER_WHEEL_UNIT = 0.0015;

export default function Home() {
  const { headline, subheadline } = getHomeContent();
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);

  useEffect(() => {
    function handleWheel(event: WheelEvent) {
      event.preventDefault();
      const next = Math.min(
        1,
        Math.max(
          0,
          progressRef.current + event.deltaY * PROGRESS_PER_WHEEL_UNIT,
        ),
      );
      progressRef.current = next;
      setProgress(next);
    }
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  const heroFade = Math.min(1, progress / HERO_FADE_END);
  const heroVisible = progress < HERO_FADE_END;
  const showSubheading = progress >= SUBHEADING_THRESHOLD;

  return (
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
  );
}
