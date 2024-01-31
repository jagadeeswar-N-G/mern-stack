import mongoose from "mongoose";
import { DB_NAME } from "./constants";
import ConnectDB from "./db";
import dotenv from "dotenv"


ConnectDB();


// import express from "express";

// const app = express();

// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`);
//     app.on("error", (error) => {
//       console.log("Error:", error);
//     });

//     app.listen(process.env.PORT, () => {
//       console.log(`app is listening on the port ${process.env.PORT}`);
//     });
//   } catch (error) {
//     console.log("Error:", error);
//   }
// })();
