import { TicketDocument, TicketInput, TicketModel } from "../models/ticket.model";


class TicketService{

    //Comprar un boleto
    async create(data: TicketInput): Promise<TicketDocument>{
        try{
            const ticket = await TicketModel.create(data);
            const msg = `Ticket creado con éxito para la presentación ${ticket.Presentation_idPresentation}`;
            console.log(msg);
            return ticket;
        }catch(error){
            console.error("Error al crear ticket:", error);
            throw new Error("Error al comprar el boleto");
        }
    }

    //Comprar un boleto
    async findById(id:string): Promise<TicketDocument | null>{ 
        try{
            const ticket = await TicketModel.findById(id);
            if(!ticket){
                console.warn(`Ticket not found with id ${id} `);
                return null;
            }
            const msg = `Ticket ${ticket.Presentation_idPresentation} found successfully`;
            console.log(msg);
            return ticket;

        }catch(error){
            console.error("Error al buscar ticket:", error);
            throw new Error("Error al buscar el boleto");
        
        }
    }

    //Obtener todos los tickets de un usuario
    async getTicketsByUser(userId: number):Promise<TicketDocument[]>{
        try{
            const tickets = await TicketModel.find({User_idUser: userId});
            console.log(`${tickets.length} tickets found successfully`);
            return tickets;
        }catch(error){
            console.error("Error al obtener tickets:", error);
            throw new Error("Error al obtener los tickets");
            
        }
    }

    //Cancelar un boleto

    async cancelTicket(id: string): Promise<TicketDocument | null>{
        try{
            const ticket =  await TicketModel.findById(id)
            if(!ticket){
                console.warn(`Ticket not found with id ${id} `);
                return null;
            }

            if(!ticket.isActive){
                console.warn(`Ticket ${id} is already cancelled`);
                return ticket;
            }
            ticket.isActive = false;
            await ticket.save();
            const msg = `Ticket ${ticket.Presentation_idPresentation} cancelled successfully`;
            console.log(msg);
            return ticket;
        }catch(error){
            console.log("Error al cancelar ticket:", error);
            throw new Error("Error al cancelar el ticket");

        }
    }

}

export default new TicketService();