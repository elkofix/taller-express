import { Request, Response } from "express";
import { securityService, userService } from "../services";
import { UserDocument, UserInput } from "../models";

class AuthController {
    /**
     * Handles user authentication.
     * 
     * @param req - Express request object containing the user's email and password.
     * @param res - Express response object to send the authentication result.
     * 
     * @description
     * 1. Receives the user email and password from the request body.
     * 2. Checks if the user exists in the database.
     * 3. Compares the entered password with the stored one.
     * 4. If correct, generates an authentication token and sends it in the response.
     * 
     * @returns Returns a JSON response with the authentication status and token if successful.
     */
    async login(req: Request, res: Response) {
        try {
            // Find user by email
            const user: UserDocument | null = await userService.findByEmail(req.body.email);
            if (!user) {
                res.status(400).json({ message: `User ${req.body.email} not found.` });
                return;
            }
            
            // Compare passwords
            const isMatch = await securityService.comparePasswords(req.body.password, user.password);
            if (!isMatch) {
                res.status(400).json({ message: `User or password incorrect` });
                return;
            }
            
            // Generate authentication token
            const token = await securityService.generateToken(user.id, user.email, user.role);
            res.status(200).json({
                message: "Login successful",
                token: token
            });
            return;
        } catch (error) {
            res.status(500).json({ message: "Login incorrect" });
            return;
        }
    }
}

export const authController = new AuthController();