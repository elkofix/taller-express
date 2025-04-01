import { Request, Response } from 'express';
import { eventService, securityService } from '../services';
import { EventDocument } from '../models';

class EventController {
    /**
     * Creates a new event. Only accessible to event managers.
     * @param req - Express request object containing event data in the body.
     * @param res - Express response object.
     * @returns A JSON response with the created event or an error message.
     */
    async create(req: Request, res: Response): Promise<void> {
        try {
            const claims = await securityService.getClaims(req.headers.authorization!);
            if (claims.role !== "eventmanager") {
                res.status(403).json({ message: "Access denied. Only event managers can create events." });
                return;
            }
            
            const event: EventDocument = await eventService.create({ ...req.body, userId: claims._id });
            res.status(201).json(event);
        } catch (error) {
            res.status(500).json({ message: "Event hasn't been created" });
        }
    }

    /**
     * Finds an event by its ID. Event managers can only view their own events.
     * @param req - Express request object containing the event ID in the parameters.
     * @param res - Express response object.
     * @returns A JSON response with the event data or an error message.
     */
    async findById(req: Request, res: Response): Promise<void> {
        try {
            const claims = await securityService.getClaims(req.headers.authorization!);
            const event: EventDocument | null = await eventService.findById(req.params.id);
            
            if (!event) {
                res.status(404).json({ message: "Event not found" });
                return;
            }
            
            if (claims.role === "eventmanager" && event.userId !== claims._id) {
                res.status(403).json({ message: "Access denied. Event managers can only view their own events." });
                return;
            }
            
            res.json(event);
        } catch (error) {
            res.status(500).json({ message: "Event not found" });
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
     * Finds all events related to a specific user.
     * @param req - Express request object containing the user ID in the parameters.
     * @param res - Express response object.
     * @returns A JSON response with an array of events or an error message.
     */
    async findByUserId(req: Request, res: Response): Promise<void> {
        try {
            const claims = await securityService.getClaims(req.headers.authorization!);
            if (claims.role !== "eventmanager") {
                res.status(403).json({ message: "Access denied. Only event managers can view their own events." });
                return;
            }
            
            const events: EventDocument[] = await eventService.findAllById(req.params.id);
            res.json(events);
        } catch (error) {
            res.status(500).json({ message: "Events not found" });
        }
    }

    /**
     * Updates an event by its ID. Only the event owner (event manager) can update their own events.
     * @param req - Express request object containing the event ID in the parameters and new data in the body.
     * @param res - Express response object.
     * @returns A JSON response with the updated event or an error message.
     */
    async update(req: Request, res: Response): Promise<void> {
        try {
            const claims = await securityService.getClaims(req.headers.authorization!);
            if (claims.role !== "eventmanager") {
                res.status(403).json({ message: "Access denied. Only event managers can update events." });
                return;
            }
            
            const event: EventDocument | null = await eventService.findById(req.params.id);
            if (!event || event.userId !== claims._id) {
                res.status(403).json({ message: "Access denied. You can only update your own events." });
                return;
            }
            
            const updatedEvent = await eventService.updateEvent(req.params.id, req.body);
            res.json(updatedEvent);
        } catch (error) {
            res.status(500).json({ message: "Event hasn't been updated" });
        }
    }

    /**
     * Deletes an event by its ID. Only the event owner (event manager) can delete their own events.
     * @param req - Express request object containing the event ID in the parameters.
     * @param res - Express response object.
     * @returns A JSON response confirming deletion or an error message.
     */
    async delete(req: Request, res: Response): Promise<void> {
        try {
            const claims = await securityService.getClaims(req.headers.authorization!);
            if (claims.role !== "eventmanager") {
                res.status(403).json({ message: "Access denied. Only event managers can delete events." });
                return;
            }
            
            const event: EventDocument | null = await eventService.findById(req.params.id);
            if (!event || event.userId !== claims._id) {
                res.status(403).json({ message: "Access denied. You can only delete your own events." });
                return;
            }
            
            await eventService.deleteEvent(req.params.id);
            res.json({ message: "Event deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Event hasn't been deleted" });
        }
    }
}


export const eventController = new EventController();