import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { getAboutContent } from "@/lib/content";

export default function AboutPage() {
  const content = getAboutContent();

  return (
    <PageShell>
      <nav className="text-center text-body-md text-text-secondary pt-4 mb-8">
        <Link href="/" className="hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-text-primary font-semibold">About</span>
      </nav>
      <h1 className="text-3xl font-semibold tracking-tight mt-4">
        {content.welcomeTitle}
      </h1>
      <div className="mt-6 space-y-4 text-lg text-text-secondary">
        {content.welcomeBody.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
        <p>
          With deep respect and hope,
          <br />
          <strong className="font-semibold text-text-primary">{content.signoff}</strong>
        </p>
      </div>

      {/* Book Showcase Card */}
      <div className="mt-16 bg-white rounded-none p-10 md:p-16 flex flex-col md:flex-row items-center md:items-start gap-8 md:-mx-12 lg:-mx-20">
        <div className="w-36 md:w-44 shrink-0">
          <img
            src="/book.png"
            alt="Hurt Used to Live Here book cover"
            className="w-full h-auto object-contain filter drop-shadow-[0_12px_20px_rgba(0,0,0,0.25)]"
          />
        </div>
        <div className="flex-1 space-y-4 text-left">
          <h2 className="text-title-xs text-text-brand leading-snug max-w-md">
            Read Joyce’s Story:<br />Hurt Used to Live Here
          </h2>
          <p className="italic text-body-md text-text-secondary leading-relaxed">
            "I am sharing my story with you, so others who have judged me without knowing the silent pain that I carried will finally understand."
          </p>
          <p className="text-body-md text-text-secondary leading-relaxed">
            In her powerful autobiography, Hurt 2 Heal founder Joyce Reed shares her raw, triumphant journey through some of life's heaviest valleys to find ultimate healing and purpose. If you are looking for inspiration, validation, and a reminder of how resilient the human spirit can be, discover her story today.
          </p>
          <div className="pt-10">
            <a
              href="https://www.amazon.com/Hurt-Used-Live-Here-remember/dp/1484987837"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-surface-cta px-5 py-2.5 text-body-sm text-text-inverse font-bold hover:opacity-90 transition-opacity"
            >
              Order Now on Amazon
            </a>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
