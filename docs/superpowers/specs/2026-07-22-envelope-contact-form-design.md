# Envelope Contact Form — Design Spec

Date: 2026-07-22

## Summary

Replace the placeholder `/contact` page with a premium, animated contact
experience: a partially-open envelope with a sheet of paper (the form)
protruding from it. On successful submission, the paper slides back into
the envelope, the flap folds shut, the envelope "pops" and dissolves, and a
staggered, centered success message fades in. After 5 seconds, the success
message is replaced by a fresh, empty, closed envelope — ready for another
visitor to use without a page reload.

Submission is faked for this iteration (an async function that resolves
after a delay) so the full animation and UX can be built and reviewed
before a real delivery mechanism (e.g. an email API) is wired in.

## Scope

- New component tree replacing the current `/contact` page body.
- Desktop: full layered envelope choreography (paper slide, flap fold,
  pop, dissolve).
- Mobile: simplified "app-style" scale+fade screen transitions between
  states, prioritizing form readability over the envelope choreography.
  The envelope is still shown as static/simplified artwork behind the
  form on mobile, but its pieces do not animate independently.
- Full reset loop: idle → submitting → sealing → popping → done →
  (after 5s) reset back to a fresh idle envelope.
- Fake submission function, isolated so it can be swapped for a real
  network call later.

Out of scope: real email/backend delivery, CMS-driven copy for this
section (copy is hardcoded per the provided spec), a "send another
message immediately without waiting" affordance (the 5s success display
is fixed).

## File structure

- `src/app/contact/page.tsx` — updated to render the new experience.
  Keeps the existing breadcrumb; drops the current placeholder
  heading/intro paragraph, since the letter itself is now the page's
  primary content.
- `src/components/contact/envelope-letter-form.tsx` — client component
  owning the state machine, the paper/form markup, and the success
  message. This is the main piece of new code.
- `src/components/contact/envelope-svg.tsx` — the envelope illustration,
  exporting separable pieces (envelope body/back, envelope flap) as
  their own `motion`-wrapped SVG groups so Framer Motion can animate the
  flap independently from the body.
- `src/lib/contact.ts` — `submitContact(payload): Promise<void>`, a
  stand-in for a real request (`await new Promise(r => setTimeout(r,
  900))`). Isolated behind this one function so a future real API call
  is a one-line swap.

## Visual design

- Palette: warm neutrals (`--warm-*` tokens) for paper and envelope
  base, purple/magenta (`--purple-800`, `--magenta-*`) for accents,
  CTA button matching `--color-surface-cta`.
- Envelope: custom flat-line SVG, rounded edges, soft drop shadow
  (`filter: drop-shadow(...)`), drawn as separate `<g>`/`<path>` groups:
  back/body and flap. No external image assets.
- Paper: an HTML `<div>` (not SVG) so real form controls can live on
  it — warm off-white surface, `bg-grain` texture at low opacity
  (matching the existing `.bg-grain` utility), soft shadow, rounded top
  corners. Positioned so ~65–70% of its height protrudes above the
  envelope's front edge in the idle state.
- Idle animation: envelope+paper group floats with a slow `y: [0, -3,
  0]` loop (~4s, ease-in-out, repeating), disabled under
  `prefers-reduced-motion`.
- Typography: labels and headings use the existing Lora-based type
  ramp (`text-title-*`, `text-heading-*` utilities); form input values
  render in a standard readable font (not a script/handwritten face),
  per stakeholder decision.

## Form fields

All fields live directly on the paper (no separate card chrome),
styled with underline-only inputs consistent with
`newsletter-form.tsx`'s convention (`border-b`, transparent
background, `focus:border-text-brand`).

**Personal Information**
- First Name (text, required)
- Last Name (text, required)
- Email Address (email, required, format-validated)
- Phone Number (tel, required)

**Reason for Inquiry** — custom pill-style radio group
(`role="radiogroup"`, visually-hidden native radios + styled `<label>`
pills, wraps across lines):
Collaboration Inquiry, General Inquiry, Volunteer Opportunities,
Question about The Healing Lab, Registration Support, Guest Speaking.

**Preferred Contact Method** — pill radio group: Email, Phone / Text.

**How Did You Hear About Us?** — pill radio group: Social Media, Word
of Mouth, Event / Speaking.

