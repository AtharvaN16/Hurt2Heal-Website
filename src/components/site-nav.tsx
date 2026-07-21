"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  CaretDown,
  Phone,
  ChatText,
  ChatCircleDots,
  Globe,
  HandHeart,
  Handshake,
  ShareNetwork,
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

const SHARE_DATA = {
  title: "Hurt 2 Heal",
  text: "A safe, peer-led digital sanctuary for trauma-informed education, support, and community healing.",
};

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
  const [isGetInvolvedOpen, setIsGetInvolvedOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const lastScrollY = useRef(0);
  const getInvolvedRef = useRef<HTMLLIElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const getInvolvedItems = [
    {
      label: "Donate",
      description:
        "Every dollar counts. Contribute now to help us reach our goal.",
      icon: HandHeart,
      href: "https://www.zeffy.com/en-US/donation-form/donate-to-make-a-difference-for-hurt-2-heal",
      external: true,
    },
    {
      label: "Volunteer",
      description: "Your time and skills can make an impact too.",
      icon: Handshake,
      href: "https://www.idealist.org/en/nonprofit/22ea980b0d044873bc551ce5532e1bf5-hurt-2-heal-inc-kennesaw",
      external: true,
    },
    {
      label: "Share",
      description: shareCopied
        ? "Link copied!"
        : "Share our campaign with your friends, family, and on social media. Your advocacy can amplify our impact.",
      icon: ShareNetwork,
    },
  ];

  async function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ ...SHARE_DATA, url: window.location.origin });
      } catch {
        // user cancelled the share sheet — no-op
      }
      return;
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(window.location.origin);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      } catch {
        // clipboard unavailable — no-op
      }
    }
  }

  function handleGetInvolvedPointerMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    glowRef.current?.style.setProperty("--glow-x", `${event.clientX - rect.left}px`);
    glowRef.current?.style.setProperty("--glow-y", `${event.clientY - rect.top}px`);
  }

  useEffect(() => {
    if (!isGetInvolvedOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        getInvolvedRef.current &&
        !getInvolvedRef.current.contains(event.target as Node)
      ) {
        setIsGetInvolvedOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsGetInvolvedOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isGetInvolvedOpen]);

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
          animate={{ opacity: navHidden ? 0 : 1, y: navHidden ? -60 : 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="absolute inset-x-0 top-0 z-10 overflow-hidden bg-white/80 backdrop-blur-[80px]"
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
        className={`${isHelpOpen ? "invisible" : ""} bg-white/50 backdrop-blur-[80px]`}
      >
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6 px-5 py-4 md:px-10 lg:px-16">
          <Link href="/" className="justify-self-start flex items-center" aria-label="Hurt 2 Heal Home">
            <Image
              src="/logo.svg"
              alt="Hurt 2 Heal"
              width={64}
              height={64}
              className="h-16 w-16 shrink-0 -my-3"
              priority
            />
          </Link>
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-body-md">
            {links.map((link) =>
              link.label === "Get Involved" ? (
                <li key={link.href} className="relative" ref={getInvolvedRef}>
                  <button
                    type="button"
                    onClick={() => setIsGetInvolvedOpen((open) => !open)}
                    aria-expanded={isGetInvolvedOpen}
                    className="flex items-center gap-1 font-semibold hover:underline"
                  >
                    {link.label}
                    <CaretDown
                      size={12}
                      weight="bold"
                      className={`transition-transform ${
                        isGetInvolvedOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isGetInvolvedOpen && (
                      <motion.div
                        onMouseMove={handleGetInvolvedPointerMove}
                        initial={{ opacity: 0, y: -8, filter: "blur(8px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -8, filter: "blur(8px)" }}
                        transition={{ duration: 0.3, ease: EASE }}
                        className="group absolute left-0 top-full z-20 mt-8 w-[36rem] overflow-hidden bg-white backdrop-blur-[200px]"
                      >
                        <div
                          ref={glowRef}
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                          style={{
                            background:
                              "radial-gradient(350px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(230,96,217,0.08), transparent 70%)",
                          }}
                        />
                        <div className="relative flex flex-col gap-1 px-8 py-6">
                          {getInvolvedItems.map((item, index) => {
                            const content = (
                              <>
                                <span className="flex h-14 w-14 shrink-0 items-center justify-center text-text-brand">
                                  <item.icon size={40} weight="duotone" />
                                </span>
                                <span className="flex flex-col">
                                  <span className="text-heading-xs text-text-primary transition-colors group-hover/row:text-text-brand">
                                    {item.label}
                                  </span>
                                  <span className="text-body-md text-text-tertiary">
                                    {item.description}
                                  </span>
                                </span>
                              </>
                            );
                            return (
                              <motion.div
                                key={item.label}
                                initial={{ opacity: 0, filter: "blur(12px)" }}
                                animate={{ opacity: 1, filter: "blur(0px)" }}
                                transition={{
                                  delay: 0.1 + index * 0.08,
                                  duration: 0.6,
                                }}
                              >
                                {item.href ? (
                                  <a
                                    href={item.href}
                                    target={item.external ? "_blank" : undefined}
                                    rel={
                                      item.external
                                        ? "noopener noreferrer"
                                        : undefined
                                    }
                                    onClick={() => setIsGetInvolvedOpen(false)}
                                    className="group/row flex items-start gap-7 rounded-xl px-5 py-4"
                                  >
                                    {content}
                                  </a>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleShare();
                                      setIsGetInvolvedOpen(false);
                                    }}
                                    className="group/row flex w-full items-start gap-7 rounded-xl px-5 py-4 text-left"
                                  >
                                    {content}
                                  </button>
                                )}
                              </motion.div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              ) : (
                <li key={link.href}>
                  <Link href={link.href} className="hover:underline font-semibold">
                    {link.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
          <Link
            href="https://gforms.app/r/UN9N9Fp"
            target="_blank"
            rel="noopener noreferrer"
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
