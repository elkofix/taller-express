import { TicketDocument, TicketInput, TicketModel } from "../models/ticket.model";


class TicketService{


    async create(data: TicketInput){
        try{
            const ticket = await TicketModel.create(data);
            const msg = `Ticket ${ticket.Presentation_idPresentation} created successfully`;
            console.log(msg);
            return ticket;
        }catch(error){
            throw error;
        }
    }

    async findById(id:string){
        try{

            const ticket = await TicketModel.findById(id);
            if(!ticket){
                throw new Error(`Ticket not found with id ${id} `);
            }
            const msg = `Ticket ${ticket.Presentation_idPresentation} found successfully`;
            console.log(msg);
            return ticket;

        }catch(error){
            throw error;
        }
    }

    async getAll():Promise<TicketDocument[]>{
        try{
            const tickets = await TicketModel.find({});
            console.log(`${tickets.length} tickets found successfully`);
            return tickets;
        }catch(error){
            throw error;
        }
    }

    async updateTicket(id: string, ticket: TicketInput) {
        try{
            const updatedTicket : TicketDocument | null = await TicketModel.findOneAndUpdate(
                { _id: id },
                ticket,
                { returnOriginal: false }
            );

            if(!updatedTicket){
                throw new Error(`Ticket with id ${id} not found`);
            }

            //updatedTicket.Presentation_idPresentation = "";
        }catch(error){
            throw error;
        }
    }

}