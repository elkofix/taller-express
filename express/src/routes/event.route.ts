import { Router } from 'express';
import { eventController } from '../controllers';
import { auth, authorizeRoles } from '../middlewares/auth.middleware';

export const eventRouter = Router();

eventRouter.get('/', eventController.findAll);
eventRouter.get('/findEvent/:id', eventController.findById);
eventRouter.post('/create', eventController.create); // cambiar rol apenas esten los de user 
eventRouter.put('/update/:id', eventController.update);
eventRouter.delete('/delete/:id', eventController.delete);