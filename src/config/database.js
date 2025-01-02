import mongoose from "mongoose";

export const connectDB = async() => {
    try {
        const dbName = process.env.MONGODB_DATABASE_NAME;
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            dbName: dbName
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // process code 1 code means exit with failure, 0 code means exit with success
    }
}