
import { Router } from "express";
import { auth, authorizeRoles } from '../middlewares/auth.middleware';
import { ticketController } from "../controllers/ticket.controller"; // Import the buyTicket function


export const ticketRouter = Router();

ticketRouter.post("/buy", auth, ticketController.buyTicket); // Comprar un boleto
ticketRouter.get("/user/:userId",auth, authorizeRoles(['user', 'superadmin']), ticketController.getUserTickets); // Ver boletos comprados por usuario
ticketRouter.get("/:ticketId",auth,ticketController.getTicketDetails); // Ver detalles de un boleto
ticketRouter.delete("/:ticketId", auth, authorizeRoles(['event-manager', 'superadmin']), ticketController.cancelTicket); // Cancelar un boleto


