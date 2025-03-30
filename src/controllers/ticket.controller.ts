import { Request, Response } from "express";
import { TicketDocument } from "../models/ticket.model";
import { ticketService } from "../services/ticket.service";

class TicketController {
    /**
     * Comprar un ticket.
     * @param {Request} req - Solicitud HTTP con los datos del ticket.
     * @param {Response} res - Respuesta HTTP.
     * @returns {Promise<void>} Responde con el ticket creado o un error.
     */
    async buyTicket(req: Request, res: Response): Promise<void> {
        try {
            const { Presentation_idPresentation, User_idUser } = req.body;
            
            if (!Presentation_idPresentation || !User_idUser) {
                res.status(400).json({ message: "Missing required fields: Presentation_idPresentation or User_idUser" });
                return;
            }
            
            const ticket: TicketDocument = await ticketService.buyTicket(req.body);
            res.status(201).json(ticket);
        } catch (error) {
            res.status(500).json({ message: "Ticket hasn't been created" });
        }
    }

    /**
     * Obtener detalles de un ticket.
     * @param {Request} req - Solicitud HTTP con el ID del ticket.
     * @param {Response} res - Respuesta HTTP.
     * @returns {Promise<void>} Responde con los detalles del ticket o un error.
     */
    async getTicketDetails(req: Request, res: Response): Promise<void> {
        try {
            const { ticketId } = req.params;
            const ticket: TicketDocument | null = await ticketService.findById(ticketId);
            
            if (!ticket) {
                res.status(404).json({ message: "Ticket not found" });
                return;
            }
            
            res.status(200).json(ticket);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving ticket" });
        }
    }

    /**
     * Cancelar un ticket.
     * @param {Request} req - Solicitud HTTP con el ID del ticket.
     * @param {Response} res - Respuesta HTTP.
     * @returns {Promise<void>} Responde con el estado de cancelación o un error.
     */
    async cancelTicket(req: Request, res: Response): Promise<void> {
        try {
            const { ticketId } = req.params;
            const ticket: TicketDocument | null = await ticketService.cancelTicket(ticketId);
            
            if (!ticket) {
                res.status(404).json({ message: "Ticket not found" });
                return;
            }
            
            res.status(200).json({ message: "Ticket successfully canceled", ticket });
        } catch (error) {
            res.status(500).json({ message: "Error canceling ticket" });
        }
    }

    /**
     * Obtener tickets de un usuario.
     * @param {Request} req - Solicitud HTTP con el ID del usuario.
     * @param {Response} res - Respuesta HTTP.
     * @returns {Promise<void>} Responde con la lista de tickets o un error.
     */
    async getUserTickets(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const tickets: TicketDocument[] = await ticketService.getTicketsByUser(Number(userId));
            
            if (tickets.length === 0) {
                res.status(404).json({ message: "No tickets found for this user" });
                return;
            }
            
            res.status(200).json(tickets);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving tickets" });
        }
    }
}

export const ticketController = new TicketController();
