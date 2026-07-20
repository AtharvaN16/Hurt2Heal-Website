export function SiteFooter() {
  return (
    <footer className="border-t border-black/10 dark:border-white/10">
      <div className="mx-auto max-w-5xl px-6 py-8 text-sm text-text-secondary">
        <p>© {new Date().getFullYear()} Hurt 2 Heal. All rights reserved.</p>
      </div>
    </footer>
  );
}
