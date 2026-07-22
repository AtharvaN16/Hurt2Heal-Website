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
