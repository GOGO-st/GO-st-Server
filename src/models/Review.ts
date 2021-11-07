import mongoose from "mongoose";
import { IReview } from "../interfaces/IReview";

const ReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    locationId: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    emoji: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    created_at: {
      type: Date,
      required: true,
    },
  },
  {
    collection: "reviews",
    versionKey: false,
  }
);

export default mongoose.model<IReview & mongoose.Document>(
  "Review",
  ReviewSchema
);
