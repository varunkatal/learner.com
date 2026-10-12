"use client";

import { startTransition, useActionState, type FormEvent } from "react";
import { deleteItem } from "@/app/admin/actions";
import type { CatalogKind } from "@/lib/admin";

// Deletes an empty class, subject or chapter after asking to confirm.
export function DeleteButton({
  kind,
  id,
  label,
}: {
  kind: CatalogKind;
  id: string;
  label: string;
}) {
  const [state, formAction, pending] = useActionState(deleteItem, null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!window.confirm(`Delete "${label}"? This can't be undone.`)) return;
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={pending}
        className="h-11 rounded-full border border-error/40 px-5 font-bold text-error hover:bg-error/5 disabled:opacity-50"
      >
        {pending ? "Deleting…" : `Delete this ${kind}`}
      </button>
      {state && !state.ok && (
        <p role="alert" className="mt-2 font-semibold text-error">
          {state.error}
        </p>
      )}
    </form>
  );
}
