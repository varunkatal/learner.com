import { Card } from "@/components/ui/card";

export default function AdminHomePage() {
  return (
    <>
      <h1 className="mt-2 text-3xl font-extrabold">Admin panel</h1>
      <p className="mt-2">
        Manage your course from here. More sections arrive step by step.
      </p>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {["Classes", "Subjects", "Chapters"].map((title) => (
          <Card key={title}>
            <h2 className="text-lg font-bold">{title}</h2>
            <p className="mt-2 text-muted">
              Add, edit, reorder and publish — coming next.
            </p>
          </Card>
        ))}
      </div>
    </>
  );
}
