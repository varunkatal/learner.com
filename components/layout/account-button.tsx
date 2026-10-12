"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

// Header button: "Sign in" when logged out, otherwise a round initial with a small menu.
export function AccountButton() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close the menu when tapping outside it or pressing Escape.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) =>
      ref.current?.contains(e.target as Node) || setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("click", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (status === "loading") {
    return <div className="size-11" aria-hidden="true" />;
  }

  if (!session) {
    return (
      <Button variant="secondary" onClick={() => signIn("google")}>
        Sign in
      </Button>
    );
  }

  const { name, email, role } = session.user;
  const initial = (name ?? email ?? "?").charAt(0).toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-label="Account menu"
        onClick={() => setOpen((v) => !v)}
        className="flex size-11 items-center justify-center rounded-full bg-ink text-lg font-bold text-white hover:bg-ink/90"
      >
        {initial}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-64 rounded-card border border-line bg-white p-2 shadow-card-hover">
          <div className="px-3 py-2">
            <p className="truncate font-bold text-ink">{name}</p>
            <p className="truncate text-sm text-muted">{email}</p>
          </div>
          {role === "admin" && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="block rounded-xl px-3 py-2 font-semibold text-ink hover:bg-lavender"
            >
              Admin panel
            </Link>
          )}
          <button
            type="button"
            onClick={() => signOut({ redirectTo: "/" })}
            className="block w-full rounded-xl px-3 py-2 text-left font-semibold text-ink hover:bg-lavender"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
