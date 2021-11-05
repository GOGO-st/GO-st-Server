import mongoose from "mongoose";
import { IUser } from "../interfaces/IUser";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    nickname: {
      type: String,
      required: true,
    },
    school: {
      type: String,
      required: true,
    },
    created_at: {
      type: Date,
    },
    deleted_at: {
      type: Date,
    },
  },
  {
    collection: "user",
    versionKey: false,
  }
);

export default mongoose.model<IUser & mongoose.Document>("User", UserSchema);
