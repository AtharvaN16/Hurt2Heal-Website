# Contact Form (White Card) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the placeholder `/contact` page with a white-card contact form, per `docs/superpowers/specs/2026-07-22-contact-form-card-design.md` (which supersedes the earlier envelope-illustration spec).

**Architecture:** A single client component (`ContactForm`) renders a static white card. Inside, `AnimatePresence` (`mode="wait"`) crossfades between the form and a `SuccessMessage`, driven by a 3-value `stage` state (`"idle" | "submitting" | "done"`). Five seconds after entering `"done"`, field state resets and `stage` flips back to `"idle"`, which lets `AnimatePresence` crossfade back to a fresh empty form automatically — no separate "resetting" state is needed to get that visual behavior. `PillRadioGroup` (already built) covers the three radio field groups; `submitContact` (already built) fakes the network call.

**Tech Stack:** Next.js App Router, React 19, Tailwind CSS v4 (existing design tokens), Framer Motion, TypeScript.

## Global Constraints

- No test framework exists in this repo. Verification for each task is `npx tsc --noEmit` (+ `npm run lint` where noted) plus a manual browser check via `npm run dev`.
- Follow existing design tokens only — no new hardcoded hex colors; use `var(--warm-0)`/other `var(--warm-*)`, `--color-*` semantic tokens, and existing `text-*` typography utility classes.
- The card surface must match `src/components/newsletter-form.tsx`'s panel styling convention (`bg-grain`, near-white surface, no border, soft padding, rounded corners) — read that file before writing the card markup.
- Match `newsletter-form.tsx`'s input conventions (`border-b`, `border-text-primary/30`, `focus:border-text-brand`) and error styling (`text-red-600`, `aria-describedby`).
- Reuse, do not reimplement: `submitContact`/`ContactPayload`/`ReasonValue`/`PreferredContact`/`HearAbout` from `src/lib/contact.ts`, and `PillRadioGroup`/`PillOption` from `src/components/contact/pill-radio-group.tsx`. Both already exist and are reviewed — import them.
- Transition easing curve `[0.25, 0.46, 0.45, 0.94]` (already used by `src/components/faq-accordion.tsx`) — reuse it for the form↔success crossfade for visual consistency with the rest of the site.
- Respect `prefers-reduced-motion` via Framer Motion's `useReducedMotion()` — collapse the crossfade's slide distance to 0 (opacity-only) when reduced motion is requested.
- No mobile-specific animation branch — the same crossfade runs at every viewport width; only the field grid's column count changes responsively (`sm:grid-cols-2` → single column below `sm`).
- Success message copy is fixed verbatim (see spec) — do not paraphrase it.
- Path alias `@/*` maps to `src/*`.

---

### Task 1: Remove the scrapped envelope files

**Files:**
- Delete: `src/components/contact/envelope-svg.tsx`
- Delete: `src/lib/use-media-query.ts`

**Interfaces:** None — this task only removes files nothing else in the current codebase imports (the component that would have used them, `envelope-letter-form.tsx`, was never created/committed).

- [ ] **Step 1: Confirm nothing imports these files**

Run: `grep -rln "envelope-svg\|use-media-query" src`
Expected: no output (no remaining references). If anything is found, stop and report — do not delete files something still imports.

- [ ] **Step 2: Delete the files**

```bash
git rm src/components/contact/envelope-svg.tsx src/lib/use-media-query.ts
```

- [ ] **Step 3: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git commit -m "chore(contact): remove scrapped envelope SVG and mobile-query hook

The contact form redesign replaced the envelope illustration with a
plain white card (see docs/superpowers/specs/2026-07-22-contact-form-card-design.md),
so these files are no longer needed."
```

---

### Task 2: Success message component

**Files:**
- Create: `src/components/contact/success-message.tsx`

**Interfaces:**
- Consumes: `motion` from `framer-motion`.
- Produces: `SuccessMessage()` component — renders the fixed copy with staggered per-line reveal inside an `aria-live="polite"` region. Used by Task 3.

- [ ] **Step 1: Write the file**

```tsx
// src/components/contact/success-message.tsx
"use client";

import { motion } from "framer-motion";

