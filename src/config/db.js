import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
export const connectDB = async () => {
    try {
        const options = process.env.DB_NAME
            ? { dbName: process.env.DB_NAME }
            : {};

        await mongoose.connect(process.env.MONGO_URL, options);
        console.log(`Connected to MongoDB database: ${mongoose.connection.name}`);
        } catch (error){
            console.error('Error connecting to MongoDB:', error.message);
        }
    };
