import {
  Schema,
  model,
  models,
  type InferSchemaType,
  type Model,
} from "mongoose";

const classSchema = new Schema(
  {
    name: { type: String, required: true, trim: true }, // e.g. "Class 9"
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export type ClassDoc = InferSchemaType<typeof classSchema>;

// `models.Class ??` stops Next.js hot reload from registering the model twice.
export const ClassModel: Model<ClassDoc> =
  models.Class ?? model<ClassDoc>("Class", classSchema);
