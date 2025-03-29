import mongoose from "mongoose";

const connectionString: string =
  process.env.MONGO_URI || "mongodb+srv://kofi:Hola1597....@compunet3.llw6xdj.mongodb.net/?retryWrites=true&w=majority&appName=compunet3";

export const db =
  process.env.NODE_ENV === "test"
    ? Promise.resolve("Test DB Mocked")
    : mongoose.connect(connectionString, { dbName: "compunet03" })
        .then(() => {
          console.log("Connected to MongoDB");
        })
        .catch((error) => {
          console.error("MongoDB connection error:", error);
        });
