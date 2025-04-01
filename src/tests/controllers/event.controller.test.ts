import request from "supertest";
import { app } from "../../index";
import { eventService } from "../../services";
import { securityService } from "../../services";
import { Server } from "http";

jest.mock("../../services/user.service");
jest.mock("../../services/security.service");
jest.mock("../../services/event.service");
jest.mock("../../middlewares/auth.middleware", () => {
  return {
    auth: jest.fn((req: any, res: any, next: any) => {
      req.body.user = {
        id: "mockUserId",
        email: "mock@example.com",
        role: "superadmin", 
      };
      next();
    }),
    authorizeRoles: jest.fn((allowedRoles: string[]) => {
      return (req: any, res: any, next: any) => {
        if (!allowedRoles.includes(req.body.user.role)) {
          return res.status(403).json({ message: `Forbidden, your role is ${req.body.user.role}` });
        }
        next();
      };
    }),
  };
});

describe("EventController", () => {
  process.env.NODE_ENV = "test";
  let server: Server;
  const mockEvent = {
    id: "event123",
    name: "Test Event",
    description: "Event description",
    date: "2023-12-01",
    userId: "manager123",
  };

  const mockEvent1 = { _id: "event123", userId: "user123", name: "Sample Event" };

  const mockEvents = [
    { _id: "event123", userId: "user123", name: "Sample Event 1" },
    { _id: "event456", userId: "user123", name: "Sample Event 2" }
  ];

  const updatedEvent = {
    _id: "event123",
    userId: "user123",
    name: "Updated Event",
    description: "Updated description"
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

  it("debería crear un evento exitosamente", async () => {
    (securityService.getClaims as jest.Mock).mockResolvedValue({ _id: "manager123", role: "eventmanager" });
    (eventService.create as jest.Mock).mockResolvedValue(mockEvent);

    const res = await request(app)
      .post("/events/create")
      .send({ name: "Test Event", description: "Event description", date: "2023-12-01" })
      .set("Authorization", "Bearer token");

    expect(res.status).toBe(201);
    expect(res.body.name).toBe(mockEvent.name);
  });

  it("debería retornar 403 si no es un event manager", async () => {
    (securityService.getClaims as jest.Mock).mockResolvedValue({ _id: "user123", role: "user" });

    const res = await request(app)
      .post("/events/create")
      .send({ name: "Test Event", description: "Event description" })
      .set("Authorization", "Bearer token");

    expect(res.status).toBe(403);
    expect(res.body.message).toBe("Access denied. Only event managers can create events.");
  });

  it("debería retornar 500 si hay un error interno al crear un evento", async () => {
    (securityService.getClaims as jest.Mock).mockResolvedValue({ _id: "manager123", role: "eventmanager" });
    (eventService.create as jest.Mock).mockRejectedValue(new Error("DB error"));

    const res = await request(app)
      .post("/events/create")
      .send({ name: "Test Event", description: "Event description" })
      .set("Authorization", "Bearer token");

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Event hasn't been created");
  });

  it("debería retornar un evento por ID", async () => {
    (securityService.getClaims as jest.Mock).mockResolvedValue({ _id: "manager123", role: "eventmanager" });
    (eventService.findById as jest.Mock).mockResolvedValue(mockEvent);

    const res = await request(app)
      .get(`/events/findEvent/${mockEvent.id}`)
      .set("Authorization", "Bearer token");

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(mockEvent.id);
  });

  it("debería retornar 404 si el evento no existe", async () => {
    (eventService.findById as jest.Mock).mockResolvedValue(null);
    (securityService.getClaims as jest.Mock).mockResolvedValue({ _id: "manager123", role: "eventmanager" });

    const res = await request(app)
      .get("/events/findEvent/nonexistentId")

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Event not found");
  });

  it("debería retornar 500 si hay un error interno al buscar un evento", async () => {
    (eventService.findById as jest.Mock).mockRejectedValue(new Error("DB error"));

    const res = await request(app)
      .get(`/events/findEvent/${mockEvent.id}`)
      .set("Authorization", "Bearer token");

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Event not found");
  });

  it("debería retornar todos los eventos", async () => {
    (eventService.getAll as jest.Mock).mockResolvedValue([mockEvent]);

    const res = await request(app).get("/events");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it("debería retornar 500 si hay un error interno al obtener eventos", async () => {
    (eventService.getAll as jest.Mock).mockRejectedValue(new Error("DB error"));

    const res = await request(app).get("/events");
    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Events not found");
  });

  ////

  it("debería devolver el evento si el usuario es 'eventmanager' y es el dueño", async () => {
    (securityService.getClaims as jest.Mock).mockResolvedValue({ role: "eventmanager", _id: "user123" });
    (eventService.findById as jest.Mock).mockResolvedValue(mockEvent1);

    const res = await request(app)
        .get("/events/findEvent/event123")
        .set("Authorization", "Bearer token");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockEvent1);
});

it("debería devolver 403 si el usuario es 'eventmanager' pero no es el dueño", async () => {
    (securityService.getClaims as jest.Mock).mockResolvedValue({ role: "eventmanager", _id: "otherUser" });
    (eventService.findById as jest.Mock).mockResolvedValue(mockEvent1);

    const res = await request(app)
        .get("/events/findEvent/event123")
        .set("Authorization", "Bearer token");

    expect(res.status).toBe(403);
    expect(res.body).toEqual({ message: "Access denied. Event managers can only view their own events." });
});

it("debería devolver el evento si el usuario tiene otro rol", async () => {
    (securityService.getClaims as jest.Mock).mockResolvedValue({ role: "admin", _id: "adminUser" });
    (eventService.findById as jest.Mock).mockResolvedValue(mockEvent1);

    const res = await request(app)
        .get("/events/findEvent/event123")
        .set("Authorization", "Bearer token");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockEvent1);
});

it("debería devolver 404 si el evento no existe", async () => {
    (securityService.getClaims as jest.Mock).mockResolvedValue({ role: "eventmanager", _id: "user123" });
    (eventService.findById as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
        .get("/events/findEvent/event123")
        .set("Authorization", "Bearer token");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "Event not found" });
});

///

it("debería devolver los eventos si el usuario es 'eventmanager'", async () => {
  (securityService.getClaims as jest.Mock).mockResolvedValue({ role: "eventmanager", _id: "user123" });
  (eventService.findAllById as jest.Mock).mockResolvedValue(mockEvents);

  const res = await request(app)
      .get("/events/findAllById/user123")
      .set("Authorization", "Bearer token");

  expect(res.status).toBe(200);
  expect(res.body).toEqual(mockEvents);
});

it("debería devolver 403 si el usuario no es 'eventmanager'", async () => {
  (securityService.getClaims as jest.Mock).mockResolvedValue({ role: "admin", _id: "user123" });

  const res = await request(app)
      .get("/events/findAllById/user123")
      .set("Authorization", "Bearer token");

  expect(res.status).toBe(403);
  expect(res.body).toEqual({ message: "Access denied. Only event managers can view their own events." });
});

it("debería devolver 500 si el servicio de eventos falla", async () => {
  (securityService.getClaims as jest.Mock).mockResolvedValue({ role: "eventmanager", _id: "user123" });
  (eventService.findAllById as jest.Mock).mockRejectedValue(new Error("Database error"));

  const res = await request(app)
      .get("/events/findAllById/user123")
      .set("Authorization", "Bearer token");

  expect(res.status).toBe(500);
  expect(res.body).toEqual({ message: "Events not found" });
});

it("debería devolver un array vacío si no hay eventos para el usuario", async () => {
  (securityService.getClaims as jest.Mock).mockResolvedValue({ role: "eventmanager", _id: "user123" });
  (eventService.findAllById as jest.Mock).mockResolvedValue([]);

  const res = await request(app)
      .get("/events/findAllById/user123")
      .set("Authorization", "Bearer token");

  expect(res.status).toBe(200);
  expect(res.body).toEqual([]);
});

/////

it("debería actualizar el evento si el usuario es 'eventmanager' y el evento pertenece al usuario", async () => {
  (securityService.getClaims as jest.Mock).mockResolvedValue({ role: "eventmanager", _id: "user123" });
  (eventService.findById as jest.Mock).mockResolvedValue(mockEvent);
  (eventService.updateEvent as jest.Mock).mockResolvedValue(updatedEvent);

  const res = await request(app)
      .put("/events/update/event123")
      .set("Authorization", "Bearer token")
      .send({ name: "Updated Event", description: "Updated description" });

  expect(res.status).toBe(200);
  expect(res.body).toEqual(updatedEvent);
});

it("debería devolver 403 si el usuario no es 'eventmanager'", async () => {
  (securityService.getClaims as jest.Mock).mockResolvedValue({ role: "admin", _id: "user123" });

  const res = await request(app)
      .put("/events/update/event123")
      .set("Authorization", "Bearer token")
      .send({ name: "Updated Event", description: "Updated description" });

  expect(res.status).toBe(403);
  expect(res.body).toEqual({ message: "Access denied. Only event managers can update events." });
});

it("debería devolver 403 si el evento no existe o no pertenece al usuario", async () => {
  (securityService.getClaims as jest.Mock).mockResolvedValue({ role: "eventmanager", _id: "user123" });
  (eventService.findById as jest.Mock).mockResolvedValue(null); // Simulamos que el evento no existe

  const res = await request(app)
      .put("/events/update/event123")
      .set("Authorization", "Bearer token")
      .send({ name: "Updated Event", description: "Updated description" });

  expect(res.status).toBe(403);
  expect(res.body).toEqual({ message: "Access denied. You can only update your own events." });
});

it("debería devolver 500 si el servicio de eventos falla", async () => {
  (securityService.getClaims as jest.Mock).mockResolvedValue({ role: "eventmanager", _id: "user123" });
  (eventService.findById as jest.Mock).mockResolvedValue(mockEvent);
  (eventService.updateEvent as jest.Mock).mockRejectedValue(new Error("Database error"));

  const res = await request(app)
      .put("/events/update/event123")
      .set("Authorization", "Bearer token")
      .send({ name: "Updated Event", description: "Updated description" });

  expect(res.status).toBe(500);
  expect(res.body).toEqual({ message: "Event hasn't been updated" });
});

  
});
