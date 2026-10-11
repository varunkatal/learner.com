import {
  Schema,
  model,
  models,
  type InferSchemaType,
  type Model,
} from "mongoose";

const chapterSchema = new Schema(
  {
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    order: { type: Number, default: 0 }, // position across the whole subject
    part: { type: Number, default: 1 }, // textbook part (Part I / Part II)
    number: { type: Number, default: 1 }, // chapter number as printed within its part
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true },
);

chapterSchema.index({ subjectId: 1, slug: 1 }, { unique: true });

export type ChapterDoc = InferSchemaType<typeof chapterSchema>;

export const ChapterModel: Model<ChapterDoc> =
  models.Chapter ?? model<ChapterDoc>("Chapter", chapterSchema);
