import mongoose from "mongoose";

export type UserRole  = 'superadmin' | 'user' | 'event-manager';
export interface UserInput{
        name:string;
        lastname: string;      
        email: string;
        password:string;
        role:UserRole;
        isActive: boolean;
}

export interface UserDocument extends UserInput, mongoose.Document{}

const userSchema = new mongoose.Schema({
    name:{ type: String, required: true },
    email: { type: String, requiered: true, unique: true },
    password:{ type: String, required: true },
    isActive: {type: Boolean, required:true},
    role:{ type: String, required: true },
});

export const UserModel = mongoose.model<UserDocument>("user", userSchema);