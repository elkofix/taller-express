// tests/ticketController.test.ts
import { Request, Response, NextFunction } from "express"; // Importar tipos de Express
import request from "supertest";
import { app } from "../../index";  // Asegúrate de que 'app' esté exportado
import { ticketService } from "../../services/ticket.service";  // Mockear los servicios

// Mock de middlewares
jest.mock("../middlewares/auth.middleware", () => ({
  auth: jest.fn((req: Request, res: Response, next: NextFunction) => next()), // Especificar tipos
  authorizeRoles: jest.fn((roles: string[]) => (req: Request, res: Response, next: NextFunction) => next()), // Especificar tipos
}));

jest.mock("../../services/ticket.service");

describe("TicketController", () => {
  const mockTicket = {
    id: "1",
    Presentation_idPresentation: 123,
    User_idUser: 456,
  };

  it("debería retornar 400 si falta Presentation_idPresentation", async () => {
    const res = await request(app)
      .post("/ticket/buy")
      .send({ User_idUser: 456 });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Missing required fields: Presentation_idPresentation or User_idUser");
  });

  it("debería retornar 500 si hay un error interno al crear el ticket", async () => {
    (ticketService.buyTicket as jest.Mock).mockRejectedValue(new Error("Database error"));

    const res = await request(app)
      .post("/ticket/buy")
      .send({ Presentation_idPresentation: 123, User_idUser: 456 });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Ticket hasn't been created");
  });

  it("debería obtener un ticket por su ID", async () => {
    (ticketService.findById as jest.Mock).mockResolvedValue(mockTicket);

    const res = await request(app).get("/ticket/1");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockTicket);
  });

  it("debería retornar 404 si el ticket no existe", async () => {
    (ticketService.findById as jest.Mock).mockResolvedValue(null);

    const res = await request(app).get("/ticket/999");

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Ticket not found");
  });

  it("debería cancelar un ticket correctamente", async () => {
    (ticketService.cancelTicket as jest.Mock).mockResolvedValue(mockTicket);

    const res = await request(app).delete("/ticket/1");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Ticket successfully canceled");
  });

  it("debería retornar 404 si el ticket no se puede cancelar", async () => {
    (ticketService.cancelTicket as jest.Mock).mockResolvedValue(null);

    const res = await request(app).delete("/ticket/999");

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Ticket not found");
  });
});
