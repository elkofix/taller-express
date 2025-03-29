import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { securityService } from "../../services";

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("SecurityService", () => {
    const mockPassword = "testPassword";
    const mockHash = "hashedPassword";
    const mockId = new mongoose.Types.ObjectId();
    const mockEmail = "test@example.com";
    const mockRole = "user";
    const mockToken = "jwtToken";

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should encrypt password", async () => {
        (bcrypt.hash as jest.Mock).mockResolvedValue(mockHash);
        
        const result = await securityService.encryptPassword(mockPassword);
        expect(bcrypt.hash).toHaveBeenCalledWith(mockPassword, 10);
        expect(result).toBe(mockHash);
    });

    test("should generate JWT token", async () => {
        (jwt.sign as jest.Mock).mockReturnValue(mockToken);
        
        const result = await securityService.generateToken(mockId, mockEmail, mockRole);
        expect(jwt.sign).toHaveBeenCalledWith(
            { _id: mockId, email: mockEmail, role: mockRole },
            "secret",
            { expiresIn: "1h" }
        );
        expect(result).toBe(mockToken);
    });

    test("should compare passwords correctly", async () => {
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        
        const result = await securityService.comparePasswords(mockPassword, mockHash);
        expect(bcrypt.compare).toHaveBeenCalledWith(mockPassword, mockHash);
        expect(result).toBe(true);
    });
});
