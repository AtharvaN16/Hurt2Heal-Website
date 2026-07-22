# Envelope Contact Form Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the placeholder `/contact` page with an animated envelope-and-letter contact form, per `docs/superpowers/specs/2026-07-22-envelope-contact-form-design.md`.

**Architecture:** A client component (`EnvelopeLetterForm`) owns a small stage state machine (`idle → sealing → popping → done → resetting → idle`) that drives Framer Motion animations across three pieces: a custom SVG envelope (body + flap, animated independently), an HTML "paper" div containing the real form fields, and a `SuccessMessage` component. A reusable `PillRadioGroup` component covers the three radio-button field groups. Submission is faked via an isolated `submitContact()` function in `src/lib/contact.ts` so it can be swapped for a real API call later without touching the component.

**Tech Stack:** Next.js App Router, React 19, Tailwind CSS v4 (existing design tokens), Framer Motion (already installed), TypeScript.

## Global Constraints

- No test framework exists in this repo. Verification for each task is `npx tsc --noEmit` (+ `npm run lint` where noted) plus a manual browser check via `npm run dev` — do not invent a test runner.
- Follow existing design tokens only (`src/styles/tokens/*.css`) — no new hardcoded hex colors; use `var(--warm-*)`, `var(--purple-*)`, `--color-*` semantic tokens, and the existing `text-*` typography utility classes.
- Match the existing form conventions in `src/components/newsletter-form.tsx` (underline inputs, `border-text-primary/30`, `focus:border-text-brand`, error styling with `text-red-600` + `aria-describedby`).
- All new client components require `"use client"`.
- Respect `prefers-reduced-motion` (via Framer Motion's `useReducedMotion()`) everywhere motion is used.
- Path alias `@/*` maps to `src/*` (see `tsconfig.json`).
- Success message copy is fixed verbatim (see spec) — do not paraphrase it.

---

### Task 1: Fake contact submission lib

**Files:**
- Create: `src/lib/contact.ts`

**Interfaces:**
- Produces: `ReasonValue`, `PreferredContact`, `HearAbout`, `ContactPayload` types; `submitContact(payload: ContactPayload): Promise<void>` — used by Task 6.

- [ ] **Step 1: Write the file**

```ts
// src/lib/contact.ts

export type ReasonValue =
  | "collaboration"
  | "general"
  | "volunteer"
  | "healing-lab"
  | "registration"
  | "guest-speaking";

export type PreferredContact = "email" | "phone";

export type HearAbout = "social" | "word-of-mouth" | "event";

export type ContactPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  reason: ReasonValue;
  preferredContact: PreferredContact;
  hearAbout: HearAbout;
};

/**
 * Stand-in for a real network call. Resolves after a short delay so the UI
 * can show a realistic pending duration. Swap the body for a real request
 * (e.g. `fetch("/api/contact", ...)`) when a backend exists — the signature
 * should not need to change.
 */
export async function submitContact(payload: ContactPayload): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 900));
  if (process.env.NODE_ENV !== "production") {
    console.info("[contact] fake submission received", payload);
  }
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/contact.ts
git commit -m "feat(contact): add contact payload types and fake submit function"
```

---

### Task 2: `useMediaQuery` hook

**Files:**
- Create: `src/lib/use-media-query.ts`

**Interfaces:**
- Produces: `useMediaQuery(query: string): boolean` — used by Task 8 to detect the mobile breakpoint.

- [ ] **Step 1: Write the file**

```ts
// src/lib/use-media-query.ts
"use client";

import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    setMatches(mediaQueryList.matches);

    function handleChange(event: MediaQueryListEvent) {
      setMatches(event.matches);
    }

    mediaQueryList.addEventListener("change", handleChange);
    return () => mediaQueryList.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/use-media-query.ts
git commit -m "feat(contact): add useMediaQuery hook"
```

---

### Task 3: `PillRadioGroup` reusable component

**Files:**
- Create: `src/components/contact/pill-radio-group.tsx`

**Interfaces:**
- Consumes: none (self-contained).
- Produces: `PillOption<T>` type and `PillRadioGroup<T extends string>` component with props `{ name, legend, options, value, onChange, required?, error? }` — used by Task 5 for the three radio field groups.

- [ ] **Step 1: Write the file**

```tsx
// src/components/contact/pill-radio-group.tsx
"use client";

export type PillOption<T extends string> = {
  value: T;
  label: string;
};

export function PillRadioGroup<T extends string>({
  name,
  legend,
  options,
  value,
  onChange,
  required = false,
  error,
}: {
  name: string;
  legend: string;
  options: PillOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  required?: boolean;
  error?: string;
}) {
  const errorId = error ? `${name}-error` : undefined;

  return (
    <fieldset>
      <legend className="text-heading-xxs text-text-primary">
        {legend}
        {required && (
          <span aria-hidden="true" className="text-red-600">
            {" "}
            *
          </span>
        )}
      </legend>
      <div
        role="radiogroup"
        aria-describedby={errorId}
        className="mt-2 flex flex-wrap gap-2"
      >
        {options.map((option) => {
          const id = `${name}-${option.value}`;
          const checked = value === option.value;
          return (
            <span key={option.value} className="contents">
              <input
                type="radio"
                id={id}
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
                className="peer sr-only"
              />
              <label
                htmlFor={id}
                className={`inline-flex cursor-pointer items-center rounded-full border px-4 py-2 text-body-sm transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-text-brand peer-focus-visible:ring-offset-2 ${
                  checked
                    ? "border-text-brand bg-text-brand text-text-inverse"
                    : "border-text-primary/30 text-text-primary hover:border-text-brand"
                }`}
              >
                {option.label}
              </label>
            </span>
          );
        })}
      </div>
      {error && (
        <span
          id={errorId}
          className="mt-1 block text-body-xs font-normal text-red-600"
        >
          {error}
        </span>
      )}
    </fieldset>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/contact/pill-radio-group.tsx
git commit -m "feat(contact): add reusable PillRadioGroup component"
```

---

### Task 4: Envelope SVG pieces

**Files:**
- Create: `src/components/contact/envelope-svg.tsx`

**Interfaces:**
- Consumes: `framer-motion` (`motion`).
- Produces: `ENVELOPE_WIDTH`, `ENVELOPE_HEIGHT`, `ENVELOPE_FLAP_HEIGHT` constants; `EnvelopeBody({ className? })`; `EnvelopeFlap({ pose: "open" | "closed", transitionDuration: number, className? })` — used by Task 5.

- [ ] **Step 1: Write the file**

```tsx
// src/components/contact/envelope-svg.tsx
"use client";

import { motion } from "framer-motion";

export const ENVELOPE_WIDTH = 400;
export const ENVELOPE_HEIGHT = 240;
export const ENVELOPE_FLAP_HEIGHT = 132;

export function EnvelopeBody({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${ENVELOPE_WIDTH} ${ENVELOPE_HEIGHT}`}
      className={className}
      aria-hidden="true"
    >
      <rect
        x="4"
        y="4"
        width={ENVELOPE_WIDTH - 8}
        height={ENVELOPE_HEIGHT - 8}
        rx="18"
        fill="var(--warm-100)"
        stroke="var(--purple-800)"
        strokeWidth="2"
      />
      <path
        d={`M 4 22 L ${ENVELOPE_WIDTH / 2} ${ENVELOPE_HEIGHT - 36} L ${
          ENVELOPE_WIDTH - 4
        } 22`}
        fill="none"
        stroke="var(--purple-800)"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

