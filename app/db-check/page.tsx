import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { withDB } from "@/lib/db";
import { ClassModel } from "@/models/Class";

// Phase 0 test: proves the site can read MongoDB while running on Cloudflare Workers.
// Delete this page once Phase 2 pages read from the database.

export const dynamic = "force-dynamic"; // read the database on every visit, not once at build time

export const metadata: Metadata = {
  title: "Database check",
  robots: { index: false },
};

export default async function DbCheckPage() {
  let message: string;
  let ok = false;
  try {
    const { first, total } = await withDB(async (db) => {
      const Class = db.model(ClassModel);
      return {
        first: await Class.findOne().sort({ order: 1 }).lean(),
        total: await Class.countDocuments(),
      };
    });
    ok = true;
    message = first
      ? `Connected. First class: ${first.name} (${total} classes in the database).`
      : "Connected, but the database is empty. Run npm run seed.";
  } catch (error) {
    console.error("db-check failed:", error);
    message = "Could not read the database. Check the server logs.";
  }

  return (
    <Container className="py-16">
      <h1 className="text-2xl font-bold">Database check</h1>
      <p
        className={
          ok ? "mt-4 font-semibold text-ink" : "mt-4 font-semibold text-error"
        }
      >
        {message}
      </p>
    </Container>
  );
}
