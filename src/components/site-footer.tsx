import Link from "next/link";
import { FacebookLogo, InstagramLogo } from "@phosphor-icons/react/dist/ssr";

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
    numbers: [{ label: "(404) 892-4646", href: "tel:4048924646" }],
  },
  {
    name: "Fulton County Department of Mental Health, Emergency Mental Health Services",
    numbers: [
      { label: "(404) 730-1600", href: "tel:4047301600" },
      { label: "(404) 730-1608", href: "tel:4047301608" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="w-full bg-gradient-footer">
      <div className="w-full px-6 pt-24 pb-10 md:px-12 md:pt-32 lg:px-16">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <h2 className="text-title-sm text-text-brand">Keep in touch</h2>
            <p className="text-body-lg text-text-secondary mt-4 max-w-sm">
              Subscribe to our newsletter to stay up to date with our latest
              news and events.
            </p>
          </div>

          <form className="grid grid-cols-1 gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
            <div className="grid gap-6 sm:grid-cols-2 sm:col-span-2">
              <label className="text-heading-xxs text-text-primary">
                First Name
                <input
                  type="text"
                  name="firstName"
                  autoComplete="given-name"
                  className="mt-2 block w-full border-b border-text-primary/30 bg-transparent pb-2 text-body-md text-text-primary outline-none focus:border-text-brand"
                />
              </label>
              <label className="text-heading-xxs text-text-primary">
                Last Name
                <input
                  type="text"
                  name="lastName"
                  autoComplete="family-name"
                  className="mt-2 block w-full border-b border-text-primary/30 bg-transparent pb-2 text-body-md text-text-primary outline-none focus:border-text-brand"
                />
              </label>
            </div>
            <label className="text-heading-xxs text-text-primary sm:col-span-1">
              Email
              <input
                type="email"
                name="email"
                autoComplete="email"
                className="mt-2 block w-full border-b border-text-primary/30 bg-transparent pb-2 text-body-md text-text-primary outline-none focus:border-text-brand"
              />
            </label>
            <div className="sm:col-start-2 sm:row-start-1 sm:justify-self-end">
              <button
                type="submit"
                className="rounded-full bg-surface-cta px-6 py-2.5 text-body-sm font-bold text-text-inverse"
              >
                Submit
              </button>
            </div>
            <p className="text-body-xs text-text-tertiary italic sm:col-span-2">
              We respect your privacy and will never share your information.
              You can unsubscribe anytime.
            </p>
          </form>
        </div>

        <div className="bg-grain relative mt-16 rounded-xl bg-[var(--color-bg-base)] p-6 md:mt-24 md:px-[54px] md:py-[68px]">
          <div className="bg-grain relative overflow-hidden bg-[var(--purple-900)] px-8 py-10 md:px-12 md:py-12">
            <h3 className="text-title-xs text-[var(--magenta-50)] max-w-lg">
              Next Session on July 25, 9:00 PM
            </h3>
            <Link
              href="/get-involved"
              className="mt-6 inline-flex items-center rounded-full bg-[var(--magenta-100)] px-5 py-2.5 text-body-sm font-bold text-[var(--purple-900)]"
            >
              Register for a session
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-10 md:mt-[53px] md:grid-cols-[1.25fr_1.2fr] md:gap-8">
            <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 md:grid-cols-[0.85fr_1.3fr_0.7fr] md:gap-x-[40px] md:px-[40px] md:py-[54px]">
              <div>
                <h4 className="text-footer-label text-text-brand">
                  Navigation
                </h4>
                <ul className="mt-4 space-y-3 text-body-md text-text-primary">
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
                <h4 className="text-footer-label text-text-brand">
                  Get Involved
                </h4>
                <ul className="mt-4 space-y-3 text-body-md text-text-primary">
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
                <h4 className="text-footer-label text-text-brand">Socials</h4>
                <div className="mt-4 flex gap-3">
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
              <h4 className="text-[20px] font-bold text-text-brand">
                Crisis Support (24/7)
              </h4>
              <p className="text-[16px] text-text-secondary mt-4">
                Hurt 2 Heal is not a crisis center. If you are in immediate
                danger, please call 911 or contact crisis hotlines:
              </p>
              <ul className="mt-4 space-y-3">
                {hotlines.map((hotline) => (
                  <li
                    key={hotline.name}
                    className="flex items-start justify-between gap-6"
                  >
                    <p className="max-w-[280px] text-[16px] font-bold text-text-primary">
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
      </div>

      <p className="sr-only">
        © {new Date().getFullYear()} Hurt 2 Heal. All rights reserved.
      </p>
    </footer>
  );
}
