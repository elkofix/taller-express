import { EventDocument, EventInput, EventModel } from '../models';

/**
 * Service class for handling event-related operations.
 */
class EventService {
    
    /**
     * Creates a new event.
     * @param data - Event input data.
     * @returns The created event document.
     */
    async create(data: EventInput): Promise<EventDocument> {
        try {
            const event = await EventModel.create(data);
            const msg = `Event ${event.name} created successfully`;
            console.log(msg);
            return event;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Finds an event by its ID.
     * @param id - The event ID.
     * @returns The found event document or throws an error if not found.
     */
    async findById(id: string): Promise<EventDocument> {
        try {
            const event = await EventModel.findById(id);
            if (!event) {
                throw new Error(`Event not found with id ${id}`);
            }
            const msg = `Event ${event.name} found successfully`;
            console.log(msg);
            return event;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Retrieves all events.
     * @returns An array of all event documents.
     */
    async getAll(): Promise<EventDocument[]> {
        try {
            const events: EventDocument[] = await EventModel.find();
            const msg = `Found ${events.length} events`;
            console.log(msg);
            return events;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    /**
     * Updates an event by its ID.
     * @param id - The event ID.
     * @param event - The updated event data.
     * @returns The updated event document or throws an error if not found.
     */
    async updateEvent(id: string, event: EventInput): Promise<EventDocument> {
        try {
            const updatedEvent: EventDocument | null = await EventModel.findOneAndUpdate(
                { _id: id },
                event,
                { returnOriginal: false }
            );
    
            if (!updatedEvent) {
                throw new Error(`Event with id ${id} not found`);
            }
    
            const msg = `Event ${updatedEvent.name} updated successfully`;
            console.log(msg);
            
            return updatedEvent;
        } catch (error) {
            console.error(`Error updating event with id ${id}:`, error);
            throw error;
        }
    }
    
    /**
     * Deletes an event by its ID.
     * @param id - The event ID.
     * @returns The deleted event document or throws an error if not found.
     */
    async deleteEvent(id: string): Promise<EventDocument> {
        try {
            const deletedEvent = await EventModel.findByIdAndDelete(id);
            if (!deletedEvent) {
                throw new Error(`Event not found with id ${id}`);
            }
            const msg = `Event ${deletedEvent.name} deleted successfully`;
            console.log(msg);
            return deletedEvent;
        } catch (error) {
            throw error;
        }
    }
}

/**
 * Instance of EventService for handling event-related logic.
 */
export const eventService = new EventService();
