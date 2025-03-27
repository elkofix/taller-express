import request from "supertest";
import { app } from "../../index"; 
import { userService } from "../../services";
import { securityService } from "../../services";
import { Server } from "http";

jest.mock("../../services/user.service");
jest.mock("../../services/security.service");

describe("AuthController - Login", () => {
  process.env.NODE_ENV = "test"
  let server: Server;
  const mockUser = {
    id: "12345",
    email: "test@example.com",
    password: "hashedPassword",
    role: "user",
  };

  beforeAll(async () => {
    process.env.NODE_ENV = "test"
    server = app.listen(4000, () => console.log("Test server running on port 4000"));
});


  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    if (server) {
        await new Promise(resolve => server.close(resolve));
    }
});


  it("debería retornar 400 si el usuario no existe", async () => {
    (userService.findByEmail as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "notfound@example.com", password: "123456" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("user notfound@example.com not found.");
  });

  it("debería retornar 400 si la contraseña es incorrecta", async () => {
    (userService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
    (securityService.comparePasswords as jest.Mock).mockResolvedValue(false);

    const res = await request(app)
      .post("/auth/login")
      .send({ email: mockUser.email, password: "wrongpassword" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("User or password incorrect");
  });

  it("debería retornar 200 y un token si el login es exitoso", async () => {
    (userService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
    (securityService.comparePasswords as jest.Mock).mockResolvedValue(true);
    (securityService.generateToken as jest.Mock).mockResolvedValue("fake-jwt-token");

    const res = await request(app)
      .post("/auth/login")
      .send({ email: mockUser.email, password: "123456" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("login successfull");
    expect(res.body.token).toBe("fake-jwt-token");
  });

  it("debería manejar errores internos con código 500", async () => {
    (userService.findByEmail as jest.Mock).mockRejectedValue(new Error("DB error"));

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "test@example.com", password: "123456" });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Login incorrect");
  });
});
