// src/components/contact/envelope-svg.tsx
"use client";

import { motion } from "framer-motion";

export const ENVELOPE_WIDTH = 400;
export const ENVELOPE_HEIGHT = 240;
export const ENVELOPE_FLAP_HEIGHT = 132;

export function EnvelopeBody({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${ENVELOPE_WIDTH} ${ENVELOPE_HEIGHT}`}
      className={className}
      aria-hidden="true"
    >
      <rect
        x="4"
        y="4"
        width={ENVELOPE_WIDTH - 8}
        height={ENVELOPE_HEIGHT - 8}
        rx="18"
        fill="var(--warm-100)"
        stroke="var(--purple-800)"
        strokeWidth="2"
      />
      <path
        d={`M 4 22 L ${ENVELOPE_WIDTH / 2} ${ENVELOPE_HEIGHT - 36} L ${
          ENVELOPE_WIDTH - 4
        } 22`}
        fill="none"
        stroke="var(--purple-800)"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

type FlapPose = "open" | "closed";

export function EnvelopeFlap({
  pose,
  transitionDuration,
  className,
}: {
  pose: FlapPose;
  transitionDuration: number;
  className?: string;
}) {
  return (
    <motion.svg
      viewBox={`0 0 ${ENVELOPE_WIDTH} ${ENVELOPE_FLAP_HEIGHT}`}
      className={className}
      style={{ transformOrigin: "50% 0%", transformStyle: "preserve-3d" }}
      initial={false}
      animate={{ rotateX: pose === "open" ? 165 : 0 }}
      transition={{ duration: transitionDuration, ease: [0.65, 0, 0.35, 1] }}
      aria-hidden="true"
    >
      <path
        d={`M 4 4 L ${ENVELOPE_WIDTH / 2} ${ENVELOPE_FLAP_HEIGHT - 12} L ${
          ENVELOPE_WIDTH - 4
        } 4 Z`}
        fill="var(--warm-200)"
        stroke="var(--purple-800)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}
