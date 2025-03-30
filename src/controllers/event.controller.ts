import { Request, Response } from 'express';
import { eventService } from '../services';
import { EventDocument, EventInput } from '../models';

/**
 * Controller for handling event-related operations.
 */
class EventController {

    /**
     * Creates a new event.
     * @param req - Express request object containing event data in the body.
     * @param res - Express response object.
     * @returns A JSON response with the created event or an error message.
     */
    async create(req: Request, res: Response): Promise<void> {
        try {
            const { name, bannerPhotoUrl, isPublic, userId } = req.body;
            
            // Validation for required fields
            if (!name || !bannerPhotoUrl || isPublic === undefined || !userId) {
                res.status(400).json({ message: "Missing required fields: name, bannerPhotoUrl, isPublic, or userId" });
                return;
            }
    
            // Type validation for isPublic
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
    
    /**
     * Finds an event by its ID.
     * @param req - Express request object containing the event ID in the parameters.
     * @param res - Express response object.
     * @returns A JSON response with the event data or an error message.
     */
    async findById(req: Request, res: Response): Promise<void> {
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
    
    /**
     * Retrieves all events.
     * @param req - Express request object.
     * @param res - Express response object.
     * @returns A JSON response with an array of events or an error message.
     */
    async findAll(req: Request, res: Response): Promise<void> {
        try {
            const events: EventDocument[] = await eventService.getAll();
            res.json(events);
            return;
        } catch (error) {
            res.status(500).json({ message: "Events not found" });
            return;
        }
    }

    /**
     * Updates an event by its ID.
     * @param req - Express request object containing the event ID in the parameters and new data in the body.
     * @param res - Express response object.
     * @returns A JSON response with the updated event or an error message.
     */
    async update(req: Request, res: Response): Promise<void> {
        try {
            const event: EventDocument = await eventService.updateEvent(req.params.id, req.body);
            res.json(event);
            return;
        } catch (error) {
            res.status(500).json({ message: "Event hasn't been updated" });
            return;
        }
    }

    /**
     * Deletes an event by its ID.
     * @param req - Express request object containing the event ID in the parameters.
     * @param res - Express response object.
     * @returns A JSON response confirming deletion or an error message.
     */
    async delete(req: Request, res: Response): Promise<void> {
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

/**
 * Instance of EventController for handling event routes.
 */
export const eventController = new EventController();
