import { contentTypes, type ContentType } from "@/config/content";
import { Field } from "./field";

const inputStyle =
  "mt-1.5 w-full rounded-xl border border-line bg-white px-3 text-base text-ink focus:border-brand-ink";

// The fields for one video or file, shared by the "Add content" and "Edit" forms.
export function ItemFields({
  defaults,
}: {
  defaults?: {
    type: ContentType;
    title: string;
    link: string;
    description?: string | null;
  };
}) {
  return (
    <>
      <label className="block">
        <span className="font-semibold text-ink">Type</span>
        <select
          name="type"
          defaultValue={defaults?.type ?? "animated"}
          className={`${inputStyle} h-11`}
          required
        >
          {contentTypes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.icon} {t.label}
            </option>
          ))}
        </select>
      </label>
      <Field
        label="Title"
        name="title"
        defaultValue={defaults?.title}
        placeholder="e.g. What is a perfect square?"
        required
      />
      <Field
        label="Link"
        hint="Videos: the YouTube link (Share → Copy). Notes, PPT, worksheets: the Google Drive link, shared as “Anyone with the link”."
        name="link"
        defaultValue={defaults?.link}
        placeholder="https://"
        required
      />
      <label className="block">
        <span className="font-semibold text-ink">Description</span>
        <span className="block text-sm text-muted">
          Optional, one or two lines.
        </span>
        <textarea
          name="description"
          rows={2}
          defaultValue={defaults?.description ?? ""}
          className={`${inputStyle} py-2`}
        />
      </label>
    </>
  );
}
