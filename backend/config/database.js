import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoBD connection successful");
  } catch (error) {
    console.error("MongoBD connection error: ", error.message);
    process.exit(1);
  }
};
