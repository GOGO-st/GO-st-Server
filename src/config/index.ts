import dotenv from "dotenv";

process.env.NODE_ENV = process.env.NODE_ENV || "development";

const envFound = dotenv.config();
if (envFound.error) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  // PORT
  port: parseInt(process.env.PORT, 10),

  // DB
  mongoURI: process.env.MONGODB_URI,

  // JWT
  jwtSecret: process.env.JWT_SECRET,
  jwtAlgorithm: process.env.JWT_ALGO,

  // API
  mapClientId: process.env.MAP_CLIENT_ID,
  mapSecretKey: process.env.MAP_SECRET_KEY,
  searchClientId: process.env.SEARCH_CLIENT_ID,
  searchSecretKey: process.env.SEARCH_SECRET_KEY,
};
