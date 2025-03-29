import mongoose from "mongoose";

const connectionString: string =
  process.env.MONGO_URI || "mongodb://root:password@localhost:27017/";

export const db =
  process.env.NODE_ENV === "test"
    ? Promise.resolve("Test DB Mocked")
    : mongoose.connect(connectionString, { dbName: "compunet03" })
        .then(() => {
          console.log("Connected to MongoDB");
        })
        .catch((error) => {
          console.error("MongoDB connection error:", error);
          throw new Error("Connection Failed");
        });
