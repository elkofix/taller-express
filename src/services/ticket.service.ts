import { TicketDocument, TicketInput, TicketModel } from "../models/ticket.model";

class TicketService {
    
    // Comprar un boleto
    async buyTicket(data: TicketInput): Promise<TicketDocument> {
        try {
            data.buyDate= new Date(); // Establecer la fecha de compra
            const ticket = await TicketModel.create(data);
            console.log(` Ticket ${ticket._id} para presentación ${ticket.Presentation_idPresentation} creado con éxito`);
            return ticket;
        } catch (error) {
            console.error(" Error al crear ticket:", error);
            throw new Error("Error al comprar el boleto");
        }
    }

    //  Buscar ticket por ID
    async findById(id: string): Promise<TicketDocument | null> {
        try {
            const ticket = await TicketModel.findById(id);
            if (!ticket) {
                console.warn(` Ticket con id ${id} no encontrado`);
                return null;
            }
            console.log(` Ticket ${id} encontrado con éxito`);
            return ticket;
        } catch (error) {
            console.error(" Error al buscar ticket:", error);
            throw new Error("Error al obtener el boleto");
        }
    }

    // Tener todos los tickets de un usuario
    async getTicketsByUser(userId: number): Promise<TicketDocument[]> {
        try {
            const tickets = await TicketModel.find({ User_idUser: userId });
            console.log(`${tickets.length} tickets found successfully`);
            return tickets;
        } catch (error) {
            console.error("Error al obtener tickets:", error);
            throw new Error("Error al obtener los tickets");
        }
    }
    

    //  Cancelar un boleto
    async cancelTicket(id: string): Promise<TicketDocument | null> {
        try {
            const ticket = await TicketModel.findById(id);
            if (!ticket) {
                console.warn(` Ticket con id ${id} no encontrado`);
                return null;
            }
            
            if (!ticket.isActive) {
                console.warn(`El ticket ${id} ya estaba cancelado`);
                return ticket;
            }

            ticket.isActive = false;
            await ticket.save();
            console.log(` Ticket ${id} cancelado con éxito`);
            return ticket;
        } catch (error) {
            console.error("Error al cancelar ticket:", error);
            throw new Error("Error al cancelar el boleto");
        }
    }
}
export const ticketService = new TicketService();
