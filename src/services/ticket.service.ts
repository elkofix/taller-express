import { TicketDocument, TicketInput, TicketModel } from "../models/ticket.model";
import { EventModel } from "../models/event.model";
import mongoose from "mongoose";

class TicketService {
    
    // Comprar un boleto
    async buyTicket(data: TicketInput): Promise<TicketDocument> {
        try {
            data.buyDate = new Date(); // Establecer la fecha de compra
            data.isActive = true; // Por defecto, el ticket está activo
            const ticket = await TicketModel.create(data);
            console.log(`Ticket ${ticket._id} para presentación ${ticket.Presentation_idPresentation} creado con éxito`);
            return ticket;
        } catch (error) {
            console.error("Error al crear ticket:", error);
            throw new Error("Error al comprar el boleto");
        }
    }

    // Buscar ticket por ID
    async findById(id: string): Promise<TicketDocument | null> {
        try {
            const ticket = await TicketModel.findById(id);
            if (!ticket) {
                console.warn(`Ticket con id ${id} no encontrado`);
                return null;
            }
            console.log(`Ticket ${id} encontrado con éxito`);
            return ticket;
        } catch (error) {
            console.error("Error al buscar ticket:", error);
            throw new Error("Error al obtener el boleto");
        }
    }

    // Obtener todos los tickets
    async findAll(): Promise<TicketDocument[]> {
        try {
            const tickets = await TicketModel.find();
            console.log(`${tickets.length} tickets encontrados en total`);
            return tickets;
        } catch (error) {
            console.error("Error al obtener todos los tickets:", error);
            throw new Error("Error al obtener todos los tickets");
        }
    }

    // Obtener todos los tickets de un usuario
    async getTicketsByUser(userId: number): Promise<TicketDocument[]> {
        try {
            const tickets = await TicketModel.find({ User_idUser: userId });
            console.log(`${tickets.length} tickets encontrados para el usuario ${userId}`);
            return tickets;
        } catch (error) {
            console.error("Error al obtener tickets de usuario:", error);
            throw new Error("Error al obtener los tickets del usuario");
        }
    }
    
    // Obtener tickets para un event-manager
    async getTicketsByEventManager(eventManagerId: number): Promise<TicketDocument[]> {
        try {
            // Asumimos que hay una relación entre Event y Presentation
            // donde cada presentación está asociada a un evento
            
            // 1. Obtenemos los eventos gestionados por este event-manager
            const events = await EventModel.find({ userId: eventManagerId.toString() });
            
            // 2. Asumimos que existe una relación donde Presentation tiene un campo eventId
            // que lo relaciona con un evento específico
            // Necesitamos hacer un join entre tickets y presentaciones para encontrar esta relación
            
            // Esta es una consulta de ejemplo que necesitarías adaptar según tu esquema real
            const tickets = await TicketModel.aggregate([
                {
                    $lookup: {
                        from: "presentations", // Nombre de la colección de presentaciones
                        localField: "Presentation_idPresentation",
                        foreignField: "_id",
                        as: "presentation"
                    }
                },
                {
                    $match: {
                        "presentation.eventId": { 
                            $in: events.map(event => event._id) 
                        }
                    }
                }
            ]);
            
            console.log(`${tickets.length} tickets encontrados para el event-manager ${eventManagerId}`);
            return tickets;
        } catch (error) {
            console.error("Error al obtener tickets de event-manager:", error);
            throw new Error("Error al obtener los tickets asociados al gestor de eventos");
        }
    }

    // Verificar si un event-manager está asociado a una presentación
    async isEventManagerOfPresentation(eventManagerId: number, presentationId: number): Promise<boolean> {
        try {
            // Similar al método anterior, necesitamos verificar la relación entre
            // el event-manager y la presentación a través del evento
            
            // 1. Buscar la presentación
            // Asumimos que hay un modelo de Presentation con un campo eventId
            const presentation = await mongoose.model("Presentation").findById(presentationId);
            
            if (!presentation) {
                return false;
            }
            
            // 2. Verificar si el evento pertenece al event-manager
            const event = await EventModel.findOne({
                _id: presentation.eventId,
                userId: eventManagerId.toString()
            });
            
            return !!event; // True si encontramos un evento que coincide
        } catch (error) {
            console.error("Error al verificar event-manager de presentación:", error);
            throw new Error("Error al verificar permisos del gestor de eventos");
        }
    }

    // Cancelar un boleto
    async cancelTicket(id: string): Promise<TicketDocument | null> {
        try {
            const ticket = await TicketModel.findById(id);
            if (!ticket) {
                console.warn(`Ticket con id ${id} no encontrado`);
                return null;
            }
            
            if (!ticket.isActive) {
                console.warn(`El ticket ${id} ya estaba cancelado`);
                return ticket;
            }

            ticket.isActive = false;
            await ticket.save();
            console.log(`Ticket ${id} cancelado con éxito`);
            return ticket;
        } catch (error) {
            console.error("Error al cancelar ticket:", error);
            throw new Error("Error al cancelar el boleto");
        }
    }
    
    // Actualizar un ticket
    async updateTicket(id: string, updateData: Partial<TicketInput>): Promise<TicketDocument | null> {
        try {
            const ticket = await TicketModel.findByIdAndUpdate(
                id, 
                updateData, 
                { new: true, runValidators: true }
            );
            
            if (!ticket) {
                console.warn(`Ticket con id ${id} no encontrado para actualizar`);
                return null;
            }
            
            console.log(`Ticket ${id} actualizado con éxito`);
            return ticket;
        } catch (error) {
            console.error("Error al actualizar ticket:", error);
            throw new Error("Error al actualizar el boleto");
        }
    }
}

export const ticketService = new TicketService();