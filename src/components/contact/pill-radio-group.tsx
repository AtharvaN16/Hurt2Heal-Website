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
