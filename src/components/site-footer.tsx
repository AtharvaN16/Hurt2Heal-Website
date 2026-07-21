import Link from "next/link";
import { FacebookLogo, InstagramLogo, CalendarCheck } from "@phosphor-icons/react/dist/ssr";
import { NewsletterForm } from "@/components/newsletter-form";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "FAQs", href: "/faq" },
  { label: "Contact", href: "/contact" },
  { label: "Resources", href: "/resources" },
];

const getInvolvedLinks = [
  { label: "Events & Programs", href: "/programs" },
  {
    label: "Volunteer",
    href: "https://www.idealist.org/en/nonprofit/22ea980b0d044873bc551ce5532e1bf5-hurt-2-heal-inc-kennesaw",
    external: true,
  },
  {
    label: "Donate",
    href: "https://www.zeffy.com/en-US/donation-form/donate-to-make-a-difference-for-hurt-2-heal",
    external: true,
  },
];

const socials = [
  {
    label: "Facebook",
    icon: FacebookLogo,
    href: "https://www.facebook.com/hurt2heal/",
  },
  {
    label: "Instagram",
    icon: InstagramLogo,
    href: "https://www.instagram.com/_hurt2heal/?hl=en",
  },
];

type Hotline = {
  name: string;
  numbers: { label: string; href: string }[];
};

const hotlines: Hotline[] = [
  {
    name: "National Domestic Violence Hotline",
    numbers: [{ label: "1-800-799-7233", href: "tel:18007997233" }],
  },
  {
    name: "National Sexual Assault Hotline (RAINN)",
    numbers: [{ label: "1-800-656-4673", href: "tel:18006564673" }],
  },
  {
    name: "Georgia Crisis and Access Line",
    numbers: [{ label: "1-800-715-4225", href: "tel:18007154225" }],
  },
  {
    name: "DeKalb Community Service Board, Crisis Access Line",
    numbers: [{ label: "1-404-892-4646", href: "tel:14048924646" }],
  },
  {
    name: "Fulton County Department of Mental Health, Emergency Mental Health Services",
    numbers: [
      { label: "1-404-730-1600", href: "tel:14047301600" },
      { label: "1-404-730-1608", href: "tel:14047301608" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="w-full bg-gradient-footer">
      <div className="w-full px-6 pt-16 pb-6 md:px-12 md:pt-12 md:pb-8 lg:px-16">
        <NewsletterForm />

        <div className="bg-grain relative mt-40 rounded-xl bg-[var(--color-bg-base)] p-6 md:mt-64 md:px-[54px] md:py-16">
          <div className="group bg-grain relative overflow-hidden rounded-xl bg-[var(--purple-900)] px-8 py-6 md:px-12 md:py-7 min-h-[160px] md:min-h-[180px] flex flex-col justify-between">
            {/* Silna Health-inspired bottom glow (subtle hover) */}
            {/* Wide atmospheric glow layer */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-24 left-1/2 -translate-x-1/2 w-[130%] h-60 rounded-full bg-[radial-gradient(ellipse_at_bottom,_var(--magenta-400)_0%,_var(--purple-500)_40%,_var(--purple-800)_70%,_transparent_90%)] blur-2xl opacity-0 transition-all duration-500 ease-out group-hover:opacity-55 group-hover:scale-105"
            />
            {/* Soft core light emission layer */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-16 left-1/2 -translate-x-1/2 w-[90%] h-32 rounded-full bg-[radial-gradient(ellipse_at_bottom,_var(--magenta-200)_0%,_var(--magenta-400)_40%,_transparent_75%)] blur-xl opacity-0 transition-all duration-500 ease-out group-hover:opacity-50 group-hover:scale-105"
            />

            <div className="relative z-10 flex items-start justify-between gap-4">
              <h3 className="text-title-xs text-[var(--magenta-50)] max-w-lg">
                Next Session on July 25, 9:00 PM
              </h3>
              <CalendarCheck size={28} className="text-[var(--magenta-200)] opacity-75 shrink-0 mt-1" weight="light" />
            </div>

            <div className="relative z-10 mt-auto pt-6">
              <Link
                href="/get-involved"
                className="inline-flex items-center rounded-full bg-[var(--magenta-100)] px-5 py-2.5 text-body-sm font-bold text-[var(--purple-900)] transition-all duration-200 hover:bg-white hover:scale-[1.02]"
              >
                Register for a session
              </Link>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-10 md:mt-[53px] md:grid-cols-[1.25fr_1.2fr] md:gap-8">
            <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 md:grid-cols-[0.85fr_1.3fr_0.7fr] md:gap-x-[40px] md:px-[40px] md:py-[54px]">
              <div>
                <h4 className="text-footer-label text-text-brand mb-4 md:mb-8">
                  Navigation
                </h4>
                <ul className="space-y-[18px] text-body-md text-text-primary">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="hover:underline">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-footer-label text-text-brand mb-4 md:mb-8">
                  Get Involved
                </h4>
                <ul className="space-y-[18px] text-body-md text-text-primary">
                  {getInvolvedLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="hover:underline"
                        {...(link.external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-footer-label text-text-brand mb-4 md:mb-8">Socials</h4>
                <div className="flex gap-3">
                  {socials.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--purple-900)] text-text-inverse"
                    >
                      <social.icon size={18} weight="fill" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:px-[40px] md:py-[54px]">
              <h4 className="text-[20px] font-bold text-text-brand mb-[18px]">
                Crisis Support (24/7)
              </h4>
              <p className="text-[16px] text-text-secondary mb-7">
                Hurt 2 Heal is not a crisis center. If you are in immediate
                danger, please call 911 or contact crisis hotlines:
              </p>
              <ul className="space-y-[18px]">
                {hotlines.map((hotline) => (
                  <li
                    key={hotline.name}
                    className="flex items-start justify-between gap-6"
                  >
                    <p className="max-w-[320px] text-[16px] font-bold text-text-primary">
                      {hotline.name}
                    </p>
                    <div className="flex flex-wrap justify-end gap-x-3 gap-y-0.5 text-[16px]">
                      {hotline.numbers.map((number) => (
                        <a
                          key={number.href}
                          href={number.href}
                          className="text-text-brand underline whitespace-nowrap"
                        >
                          {number.label}
                        </a>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-4 text-body-xs text-text-inverse/60 sm:flex-row md:mt-8">
          <div className="flex items-center gap-6">
            <Link
              href="/privacy-policy"
              className="hover:text-text-inverse hover:underline transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-use"
              className="hover:text-text-inverse hover:underline transition-colors"
            >
              Terms of Use
            </Link>
          </div>
          <p className="text-center sm:text-right">
            Hurt 2 Heal is a registered 501(c)(3) non-profit organization.
          </p>
        </div>
      </div>

      <p className="sr-only">
        © {new Date().getFullYear()} Hurt 2 Heal. All rights reserved.
      </p>
    </footer>
  );
}
