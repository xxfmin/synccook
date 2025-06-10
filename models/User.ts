import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export type UserDoc = InferSchemaType<typeof UserSchema>;

const User: Model<UserDoc> =
  mongoose.models.User || mongoose.model<UserDoc>("User", UserSchema);

export default User;
