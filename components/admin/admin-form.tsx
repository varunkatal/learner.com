"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  type FormEvent,
  type ReactNode,
} from "react";
import { Button } from "@/components/ui/button";
import type { FormState } from "@/lib/validators/catalog";

type AdminFormProps = {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  submitLabel: string;
  successText: string;
  resetOnSuccess?: boolean; // for "Add" forms, so the next item can be typed straight away
  children: ReactNode;
};

// A form that sends its fields to a Server Action and shows the result.
export function AdminForm({
  action,
  submitLabel,
  successText,
  resetOnSuccess = false,
  children,
}: AdminFormProps) {
  const [state, formAction, pending] = useActionState(action, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok && resetOnSuccess) formRef.current?.reset();
  }, [state, resetOnSuccess]);

  // Submitting this way (instead of <form action>) stops React clearing
  // what was typed when the server sends back an error.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      {children}
      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : submitLabel}
        </Button>
        <p aria-live="polite" className="font-semibold">
          {!pending && state?.ok && (
            <span className="text-success-ink">{successText}</span>
          )}
          {!pending && state && !state.ok && (
            <span className="text-error">{state.error}</span>
          )}
        </p>
      </div>
    </form>
  );
}
