import mongoose from "mongoose";
import { ILocation } from "../interfaces/ILocation";

const LocationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
      required: false,
    },
    longitude: {
      type: Number,
      required: false,
    },
    category: {
      type: String,
      required: false,
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
