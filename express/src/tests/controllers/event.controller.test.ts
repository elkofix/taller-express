import request from "supertest";
import { app, server } from "../../index";
import { eventService } from "../../services";
import { Server } from "http";

jest.mock("../../services/event.service");

describe("EventController", () => {
  process.env.NODE_ENV = "test"
  let server: Server;
  const mockEvent = {
    id: "1",
    name: "Tech Conference",
    bannerPhotoUrl: "https://example.com/banner.jpg",
    isPublic: true,
    userId: "12345",
  };

  beforeAll(async () => {
    process.env.NODE_ENV = "test"
    server = app.listen(4000, () => console.log("Test server running on port 4000"));
});

  beforeEach(() => {
    process.env.NODE_ENV = "test";
    jest.clearAllMocks();
  });

  afterAll(async () => {
    if (server) {
      await new Promise(resolve => server.close(resolve));
    }
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

  describe("GET /events", () => {
    it("debería retornar una lista de eventos", async () => {
      (eventService.getAll as jest.Mock).mockResolvedValue([mockEvent]);
      const res = await request(app).get("/events");

      expect(res.status).toBe(200);
      expect(res.body).toEqual([mockEvent]);
    });
  });

  describe("GET /events/findEvent/:id", () => {
    it("debería retornar un evento por ID", async () => {
      (eventService.findById as jest.Mock).mockResolvedValue(mockEvent);
      const res = await request(app).get(`/events/findEvent/${mockEvent.id}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockEvent);
    });

    it("debería manejar errores internos con código 500", async () => {
      (eventService.findById as jest.Mock).mockRejectedValue(new Error("DB error"));
      const res = await request(app).get(`/events/findEvent/${mockEvent.id}`);

      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Event not found");
    });
  });

  describe("PUT /events/update/:id", () => {
    it("debería actualizar un evento", async () => {
      (eventService.updateEvent as jest.Mock).mockResolvedValue(mockEvent);
      const res = await request(app).put(`/events/update/${mockEvent.id}`).send(mockEvent);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockEvent);
    });
  });

  describe("DELETE /events/delete/:id", () => {
    it("debería eliminar un evento", async () => {
      (eventService.deleteEvent as jest.Mock).mockResolvedValue(mockEvent);
      const res = await request(app).delete(`/events/delete/${mockEvent.id}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockEvent);
    });
  });

  ///////////////////////////////////////////////////////////////////////////////////////////

  describe("POST /events/create - Validaciones", () => {
    it("debería retornar 400 si falta el nombre", async () => {
      const res = await request(app).post("/events/create").send({
        bannerPhotoUrl: "https://example.com/banner.jpg",
        isPublic: true,
        userId: "12345",
      });
  
      expect(res.status).toBe(400);
    });
  
    it("debería retornar 400 si falta la URL del banner", async () => {
      const res = await request(app).post("/events/create").send({
        name: "Tech Conference",
        isPublic: true,
        userId: "12345",
      });
  
      expect(res.status).toBe(400);
    });
  
    it("debería retornar 400 si falta el campo isPublic", async () => {
      const res = await request(app).post("/events/create").send({
        name: "Tech Conference",
        bannerPhotoUrl: "https://example.com/banner.jpg",
        userId: "12345",
      });
  
      expect(res.status).toBe(400);
    });
  
    it("debería retornar 400 si isPublic no es booleano", async () => {
      const res = await request(app).post("/events/create").send({
        name: "Tech Conference",
        bannerPhotoUrl: "https://example.com/banner.jpg",
        isPublic: "true",
        userId: "12345",
      });
  
      expect(res.status).toBe(400);
    });
  
    it("debería retornar 400 si falta userId", async () => {
      const res = await request(app).post("/events/create").send({
        name: "Tech Conference",
        bannerPhotoUrl: "https://example.com/banner.jpg",
        isPublic: true,
      });
  
      expect(res.status).toBe(400);
    });
  });

  ///////////////////////////////////////////////////////////////////////////////////////////

  describe('EventController - Casos adicionales', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("debería manejar errores al crear un evento (línea 38)", async () => {
      (eventService.create as jest.Mock).mockRejectedValue(new Error("Database error"));
  
      const res = await request(app).post("/events/create").send({
        name: "Test Event",
        bannerPhotoUrl: "http://example.com/banner.jpg",
        isPublic: true,
        userId: "12345",
      });
  
      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Event hasn't been created");
    });
  
    it("debería manejar cuando un evento no existe al buscar por ID (línea 47)", async () => {
      (eventService.findById as jest.Mock).mockResolvedValue(null);
  
      const res = await request(app).get("/events/findEvent/999");
  
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Event not found");
    });
  
  
    it("debería manejar errores al actualizar un evento inexistente (línea 56)", async () => {
      (eventService.updateEvent as jest.Mock).mockRejectedValue(new Error("Event not found"));
  
      const res = await request(app).put("/events/update/999").send({
        name: "Updated Event",
      });
  
      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Event hasn't been updated");
    });

    it("debería manejar errores internos al buscar un evento por ID", async () => {
      (eventService.findById as jest.Mock).mockRejectedValue(new Error("DB error"));
  
      const res = await request(app).get("/events/findEvent/1");
  
      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Event not found");
    });
  
  });
  
});