import mongoose from "mongoose";
import "dotenv/config";

export async function connectDB(){
    try{
        await mongoose.connect(process.env.DB_URL);
        console.log("Connection Established successfully");
    } catch(err) {
        console.log("Connection Failed");
        console.error(err.message);
    }
}