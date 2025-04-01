/* import request from "supertest";
import { app } from "../../index";
import { ticketService } from "../../services/ticket.service";
import { Server } from "http";

jest.mock("../../services/ticket.service");

describe("TicketController", () => {
  process.env.NODE_ENV = "test";
  let server: Server;

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

  const mockTicket = {
    id: "1",
    Presentation_idPresentation: 123,
    User_idUser: 456,
  };

  it("debería comprar un ticket exitosamente", async () => {
    (ticketService.buyTicket as jest.Mock).mockResolvedValue(mockTicket);

    const res = await request(app)
      .post("/ticket/buy")
      .send({ Presentation_idPresentation: 123, User_idUser: 456 });

    expect(res.status).toBe(201);
    expect(res.body).toEqual(mockTicket);
  });

  it("debería retornar 400 si faltan campos requeridos", async () => {
    const res = await request(app).post("/ticket/buy").send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Missing required fields: Presentation_idPresentation or User_idUser");
  });

  it("debería retornar 500 si hay un error interno al comprar un ticket", async () => {
    (ticketService.buyTicket as jest.Mock).mockRejectedValue(new Error("DB error"));

    const res = await request(app).post("/ticket/buy").send({ Presentation_idPresentation: 123, User_idUser: 456 });
    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Ticket hasn't been created");
  });

  it("debería obtener detalles de un ticket", async () => {
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

  it("debería retornar 500 si hay un error interno al obtener detalles del ticket", async () => {
    (ticketService.findById as jest.Mock).mockRejectedValue(new Error("DB error"));

    const res = await request(app).get("/ticket/1");
    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Error retrieving ticket");
  });

  it("debería cancelar un ticket exitosamente", async () => {
    (ticketService.cancelTicket as jest.Mock).mockResolvedValue(mockTicket);

    const res = await request(app).delete("/ticket/1");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Ticket successfully canceled");
  });

  it("debería retornar 404 al cancelar un ticket inexistente", async () => {
    (ticketService.cancelTicket as jest.Mock).mockResolvedValue(null);

    const res = await request(app).delete("/ticket/999");
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Ticket not found");
  });

  it("debería retornar 500 si hay un error interno al cancelar un ticket", async () => {
    (ticketService.cancelTicket as jest.Mock).mockRejectedValue(new Error("DB error"));

    const res = await request(app).delete("/ticket/1");
    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Error canceling ticket");
  });

  it("debería obtener tickets de un usuario", async () => {
    (ticketService.getTicketsByUser as jest.Mock).mockResolvedValue([mockTicket]);

    const res = await request(app).get("/ticket/user/456");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([mockTicket]);
  });

  it("debería retornar 404 si el usuario no tiene tickets", async () => {
    (ticketService.getTicketsByUser as jest.Mock).mockResolvedValue([]);

    const res = await request(app).get("/ticket/user/999");
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("No tickets found for this user");
  });

  it("debería retornar 500 si hay un error interno al obtener los tickets del usuario", async () => {
    (ticketService.getTicketsByUser as jest.Mock).mockRejectedValue(new Error("DB error"));

    const res = await request(app).get("/ticket/user/456");
    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Error retrieving tickets");
  });
}); */