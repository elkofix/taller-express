import { Request, Response } from 'express';
import { eventService } from '../services';
import { EventDocument, EventInput } from '../models';

class EventController{

    async create(req: Request, res: Response) {
        try {
            const { name, bannerPhotoUrl, isPublic, userId } = req.body;
            
            if (!name || !bannerPhotoUrl || isPublic === undefined || !userId) {
                res.status(400).json({ message: "Missing required fields: name, bannerPhotoUrl, isPublic, or userId" });
                return;
            }
    
            // Nueva validación para isPublic
            if (typeof isPublic !== "boolean") {
                res.status(400).json({ message: "isPublic must be a boolean" });
                return;
            }
    
            const event: EventDocument = await eventService.create(req.body);
            res.status(201).json(event);
            return;

        } catch (error) {
            res.status(500).json({ message: "Event hasn't been created" });
            return;

        }
    }
    

    async findById(req: Request, res: Response) {
        try {
            const event: EventDocument | null = await eventService.findById(req.params.id);
            
            if (!event) {
                res.status(404).json({ message: "Event not found" });
                return;
            }
    
            res.json(event);
            return;
        } catch (error) {
            res.status(500).json({ message: "Event not found" });
            return;
        }
    }
    

    async findAll(req: Request, res: Response){
        try{
            const events: EventDocument[] = await eventService.getAll();
            res.json(events);
            return;
        }catch(error){
            res.status(500).json({message: "Events not found"});
            return;
        }
    }

    async update(req: Request, res: Response){
        try{
            const event: EventDocument = await eventService.updateEvent(req.params.id, req.body);
            res.json(event);
            return;
        }catch(error){
            res.status(500).json({message: "Event hasn't been updated"});
            return;
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const event: EventDocument | null = await eventService.deleteEvent(req.params.id);
    
            if (!event) {
                res.status(404).json({ message: "Event not found" });
                return;
            }
    
            res.json(event);
            return;
        } catch (error) {
            res.status(500).json({ message: "Event hasn't been deleted" });
            return;
        }
    }
    

}

export const eventController = new EventController();