"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
        setEmail("");
        setTimeout(() => setSent(false), 4000);
      }}
      className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
    >
      <input
        type="email"
        required
        maxLength={120}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Tu email"
        aria-label="Tu email"
        className="flex-1 px-5 py-4 border border-eliz-border bg-eliz-card text-sm outline-none focus:border-eliz-accent transition-colors"
      />
      <button
        type="submit"
        className="px-8 py-4 bg-eliz-accent text-white text-xs font-semibold tracking-[0.12em] uppercase transition-colors hover:bg-eliz-accent-hover cursor-pointer"
      >
        {sent ? "¡Gracias!" : "Suscribirme"}
      </button>
    </form>
  );
}
