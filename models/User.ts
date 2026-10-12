import {
  Schema,
  model,
  models,
  type InferSchemaType,
  type Model,
} from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    image: String,
    role: { type: String, enum: ["student", "admin"], default: "student" },
    grade: { type: Number, min: 6, max: 10 }, // the student's class, e.g. 9
    whatsapp: { type: String, trim: true },
    membership: {
      status: {
        type: String,
        enum: ["none", "active", "expired"],
        default: "none",
      },
      planId: String,
      validUntil: Date,
    },
  },
  { timestamps: true },
);

export type UserDoc = InferSchemaType<typeof userSchema>;
export type Role = "student" | "admin";

export const UserModel: Model<UserDoc> =
  models.User ?? model<UserDoc>("User", userSchema);
