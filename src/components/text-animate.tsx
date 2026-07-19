"use client";

import { motion, type TargetAndTransition } from "framer-motion";
import { useMemo, type ReactNode, type ElementType } from "react";

type AnimationType = "blurIn" | "fadeIn" | "slideUp";
type AnimateMode = "word" | "block";

interface TextAnimateProps {
  children: ReactNode;
  animation?: AnimationType;
  mode?: AnimateMode;
  as?: ElementType;
  delay?: number;
  duration?: number;
  stagger?: number;
  className?: string;
}

const animations: Record<AnimationType, { hidden: TargetAndTransition; visible: TargetAndTransition }> = {
  blurIn: {
    hidden: { opacity: 0, filter: "blur(12px)" },
    visible: { opacity: 1, filter: "blur(0px)" },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
};

const transition = {
  ease: [0.25, 0.46, 0.45, 0.94] as const,
};

export function TextAnimate({
  children,
  animation = "blurIn",
  mode = "block",
  as: Component = "div",
  delay = 0,
  duration = 0.6,
  stagger = 0.06,
  className,
  ...props
}: TextAnimateProps) {
  const { hidden, visible } = animations[animation];
  const MotionComponent = useMemo(() => motion.create(Component), [Component]);

  if (mode === "block") {
    return (
      <MotionComponent
        initial={hidden}
        animate={visible}
        transition={{ duration, delay, ...transition }}
        className={className}
        {...props}
      >
        {children}
      </MotionComponent>
    );
  }

  const text = typeof children === "string" ? children : String(children);
  const words = text.split(" ").filter(Boolean);

  return (
    <Component className={className} {...props}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={hidden}
          animate={visible}
          transition={{ duration, delay: delay + i * stagger, ...transition }}
          style={{ display: "inline-block", marginRight: i < words.length - 1 ? "0.25em" : 0 }}
        >
          {word}
        </motion.span>
      ))}
    </Component>
  );
}