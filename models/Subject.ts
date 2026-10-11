import {
  Schema,
  model,
  models,
  type InferSchemaType,
  type Model,
} from "mongoose";

const subjectSchema = new Schema(
  {
    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    book: { type: String, trim: true }, // textbook name, e.g. "Ganita Prakash"
    order: { type: Number, default: 0 },
    thumbnail: { type: String },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// "maths" can exist in every class, but only once per class.
subjectSchema.index({ classId: 1, slug: 1 }, { unique: true });

export type SubjectDoc = InferSchemaType<typeof subjectSchema>;

export const SubjectModel: Model<SubjectDoc> =
  models.Subject ?? model<SubjectDoc>("Subject", subjectSchema);
