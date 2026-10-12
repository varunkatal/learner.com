import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { siteConfig } from "@/config/site";
import { auth, signIn } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false },
};

// Only allow going back to a page on this site (stops links that bounce people elsewhere).
function safePath(value: string | string[] | undefined) {
  return typeof value === "string" &&
    value.startsWith("/") &&
    !value.startsWith("//")
    ? value
    : "/";
}

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const callbackUrl = safePath((await searchParams).callbackUrl);
  if (await auth()) redirect(callbackUrl);

  return (
    <Container className="flex justify-center py-16 sm:py-24">
      <Card className="w-full max-w-md text-center">
        <h1 className="text-2xl font-extrabold">
          Sign in to {siteConfig.name}
        </h1>
        <p className="mt-3">
          Use your Google (Gmail) account. There&apos;s no password to remember.
        </p>
        <form
          className="mt-8"
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: callbackUrl });
          }}
        >
          <Button type="submit" size="lg" className="w-full">
            Continue with Google
          </Button>
        </form>
      </Card>
    </Container>
  );
}
