# Contact Form (White Card) — Design Spec

Date: 2026-07-22

> **Supersedes:** `2026-07-22-envelope-contact-form-design.md`. The
> envelope/paper illustration concept was scrapped after implementation
> began; this spec replaces it with a plain white-card form. Tasks 1 and 3
> from the original implementation plan (the fake submission lib and the
> `PillRadioGroup` component) are unaffected and carry over unchanged.
> Task 4 (envelope SVG) and Task 2 (`useMediaQuery`, which only existed to
> support the envelope's mobile treatment) are dropped — their files are
> removed.

## Summary

Replace the placeholder `/contact` page with a contact form presented on a
single white card — the same visual pattern already used by
`newsletter-form.tsx`'s panel (`bg-white`, `bg-grain` texture, no border,
soft padding, rounded corners). No envelope illustration, no SVG
choreography. On successful submission, the card's form contents fade out
and the same card cross-fades to a staggered, centered success message.
After 5 seconds, the success message fades out and a fresh, empty form
fades back into the same card. Submission is faked (unchanged from the
original spec) via `submitContact()` in `src/lib/contact.ts`.

## Scope

- One component, `ContactForm` (`src/components/contact/contact-form.tsx`),
  replacing the never-integrated `EnvelopeLetterForm`.
- Reuses `PillRadioGroup` (`src/components/contact/pill-radio-group.tsx`)
  and `submitContact`/`ContactPayload`/etc. (`src/lib/contact.ts`)
  unchanged.
- Removes `src/components/contact/envelope-svg.tsx` and
  `src/lib/use-media-query.ts` — no longer used by anything.
- Normal responsive layout only (fields stack to one column on small
  screens via CSS) — no separate mobile animation variant.
- Full reset loop: form → fade out → success (staggered) → 5s → fade out
  → fresh empty form fades in, all within the same card.

Out of scope (unchanged from the original spec): real email/backend
delivery, CMS-driven copy for this section.

## File structure

- `src/app/contact/page.tsx` — updated to render `ContactForm` (same
  integration point as before; breadcrumb stays).
- `src/components/contact/contact-form.tsx` — the whole component: field
  state, validation, submit stage machine, and the card markup. Renders
  `PillRadioGroup` for the three radio field groups and `SuccessMessage`
  (unchanged from the original plan) for the success state.
- `src/components/contact/success-message.tsx` — unchanged from the
  original plan (staggered success copy, `aria-live="polite"`).
- `src/lib/contact.ts` — unchanged (Task 1, already built).
- `src/components/contact/pill-radio-group.tsx` — unchanged (Task 3,
  already built).

Deleted: `src/components/contact/envelope-svg.tsx`,
`src/lib/use-media-query.ts`.

## Visual design

- Card: `bg-grain` texture, `bg-white` (or the repo's `var(--warm-0)`
  near-white token, matching `newsletter-form.tsx`'s exact surface),
  generous padding (`px-8 py-14 md:px-14 md:py-18`), soft shadow, rounded
  corners — no border, matching the newsletter panel's flat premium-card
  look.
- Typography: same as before — Lora-based `text-title-*`/`text-heading-*`
  labels, standard readable font for input values (not script/handwritten).
- No idle floating animation, no illustration — the card is static at
  rest.

## Form fields

Unchanged from the original spec:

**Personal Information:** First Name, Last Name, Email Address, Phone
Number (all required text/email/tel inputs, underline style matching
`newsletter-form.tsx`).

**Reason for Inquiry** (`PillRadioGroup`): Collaboration Inquiry, General
Inquiry, Volunteer Opportunities, Question about The Healing Lab,
Registration Support, Guest Speaking.

**Preferred Contact Method** (`PillRadioGroup`): Email, Phone / Text.

**How Did You Hear About Us?** (`PillRadioGroup`): Social Media, Word of
Mouth, Event / Speaking.

**Submit:** pill-shaped CTA button (`bg-surface-cta`), matching site
convention.

### Validation

Identical rule set and behavior to the original spec: block submission and
animation on any invalid/missing required field, mark invalid fields
(`aria-invalid`, red underline, `aria-describedby` error text), move focus
to the first invalid field.

## State machine

States: `idle → submitting → done → resetting → idle`

1. **idle** — form interactive.
2. **submitting** (on valid submit) — `<fieldset disabled>`, call
   `submitContact()`. Form contents fade+slide out (short transition,
   easing `[0.25, 0.46, 0.45, 0.94]` — matching the FAQ accordion's
   existing curve for visual consistency with the rest of the site).
3. **done** — once the fade-out finishes and the fake request resolves,
   the same card cross-fades to `<SuccessMessage />` (staggered per-line
   reveal, centered, `aria-live="polite"`).
4. **resetting** (5s after entering `done`) — success message fades out;
   the card cross-fades back to a freshly empty form (all fields reset,
   errors cleared) — a full loop back to `idle`.

No mobile-specific branch: the same transition and timing run at every
viewport width; only the field grid's column count changes responsively.

### Success message copy

Unchanged verbatim from the original spec:

> Once we receive your completed details, a member of our team will
> review your message and respond within 24 to 48 hours.
>
> Thank you for connecting with us, and we look forward to supporting
> you on your journey!
>
> Warm regards,
> The Hurt 2 Heal Team
> Hurt 2 Heal

## Accessibility

Unchanged from the original spec: real labeled inputs and radio
pills, keyboard navigation, `aria-invalid`/`aria-describedby` on error,
`aria-live="polite"` for success/validation announcements,
`prefers-reduced-motion` collapses all transitions to quick opacity swaps,
`<fieldset disabled>` during submission.

## Testing approach

Manual verification (no test framework in this repo):
- Fill and submit valid data — confirm the card's contents fade out, then
  the success message fades in with its staggered lines, stays 5s, fades
  out, and a fresh empty form fades back in.
- Submit with missing/invalid fields — confirm no stage transition
  starts, invalid fields are flagged, focus moves correctly.
- Resize to a narrow viewport — confirm fields stack to one column and
  the same transition behavior holds.
- Toggle `prefers-reduced-motion` — confirm the reduced-motion path.
- Keyboard-only pass through all fields, radio groups, and submit.
