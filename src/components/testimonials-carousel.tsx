"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play, Pause } from "@phosphor-icons/react/dist/ssr";
import type { Testimonial } from "@/lib/content";

const EASE = [0.25, 1, 0.4, 1] as const;
const AUTOPLAY_DURATION = 6000;

const QUOTE_CLASSES =
  "font-serif font-medium text-xl leading-snug tracking-tight md:text-[24px]";
const CARD_PADDING_CLASSES = "px-10 py-14 md:px-20 md:py-20";

export function TestimonialsCarousel({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [[index, direction], setIndex] = useState<[number, number]>([0, 1]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [cardHeight, setCardHeight] = useState<number>();
  const measureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animFrameRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    function measure() {
      const heights = measureRefs.current.map((el) => el?.offsetHeight ?? 0);
      setCardHeight(Math.max(...heights, 0));
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [testimonials]);

  function paginate(dir: number) {
    setIndex(([prev]) => [
      (prev + dir + testimonials.length) % testimonials.length,
      dir,
    ]);
    setProgress(0);
  }

  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    let start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const p = Math.min(elapsed / AUTOPLAY_DURATION, 1);
      setProgress(p);

      if (p >= 1) {
        paginate(1);
        start = performance.now();
        setProgress(0);
      }
      animFrameRef.current = requestAnimationFrame(tick);
    }

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, index, testimonials.length]);

  const circleCircumference = 2 * Math.PI * 23; // ~144.513

  return (
    <div className="mx-auto max-w-[1140px]">
      {/* Hidden measurement pass — mirrors the visible card exactly so the
          carousel can be sized to the tallest testimonial and never reflow. */}
      <div aria-hidden className="invisible absolute -z-10 w-full max-w-[1140px]">
        {testimonials.map((testimonial, i) => (
          <div
            key={i}
            ref={(el) => {
              measureRefs.current[i] = el;
            }}
            className={CARD_PADDING_CLASSES}
          >
            <p className={QUOTE_CLASSES}>
              {testimonial.quoteBefore}
              <mark className="bg-[var(--magenta-100)] text-text-primary box-decoration-clone px-1.5 py-0.5 rounded-[3px]">
                {testimonial.highlight}
              </mark>
              {testimonial.quoteAfter}
            </p>
          </div>
        ))}
      </div>

      <div className="relative" style={{ height: cardHeight }}>
        <AnimatePresence custom={direction} initial={false}>
          <motion.div
            key={index}
            custom={direction}
            initial={{
              x: direction > 0 ? "100%" : "-100%",
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
            }}
            animate={{ x: 0, opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.92, filter: "blur(10px)" }}
            transition={{ duration: 1.8, ease: EASE }}
            className={`bg-grain absolute inset-0 bg-[var(--color-bg-base)] ${CARD_PADDING_CLASSES}`}
          >
            <p className={`${QUOTE_CLASSES} text-text-secondary`}>
              {testimonials[index].quoteBefore}
              <mark className="bg-[var(--magenta-100)] text-text-primary box-decoration-clone px-1.5 py-0.5 rounded-[3px]">
                {testimonials[index].highlight}
              </mark>
              {testimonials[index].quoteAfter}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex justify-end gap-4">
        {/* Play/Pause Button with Progress Stroke Ring */}
        <button
          type="button"
          onClick={() => {
            setIsPlaying((prev) => !prev);
          }}
          aria-label={isPlaying ? "Pause autoplay" : "Start autoplay"}
          className="relative flex h-12 w-12 items-center justify-center rounded-full text-text-inverse transition-colors hover:bg-white/10"
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            className="absolute inset-0 -rotate-90 pointer-events-none"
          >
            {/* Base Ring Stroke */}
            <circle
              cx="24"
              cy="24"
              r="23"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-text-inverse/30"
            />
            {/* Active Progress Stroke */}
            <circle
              cx="24"
              cy="24"
              r="23"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray={circleCircumference}
              strokeDashoffset={circleCircumference * (1 - progress)}
              strokeLinecap="round"
              className="text-text-inverse"
            />
          </svg>
          {isPlaying ? (
            <Pause size={18} weight="fill" />
          ) : (
            <Play size={18} weight="fill" className="ml-0.5" />
          )}
        </button>

        <button
          type="button"
          onClick={() => paginate(-1)}
          aria-label="Previous testimonial"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-text-inverse/40 text-text-inverse transition-colors hover:bg-white/10"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => paginate(1)}
          aria-label="Next testimonial"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-text-inverse/40 text-text-inverse transition-colors hover:bg-white/10"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
