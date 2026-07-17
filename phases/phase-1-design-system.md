# Phase 1 — Design system

Status: **In progress**

Approach: a consulting process, not a solo build. We talk through and decide
design questions together; Figma is edited directly (by hand and via AI
agents through the Figma MCP write access) as well as in code, and the two
stay in sync rather than one being a one-way source of truth for the other.

## Checklist

### Setup
- [x] Figma MCP connected (hosted plugin, `plugin:figma:figma`)
- [ ] Confirm Figma plan/seat has write access (Full or Dev seat, paid plan) if we want AI agents writing frames, not just reading
- [ ] Figma file created for Hurt 2 Heal design system

### Foundational decisions (consulting checkpoints — discuss before locking)
- [ ] Design workflow split: how much Figma-first vs. code-first vs. hybrid, per component type
- [ ] Color palette — trauma-informed, calm, accessible contrast (WCAG AA minimum given the audience)
- [ ] Typography — Google Font pairing (heading + body), type scale
- [ ] Spacing / sizing scale
- [ ] Motion principles for Framer Motion (restrained, no jarring transitions — reduced-motion respected)
- [ ] Icon usage guidelines (Phosphor, which weight — likely light/thin)

### Token generation
- [ ] Primary tokens generated in Figma (color, type, spacing, radius, shadow) — AI-agent-assisted via MCP write access
- [ ] Tokens mirrored into code (Tailwind config / CSS variables) via MCP read access
- [ ] Token source-of-truth process agreed (which side edits first when they diverge)

### Core components
- [ ] Buttons (primary/secondary, states)
- [ ] Navigation (site nav, footer)
- [ ] Cards (used on Programs/Resources)
- [ ] Form inputs (contact, registration flow)
- [ ] Section/layout primitives (matches `PageShell` in code)

### Validation
- [ ] Run `impeccable` skill's audit/critique pass once initial components exist
- [ ] Client review of the design system before Phase 2 build-out begins

## Decisions log

*(Record decisions here as we make them, with the "why" — this becomes the
reference when questions resurface later.)*
