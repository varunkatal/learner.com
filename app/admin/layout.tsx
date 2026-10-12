import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin, signOut } from "@/lib/auth";
import { Logo } from "@/components/layout/logo";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false },
};

// Every page under /admin goes through this layout, so the admin check happens on the server here.
export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const user = await requireAdmin();

  return (
    <>
      <header className="border-b border-line bg-white">
        <Container className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="rounded-full bg-lavender px-3 py-1 text-sm font-bold text-ink">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="font-semibold text-ink hover:underline">
              View site
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="font-semibold text-ink hover:underline"
              >
                Sign out
              </button>
            </form>
          </div>
        </Container>
      </header>
      <main className="flex-1 bg-surface">
        <Container className="py-10">
          <p className="text-sm text-muted">Signed in as {user.email}</p>
          {children}
        </Container>
      </main>
    </>
  );
}
