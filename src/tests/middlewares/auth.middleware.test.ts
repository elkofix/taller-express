import request from 'supertest';
import jwt from 'jsonwebtoken';

import express, { Request, Response, NextFunction } from 'express';
import { auth, authorizeRoles } from '../../middlewares/auth.middleware';

jest.mock('jsonwebtoken');

const app = express();
app.use(express.json());

app.get('/protected', auth, (req: Request, res: Response) => {
    res.status(200).json({ message: 'Access granted' });
});

app.get('/admin', auth, authorizeRoles(["superadmin"]), (req: Request, res: Response) => {
    res.status(200).json({ message: 'Admin access granted' });
});

describe('Auth Middleware', () => {
    it('should return 401 if no token is provided', async () => {
        const response = await request(app).get('/protected');
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Unauthorized');
    });

    it('should return 500 if token verification fails', async () => {
        (jwt.verify as jest.Mock).mockImplementation(() => {
            throw new Error('Invalid token');
        });

        const response = await request(app)
            .get('/protected')
            .set('Authorization', 'Bearer invalidtoken');

        expect(response.status).toBe(500);
    });

    it('should call next if token is valid', async () => {
        const mockUser = { id: 1, role: "user" };
        (jwt.verify as jest.Mock).mockReturnValue(mockUser);

        const response = await request(app)
            .get('/protected')
            .set('Authorization', 'Bearer validtoken');

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Access granted');
    });
});

describe('Authorize Roles Middleware', () => {
    it('should return 403 if user role is not authorized', async () => {
        const mockUser = { id: 1, role: "user" };
        (jwt.verify as jest.Mock).mockReturnValue(mockUser);

        const response = await request(app)
            .get('/admin')
            .set('Authorization', 'Bearer validtoken');

        expect(response.status).toBe(403);
        expect(response.body.message).toContain('Forbidden');
    });

    it('should call next if user role is authorized', async () => {
        const mockUser = { id: 1, role: "superadmin" };
        (jwt.verify as jest.Mock).mockReturnValue(mockUser);

        const response = await request(app)
            .get('/admin')
            .set('Authorization', 'Bearer validtoken');

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Admin access granted');
    });
});