import mongoose, { mongo } from 'mongoose';

const connectionString:string = "mongodb://mongo:dCWABMaVBvgkiGYXMuUuqgJWdqXElxSk@yamanote.proxy.rlwy.net:20957";

export const db = mongoose.connect(connectionString, { dbName:"compunet03" })
.then(()=>{
    console.log("Connected to MongoDB");
})
.catch((error)=>{
    console.log(error)
})