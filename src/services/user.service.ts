import { UserDocument, UserInput, UserModel } from '../models/user.model';

class UserService {
    /**
     * Creates a new user in the database.
     * 
     * @param data - The user data to be stored.
     * @returns The created user document.
     * @throws Will throw an error if user creation fails.
     */
    async create(data: UserDocument): Promise<UserDocument> {
        try {
            const user = await UserModel.create(data);
            return user;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Finds a user by email.
     * 
     * @param email - The email of the user to find.
     * @returns The user document if found, otherwise `null`.
     * @throws Will throw an error if the query fails.
     */
    async findByEmail(email: string): Promise<UserDocument | null> {
        try {
            const user = await UserModel.findOne({ email: email });
            return user;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Retrieves all active users.
     * 
     * @returns An array of active user documents.
     * @throws Will throw an error if the query fails.
     */
    async getAll(): Promise<UserDocument[]> {
        try {
            const users: UserDocument[] = await UserModel.find({ isActive: true });
            return users;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    /**
     * Updates a user's information by email.
     * 
     * @param email - The email of the user to update.
     * @param user - The updated user data.
     * @returns The updated user document or `null` if the user was not found.
     * @throws Will throw an error if the update fails.
     */
    async updateUser(email: string, user: UserInput): Promise<UserDocument | null> {
        try {
            const updatedUser: UserDocument | null = await UserModel.findOneAndUpdate(
                { email: email },
                user,
                { returnOriginal: false }
            );
            if (updatedUser) {
                updatedUser.password = "";
            }
            return updatedUser;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Soft deletes a user by setting `isActive` to `false`.
     * 
     * @param email - The email of the user to deactivate.
     * @returns The updated user document if found, otherwise `null`.
     * @throws Will throw an error if the deletion fails.
     */
    async deleteUser(email: string): Promise<UserDocument | null> {
        try {
            const updatedUser: UserDocument | null = await UserModel.findOneAndUpdate(
                { email: email },
                { isActive: false },
                { returnOriginal: false }
            );
            return updatedUser;
        } catch (error) {
            throw error;
        }
    }
}

export const userService = new UserService();
