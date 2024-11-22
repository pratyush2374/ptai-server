import mongoose from "mongoose";
import { DB_NAME } from "../src/constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URL}/${DB_NAME}`
        );
        console.log(
            `\n MongoDB connected ! DB Host: ${connectionInstance.connection.host}`
        );
    } catch (error) {
        console.error("Connection Failed: ", error);
        process.exit(1);
    }
};

export default connectDB;
