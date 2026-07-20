"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Testimonial } from "@/lib/content";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const QUOTE_CLASSES =
  "font-serif font-medium text-xl leading-snug tracking-tight md:text-[24px]";
const CARD_PADDING_CLASSES = "px-10 py-14 md:px-20 md:py-20";

export function TestimonialsCarousel({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [[index, direction], setIndex] = useState<[number, number]>([0, 1]);
  const [cardHeight, setCardHeight] = useState<number>();
  const measureRefs = useRef<(HTMLDivElement | null)[]>([]);

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
  }

  useEffect(() => {
    const id = setInterval(() => paginate(1), 5000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

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
            <p className={QUOTE_CLASSES}>{testimonial.quote}</p>
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
            transition={{ duration: 0.9, ease: EASE }}
            className={`bg-grain absolute inset-0 rounded-md bg-[var(--color-bg-base)] ${CARD_PADDING_CLASSES}`}
          >
            <p className={`${QUOTE_CLASSES} text-text-secondary`}>
              {testimonials[index].quote}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex justify-end gap-4">
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
