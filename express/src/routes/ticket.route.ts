import { Router } from "express";
import { buyTicket, getUserTickets, getTicketDetails, cancelTicket } from "../controllers/ticket.controller";

const router = Router();

router.post("/buy", buyTicket); // Comprar un boleto
router.get("/user/:userId", getUserTickets); // Ver boletos comprados por usuario
router.get("/:ticketId", getTicketDetails); // Ver detalles de un boleto
router.delete("/:ticketId", cancelTicket); // Cancelar un boleto

export default router;
