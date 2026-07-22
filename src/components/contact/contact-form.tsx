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
const SUCCESS_DISPLAY_MS = 4000;

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

  // 4s after showing the success message, reset field state and go back to "idle"
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
    <div className="mx-auto w-full max-w-3xl">
      <div className="bg-grain relative overflow-hidden rounded-none border-none bg-white px-8 py-12 md:px-14 md:py-16 shadow-none min-h-[680px] md:min-h-[750px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {stage === "done" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: slideDistance }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -slideDistance }}
              transition={{ duration: transitionDuration, ease: EASE }}
              className="py-12 flex-1 flex flex-col items-center justify-center min-h-[550px] md:min-h-[620px]"
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
                <fieldset disabled={!isInteractive} className="flex flex-col gap-10 md:gap-12">
                  <div className="grid gap-8 sm:grid-cols-2">
                    {TEXT_FIELDS.map((field) => {
                      const error = errors[field.name];
                      return (
                        <label
                          key={field.name}
                          className="text-heading-xxs text-text-primary font-semibold"
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

                  {/* Divider Line & Bottom Right Send Message Button */}
                  <div className="pt-8 border-t border-black/10 flex justify-end">
                    <button
                      type="submit"
                      disabled={!isInteractive}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--purple-900)] px-8 py-3.5 text-body-md font-bold text-white transition-all duration-200 hover:bg-[var(--purple-800)] hover:scale-[1.02] shadow-xs disabled:opacity-60 cursor-pointer"
                    >
                      {stage === "idle" ? "Send Message" : "Sending…"}
                      <CaretRight size={18} weight="bold" />
                    </button>
                  </div>
                </fieldset>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
