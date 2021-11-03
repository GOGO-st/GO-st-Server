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

// import mongoose from "mongoose";
// import config from "../config";

// const connectDB = async () => {
//   try {
//     await mongoose.connect(config.mongoURI, {
//       useNewUrlParser: true,
//       useCreateIndex: true,
//       useUnifiedTopology: true,
//     });

//     console.log("Mongoose Connected ...");

//     User.createCollection().then(function (collection) {
//       console.log("User Collection is created!");
//     });

//     Cafeti.createCollection().then(function (collection) {
//       console.log("Cafeti Collection is created!");
//     });

//     Category.createCollection().then(function (collection) {
//       console.log("Category Collection is created!");
//     });

//     Cafe.createCollection().then(function (collection) {
//       console.log("Cafe Collection is created!");
//     });

//     Review.createCollection().then(function (collection) {
//       console.log("Review Collection is created!");
//     });

//     Tag.createCollection().then(function (collection) {
//       console.log("Tag Collection is created!");
//     });
//     Menu.createCollection().then(function (collection) {
//       console.log("Menu Collection is created!");
//     });
//   } catch (err) {
//     console.error(err.message);
//     process.exit(1);
//   }
// };

// export default connectDB;
