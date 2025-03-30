import request from "supertest";
import { app } from "../../index";

import { Server } from "http";
import { ticketService } from "../../services/ticket.service";

jest.mock("../../services/ticket.service");

describe("TicketController", () => {
  process.env.NODE_ENV = "test";
  let server: Server;
  
  const mockTicket = {
    _id: "ticket123",
    buyDate: new Date(),
    Presentation_idPresentation: 10,
    User_idUser: 1,
    isRedeemed: false,
    isActive: true,
  };

  beforeAll(async () => {
    server = app.listen(0, () => console.log("Test server running on available port"));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  describe("POST /ticket/buy", () => {
    it("debería comprar un ticket exitosamente", async () => {
      (ticketService.buyTicket as jest.Mock).mockResolvedValue(mockTicket);

      const res = await request(app)
        .post("/ticket/buy")
        .send({ Presentation_idPresentation: 10, User_idUser: 1 });

      expect(res.status).toBe(201);
      expect(res.body._id).toBe(mockTicket._id);
    });

    it("debería retornar 400 si faltan datos requeridos", async () => {
      const res = await request(app).post("/ticket/buy").send({ User_idUser: 1 });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Missing required fields: Presentation_idPresentation or User_idUser");
    });

    it("debería retornar 500 si hay un error en la base de datos", async () => {
      (ticketService.buyTicket as jest.Mock).mockRejectedValue(new Error("DB error"));

      const res = await request(app)
        .post("/ticket/buy")
        .send({ Presentation_idPresentation: 10, User_idUser: 1 });

      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Ticket hasn't been created");
    });
  });

  describe("DELETE /ticket/:id/cancel", () => {
    it("debería cancelar un ticket exitosamente", async () => {
      (ticketService.cancelTicket as jest.Mock).mockResolvedValue({ ...mockTicket, isActive: false });
  
      const res = await request(app).delete(`/ticket/${mockTicket._id}/cancel`);
  
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Ticket successfully canceled"); // ← Coincide con el mensaje del controlador
      expect(res.body.ticket.isActive).toBe(false);
    });
  
    it("debería retornar 404 si el ticket no existe", async () => {
      (ticketService.cancelTicket as jest.Mock).mockResolvedValue(null);
  
      const res = await request(app).delete("/ticket/invalidId/cancel");
  
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Ticket not found"); // ← Coincide con el mensaje del controlador
    });
  
    it("debería retornar 500 si hay un error en la base de datos", async () => {
      (ticketService.cancelTicket as jest.Mock).mockRejectedValue(new Error("DB error"));
  
      const res = await request(app).delete(`/ticket/${mockTicket._id}/cancel`);
  
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Error canceling ticket"); // ← Coincide con el mensaje del controlador
    });
  });
  
  

  describe("GET /ticket/user/:userId", () => {
    it("debería retornar los tickets de un usuario", async () => {
      (ticketService.getTicketsByUser as jest.Mock).mockResolvedValue([mockTicket]);

      const res = await request(app).get(`/ticket/user/${mockTicket.User_idUser}`);

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0]._id).toBe(mockTicket._id);
    });

    it("debería retornar 404 si el usuario no tiene tickets", async () => {
      (ticketService.getTicketsByUser as jest.Mock).mockResolvedValue([]);

      const res = await request(app).get(`/ticket/user/${mockTicket.User_idUser}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("No tickets found for this user");
    });

    it("debería retornar 500 si hay un error en la base de datos", async () => {
      (ticketService.getTicketsByUser as jest.Mock).mockRejectedValue(new Error("DB error"));

      const res = await request(app).get(`/ticket/user/${mockTicket.User_idUser}`);

      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Error retrieving tickets");
    });
  });
});
