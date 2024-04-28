import "dotenv/config";
import mongoose from "mongoose";

const dbUrl = process.env.DB_URL as string;

export const connectDb = async () => {
  try {
    await mongoose.connect(dbUrl).then(() => {
      console.log("Database connected");
    });
  } catch (error: any) {
    console.log(error.message);
    setTimeout(connectDb, 5000);
  }
};
