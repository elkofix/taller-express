import { Request, Response } from "express";

import { TicketDocument } from "../models/ticket.model";
import { ticketService } from "../services/ticket.service";

class TicketController {

    // Comprar un boleto
    async buyTicket(req: Request, res: Response) {
        try {
            const { buyDate, Presentation_idPresentation, User_idUser, isRedeemed, isActive } = req.body;
            
            if (!buyDate || !Presentation_idPresentation || !User_idUser) {
                res.status(400).json({ message: "Faltan campos obligatorios" });
                return;
            }
            
            const ticket: TicketDocument = await ticketService.create({ buyDate, Presentation_idPresentation, User_idUser, isRedeemed, isActive });
            res.status(201).json(ticket);
        } catch (error) {
            res.status(500).json({ message: "Error al comprar el ticket" });
        }
    }

    // Ver detalles de un boleto
    async getTicketDetails(req: Request, res: Response) {
        try {
            const { ticketId } = req.params;
            const ticket: TicketDocument | null = await ticketService.findById(ticketId);
            
            if (!ticket) {
                res.status(404).json({ error: "Ticket no encontrado" });
                return;
            }
            
            res.status(200).json(ticket);
            return;
        } catch (error) {
            res.status(500).json({ error: "Error al obtener el ticket" });
            return;
        }
    }

    // Cancelar un boleto
    async cancelTicket(req: Request, res: Response) {
        try {
            const { ticketId } = req.params;
            const ticket: TicketDocument | null = await ticketService.cancelTicket(ticketId);
            
            if (!ticket) {
                res.status(404).json({ error: "Ticket no encontrado" });
                return;
            }
            
            res.status(200).json({ message: "Ticket cancelado exitosamente", ticket });
            return;
        } catch (error) {
            res.status(500).json({ error: "Error al cancelar el ticket" });
            return;
        }
    }

    // Ver boletos comprados por usuario
    async getUserTickets(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const tickets: TicketDocument[] = await ticketService.getTicketsByUser(Number(userId));
            
            res.status(200).json(tickets);
            return;
        } catch (error) {
            res.status(500).json({ error: "Error al obtener los tickets del usuario" });
            return;
        }
    }
}

export const ticketController = new TicketController();

