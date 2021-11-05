import mongoose from "mongoose";
import config from "../config";

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoURI);

    console.log(`
    #########################
    📦  mongoDB 연결 성공 📦
    #########################
  `);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;
