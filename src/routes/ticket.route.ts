import express from "express";

import { ticketController } from "../controllers/ticket.controller"; // Import the buyTicket function


const router = express.Router();

router.post("/buy", ticketController.buyTicket); // Comprar un boleto
router.get("/user/:userId", ticketController.getUserTickets); // Ver boletos comprados por usuario
router.get("/:ticketId", ticketController.getTicketDetails); // Ver detalles de un boleto
router.delete("/:ticketId", ticketController.cancelTicket); // Cancelar un boleto

export default router;
