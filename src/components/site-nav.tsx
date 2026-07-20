"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  CaretDown,
  Phone,
  ChatText,
  ChatCircleDots,
  Globe,
} from "@phosphor-icons/react/dist/ssr";
import { TextAnimate } from "@/components/text-animate";
import { RotatingText } from "@/components/rotating-text";
import { QuickExit } from "@/components/quick-exit";

const links = [
  { label: "Programs & Events", href: "/programs" },
  { label: "Get Involved", href: "/get-involved" },
  { label: "Contact", href: "/contact" },
  { label: "About", href: "/about" },
];

type Hotline = {
  name: string;
  actions: {
    icon: typeof Phone;
    label: string;
    href: string;
    primary?: boolean;
  }[];
};

const hotlines: Hotline[] = [
  {
    name: "National Domestic Violence Hotline",
    actions: [
      {
        icon: Phone,
        label: "Call 800-799-7233",
        href: "tel:8007997233",
        primary: true,
      },
      { icon: ChatText, label: "Text BEGIN to 88788", href: "sms:88788" },
      {
        icon: ChatCircleDots,
        label: "Chat",
        href: "https://www.thehotline.org",
      },
      {
        icon: Globe,
        label: "Official Website",
        href: "https://www.thehotline.org",
      },
    ],
  },
  {
    name: "National Sexual Assault Hotline (RAINN)",
    actions: [
      {
        icon: Phone,
        label: "Call 800-656-4673",
        href: "tel:8006564673",
        primary: true,
      },
      {
        icon: ChatCircleDots,
        label: "Chat",
        href: "https://hotline.rainn.org",
      },
      { icon: Globe, label: "Official Website", href: "https://www.rainn.org" },
    ],
  },
];

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const TITLE_DELAY = 0.35;
const TITLE_DURATION = 0.9;
const BUTTONS_DELAY = 0.9;

export function SiteNav() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    function handleScroll() {
      const y = window.scrollY;
      const direction = y - lastScrollY.current;
      if (direction > 5 && y > 80) {
        setNavHidden(true);
      } else if (direction < -5) {
        setNavHidden(false);
      }
      lastScrollY.current = y;
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const utilityRow = (
    <div className="flex items-center justify-between gap-4 px-5 py-2 text-body-sm text-text-primary md:px-10 lg:px-16">
      <button
        type="button"
        onClick={() => setIsHelpOpen((open) => !open)}
        aria-expanded={isHelpOpen}
        className="flex items-center gap-1 font-semibold"
      >
        Free, Confidential, 24/7 Support
        <motion.span
          animate={{ y: isHelpOpen ? 0 : [0, -3, 0] }}
          transition={{ duration: 1.5, repeat: isHelpOpen ? 0 : Infinity, ease: "easeInOut" }}
          className="flex"
        >
          <CaretDown
            size={14}
            weight="bold"
            className={`transition-transform ${isHelpOpen ? "rotate-180" : ""}`}
          />
        </motion.span>
      </button>
      <RotatingText
        messages={[
          "If you are in immediate danger, please call 911",
          'Click the "X" in the bottom-right or "ESC" button on your keyboard twice to leave the site immediately.',
        ]}
        className="font-semibold"
      />
    </div>
  );

  return (
    <>
      <header className="sticky top-0 z-50">
      <div className="relative">
        {/* Invisible spacer — reserves the utility row's height in normal
            flow so nav sits in the right place, since the visible surface
            below is absolutely positioned (must overlay, not push, when
            the help panel opens). */}
        <div aria-hidden="true" className="invisible">
          {utilityRow}
        </div>

        {/* Single shared glass surface for the utility row + help panel —
            one bg/blur box that resizes via `layout`, instead of two
            separately-blurred elements handing off to each other (which
            is what produced the seam/line at the boundary). */}
        <motion.div
          layout
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="absolute inset-x-0 top-0 z-10 overflow-hidden bg-white/50 backdrop-blur-[80px]"
        >
          <motion.div layout="position">{utilityRow}</motion.div>
          <AnimatePresence mode="popLayout">
            {isHelpOpen && (
              <motion.div
                key="help-panel"
                layout="position"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                <div className="px-5 md:px-10 lg:px-16 py-16">
                  <TextAnimate
                    as="h2"
                    animation="blurIn"
                    delay={0.2}
                    duration={1}
                    className="text-title-xs mb-16"
                  >
                    Help is available, Speak with someone today
                  </TextAnimate>
                  <div className="grid gap-24 sm:grid-cols-[max-content_max-content]">
                    {hotlines.map((hotline) => (
                      <motion.div
                        key={hotline.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8, ease: EASE }}
                      >
                        <TextAnimate
                          as="h3"
                          animation="blurIn"
                          delay={TITLE_DELAY}
                          duration={TITLE_DURATION}
                          className="text-heading-xs mb-6"
                        >
                          {hotline.name}
                        </TextAnimate>
                        <div className="flex flex-col gap-2">
                          {Array.from({
                            length: Math.ceil(hotline.actions.length / 2),
                          }).map((_, rowIndex) => (
                            <div key={rowIndex} className="flex gap-2">
                              {hotline.actions
                                .slice(rowIndex * 2, rowIndex * 2 + 2)
                                .map((action) => (
                                  <motion.a
                                    key={action.label}
                                    href={action.href}
                                    initial={{
                                      opacity: 0,
                                      scale: 0.95,
                                      filter: "blur(12px)",
                                    }}
                                    animate={{
                                      opacity: 1,
                                      scale: 1,
                                      filter: "blur(0px)",
                                    }}
                                    transition={{
                                      delay: BUTTONS_DELAY + rowIndex * 0.08,
                                      duration: 0.8,
                                    }}
                                    className={`flex w-fit items-center justify-center gap-2 rounded-full px-3 py-2 text-body-sm ${
                                      action.primary
                                        ? "bg-surface-cta text-text-inverse"
                                        : "bg-text-primary/10 text-text-primary"
                                    }`}
                                  >
                                    <action.icon size={16} />
                                    {action.label}
                                  </motion.a>
                                ))}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ y: navHidden ? -60 : 0, opacity: navHidden ? 0 : 1 }}
        transition={{ duration: 0.3, ease: EASE }}
        className={isHelpOpen ? "invisible" : ""}
      >
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6 px-5 py-4 md:px-10 lg:px-16">
          <Link href="/" className="text-title-sm text-text-brand justify-self-start">
            H2H
          </Link>
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-body-md">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:underline font-semibold">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/get-involved"
            className="justify-self-end rounded-full bg-surface-cta px-5 py-2.5 text-body-sm text-text-inverse font-bold"
          >
            Register for a Session
          </Link>
        </div>
      </motion.nav>
      </header>
      <QuickExit />
    </>
  );
}
