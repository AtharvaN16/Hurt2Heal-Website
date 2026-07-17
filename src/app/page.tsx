import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { getHomeContent } from "@/lib/content";

export default function Home() {
  const content = getHomeContent();

  return (
    <PageShell>
      <h1 className="text-4xl font-semibold tracking-tight">
        {content.headline}
      </h1>
      <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400">
        {content.subheadline}
      </p>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        {content.ctas.map((cta) => (
          <Link
            key={cta.href}
            href={cta.href}
            className="flex h-12 items-center justify-center rounded-full bg-foreground px-6 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            {cta.label}
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