const LINE_VARIANTS = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export function SuccessMessage() {
  return (
    <motion.div
      role="status"
      aria-live="polite"
      className="mx-auto flex max-w-xl flex-col items-center gap-4 text-center"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
      }}
    >
      <motion.p
        variants={LINE_VARIANTS}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-title-sm text-text-brand"
      >
        Message sent
      </motion.p>
      <motion.p
        variants={LINE_VARIANTS}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-body-lg text-text-secondary"
      >
        Once we receive your completed details, a member of our team will
        review your message and respond within 24 to 48 hours.
      </motion.p>
      <motion.p
        variants={LINE_VARIANTS}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-body-lg text-text-secondary"
      >
        Thank you for connecting with us, and we look forward to supporting
        you on your journey!
      </motion.p>
      <motion.div
        variants={LINE_VARIANTS}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-body-md text-text-tertiary"
      >
        <p>Warm regards,</p>
        <p>The Hurt 2 Heal Team</p>
        <p className="mt-2 text-heading-xxs text-text-brand">Hurt 2 Heal</p>
      </motion.div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/contact/success-message.tsx
git commit -m "feat(contact): add staggered success message component"
```

---

### Task 3: `ContactForm` — card, fields, validation, submit/reset crossfade

**Files:**
- Create: `src/components/contact/contact-form.tsx`

**Interfaces:**
- Consumes: `submitContact`, `ContactPayload`, `ReasonValue`, `PreferredContact`, `HearAbout` from `@/lib/contact`; `PillOption`, `PillRadioGroup` from `./pill-radio-group`; `SuccessMessage` from `./success-message` (Task 2); `AnimatePresence`, `motion`, `useReducedMotion` from `framer-motion`.
- Produces: `ContactForm()` component — used by Task 4.

- [ ] **Step 1: Write the file**

```tsx
// src/components/contact/contact-form.tsx
"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import {
  submitContact,
  type ContactPayload,
  type ReasonValue,
  type PreferredContact,
  type HearAbout,
} from "@/lib/contact";
import { PillRadioGroup, type PillOption } from "./pill-radio-group";
import { SuccessMessage } from "./success-message";

type TextFieldName = "firstName" | "lastName" | "email" | "phone";
type Stage = "idle" | "submitting" | "done";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;
const SUCCESS_DISPLAY_MS = 5000;

const TEXT_FIELDS: {
  name: TextFieldName;
  label: string;
  type: string;
  autoComplete: string;
}[] = [
  { name: "firstName", label: "First Name", type: "text", autoComplete: "given-name" },
  { name: "lastName", label: "Last Name", type: "text", autoComplete: "family-name" },
  { name: "email", label: "Email Address", type: "email", autoComplete: "email" },
  { name: "phone", label: "Phone Number", type: "tel", autoComplete: "tel" },
];

const REASON_OPTIONS: PillOption<ReasonValue>[] = [
  { value: "collaboration", label: "Collaboration Inquiry" },
  { value: "general", label: "General Inquiry" },
  { value: "volunteer", label: "Volunteer Opportunities" },
  { value: "healing-lab", label: "Question about The Healing Lab" },
  { value: "registration", label: "Registration Support" },
  { value: "guest-speaking", label: "Guest Speaking" },
];

const PREFERRED_CONTACT_OPTIONS: PillOption<PreferredContact>[] = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone / Text" },
];

const HEAR_ABOUT_OPTIONS: PillOption<HearAbout>[] = [
  { value: "social", label: "Social Media" },
  { value: "word-of-mouth", label: "Word of Mouth" },
  { value: "event", label: "Event / Speaking" },
];

const EMPTY_TEXT_VALUES: Record<TextFieldName, string> = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldErrors = Partial<
  Record<TextFieldName | "reason" | "preferredContact" | "hearAbout", string>
>;

function validate(
  values: Record<TextFieldName, string>,
  reason: ReasonValue | null,
  preferredContact: PreferredContact | null,
  hearAbout: HearAbout | null
): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.firstName.trim()) errors.firstName = "First name is required.";
  if (!values.lastName.trim()) errors.lastName = "Last name is required.";
  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (!values.phone.trim()) errors.phone = "Phone number is required.";
  if (!reason) errors.reason = "Please select a reason for your inquiry.";
  if (!preferredContact)
    errors.preferredContact = "Please select a preferred contact method.";
  if (!hearAbout)
    errors.hearAbout = "Please let us know how you heard about us.";
  return errors;
}

