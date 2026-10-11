"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/button-link";

type NavItem = { label: string; href: string };

// The phone-width menu. It's the only interactive part of the header, so only it runs in the browser.
export function MobileMenu({ items }: { items: readonly NavItem[] }) {
  const [open, setOpen] = useState(false);

  // Close on Escape, like any well-behaved menu.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="flex size-11 items-center justify-center rounded-full text-ink hover:bg-lavender"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      {open && (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-16 border-b border-line bg-white shadow-card"
        >
          <nav aria-label="Mobile" className="flex flex-col gap-1 px-4 py-4">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className="rounded-xl px-4 py-3 text-lg font-semibold text-ink hover:bg-lavender"
              >
                {item.label}
              </Link>
            ))}
            <ButtonLink
              href="/classes"
              onClick={close}
              size="lg"
              className="mt-2"
            >
              Start learning
            </ButtonLink>
          </nav>
        </div>
      )}
    </div>
  );
}
