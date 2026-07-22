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
