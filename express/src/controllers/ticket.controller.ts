import { Request, Response } from "express";
import TicketService from "../services/ticket.service";

// 📌 Comprar un boleto
export const buyTicket = async (req: Request, res: Response): Promise<void> => {
    try {
        const ticket = await TicketService.create(req.body);
        res.status(201).json({ message: "Ticket comprado exitosamente", ticket });
    } catch (error) {
        res.status(500).json({ error: "Error al comprar el ticket" });
    }
};

// 📌 Ver boletos comprados por el usuario
export const getUserTickets = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;
        const tickets = await TicketService.getTicketsByUser(Number(userId));
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los tickets del usuario" });
    }
};

// 📌 Ver detalles de un boleto
export const getTicketDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        const { ticketId } = req.params;
        const ticket = await TicketService.findById(ticketId);
        if (!ticket) 
            return res.status(404).json({ error: "Ticket no encontrado" });
        
        res.status(200).json(ticket);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el ticket" });
    }
};

// 📌 Cancelar un boleto
export const cancelTicket = async (req: Request, res: Response): Promise<void> => {
    try {
        const { ticketId } = req.params;
        const ticket = await TicketService.cancelTicket(ticketId);
        if (!ticket) 
            return res.status(404).json({ error: "Ticket no encontrado" });

        res.status(200).json({ message: "Ticket cancelado exitosamente", ticket });
    } catch (error) {
        res.status(500).json({ error: "Error al cancelar el ticket" });
    }
};
