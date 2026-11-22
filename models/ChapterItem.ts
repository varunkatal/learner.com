import {
  Schema,
  model,
  models,
  type InferSchemaType,
  type Model,
} from "mongoose";
import { contentTypeIds } from "@/config/content";

// One piece of content inside a chapter: an animated video, a recorded class,
// notes, PPT slides or a worksheet. Videos store a YouTube ID; files store a Drive link.
const chapterItemSchema = new Schema(
  {
    chapterId: {
      type: Schema.Types.ObjectId,
      ref: "Chapter",
      required: true,
      index: true,
    },
    type: { type: String, enum: contentTypeIds, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    youtubeId: { type: String }, // video types only
    url: { type: String }, // file types only (https link)
    order: { type: Number, default: 0 }, // position within its type (tab)
    access: { type: String, enum: ["free", "members"], default: "free" },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true },
);

chapterItemSchema.index({ chapterId: 1, type: 1, order: 1 });

export type ChapterItemDoc = InferSchemaType<typeof chapterItemSchema>;

export const ChapterItemModel: Model<ChapterItemDoc> =
  models.ChapterItem ?? model<ChapterItemDoc>("ChapterItem", chapterItemSchema);