export function ContactForm() {
  const [stage, setStage] = useState<Stage>("idle");
  const [values, setValues] = useState<Record<TextFieldName, string>>(EMPTY_TEXT_VALUES);
  const [reason, setReason] = useState<ReasonValue | null>(null);
  const [preferredContact, setPreferredContact] = useState<PreferredContact | null>(null);
  const [hearAbout, setHearAbout] = useState<HearAbout | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});

  const prefersReducedMotion = useReducedMotion();
  const fieldRefs = useRef<Partial<Record<keyof FieldErrors, HTMLElement | null>>>({});

  const isInteractive = stage === "idle";

  function handleTextChange(name: TextFieldName, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isInteractive) return;

    const nextErrors = validate(values, reason, preferredContact, hearAbout);
    setErrors(nextErrors);

    const order: (keyof FieldErrors)[] = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "reason",
      "preferredContact",
      "hearAbout",
    ];
    const firstInvalid = order.find((name) => nextErrors[name]);
    if (firstInvalid) {
      fieldRefs.current[firstInvalid]?.focus();
      return;
    }

    const payload: ContactPayload = {
      ...values,
      reason: reason as ReasonValue,
      preferredContact: preferredContact as PreferredContact,
      hearAbout: hearAbout as HearAbout,
    };
    setStage("submitting");
    await submitContact(payload);
    setStage("done");
  }

  // 5s after showing the success message, reset field state and go back
  // to "idle" — AnimatePresence's exit/enter cycle below handles the
  // visual crossfade back to a fresh empty form automatically.
  useEffect(() => {
    if (stage !== "done") return;
    const timeoutId = setTimeout(() => {
      setValues(EMPTY_TEXT_VALUES);
      setReason(null);
      setPreferredContact(null);
      setHearAbout(null);
      setErrors({});
      setStage("idle");
    }, SUCCESS_DISPLAY_MS);
    return () => clearTimeout(timeoutId);
  }, [stage]);

  const transitionDuration = prefersReducedMotion ? 0.15 : 0.4;
  const slideDistance = prefersReducedMotion ? 0 : 16;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="bg-grain relative overflow-hidden rounded-2xl bg-[var(--warm-0)] px-8 py-14 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.15)] md:px-14 md:py-18">
        <AnimatePresence mode="wait">
          {stage === "done" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: slideDistance }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -slideDistance }}
              transition={{ duration: transitionDuration, ease: EASE }}
            >
              <SuccessMessage />
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: slideDistance }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -slideDistance }}
              transition={{ duration: transitionDuration, ease: EASE }}
            >
              <form onSubmit={handleSubmit} noValidate>
                <fieldset disabled={!isInteractive} className="flex flex-col gap-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    {TEXT_FIELDS.map((field) => {
                      const error = errors[field.name];
                      return (
                        <label
                          key={field.name}
                          className="text-heading-xxs text-text-primary"
                        >
                          {field.label}
                          <span aria-hidden="true" className="text-red-600">
                            {" "}
                            *
                          </span>
                          <input
                            ref={(el) => {
                              fieldRefs.current[field.name] = el;
                            }}
                            type={field.type}
                            autoComplete={field.autoComplete}
                            required
                            value={values[field.name]}
                            onChange={(event) =>
                              handleTextChange(field.name, event.target.value)
                            }
                            aria-invalid={!!error}
                            aria-describedby={error ? `${field.name}-error` : undefined}
                            className={`mt-2 block w-full border-b bg-transparent pb-2 text-body-md text-text-primary outline-none ${
                              error
                                ? "border-red-600"
                                : "border-text-primary/30 focus:border-text-brand"
                            }`}
                          />
                          {error && (
                            <span
                              id={`${field.name}-error`}
                              className="mt-1 block text-body-xs font-normal text-red-600"
                            >
                              {error}
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>

                  <div
                    ref={(el) => {
                      fieldRefs.current.reason = el?.querySelector("input") ?? el;
                    }}
                  >
                    <PillRadioGroup
                      name="reason"
                      legend="Reason for Inquiry"
                      options={REASON_OPTIONS}
                      value={reason}
                      onChange={setReason}
                      required
                      error={errors.reason}
                    />
                  </div>

                  <div
                    ref={(el) => {
                      fieldRefs.current.preferredContact = el?.querySelector("input") ?? el;
                    }}
                  >
                    <PillRadioGroup
                      name="preferredContact"
                      legend="Preferred Contact Method"
                      options={PREFERRED_CONTACT_OPTIONS}
                      value={preferredContact}
                      onChange={setPreferredContact}
                      required
                      error={errors.preferredContact}
                    />
                  </div>

                  <div
                    ref={(el) => {
                      fieldRefs.current.hearAbout = el?.querySelector("input") ?? el;
                    }}
                  >
                    <PillRadioGroup
                      name="hearAbout"
                      legend="How Did You Hear About Us?"
                      options={HEAR_ABOUT_OPTIONS}
                      value={hearAbout}
                      onChange={setHearAbout}
                      required
                      error={errors.hearAbout}
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 self-start rounded-full bg-surface-cta px-6 py-3.5 text-body-lg font-bold text-text-inverse transition-transform duration-200 hover:scale-[1.02] disabled:opacity-60"
                  >
                    {stage === "idle" ? "Send Message" : "Sending…"}
                    <CaretRight size={18} weight="bold" />
                  </button>
                </fieldset>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 3: Manual verification**

Run: `npm run dev`. Temporarily render `<ContactForm />` inside `src/app/contact/page.tsx`'s `PageShell` (add the import and drop it after the existing breadcrumb) to check it, then **revert that temporary edit** — Task 4 does the real wiring. Open `http://localhost:3000/contact` and confirm:
- The card renders with `bg-grain` texture, no border, matching `newsletter-form.tsx`'s panel look.
- All fields are focusable/typeable; the three pill radio groups toggle by mouse and keyboard.
- Submitting with empty fields shows inline red errors on every missing field and moves focus to the first one; no stage transition occurs.
- Submitting with everything filled: the form fades out, then (after the fake ~900ms request) the same card cross-fades to the staggered success message.
- The success message stays 5 seconds, then fades out and a fresh empty form fades back into the same card.
- Enable "Reduce motion" (OS or devtools emulation) and repeat — confirm the same sequence with only opacity changes (no vertical slide).
- Narrow the viewport below 640px — confirm the text fields stack to a single column and the rest of the behavior is unchanged.

- [ ] **Step 4: Commit**

```bash
git add src/components/contact/contact-form.tsx
git commit -m "feat(contact): add ContactForm white-card component with submit/reset crossfade"
```

---

### Task 4: Integrate into the `/contact` page

**Files:**
- Modify: `src/app/contact/page.tsx`

**Interfaces:**
- Consumes: `ContactForm` from `@/components/contact/contact-form`.

- [ ] **Step 1: Replace the page body**

Replace the full contents of `src/app/contact/page.tsx` with:

```tsx
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { ContactForm } from "@/components/contact/contact-form";

export default function ContactPage() {
  return (
    <PageShell>
      <nav className="text-center text-body-md text-text-secondary mb-20 md:mb-40">
        <Link href="/" className="hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-text-primary font-semibold">Contact</span>
      </nav>
      <ContactForm />
    </PageShell>
  );
}
```

This drops the `getContactContent()`-driven placeholder heading/intro
paragraph, since the card form is now the page's primary content per the
approved design.

- [ ] **Step 2: Check whether `getContactContent` is still used elsewhere**

Run: `grep -rn "getContactContent" src`
Expected: no remaining references outside `src/lib/content.ts`'s definition. If there are none, leave the function itself in `src/lib/content.ts` alone (removing unrelated exports is out of scope) — just confirm the page no longer calls it.

- [ ] **Step 3: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 4: Full manual verification**

Run: `npm run dev`, open `http://localhost:3000/contact`:
- Confirm the breadcrumb ("Home / Contact") still renders above the card.
- Run through the full submit flow end-to-end (valid submit → form fades out → success crossfades in → 5s → resets to a fresh empty form).
- Tab through the entire form via keyboard only, including all three radio groups, and submit via keyboard (Enter on the button).
- Trigger validation errors and confirm focus moves to the first invalid field with a visible error message.
- Resize to a mobile viewport (< 640px) and repeat the submit flow — confirm layout stacks correctly and behavior is unchanged.
- Enable `prefers-reduced-motion: reduce` and repeat once more, confirming the reduced-motion path from Task 3.

- [ ] **Step 5: Commit**

```bash
git add src/app/contact/page.tsx
git commit -m "feat(contact): wire ContactForm into the contact page"
```

---

## Self-Review Notes

- **Spec coverage:** personal info fields, three radio groups, validation blocking the transition, disable-on-submit, form→success crossfade with the site's existing easing curve, staggered centered success message with exact copy, 5s-then-reset loop (via AnimatePresence's natural exit/enter cycle rather than an explicit fourth state), no mobile-specific animation branch, accessibility (labels, keyboard, aria-live, reduced-motion), removal of the unused envelope/mobile-hook files, page integration — all covered across Tasks 1–4.
- **Placeholder scan:** no TBD/TODO markers; every step has complete, runnable code.
- **Type consistency:** `Stage`, `TextFieldName`, `FieldErrors`, and the imported `ContactPayload`/`ReasonValue`/`PreferredContact`/`HearAbout`/`PillOption` types are used with identical names/shapes throughout Task 3 and Task 4.
- **Reuse check:** Tasks 1 (`src/lib/contact.ts`) and 3-from-the-superseded-plan (`src/components/contact/pill-radio-group.tsx`) are treated as already built and reviewed — this plan does not recreate them, only imports them.
