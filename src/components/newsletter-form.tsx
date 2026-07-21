"use client";

import { useState, type FormEvent } from "react";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";

type FieldName = "firstName" | "lastName" | "email";

const FIELDS: {
  name: FieldName;
  label: string;
  type: string;
  autoComplete: string;
}[] = [
  { name: "firstName", label: "First Name", type: "text", autoComplete: "given-name" },
  { name: "lastName", label: "Last Name", type: "text", autoComplete: "family-name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(formData: FormData) {
  const errors: Partial<Record<FieldName, string>> = {};
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  if (!firstName) errors.firstName = "First name is required.";
  if (!lastName) errors.lastName = "Last name is required.";
  if (!email) {
    errors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address.";
  }
  return errors;
}

export function NewsletterForm() {
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors(validate(new FormData(event.currentTarget)));
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="grid gap-10 md:grid-cols-[1fr_2.2fr] md:gap-12 lg:gap-16 items-start"
    >
      <div>
        <h2 className="text-title-sm text-text-brand">Keep in touch</h2>
        <p className="text-subheading-sm text-text-secondary mt-4 max-w-sm">
          Subscribe to our newsletter to stay up to date with our latest
          news and events.
        </p>
      </div>

      {/* Merged frame containing input fields and submit button */}
      <div className="bg-grain relative flex min-h-[380px] flex-col justify-center rounded-none bg-white px-8 py-14 md:min-h-[440px] md:px-14 md:py-18 lg:py-20">
        <div className="grid gap-8 sm:grid-cols-[1fr_220px] md:gap-10 lg:gap-14 items-stretch">
          <div className="flex flex-col gap-6">
            {FIELDS.map((field) => {
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
                    type={field.type}
                    name={field.name}
                    autoComplete={field.autoComplete}
                    required
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

          <div className="flex flex-col justify-between gap-6 max-w-[220px]">
            <p className="text-body-md text-text-tertiary italic">
              We respect your privacy and will never share your information.
              You can unsubscribe anytime.
            </p>
            <button
              type="submit"
              className="flex w-full items-center justify-between rounded-full bg-surface-cta px-6 py-3.5 text-body-lg font-bold text-text-inverse transition-transform duration-200 hover:scale-[1.02]"
            >
              Submit
              <CaretRight size={18} weight="bold" />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
