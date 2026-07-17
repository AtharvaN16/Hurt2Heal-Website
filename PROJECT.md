# Hurt 2 Heal — Project Vision

Hurt 2 Heal is a peer-led digital sanctuary for trauma-informed education,
support, and community healing for survivors of sexual assault and domestic
violence. The website is the "digital front door" to that work: it needs to
feel emotionally safe before it needs to feel impressive — calm, clear,
low-anxiety navigation, no dark patterns, no pressure.

Content authority is the client's rough planning doc (paraphrased into
`src/lib/content.ts` for now); page copy and structure are **not final** and
will keep evolving as the client refines it.

## Stack decisions made so far

- **Framework:** Next.js (App Router, TypeScript, Tailwind), deployed on
  Vercel, hosted on the client's existing domain (DNS repointed, no transfer).
- **Package manager / runtime:** Bun (`bun install`, `bun dev`, `bun run build`).
- **Motion:** Framer Motion, for restrained, non-jarring interaction (nothing
  that reads as "flashy" — this is a trauma-informed site).
- **Content:** currently hardcoded via `src/lib/content.ts`. A real CMS
  (Sanity, evaluated against Payload) is deliberately deferred — the data
  layer is shaped so swapping it in later only touches that one file, not
  pages or components.
- **Skills/tooling:** `.claude/skills/` (and mirrored `.agents/skills/`) vendor
  in mattpocock's engineering/productivity skills and the `impeccable` design
  skill, plus the `superpowers` plugin, to keep implementation disciplined and
  visual output non-generic. See `.claude/skills/README.md`.
- **Branching:** `dev` for active work, `main` as the deploy branch Vercel
  tracks for production.

## Rough phases

1. **Foundations (current)** — repo, branching, skills tooling, Next.js
   scaffold with placeholder routes/content pulled from the client's doc.
2. **Design system** — build the visual language in Figma (palette, type
   scale, spacing, components), informed by the trauma-informed tone above.
   Pull specs into code via the Figma MCP server rather than eyeballing.
3. **Real build-out** — implement the design system as components, wire real
   (client-approved) copy into every page, replace placeholder content.
4. **CMS decision + integration** — once page/content shape has stabilized,
   revisit Sanity vs. Payload vs. staying static, and wire it into
   `src/lib/content.ts` without touching pages.
5. **Polish & accessibility pass** — run the `impeccable` skill's audit/polish
   commands; verify contrast, motion-reduction (`prefers-reduced-motion`),
   screen-reader flows — accessibility matters more than usual here given the
   audience.
6. **Domain + launch** — connect Vercel to the client's domain, point `main`
   at production, confirm DNS, go live.
7. **Handoff** — make sure the client can edit content without touching code
   (via whatever CMS lands in phase 4), document the editing workflow for her.

This file is a living rough sketch, not a locked plan — update it as
decisions firm up (especially the CMS choice and design system outcomes).
