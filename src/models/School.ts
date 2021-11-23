import mongoose from "mongoose";
import { ISchool } from "../interfaces/ISchool";

const SchoolSchema = new mongoose.Schema(
  {
    kor: {
      type: String,
      required: true,
    },
    eng: {
      type: String,
      required: true,
    },
  },
  {
    collection: "schools",
    versionKey: false,
  }
);

export default mongoose.model<ISchool & mongoose.Document>(
  "School",
  SchoolSchema
);
