import { Schema, model } from "mongoose";

export interface userAttributes {
  name: string;
  email: string;
  phoneNumber?: string;
}

export const UserSchema = new Schema<userAttributes>(
  {
    name: {
      type: String,
      required: [true, "full name is required"],
      trim: true,
    },
    email: {
      type: String,
      trim: false,
      required: [true, "Please provide a valid email"],
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: [true, "Please provide your phone number"],
      unique: [true, "no duplicate email is allowed"],
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

UserSchema.index({ request: "text" });
export let userInstance = model("User", UserSchema);
