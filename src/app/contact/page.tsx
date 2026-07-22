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

      <h1 className="text-title-md font-serif text-text-brand text-center mt-4 mb-10 md:mb-18">
        Get in Touch
      </h1>

      <ContactForm />
    </PageShell>
  );
}
