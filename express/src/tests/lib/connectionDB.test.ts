import mongoose from "mongoose";
import { db } from "../../lib/connectionDB";

jest.mock("mongoose", () => ({
  connect: jest.fn(),
}));

describe("Database Connection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not connect to MongoDB in test environment", async () => {
    process.env.NODE_ENV = "test";
    const result = await db;
    expect(result).toBe("Test DB Mocked");
  });

  it("should call mongoose.connect with correct parameters", async () => {
    process.env.NODE_ENV = "development";
    (mongoose.connect as jest.Mock).mockResolvedValueOnce({});
    
    await db;

    expect(mongoose.connect).toHaveBeenCalledWith(expect.any(String), { dbName: "compunet03" });
  });

  it("should handle MongoDB connection failure", async () => {
    process.env.NODE_ENV = "development";
    (mongoose.connect as jest.Mock).mockRejectedValueOnce(new Error("Connection Failed"));
    await expect(db).rejects.toThrow("Connection Failed");
  });
});