**Submit** — pill-shaped CTA button matching site convention
(`bg-surface-cta`, `text-text-inverse`, hover scale), full-width on
mobile.

### Validation

Mirrors `newsletter-form.tsx`'s pattern: on submit, run validation
against a `FormData` snapshot. If any required field is missing/invalid:
- Do **not** start the animation sequence.
- Mark invalid fields (`aria-invalid`, red underline, inline
  `text-red-600` error message tied via `aria-describedby`).
- Move focus to the first invalid field.

If valid: proceed to the submit sequence below.

## State machine

States: `idle → submitting → sealing → popping → done → resetting → idle`

1. **idle** — envelope closed-ish (flap open, paper protruding), form
   interactive, idle float animation running.
2. **submitting** (on valid submit) — `<fieldset disabled>` on all
   inputs, call `submitContact()`.
3. **sealing** — paper slides down into the envelope over ~800ms
   (ease-in-out transform), clipped by the envelope's front edge via
   `overflow: hidden` on a wrapping container so the field values
   appear to be swallowed by the envelope rather than manually faded.
   Flap rotates closed with its own eased transition on a layered
   transform (rotateX/skew), not a simple opacity cross-fade.
4. **popping** — after the flap finishes closing, pause ~300ms, then
   the envelope group runs a short keyframed sequence: squash
   (`scaleY` down), overshoot scale up, small upward bounce
   (`y` overshoot), immediately followed by a fade+scale-out dissolve.
5. **done** — success message fades in with staggered per-line reveal
   (heading → body → signature), centered, replacing the envelope's
   space. `aria-live="polite"` region announces it for screen readers.
6. **resetting** (5s after entering `done`) — success message fades
   out; a brand-new envelope instance cross-fades/slides in already in
   the exact `idle` state (empty fields, flap open, paper protruding,
   idle float resumes). This is a full reset — no residual form values.

### Success message copy

> Once we receive your completed details, a member of our team will
> review your message and respond within 24 to 48 hours.
>
> Thank you for connecting with us, and we look forward to supporting
> you on your journey!
>
> Warm regards,
> The Hurt 2 Heal Team
> Hurt 2 Heal

## Mobile behavior (< md breakpoint)

Desktop's layered choreography (independent paper slide, flap fold,
squash/pop, dissolve) is replaced by a single, simpler transition
optimized for form readability on small screens:

- Envelope artwork is shown behind/around the form as static (or
  minimally simplified) art — its pieces do not animate independently.
- State transitions (idle-form → success, success → reset) use a
  uniform "app-style" scale+fade: the current view scales down
  slightly (~0.95) while fading out, then the next view scales up from
  ~0.95 to 1 while fading in. This applies at each state boundary
  (submit → success, success → reset) rather than the multi-step
  desktop sequence.
- Same state machine and timing (800ms transition, 300ms pause, 5s
  success display) — only the *how it looks* changes, not the *when*.

## Accessibility

- All radio pills: real `<input type="radio">` + associated
  `<label>`, full keyboard navigation, visible focus rings.
- Text inputs: proper `<label>`, `autoComplete` hints
  (given-name/family-name/email/tel), `aria-invalid` +
  `aria-describedby` on error.
- `aria-live="polite"` region announces validation failure summary and
  the success message.
- `prefers-reduced-motion`: idle float disabled; sealing/popping/reset
  transitions collapse to quick opacity swaps instead of
  slides/squash/bounce/scale — same state sequence, no motion-heavy
  keyframes.
- Disabled state during `submitting`/`sealing`/`popping` is reflected
  via `<fieldset disabled>` so assistive tech announces it.

## Testing approach

Manual verification (no test framework in this repo currently):
- Fill and submit valid data on desktop viewport — confirm full
  sequence (slide → fold → pop → dissolve → success → reset) runs
  smoothly with no abrupt cuts.
- Submit with missing/invalid fields — confirm animation does not
  start, invalid fields are flagged, focus moves correctly.
- Repeat on a mobile viewport — confirm scale+fade transitions and
  that the form remains fully usable/readable throughout.
- Toggle `prefers-reduced-motion` (OS or devtools emulation) — confirm
  reduced-motion path runs correctly.
- Keyboard-only pass: tab through every field and radio group, submit
  via keyboard, confirm focus handling on validation errors.
