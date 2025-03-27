import request from "supertest";
import { app } from "../../index";
import { eventService } from "../../services";

jest.mock("../../services/event.service");

describe("EventController", () => {
  const mockEvent = {
    id: "1",
    name: "Tech Conference",
    bannerPhotoUrl: "https://example.com/banner.jpg",
    isPublic: true,
    userId: "12345",
  };

  beforeEach(() => {
    process.env.NODE_ENV = "test";
    jest.clearAllMocks();
  });

  describe("POST /events/create", () => {
    it("debería retornar 400 si falta algún campo requerido", async () => {
      const res = await request(app).post("/events/create").send({
        name: "Tech Conference",
        bannerPhotoUrl: "https://example.com/banner.jpg",
        isPublic: true,
      });

      expect(res.status).toBe(400);
    });

    it("debería retornar 201 y crear un evento si los datos son válidos", async () => {
      (eventService.create as jest.Mock).mockResolvedValue(mockEvent);

      const res = await request(app).post("/events/create").send(mockEvent);

      expect(res.status).toBe(201);
      expect(res.body).toEqual(mockEvent);
    });

    it("debería manejar errores internos con código 500", async () => {
      (eventService.create as jest.Mock).mockRejectedValue(new Error("DB error"));

      const res = await request(app).post("/events/create").send(mockEvent);

      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Event hasn't been created");
    });
  });

  describe("GET /events/:id", () => {
    it("debería retornar un evento por ID", async () => {
      (eventService.findById as jest.Mock).mockResolvedValue(mockEvent);
      const res = await request(app).get(`/events/${mockEvent.id}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockEvent);
    });

    it("debería manejar errores internos con código 500", async () => {
      (eventService.findById as jest.Mock).mockRejectedValue(new Error("DB error"));
      const res = await request(app).get(`/events/${mockEvent.id}`);

      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Event not found");
    });
  });

  describe("GET /events", () => {
    it("debería retornar una lista de eventos", async () => {
      (eventService.getAll as jest.Mock).mockResolvedValue([mockEvent]);
      const res = await request(app).get("/events");

      expect(res.status).toBe(200);
      expect(res.body).toEqual([mockEvent]);
    });
  });

  describe("PUT /events/:id", () => {
    it("debería actualizar un evento", async () => {
      (eventService.updateEvent as jest.Mock).mockResolvedValue(mockEvent);
      const res = await request(app).put(`/events/${mockEvent.id}`).send(mockEvent);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockEvent);
    });
  });

  describe("DELETE /events/:id", () => {
    it("debería eliminar un evento", async () => {
      (eventService.deleteEvent as jest.Mock).mockResolvedValue(mockEvent);
      const res = await request(app).delete(`/events/${mockEvent.id}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockEvent);
    });
  });
});