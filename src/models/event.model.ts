import mongoose from "mongoose";

export interface EventInput{
    name:string;
    bannerPhotoUrl:string;
    isPublic:boolean;
    userId:string; 
}

export interface EventDocument extends EventInput, mongoose.Document{}

const eventSchema = new mongoose.Schema({
    name:{ type: String, required: true },
    bannerPhotoUrl:{ type: String, required: true },
    isPublic: {type: Boolean, required:true},
    userId: { type: String, required: true },
});

export const EventModel = mongoose.model<EventDocument>("Event", eventSchema);