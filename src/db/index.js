import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


export const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log("MONGOOSE connected",JSON.stringify(connectionInstance.connection.host));
  } catch (error) {
    console.error("ERROR::", error);
    throw error;
  }
};
