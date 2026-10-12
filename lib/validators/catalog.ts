import { z } from "zod";

// Checks for the admin forms that add and edit Classes, Subjects and Chapters.

// What an admin form action returns: null before the first submit.
export type FormState = { ok: true } | { ok: false; error: string } | null;

// MongoDB ids are 24 hex characters. Checked before querying so bad ids never reach the database.
export function isObjectId(value: string) {
  return /^[a-f0-9]{24}$/i.test(value);
}

const objectId = z.string().refine(isObjectId, "Invalid id.");

const text = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `Please enter a ${label}.`)
    .max(80, `Keep the ${label} under 80 characters.`);

// Blank means "make it from the name".
const slug = z
  .string()
  .trim()
  .toLowerCase()
  .max(80, "Keep the web address under 80 characters.")
  .regex(
    /^([a-z0-9]+(-[a-z0-9]+)*)?$/,
    "The web address can only use lowercase letters, numbers and dashes, e.g. class-9.",
  )
  .optional();

const position = (label: string) =>
  z.coerce
    .number({ error: `${label} must be a number.` })
    .int(`${label} must be a whole number.`)
    .min(1, `${label} must be 1 or more.`)
    .max(99, `${label} must be 99 or less.`);

// `id` is sent when editing; the parent id (classId / subjectId) when adding.
export const classInput = z.object({
  id: objectId.optional(),
  name: text("name"),
  slug,
});

export const subjectInput = z.object({
  id: objectId.optional(),
  classId: objectId.optional(),
  name: text("name"),
  slug,
  book: z.string().trim().max(80, "Keep the book name short.").optional(),
});

export const chapterInput = z.object({
  id: objectId.optional(),
  subjectId: objectId.optional(),
  title: text("title"),
  slug,
  part: position("Part"),
  number: position("Chapter number"),
});

const kind = z.enum(["class", "subject", "chapter"]);

export const moveInput = z.object({
  kind,
  id: objectId,
  direction: z.enum(["up", "down"]),
});

export const publishInput = z.object({
  kind,
  id: objectId,
  publish: z.enum(["true", "false"]).transform((value) => value === "true"),
});

export const deleteInput = z.object({ kind, id: objectId });
