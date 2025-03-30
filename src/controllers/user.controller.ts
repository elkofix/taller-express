import { Request, Response } from "express";
import { securityService, userService } from "../services";
import { UserDocument, UserInput } from "../models";

class UserController {
    /**
     * Creates a new user.
     * 
     * @param req - Express request object containing user details.
     * @param res - Express response object to send the created user data.
     * 
     * @returns Returns a JSON response with the newly created user or an error message.
     */
    async create(req: Request, res: Response) {
        try {
            const userExist: UserDocument | null = await userService.findByEmail(req.body.email);

            if (userExist) {
                res.status(400).json({ message: `The user ${req.body.email} already exists!` });
                return;
            }

            req.body.password = await securityService.encryptPassword(req.body.password);
            const user: UserDocument = await userService.create(req.body);
            res.status(201).json(user);
            return;
        } catch (error) {
            res.status(500).json({ message: "The user hasn't been created" });
            return;
        }
    }

    /**
     * Retrieves all users or a specific user based on role.
     * 
     * @param req - Express request object containing authorization headers.
     * @param res - Express response object to send the retrieved user(s).
     * 
     * @returns Returns a JSON response with user data or an error message.
     */
    async findAll(req: Request, res: Response) {
        try {
            const claims = await securityService.getClaims(req.headers.authorization!);
            if (claims.role === "superadmin") {
                const users: UserDocument[] = await userService.getAll();
                res.json(users);
                return;
            } else {
                const user: UserDocument | null = await userService.findByEmail(claims.email);
                if (!user) {
                    res.status(404).json({ message: `User with email ${claims.email} not found` });
                    return;
                }
                res.status(200).json(user);
                return;
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Cannot get the users" });
            return;
        }
    }

    /**
     * Deletes a user by email.
     * 
     * @param req - Express request object containing user email in params.
     * @param res - Express response object to send the deletion status.
     * 
     * @returns Returns a JSON response confirming deactivation or an error message.
     */
    async delete(req: Request, res: Response) {
        try {
            const email: string = req.params.email;
            const user: UserDocument | null = await userService.deleteUser(email);

            if (!user) {
                res.status(404).json({ message: `User ${email} not found.` });
                return;
            }

            res.json({ message: `User ${email} has been deactivated.` });
            return;
        } catch (error) {
            res.status(500).json({ message: `The user ${req.params.email} cannot be deleted.` });
            return;
        }
    }

    /**
     * Updates a user's information.
     * 
     * @param req - Express request object containing user email in params and update data in body.
     * @param res - Express response object to send the updated user data.
     * 
     * @returns Returns a JSON response with the updated user or an error message.
     */
    async update(req: Request, res: Response) {
        try {
            const email: string = req.params.email;
            const user: UserDocument | null = await userService.updateUser(email, req.body as UserInput);
            if (user === null) {
                res.status(404).json({ message: `User ${email} not found.` });
                return;
            }
            res.json(user);
            return;
        } catch (error) {
            res.status(500).json({ message: `The user ${req.params.email} cannot be updated.` });
            return;
        }
    }
}

export const userController = new UserController();