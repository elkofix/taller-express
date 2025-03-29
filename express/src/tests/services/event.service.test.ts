import mongoose from "mongoose";
import { EventDocument, EventInput, EventModel } from "../../models";
import { eventService } from "../../services";

jest.mock("../../models/event.model");

describe("EventService", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockEvent: EventDocument = {
        _id: new mongoose.Types.ObjectId(),
        name: "Tech Conference",
        bannerPhotoUrl: "https://example.com/banner.jpg",
        isPublic: true,
        userId: "user123",
    } as EventDocument;

    test("should create an event", async () => {
        (EventModel.create as jest.Mock).mockResolvedValue(mockEvent);

        const event = await eventService.create(mockEvent);
        expect(EventModel.create).toHaveBeenCalledWith(mockEvent);
        expect(event).toEqual(mockEvent);
    });

    test("should throw error and not create an event", async () => {
        (EventModel.create as jest.Mock).mockRejectedValue(new Error("DB error"));


        await expect(eventService.create(mockEvent)).rejects.toThrow("DB error");    
        expect(EventModel.create).toHaveBeenCalledWith(mockEvent);

    });

    test("should find an event by ID", async () => {
        (EventModel.findById as jest.Mock).mockResolvedValue(mockEvent);

        const event = await eventService.findById((mockEvent._id as mongoose.Types.ObjectId).toString());
        expect(EventModel.findById).toHaveBeenCalledWith((mockEvent._id as mongoose.Types.ObjectId).toString());
        expect(event).toEqual(mockEvent);
    });

    test("not find an event by ID and throw errors", async () => {
        (EventModel.findById as jest.Mock).mockResolvedValue(null);

        await expect(eventService.findById("mockID")).rejects.toThrow(`Event not found with id mockID`);    
        expect(EventModel.findById).toHaveBeenCalledWith("mockID");
    });


    test("should throw error and not find an event by ID", async () => {
        (EventModel.findById as jest.Mock).mockRejectedValue(new Error("DB error"));

        await expect(eventService.findById((mockEvent._id as mongoose.Types.ObjectId).toString())).rejects.toThrow("DB error");    
        expect(EventModel.findById).toHaveBeenCalledWith((mockEvent._id as mongoose.Types.ObjectId).toString());
    });


    test("should return all events", async () => {
        (EventModel.find as jest.Mock).mockResolvedValue([mockEvent]);

        const events = await eventService.getAll();
        expect(EventModel.find).toHaveBeenCalled();
        expect(events).toEqual([mockEvent]);
    });

    test("should throw error and not return all events", async () => {
        (EventModel.find as jest.Mock).mockRejectedValue(new Error("DB error"));

        await expect(eventService.getAll()).rejects.toThrow("DB error");    
        expect(EventModel.find).toHaveBeenCalled();
    });

    test("should update an event", async () => {
        const updatedEvent = { ...mockEvent, name: "Updated Event Name" };
        (EventModel.findOneAndUpdate as jest.Mock).mockResolvedValue(updatedEvent);

        const result = await eventService.updateEvent((mockEvent._id as mongoose.Types.ObjectId).toString(), { name: "Updated Event Name" } as EventInput);
        expect(EventModel.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: (mockEvent._id as mongoose.Types.ObjectId).toString() },
            { name: "Updated Event Name" },
            { returnOriginal: false }
        );
        expect(result).toEqual(updatedEvent);
    });


    test("should throw error and not update an event", async () => {
        (EventModel.findOneAndUpdate as jest.Mock).mockRejectedValue(new Error("DB error"));

        await expect(eventService.updateEvent((mockEvent._id as mongoose.Types.ObjectId).toString(), { name: "Updated Event Name" } as EventInput)).rejects.toThrow("DB error");    
        expect(EventModel.findOneAndUpdate).toHaveBeenCalled();
    });

    test("should throw not found error and not update an event", async () => {
        (EventModel.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

        await expect(eventService.updateEvent("mockID", { name: "Updated Event Name" } as EventInput)).rejects.toThrow("Event with id mockID not found");    
        expect(EventModel.findOneAndUpdate).toHaveBeenCalled();
    });

    test("should delete an event", async () => {
        (EventModel.findByIdAndDelete as jest.Mock).mockResolvedValue(mockEvent);

        const deletedEvent = await eventService.deleteEvent((mockEvent._id as mongoose.Types.ObjectId).toString());
        expect(EventModel.findByIdAndDelete).toHaveBeenCalledWith((mockEvent._id as mongoose.Types.ObjectId).toString());
        expect(deletedEvent).toEqual(mockEvent);
    });


    test("should throw not found error and not delete an event", async () => {
        (EventModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

        await expect(eventService.deleteEvent("mockID")).rejects.toThrow("Event not found with id mockID");    
        expect(EventModel.findByIdAndDelete).toHaveBeenCalledWith("mockID");
    });


    test("should throw error and not delete an event", async () => {
        (EventModel.findByIdAndDelete as jest.Mock).mockRejectedValue(new Error("DB error"));

        await expect(eventService.deleteEvent((mockEvent._id as mongoose.Types.ObjectId).toString())).rejects.toThrow("DB error");    
        expect(EventModel.findByIdAndDelete).toHaveBeenCalledWith((mockEvent._id as mongoose.Types.ObjectId).toString());
    });
});
