const dotenv = require("dotenv");
dotenv.config();
import mongoose from "mongoose";
import { DB_NAME } from "../constants";

const ConnectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`
    );
    console.log(
      `connection was successful host:${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("Mongo DB connection Error:", error);
    process.exit(1);
  }
};

export default ConnectDB;
