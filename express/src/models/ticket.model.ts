import mongoose from "mongoose";


export interface TicketInput{
    buyDate: Date;
    Presentation_idPresentation : number;
    User_idUser: number;
    isRedeemed: boolean;
    isActive: boolean;
}

export interface TicketDocument extends TicketInput, mongoose.Document{}

const ticketSchema = new mongoose.Schema({
    buyDate:{ type: Date, required: true },
    Presentation_idPresentation:{ type: Number, required: true },
    User_idUser:{ type: Number, required: true },
    isRedeemed: {type: Boolean, required:true},
    isActive: {type: Boolean, required:true},
});

export const TicketModel = mongoose.model<TicketDocument>("Ticket", ticketSchema);