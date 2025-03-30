import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

class SecurityService {
    /**
     * Hashes a password using bcrypt.
     * 
     * @param password - The plain text password to be encrypted.
     * @returns The hashed password.
     */
    async encryptPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    /**
     * Generates a JWT token for authentication.
     * 
     * @param _id - The user's unique identifier.
     * @param email - The user's email.
     * @param role - The user's role.
     * @returns A signed JWT token with a 1-hour expiration time.
     */
    async generateToken(_id: mongoose.Types.ObjectId, email: string, role: string): Promise<string> {
        return await jwt.sign({ _id, email, role }, 'secret', { expiresIn: '1h' });
    }

    /**
     * Compares a plain text password with a hashed password.
     * 
     * @param password - The plain text password provided by the user.
     * @param currentPassword - The hashed password stored in the database.
     * @returns `true` if the passwords match, otherwise `false`.
     */
    async comparePasswords(password: string, currentPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, currentPassword);
    }

    /**
     * Extracts claims from a JWT token.
     * 
     * @param token - The JWT token containing user claims.
     * @returns An object containing `_id`, `email`, and `role` extracted from the token.
     * @throws Will throw an error if the token is invalid.
     */
    async getClaims(token: string): Promise<{ _id: string; email: string; role: string }> {
        try {
            if (token.startsWith("Bearer ")) {
                token = token.slice(7);
            }
            return jwt.verify(token, 'secret') as { _id: string; email: string; role: string };
        } catch (error) {
            throw error;
        }
    }
}

export const securityService = new SecurityService();
