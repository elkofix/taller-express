
import { Router } from "express";

import { ticketController } from "../controllers/ticket.controller"; // Import the buyTicket function



export const ticketRouter = Router();

ticketRouter.post("/buy", ticketController.buyTicket); // Comprar un boleto
ticketRouter.get("/user/:userId", ticketController.getUserTickets); // Ver boletos comprados por usuario
ticketRouter.get("/:ticketId", ticketController.getTicketDetails); // Ver detalles de un boleto
ticketRouter.delete("/:ticketId", ticketController.cancelTicket); // Cancelar un boleto


