import mongoose from "mongoose";
import { ILocation } from "../interfaces/ILocation";

const LocationSchema = new mongoose.Schema(
  {
    locationName: {
      type: String,
      required: true,
    },
    locationAddress: {
      type: String,
      required: true,
    },
    x: {
      type: Number,
      required: false,
    },
    y: {
      type: Number,
      required: false,
    },
    category: {
      type: String,
      required: false,
    },
    emoji: {
      type: String,
      required: true,
    },
  },
  {
    collection: "locations",
    versionKey: false,
  }
);

export default mongoose.model<ILocation & mongoose.Document>(
  "Location",
  LocationSchema
);
