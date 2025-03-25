import { EventDocument, EventInput, EventModel } from "../models";

class EventService{

    async create(data: EventInput){
        try{
            const event = await EventModel.create(data);
            const msg = `Event ${event.name} created successfully`;
            console.log(msg);
            return event;
        }catch(error){
            throw error;
        }
    }

    async findById(id:string){
        try{
            const event = await EventModel.findById(id);
            if(!event){
                throw new Error(`Event not found with id ${id} `);
            }
            const msg = `Event ${event.name} found successfully`;
            console.log(msg);
            return event;
        }catch(error){
            throw error;
        }
    }

    async getAll():Promise<EventDocument[]>{
        try{
            const events: EventDocument[] = await EventModel.find();
            const msg = `Found ${events.length} events`;
            console.log(msg);
            return events;
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    async updateEvent(id: string, event: EventInput) {
        try {
            const updatedEvent: EventDocument | null = await EventModel.findOneAndUpdate(
                { _id: id },
                event,
                { returnOriginal: false }
            );
    
            if (!updatedEvent) {
                throw new Error(`Event with id ${id} not found`);
            }
    
            updatedEvent.name = "";
    
            const msg = `Event ${updatedEvent.name} updated successfully`;
            console.log(msg);
            
            return updatedEvent;
        } catch (error) {
            throw error;
        }
    }
    

    async deleteEvent(id:string){
        try{
            const deletedEvent = await EventModel.findByIdAndDelete(id);
            if(!deletedEvent){
                throw new Error(`Event not found with id ${id}`);
            }
            const msg = `Event ${deletedEvent.name} deleted successfully`;
            console.log(msg);
            return deletedEvent;
        }catch(error){
            throw error;
        } 
    }
}

export const eventService = new EventService();