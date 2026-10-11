import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <Link
      href="/"
      className="flex items-center gap-2"
      aria-label={`${siteConfig.name} home`}
    >
      <svg viewBox="0 0 32 32" className="size-8" aria-hidden="true">
        <rect width="32" height="32" rx="9" fill="#FF2D68" />
        <path d="M13 9.5v13l9.5-6.5z" fill="#fff" />
      </svg>
      <span
        className={
          tone === "dark"
            ? "text-xl font-extrabold text-ink"
            : "text-xl font-extrabold text-white"
        }
      >
        {siteConfig.name}
      </span>
    </Link>
  );
}
