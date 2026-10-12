import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function AdminHomePage() {
  return (
    <>
      <h1 className="mt-2 text-3xl font-extrabold">Admin panel</h1>
      <p className="mt-2">
        Manage your course from here. More sections arrive step by step.
      </p>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <Link href="/admin/classes" className="group">
          <Card className="h-full group-hover:shadow-card-hover">
            <h2 className="text-lg font-bold group-hover:underline">
              Course structure
            </h2>
            <p className="mt-2 text-muted">
              Add, edit, reorder and publish classes, subjects and chapters.
            </p>
          </Card>
        </Link>
      </div>
    </>
  );
}
