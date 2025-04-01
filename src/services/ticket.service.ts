import { TicketDocument, TicketInput, TicketModel } from "../models/ticket.model";
import { EventModel } from "../models/event.model";
import mongoose from "mongoose";

/**
 * Servicio encargado de gestionar la compra, consulta, actualización y cancelación de boletos.
 */
class TicketService {
    
    /**
     * Comprar un boleto para una presentación específica.
     * 
     * @param data - Los datos necesarios para crear un boleto.
     * @returns El ticket recién creado.
     * @throws Error si ocurre algún problema durante la creación del ticket.
     */
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

    /**
     * Buscar un ticket por su ID.
     * 
     * @param id - El ID del ticket que se desea buscar.
     * @returns El ticket correspondiente si se encuentra, o null si no existe.
     * @throws Error si ocurre algún problema durante la búsqueda del ticket.
     */
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

    /**
     * Obtener todos los tickets registrados.
     * 
     * @returns Una lista de todos los tickets.
     * @throws Error si ocurre algún problema durante la obtención de los tickets.
     */
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

    /**
     * Obtener todos los tickets de un usuario específico.
     * 
     * @param userId - El ID del usuario cuyos tickets se desean obtener.
     * @returns Una lista de tickets pertenecientes al usuario.
     * @throws Error si ocurre algún problema durante la obtención de los tickets del usuario.
     */
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
    
    /**
     * Obtener todos los tickets asociados a un event-manager.
     * 
     * @param eventManagerId - El ID del event-manager cuyos tickets se desean obtener.
     * @returns Una lista de tickets asociados a presentaciones gestionadas por el event-manager.
     * @throws Error si ocurre algún problema durante la obtención de los tickets.
     */
    async getTicketsByEventManager(eventManagerId: number): Promise<TicketDocument[]> {
        try {
            // Obtener eventos gestionados por el event-manager
            const events = await EventModel.find({ userId: eventManagerId.toString() });
            
            // Consultar tickets asociados a presentaciones de los eventos
            const tickets = await TicketModel.aggregate([
                {
                    $lookup: {
                        from: "presentations",
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

    /**
     * Verificar si un event-manager está asociado a una presentación.
     * 
     * @param eventManagerId - El ID del event-manager.
     * @param presentationId - El ID de la presentación.
     * @returns True si el event-manager está asociado a la presentación, false si no lo está.
     * @throws Error si ocurre algún problema durante la verificación.
     */
    async isEventManagerOfPresentation(eventManagerId: number, presentationId: number): Promise<boolean> {
        try {
            // Buscar la presentación
            const presentation = await mongoose.model("Presentation").findById(presentationId);
            if (!presentation) {
                return false;
            }
            
            // Verificar si el evento está gestionado por el event-manager
            const event = await EventModel.findOne({
                _id: presentation.eventId,
                userId: eventManagerId.toString()
            });
            
            return !!event; // Retorna true si el event-manager está asociado
        } catch (error) {
            console.error("Error al verificar event-manager de presentación:", error);
            throw new Error("Error al verificar permisos del gestor de eventos");
        }
    }

    /**
     * Cancelar un boleto existente.
     * 
     * @param id - El ID del ticket que se desea cancelar.
     * @returns El ticket cancelado, o null si no se encuentra el ticket.
     * @throws Error si ocurre algún problema durante la cancelación del ticket.
     */
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
    
    /**
     * Actualizar los datos de un ticket existente.
     * 
     * @param id - El ID del ticket a actualizar.
     * @param updateData - Los datos a actualizar en el ticket.
     * @returns El ticket actualizado, o null si no se encuentra el ticket.
     * @throws Error si ocurre algún problema durante la actualización del ticket.
     */
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
