import { Request, Response } from "express";
import { TicketDocument } from "../models/ticket.model";
import { ticketService } from "../services/ticket.service";

class TicketController {
    
    // Métodos de la clase
    
    /**
     * Comprueba si el usuario tiene permisos para realizar una acción en un ticket
     */
    private async hasPermissionToManageTicket(user: any, ticket: TicketDocument) {
        if (user.role === 'user' && ticket.User_idUser !== user.id) {
            return { status: 403, message: "You don't have permission to manage this ticket" };
        }
        if (user.role === 'event-manager') {
            const isEventManagerOfPresentation = await ticketService.isEventManagerOfPresentation(user.id, ticket.Presentation_idPresentation);
            if (!isEventManagerOfPresentation) {
                return { status: 403, message: "You can only manage tickets for your own events" };
            }
        }
        return { status: 200, message: "Permission granted" };
    }

    /**
     * Comprar un ticket.
     */
    async buyTicket(req: Request, res: Response): Promise<void> {
        try {
            const { Presentation_idPresentation, User_idUser } = req.body;
            const currentUser = req.body.user;

            if (!Presentation_idPresentation || !User_idUser) {
                res.status(400).json({ message: "Missing required fields" });
            }

            // Verificación de permisos para comprar un ticket
            if (currentUser.role === 'user' && User_idUser !== currentUser.id) {
                res.status(403).json({ message: "You can only buy tickets for yourself" });
            }

            const ticket: TicketDocument = await ticketService.buyTicket(req.body);
            res.status(201).json(ticket);
        } catch (error) {
            res.status(500).json({ message: "Ticket hasn't been created", error });
        }
    }

    /**
     * Obtener detalles de un ticket.
     */
     getTicketDetails = async (req: Request, res: Response): Promise<void> => { 
        try {
            const { ticketId } = req.params;
            const currentUser = req.body.user;
    
            const ticket = await ticketService.findById(ticketId);
            if (!ticket) {
                res.status(404).json({ message: "Ticket not found" });
            }
    
            // Solo llamar a hasPermissionToManageTicket si el ticket no es null
            const permission = await this.hasPermissionToManageTicket(currentUser, ticket as TicketDocument);
            if (permission.status !== 200) {
                res.status(permission.status).json({ message: permission.message });
            }
    
                res.status(200).json(ticket);
        } catch (error) {
            console.error("Error retrieving ticket:", error);
            res.status(500).json({ message: "Error retrieving ticket", error });
        }
    }
    
    

    /**
     * Cancelar un ticket.
     */
     cancelTicket = async (req: Request, res: Response): Promise<void> => {
        try {
            const { ticketId } = req.params;
            const currentUser = req.body.user;

            const ticket: TicketDocument | null = await ticketService.findById(ticketId);
            if (!ticket) {
                res.status(404).json({ message: "Ticket not found" });
            }
            
            if (!ticket) {
                return; // Exit early if ticket is null
            }
            const permission = await this.hasPermissionToManageTicket(currentUser, ticket);
            if (permission.status !== 200) {
                res.status(permission.status).json({ message: permission.message });
            }

            const canceledTicket = await ticketService.cancelTicket(ticketId);
            res.status(200).json({ message: "Ticket successfully canceled", canceledTicket });
        } catch (error) {
            res.status(500).json({ message: "Error canceling ticket", error });
        }
    }

    /**
     * Obtener tickets de un usuario.
     */
    async getUserTickets(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const currentUser = req.body.user;

            if (currentUser.role === 'user' && Number(userId) !== currentUser.id) {
                res.status(403).json({ message: "You can only view your own tickets" });
            }

            const tickets: TicketDocument[] = await ticketService.getTicketsByUser(Number(userId));
            if (tickets.length === 0) {
                res.status(404).json({ message: "No tickets found for this user" });
            }

            res.status(200).json(tickets);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving tickets", error });
        }
    }
}

export const ticketController = new TicketController();

///////////////