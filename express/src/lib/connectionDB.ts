import mongoose, { mongo } from 'mongoose';

const connectionString:string = process.env.MONGO_URI || "mongodb://root:password@localhost:27017/";

export const db = mongoose.connect(connectionString, { dbName:"compunet03" })
.then(()=>{
    console.log("Connected to MongoDB");
})
.catch((error)=>{
    console.log(error)
})