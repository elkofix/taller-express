import request from "supertest";
import { app } from "../../index";
import { userService } from "../../services";
import { securityService } from "../../services";
import { Server } from "http";

jest.mock("../../services/user.service");
jest.mock("../../services/security.service");
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

describe("UserController", () => {
  process.env.NODE_ENV = "test";
  let server: Server;
  const mockUser = {
    id: "12345",
    name: "Test",
    lastname: "User",
    email: "test@example.com",
    password: "hashedPassword",
    role: "user",
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

  it("debería crear un usuario exitosamente", async () => {
    (userService.findByEmail as jest.Mock).mockResolvedValue(null);
    (securityService.encryptPassword as jest.Mock).mockResolvedValue("encryptedPassword");
    (userService.create as jest.Mock).mockResolvedValue(mockUser);

    const res = await request(app)
      .post("/user")
      .send({
        name: "Test",
        lastname: "User",
        email: mockUser.email,
        password: "123456",
        role: "user",
        isActive: true,
      });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe(mockUser.email);
  });

  it("debería retornar 400 si el usuario ya existe", async () => {
    (userService.findByEmail as jest.Mock).mockResolvedValue(mockUser);

    const res = await request(app)
      .post("/user")
      .send({
        email: mockUser.email,
        password: "123456",
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe(`The user ${mockUser.email} already exists!`);
  });

  it("debería retornar 500 si hay un error interno al crear usuario", async () => {
    (userService.findByEmail as jest.Mock).mockRejectedValue(new Error("DB error"));
    const res = await request(app)
      .post("/user")
      .send({
        email: "test@example.com",
        password: "123456",
      });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("The user hasn't been created");
  });

  it("debería retornar todos los usuarios", async () => {
    (userService.getAll as jest.Mock).mockResolvedValue([mockUser]);
    (securityService.getClaims as jest.Mock).mockResolvedValue({ role: "superadmin" });

    const res = await request(app).get("/user");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].email).toBe(mockUser.email);
  });


  it("debería retornar 500 si hay un error interno al obtener los usuarios", async () => {
    (userService.getAll as jest.Mock).mockRejectedValue(new Error("DB error"));
    
    const res = await request(app).get("/user");
    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Cannot get the users");
  });

  it("debería retornar solo un usuario", async () => {
    (userService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
    (securityService.getClaims as jest.Mock).mockResolvedValue({ role: "user" });

    const res = await request(app).get("/user");

    expect(res.status).toBe(200);
    expect(res.body.email).toBe(mockUser.email);
  });


  it("debería retornar 404 si el usuario del perfil no se encuentra ", async () => {
    (userService.findByEmail as jest.Mock).mockResolvedValue(null);
    (securityService.getClaims as jest.Mock).mockResolvedValue({ role: "user" });

    const res = await request(app).get("/user");

    expect(res.status).toBe(404);
  });


  it("debería actualizar un usuario exitosamente", async () => {
    (userService.updateUser as jest.Mock).mockResolvedValue(mockUser);

    const res = await request(app)
      .put(`/user/${mockUser.email}`)
      .send({ name: "Updated Name" });

    expect(res.status).toBe(200);
    expect(res.body.email).toBe(mockUser.email);
  });

  it("debería retornar 404 si el usuario no existe al actualizar", async () => {
    (userService.updateUser as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .put(`/user/nonexistent@example.com`)
      .send({ name: "Updated Name" });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("User nonexistent@example.com not found.");
  });

  it("debería retornar 500 si hay un error interno al actualizar usuario", async () => {
    (userService.updateUser as jest.Mock).mockRejectedValue(new Error("DB error"));

    const res = await request(app)
      .put(`/user/${mockUser.email}`)
      .send({ name: "Updated Name" });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe(`The user ${mockUser.email} cannot be updated.`);
  });

  it("debería retornar 200 si se elimina al usuario satisfactoriamente", async () => {
    (userService.deleteUser as jest.Mock).mockResolvedValue(mockUser);

    const res = await request(app)
      .delete(`/user/${mockUser.email}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe(`User ${mockUser.email} has been deactivated.`);
  });

  it("debería retornar 404 si no se encuentra el usuario y no se elimina al usuario satisfactoriamente", async () => {
    (userService.deleteUser as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .delete(`/user/${mockUser.email}`);
      
    expect(res.status).toBe(404);
    expect(res.body.message).toBe(`User ${mockUser.email} not found.`);
  });


  it("debería retornar 500 hay un error al eliminar al usuario satisfactoriamente", async () => {
    (userService.deleteUser as jest.Mock).mockRejectedValue(new Error("DB error"));

    const res = await request(app)
      .delete(`/user/${mockUser.email}`);
      
    expect(res.status).toBe(500);
  });


});


