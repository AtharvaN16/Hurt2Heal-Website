"use client";

import { useCallback, useEffect, useRef } from "react";
import { X } from "@phosphor-icons/react/dist/ssr";

const EXIT_URL = "https://www.google.com";
const ESC_WINDOW_MS = 2000;

export function QuickExit() {
  const armed = useRef(false);
  const armedTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

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

  return (
    <button
      type="button"
      onClick={exitSite}
      aria-label="Leave this site immediately"
      className="fixed right-6 bottom-6 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-surface-cta text-text-inverse shadow-lg"
    >
      <X size={24} weight="bold" />
    </button>
  );
}
