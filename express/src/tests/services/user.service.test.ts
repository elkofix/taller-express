
import mongoose from "mongoose";
import { UserDocument, UserInput, UserModel } from "../../models";
import { userService } from "../../services";

jest.mock("../../models/user.model");

describe("UserService", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockUser: UserDocument = {
        _id: new mongoose.Types.ObjectId(),
        name: "John",
        lastname: "Doe",
        email: "john@example.com",
        password: "hashedpassword",
        role: "user",
        isActive: true,
    } as UserDocument;

    test("should create a user", async () => {
        (UserModel.create as jest.Mock).mockResolvedValue(mockUser);

        const user = await userService.create(mockUser);
        expect(UserModel.create).toHaveBeenCalledWith(mockUser);
        expect(user).toEqual(mockUser);
    });

    test("should find a user by email", async () => {
        (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);

        const user = await userService.findByEmail("john@example.com");
        expect(UserModel.findOne).toHaveBeenCalledWith({ email: "john@example.com" });
        expect(user).toEqual(mockUser);
    });

    test("should return all users", async () => {
        (UserModel.find as jest.Mock).mockResolvedValue([mockUser]);

        const users = await userService.getAll();
        expect(UserModel.find).toHaveBeenCalled();
        expect(users).toEqual([mockUser]);
    });

    test("should update a user", async () => {
        const updatedUser = { ...mockUser, name: "Updated Name" };
        (UserModel.findOneAndUpdate as jest.Mock).mockResolvedValue(updatedUser);

        const result = await userService.updateUser("john@example.com", { name: "Updated Name" } as UserInput);
        expect(UserModel.findOneAndUpdate).toHaveBeenCalledWith(
            { email: "john@example.com" },
            { name: "Updated Name" },
            { returnOriginal: false }
        );
        expect(result).toEqual(updatedUser);
    });
});
