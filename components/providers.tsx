"use client";

import { SessionProvider } from "next-auth/react";

// Lets client components (like the header's account button) know who is signed in.
// Pages stay static: the browser asks /api/auth/session after the page loads.
export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
