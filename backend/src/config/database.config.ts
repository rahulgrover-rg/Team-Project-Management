import mongoose from "mongoose";
import { config } from "./app.config";

const connectDB = async() => {
    try {
        await mongoose.connect(config.MONGO_URL) ;
        console.log("Database Connected");
    } catch (error) {
        if(error instanceof Error) {
            console.log("Error connecting to database : ", error.message);
        }
        process.exit(1) ;
    }
}

export default connectDB ;