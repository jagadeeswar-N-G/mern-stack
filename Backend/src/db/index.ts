import mongoose from "mongoose";
import { DB_NAME } from "../constants";

const ConnectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`);
        console.log(`Mongo DB connetion successfull Host:${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("Database connection failed", error);
        process.exit(1)
        
    }
}

export default ConnectDB