type FlapPose = "open" | "closed";

export function EnvelopeFlap({
  pose,
  transitionDuration,
  className,
}: {
  pose: FlapPose;
  transitionDuration: number;
  className?: string;
}) {
  return (
    <motion.svg
      viewBox={`0 0 ${ENVELOPE_WIDTH} ${ENVELOPE_FLAP_HEIGHT}`}
      className={className}
      style={{ transformOrigin: "50% 0%", transformStyle: "preserve-3d" }}
      initial={false}
      animate={{ rotateX: pose === "open" ? 165 : 0 }}
      transition={{ duration: transitionDuration, ease: [0.65, 0, 0.35, 1] }}
      aria-hidden="true"
    >
      <path
        d={`M 4 4 L ${ENVELOPE_WIDTH / 2} ${ENVELOPE_FLAP_HEIGHT - 12} L ${
          ENVELOPE_WIDTH - 4
        } 4 Z`}
        fill="var(--warm-200)"
        stroke="var(--purple-800)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/contact/envelope-svg.tsx
git commit -m "feat(contact): add envelope body and flap SVG pieces"
```

---

### Task 5: Static letter form (fields, validation, idle layout)

**Files:**
- Create: `src/components/contact/envelope-letter-form.tsx`

**Interfaces:**
- Consumes: `submitContact`, `ContactPayload`, `ReasonValue`, `PreferredContact`, `HearAbout` from `@/lib/contact` (Task 1); `PillOption`, `PillRadioGroup` from `./pill-radio-group` (Task 3); `EnvelopeBody`, `EnvelopeFlap`, `ENVELOPE_WIDTH`, `ENVELOPE_HEIGHT` from `./envelope-svg` (Task 4).
- Produces: `EnvelopeLetterForm()` component (default export target for Task 9's page integration — exported as a named export `EnvelopeLetterForm`). This task renders the envelope + paper + fields in a static (non-animated-sequence) form: submit runs validation and, if valid, calls `submitContact` and flips a simple `submitted` boolean. Task 6 replaces `submitted` with the full stage machine.

- [ ] **Step 1: Write the file**

```tsx
// src/components/contact/envelope-letter-form.tsx
"use client";

import { useRef, useState, type FormEvent } from "react";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import {
  submitContact,
  type ContactPayload,
  type ReasonValue,
  type PreferredContact,
  type HearAbout,
} from "@/lib/contact";
import { PillRadioGroup, type PillOption } from "./pill-radio-group";
import { EnvelopeBody, EnvelopeFlap, ENVELOPE_WIDTH, ENVELOPE_HEIGHT } from "./envelope-svg";

type TextFieldName = "firstName" | "lastName" | "email" | "phone";

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

export function EnvelopeLetterForm() {
  const [values, setValues] = useState<Record<TextFieldName, string>>(EMPTY_TEXT_VALUES);
  const [reason, setReason] = useState<ReasonValue | null>(null);
  const [preferredContact, setPreferredContact] = useState<PreferredContact | null>(null);
  const [hearAbout, setHearAbout] = useState<HearAbout | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const fieldRefs = useRef<Partial<Record<keyof FieldErrors, HTMLElement | null>>>({});

  function handleTextChange(name: TextFieldName, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
    void submitContact(payload);
    setSubmitted(true);
  }

  if (submitted) {
    return <p className="text-center text-title-sm text-text-brand">Sent.</p>;
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div
        className="relative mx-auto"
        style={{
          width: "100%",
          maxWidth: ENVELOPE_WIDTH,
          aspectRatio: `${ENVELOPE_WIDTH} / ${ENVELOPE_HEIGHT}`,
        }}
      >
        <EnvelopeBody className="absolute inset-0 h-full w-full" />

        <div
          className="absolute left-1/2 top-0 w-[88%] -translate-x-1/2 overflow-hidden"
          style={{ height: "78%" }}
        >
          <div className="bg-grain relative rounded-t-lg bg-[var(--warm-0)] px-6 py-8 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.25)] md:px-10 md:py-10">
            <form onSubmit={handleSubmit} noValidate>
              <fieldset disabled={submitted} className="flex flex-col gap-6">
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
                  Send Message
                  <CaretRight size={18} weight="bold" />
                </button>
              </fieldset>
            </form>
          </div>
        </div>

        <EnvelopeFlap
          pose="open"
          transitionDuration={0}
          className="absolute inset-x-0 top-0 w-full"
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 3: Manual verification**

Run: `npm run dev`, open `http://localhost:3000/contact` (page not wired yet — temporarily render `<EnvelopeLetterForm />` inside `src/app/contact/page.tsx`'s `PageShell` to check it, then revert; Task 9 does the real wiring). Confirm:
- Envelope illustration renders with paper visibly protruding from the top and the flap open above it.
- All fields are focusable and typeable; the four pill radio groups toggle selection with a mouse click and with keyboard (Tab + Space/Arrow keys).
- Submitting with empty fields shows inline red errors on every missing field and moves focus to the first one; no crash.
- Submitting with all fields filled logs a `[contact] fake submission received` line in the browser console after ~900ms and replaces the envelope with the "Sent." placeholder text.

- [ ] **Step 4: Commit**

```bash
git add src/components/contact/envelope-letter-form.tsx
git commit -m "feat(contact): add static envelope letter form with validation"
```

---

### Task 6: Submit state machine + desktop choreography

**Files:**
- Modify: `src/components/contact/envelope-letter-form.tsx` (replace entire file contents)

**Interfaces:**
- Consumes: same as Task 5, plus `motion`, `useReducedMotion` from `framer-motion`.
- Produces: same `EnvelopeLetterForm` export; internal `Stage` type (`"idle" | "sealing" | "popping" | "done" | "resetting"`) — Task 7 and Task 8 build on this.

- [ ] **Step 1: Replace the file with the state-machine version**

```tsx
// src/components/contact/envelope-letter-form.tsx
"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import {
  submitContact,
  type ContactPayload,
  type ReasonValue,
  type PreferredContact,
  type HearAbout,
} from "@/lib/contact";
import { PillRadioGroup, type PillOption } from "./pill-radio-group";
import { EnvelopeBody, EnvelopeFlap, ENVELOPE_WIDTH, ENVELOPE_HEIGHT } from "./envelope-svg";

type TextFieldName = "firstName" | "lastName" | "email" | "phone";
type Stage = "idle" | "sealing" | "popping" | "done" | "resetting";

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

// Animation timing (ms), per the design spec.
const SEAL_PAPER_MS = 800;
const SEAL_FLAP_MS = 500;
const SEAL_PAUSE_MS = 300;
const POP_MS = 600;
const SUCCESS_DISPLAY_MS = 5000;
const RESET_FADE_MS = 500;
const REDUCED_MOTION_MS = 150;

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

export function EnvelopeLetterForm() {
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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
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
    void submitContact(payload);
    setStage("sealing");
  }

  // Drives the stage machine forward on a timer per stage. This effect owns
  // all timing so the animations below only need to react to `stage`.
  useEffect(() => {
    if (stage === "idle" || stage === "done") return;

    const sealMs = prefersReducedMotion
      ? REDUCED_MOTION_MS
      : SEAL_PAPER_MS + SEAL_FLAP_MS + SEAL_PAUSE_MS;
    const popMs = prefersReducedMotion ? REDUCED_MOTION_MS : POP_MS;
    const resetMs = prefersReducedMotion ? REDUCED_MOTION_MS : RESET_FADE_MS;

    let timeoutId: ReturnType<typeof setTimeout>;
    if (stage === "sealing") {
      timeoutId = setTimeout(() => setStage("popping"), sealMs);
    } else if (stage === "popping") {
      timeoutId = setTimeout(() => setStage("done"), popMs);
    } else if (stage === "resetting") {
      timeoutId = setTimeout(() => {
        setValues(EMPTY_TEXT_VALUES);
        setReason(null);
        setPreferredContact(null);
        setHearAbout(null);
        setErrors({});
        setStage("idle");
      }, resetMs);
    }
    return () => clearTimeout(timeoutId);
  }, [stage, prefersReducedMotion]);

  // "done" holds for SUCCESS_DISPLAY_MS, then moves to "resetting".
  useEffect(() => {
    if (stage !== "done") return;
    const timeoutId = setTimeout(() => setStage("resetting"), SUCCESS_DISPLAY_MS);
    return () => clearTimeout(timeoutId);
  }, [stage]);

  const showEnvelope = stage !== "done";
  const showForm = stage === "idle" || stage === "sealing";
  const flapPose = stage === "idle" ? "open" : "closed";
  const flapTransitionDuration = prefersReducedMotion
    ? REDUCED_MOTION_MS / 1000
    : SEAL_FLAP_MS / 1000;

  const envelopeAnimate =
    stage === "popping"
      ? prefersReducedMotion
        ? { opacity: 0, transition: { duration: REDUCED_MOTION_MS / 1000 } }
        : {
            scale: [1, 0.9, 1.15, 1, 0],
            y: [0, 6, -14, 0, 0],
            opacity: [1, 1, 1, 1, 0],
            transition: {
              duration: POP_MS / 1000,
              times: [0, 0.25, 0.55, 0.75, 1],
              ease: "easeInOut" as const,
            },
          }
      : stage === "idle" && !prefersReducedMotion
      ? { y: [0, -3, 0], transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const } }
      : { y: 0, opacity: 1 };

  const paperAnimate =
    stage === "sealing"
      ? {
          y: "70%",
          transition: {
            duration: prefersReducedMotion ? REDUCED_MOTION_MS / 1000 : SEAL_PAPER_MS / 1000,
            ease: [0.4, 0, 0.2, 1] as const,
          },
        }
      : { y: 0 };

  return (
    <div className="mx-auto w-full max-w-2xl">
      {showEnvelope && (
        <motion.div
          className="relative mx-auto"
          style={{
            width: "100%",
            maxWidth: ENVELOPE_WIDTH,
            aspectRatio: `${ENVELOPE_WIDTH} / ${ENVELOPE_HEIGHT}`,
          }}
          animate={envelopeAnimate}
        >
          <EnvelopeBody className="absolute inset-0 h-full w-full" />

          {showForm && (
            <div
              className="absolute left-1/2 top-0 w-[88%] -translate-x-1/2 overflow-hidden"
              style={{ height: "78%" }}
            >
              <motion.div
                className="bg-grain relative rounded-t-lg bg-[var(--warm-0)] px-6 py-8 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.25)] md:px-10 md:py-10"
                animate={paperAnimate}
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
            </div>
          )}

          <EnvelopeFlap
            pose={flapPose}
            transitionDuration={flapTransitionDuration}
            className="absolute inset-x-0 top-0 w-full"
          />
        </motion.div>
      )}

      {stage === "done" && (
        <p className="text-center text-title-sm text-text-brand">Sent.</p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 3: Manual verification**

Run: `npm run dev`, temporarily render `<EnvelopeLetterForm />` on `/contact` again. Fill in all fields validly and click "Send Message". Confirm:
- Button label changes to "Sending…" and all fields become disabled immediately.
- The paper visibly slides down and appears to tuck into the envelope over well under a second.
- The flap animates from open to closed shortly after.
- After a short pause, the envelope squashes, pops up, and fades away, replaced by "Sent." text.
- Enable "Reduce motion" in OS/browser devtools, repeat — confirm the same sequence occurs but with near-instant opacity swaps instead of slides/squash/bounce.

- [ ] **Step 4: Commit**

```bash
git add src/components/contact/envelope-letter-form.tsx
git commit -m "feat(contact): add submit state machine and desktop seal/pop choreography"
```

---

### Task 7: Success message + auto-reset loop

**Files:**
- Create: `src/components/contact/success-message.tsx`
- Modify: `src/components/contact/envelope-letter-form.tsx`

**Interfaces:**
- Consumes (in `success-message.tsx`): `motion` from `framer-motion`.
- Produces: `SuccessMessage()` component — renders the fixed copy with staggered per-line reveal, wrapped in an `aria-live="polite"` region.
- `envelope-letter-form.tsx` swaps its placeholder `"Sent."` paragraph for `<SuccessMessage />`, and crossfades between the envelope and the success message using `AnimatePresence`.

- [ ] **Step 1: Create the success message component**

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

- [ ] **Step 3: Wire it into `envelope-letter-form.tsx`**

In `src/components/contact/envelope-letter-form.tsx`:

1. Add the import:

```tsx
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SuccessMessage } from "./success-message";
```

(replacing the existing `import { motion, useReducedMotion } from "framer-motion";` line with the `AnimatePresence` version above).

2. Replace the final return block:

```tsx
  return (
    <p className="text-center text-title-sm text-text-brand">Sent.</p>
  );
```
(the `stage === "done"` conditional at the bottom, together with the `showEnvelope` conditional above it) with:

```tsx
  return (
    <div className="mx-auto w-full max-w-2xl">
      <AnimatePresence mode="sync">
        {showEnvelope ? (
          <motion.div
            key="envelope"
            className="relative mx-auto"
            style={{
              width: "100%",
              maxWidth: ENVELOPE_WIDTH,
              aspectRatio: `${ENVELOPE_WIDTH} / ${ENVELOPE_HEIGHT}`,
            }}
            animate={envelopeAnimate}
            exit={{ opacity: 0, transition: { duration: prefersReducedMotion ? REDUCED_MOTION_MS / 1000 : 0.3 } }}
          >
            <EnvelopeBody className="absolute inset-0 h-full w-full" />

            {showForm && (
              <div
                className="absolute left-1/2 top-0 w-[88%] -translate-x-1/2 overflow-hidden"
                style={{ height: "78%" }}
              >
                <motion.div
                  className="bg-grain relative rounded-t-lg bg-[var(--warm-0)] px-6 py-8 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.25)] md:px-10 md:py-10"
                  animate={paperAnimate}
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
              </div>
            )}

            <EnvelopeFlap
              pose={flapPose}
              transitionDuration={flapTransitionDuration}
              className="absolute inset-x-0 top-0 w-full"
            />
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: prefersReducedMotion ? REDUCED_MOTION_MS / 1000 : 0.3 } }}
          >
            <SuccessMessage />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
```

3. Remove the now-duplicated outer `<div className="mx-auto w-full max-w-2xl">...</div>` wrapper and the old `{showEnvelope && (...)}` / `{stage === "done" && (...)}` blocks that preceded this replacement — the new return block above is the entire function body's `return` statement, replacing everything from `return (` to the final `);` of the component.

- [ ] **Step 4: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 5: Manual verification**

Run: `npm run dev`, render `<EnvelopeLetterForm />` on `/contact`. Submit a valid form and confirm:
- After the pop/dissolve, the four lines of the success message fade in one after another (heading, two body lines, signature block), centered.
- The success message stays visible for 5 seconds.
- After 5 seconds, it fades out and a brand-new, empty, idle envelope fades back in (flap open, paper protruding, idle float resumes, all fields empty).
- Submitting again from this fresh envelope works identically.

- [ ] **Step 6: Commit**

```bash
git add src/components/contact/success-message.tsx src/components/contact/envelope-letter-form.tsx
git commit -m "feat(contact): add staggered success message and auto-reset loop"
```

---

### Task 8: Mobile simplified transition

**Files:**
- Modify: `src/components/contact/envelope-letter-form.tsx`

**Interfaces:**
- Consumes: `useMediaQuery` from `@/lib/use-media-query` (Task 2).
- Produces: same `EnvelopeLetterForm` export, now branching its paper/envelope animation on `isMobile`.

- [ ] **Step 1: Add the mobile branch**

In `src/components/contact/envelope-letter-form.tsx`:

1. Add the import:

```tsx
import { useMediaQuery } from "@/lib/use-media-query";
```

2. Inside `EnvelopeLetterForm`, add the hook call next to `prefersReducedMotion`:

```tsx
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 767px)");
```

3. Replace the `paperAnimate` and `envelopeAnimate` computations with mobile-aware versions:

```tsx
  const envelopeAnimate = isMobile
    ? stage === "popping"
      ? {
          opacity: 0,
          scale: prefersReducedMotion ? 1 : 0.95,
          transition: { duration: prefersReducedMotion ? REDUCED_MOTION_MS / 1000 : 0.5 },
        }
      : { opacity: 1, scale: 1 }
    : stage === "popping"
    ? prefersReducedMotion
      ? { opacity: 0, transition: { duration: REDUCED_MOTION_MS / 1000 } }
      : {
          scale: [1, 0.9, 1.15, 1, 0],
          y: [0, 6, -14, 0, 0],
          opacity: [1, 1, 1, 1, 0],
          transition: {
            duration: POP_MS / 1000,
            times: [0, 0.25, 0.55, 0.75, 1],
            ease: "easeInOut" as const,
          },
        }
    : stage === "idle" && !prefersReducedMotion
    ? { y: [0, -3, 0], transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const } }
    : { y: 0, opacity: 1 };

  const paperAnimate =
    !isMobile && stage === "sealing"
      ? {
          y: "70%",
          transition: {
            duration: prefersReducedMotion ? REDUCED_MOTION_MS / 1000 : SEAL_PAPER_MS / 1000,
            ease: [0.4, 0, 0.2, 1] as const,
          },
        }
      : { y: 0 };
```

4. On mobile, the flap should not fold independently (it stays in its `"open"` pose throughout, since the envelope-level `envelopeAnimate` scale+fade already carries the transition). Update the `flapPose` line to:

```tsx
  const flapPose = isMobile ? "open" : stage === "idle" ? "open" : "closed";
```

5. On mobile, the paper should remain visible (not slide/clip) until the envelope group itself fades — update `showForm` to:

```tsx
  const showForm = isMobile
    ? stage === "idle" || stage === "sealing" || stage === "popping"
    : stage === "idle" || stage === "sealing";
```

- [ ] **Step 2: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 3: Manual verification**

Run: `npm run dev`, open devtools responsive mode at a 390px-wide viewport, render `<EnvelopeLetterForm />` on `/contact`. Submit a valid form and confirm:
- No paper-slide or flap-fold motion occurs — instead the whole envelope+form card scales down slightly and fades out as one unit.
- The success message then scales/fades in.
- After 5 seconds, the success message fades out and a fresh envelope scales/fades back in, ready to use.
- Widen the viewport back past 768px and confirm the full desktop choreography (paper slide, flap fold, pop) still runs as in Task 7's verification.

- [ ] **Step 4: Commit**

```bash
git add src/components/contact/envelope-letter-form.tsx
git commit -m "feat(contact): add simplified mobile scale-fade transition"
```

---

### Task 9: Integrate into the `/contact` page

**Files:**
- Modify: `src/app/contact/page.tsx`

**Interfaces:**
- Consumes: `EnvelopeLetterForm` from `@/components/contact/envelope-letter-form`.

- [ ] **Step 1: Replace the page body**

Replace the full contents of `src/app/contact/page.tsx` with:

```tsx
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { EnvelopeLetterForm } from "@/components/contact/envelope-letter-form";

export default function ContactPage() {
  return (
    <PageShell>
      <nav className="text-center text-body-md text-text-secondary mb-20 md:mb-40">
        <Link href="/" className="hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-text-primary font-semibold">Contact</span>
      </nav>
      <EnvelopeLetterForm />
    </PageShell>
  );
}
```

This drops the `getContactContent()`-driven placeholder heading/intro paragraph, since the envelope experience is now the page's primary content per the approved design.

- [ ] **Step 2: Check whether `getContactContent` is still used elsewhere**

Run: `grep -rn "getContactContent" src`
Expected: no remaining references outside `src/lib/content.ts`'s definition. If there are none, leave the function itself in `src/lib/content.ts` alone (removing unrelated exports is out of scope for this task) — just confirm the page no longer calls it.

- [ ] **Step 3: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 4: Full manual verification**

Run: `npm run dev`, open `http://localhost:3000/contact` at a desktop viewport width:
- Confirm the breadcrumb ("Home / Contact") still renders above the envelope.
- Run through the full submit flow end-to-end (valid submit → seal → pop → success → 5s → reset).
- Tab through the entire form via keyboard only, including all three radio groups, and submit via keyboard (Enter on the button).
- Trigger validation errors and confirm focus moves to the first invalid field with a visible error message.

Then resize to a mobile viewport (< 768px) and repeat the submit flow, confirming the simplified scale-fade transition from Task 8.

Then enable "prefers-reduced-motion: reduce" and repeat once more on desktop width, confirming the reduced-motion path from Task 6.

- [ ] **Step 5: Commit**

```bash
git add src/app/contact/page.tsx
git commit -m "feat(contact): wire envelope letter form into the contact page"
```

---

## Self-Review Notes

- **Spec coverage:** personal info fields (Task 5), reason/contact-method/hear-about radio groups (Task 5), envelope+paper visual design (Task 4/5), idle float (Task 6), validation blocking the animation (Task 5/6), disable-on-submit (Task 6), paper slide ~800ms (Task 6), flap fold (Task 6), pause + pop + dissolve (Task 6), staggered centered success message with exact copy (Task 7), 5s-then-reset loop (Task 7), mobile scale-fade transition (Task 8), accessibility/keyboard/aria-live/reduced-motion (Tasks 5–8), page integration (Task 9) — all covered.
- **Placeholder scan:** no TBD/TODO markers; every step has complete, runnable code.
- **Type consistency:** `Stage`, `TextFieldName`, `FieldErrors`, `ContactPayload`, `ReasonValue`, `PreferredContact`, `HearAbout` are defined once (Tasks 1 and 6) and reused with identical names/shapes through Task 9.
