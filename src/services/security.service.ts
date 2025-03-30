import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

class SecurityService{

    async encryptPassword (password: string){
        return await bcrypt.hash(password, 10);
    }

    async generateToken(_id: mongoose.Types.ObjectId, email: string, role: string){
        return await jwt.sign({_id, email, role}, 'secret', { expiresIn: '1h'});
    }

    async comparePasswords( password: string, currentPassword: string){
        return await bcrypt.compare(password, currentPassword);
    }

    async getClaims(token: string): Promise<{_id: string, email: string, role: string}> {
        try {
            if (token.startsWith("Bearer ")) {
                token = token.slice(7); 
            }
            return jwt.verify(token, 'secret') as {_id: string, email: string, role: string}; 
        } catch (error) {
            throw error
        }
    }
    
    
}

export const securityService = new SecurityService();