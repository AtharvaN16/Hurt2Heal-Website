export function SiteFooter() {
  return (
    <footer className="border-t border-black/10 dark:border-white/10">
      <div className="mx-auto max-w-5xl px-6 py-8 text-sm text-zinc-600 dark:text-zinc-400">
        <p>© {new Date().getFullYear()} Hurt 2 Heal. All rights reserved.</p>
      </div>
    </footer>
  );
}
