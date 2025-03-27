import { Request, Response } from 'express';
import { eventService } from '../services';
import { EventDocument, EventInput } from '../models';

class EventController{

    async create(req: Request, res: Response){
        try{
            const { name, bannerPhotoUrl, isPublic, userId } = req.body;
            if (!name || !bannerPhotoUrl || isPublic === undefined || !userId) {
                res.status(400).json({ message: "Missing required fields: name, bannerPhotoUrl, isPublic, or userId" });
                return;
            }
    
            const event: EventDocument = await eventService.create(req.body);
            res.status(201).json(event);
            return;
        }catch(error){
            res.status(500).json({message: "Event hasn't been created"});
            return;
        }
    }

    async findById(req: Request, res: Response){
        try{
            const event: EventDocument = await eventService.findById(req.params.id);
            res.json(event);
        }catch(error){
            res.status(500).json({message: "Event not found"});
        }
    }

    async findAll(req: Request, res: Response){
        try{
            const events: EventDocument[] = await eventService.getAll();
            res.json(events);
        }catch(error){
            res.status(500).json({message: "Events not found"});
        }
    }

    async update(req: Request, res: Response){
        try{
            const event: EventDocument = await eventService.updateEvent(req.params.id, req.body);
            res.json(event);
        }catch(error){
            res.status(500).json({message: "Event hasn't been updated"});
        }
    }

    async delete(req: Request, res: Response){
        try{
            const event: EventDocument = await eventService.deleteEvent(req.params.id);
            res.json(event);
        }catch(error){
            res.status(500).json({message: "Event hasn't been deleted"});
        }
    }

}

export const eventController = new EventController();