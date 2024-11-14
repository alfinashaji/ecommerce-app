import mongoose from "mongoose";

export const mongoDb = process.env.MONGODB_URI;
export const mongodbConnect = async () =>
  await mongoose.connect(mongoDb).then(() => console.log("Connected!"));
