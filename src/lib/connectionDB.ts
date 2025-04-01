import mongoose from "mongoose";

const connectionString: string =
  process.env.MONGO_URI || "mongodb://mongo:nQYyMQOQqMixifufosGpSFgQsRHuBNEh@mainline.proxy.rlwy.net:49733";

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
