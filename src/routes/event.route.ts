import { Router } from 'express';
import { eventController } from '../controllers';
import { auth, authorizeRoles } from '../middlewares/auth.middleware';

export const eventRouter = Router();

eventRouter.get('/', eventController.findAll);
eventRouter.get('/findEvent/:id', eventController.findById);
eventRouter.post('/create', auth, authorizeRoles(['event-manager', 'superadmin']), eventController.create); 
eventRouter.put('/update/:id', auth, authorizeRoles(['event-manager', 'superadmin']), eventController.update);
eventRouter.delete('/delete/:id', auth, authorizeRoles(['event-manager', 'superadmin']), eventController.delete);
