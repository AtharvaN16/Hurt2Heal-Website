"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { X } from "@phosphor-icons/react/dist/ssr";

const EXIT_URL = "https://www.google.com";
const ESC_WINDOW_MS = 2000;
const PROXIMITY_RADIUS = 80; // pixels from button edge

export function QuickExit() {
  const armed = useRef(false);
  const armedTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isNear, setIsNear] = useState(false);

  const exitSite = useCallback(() => {
    window.location.replace(EXIT_URL);
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;

      if (armed.current) {
        exitSite();
        return;
      }

      armed.current = true;
      clearTimeout(armedTimeout.current);
      armedTimeout.current = setTimeout(() => {
        armed.current = false;
      }, ESC_WINDOW_MS);
    }
    document.addEventListener("keydown", handleKeyDown, true);
    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      clearTimeout(armedTimeout.current);
    };
  }, [exitSite]);

  useEffect(() => {
    const button = buttonRef.current!;
    if (!button) return;

    function handleMouseMove(event: MouseEvent) {
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY);
      const threshold = rect.width / 2 + PROXIMITY_RADIUS;
      setIsNear(distance < threshold);
    }

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.button
      ref={buttonRef}
      type="button"
      onClick={exitSite}
      aria-label="Leave this site immediately"
      className="fixed right-6 bottom-6 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-surface-cta text-text-inverse shadow-lg"
      animate={{ scale: isNear ? 1.75 : 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      <X size={24} weight="bold" />
    </motion.button>
  );
}
