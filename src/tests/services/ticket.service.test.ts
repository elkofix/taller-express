import mongoose from "mongoose";
import { TicketDocument, TicketModel } from "../../models/ticket.model";
import { ticketService } from "../../services/ticket.service";


jest.mock("../../models/ticket.model");

describe("TicketService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockTicket: TicketDocument = {
        _id: new mongoose.Types.ObjectId(),
        buyDate: new Date(),
        Presentation_idPresentation: 123,
        User_idUser: 456,
        isRedeemed: false,
        isActive: true,
        
    } as TicketDocument;

    test("should buy a ticket", async () => {
        (TicketModel.create as jest.Mock).mockResolvedValue(mockTicket);

        const ticket = await ticketService.buyTicket(mockTicket);
        expect(TicketModel.create).toHaveBeenCalledWith(mockTicket);
        expect(ticket).toEqual(mockTicket);
    });

    test("should throw error when buying a ticket fails", async () => {
        (TicketModel.create as jest.Mock).mockRejectedValue(new Error("DB error"));

        await expect(ticketService.buyTicket(mockTicket)).rejects.toThrow("Error al comprar el boleto");
        expect(TicketModel.create).toHaveBeenCalledWith(mockTicket);
    });

    test("should find a ticket by ID", async () => {
        (TicketModel.findById as jest.Mock).mockResolvedValue(mockTicket);

        const ticket = await ticketService.findById("anyid");
        expect(TicketModel.findById).toHaveBeenCalledWith("anyid");
        expect(ticket).toEqual(mockTicket);
    });

    test("should return null if ticket not found", async () => {
        (TicketModel.findById as jest.Mock).mockResolvedValue(null);

        const ticket = await ticketService.findById("nonexistentId");
        expect(ticket).toBeNull();
    });

    test("should throw error when finding ticket fails", async () => {
        (TicketModel.findById as jest.Mock).mockRejectedValue(new Error("DB error"));

        await expect(ticketService.findById("any")).rejects.toThrow("Error al obtener el boleto");
    });

    test("should get tickets by user", async () => {
        (TicketModel.find as jest.Mock).mockResolvedValue([mockTicket]);

        const tickets = await ticketService.getTicketsByUser(mockTicket.User_idUser);
        expect(TicketModel.find).toHaveBeenCalledWith({ User_idUser: mockTicket.User_idUser });
        expect(tickets).toEqual([mockTicket]);
    });

    test("should throw error when getting tickets by user fails", async () => {
        (TicketModel.find as jest.Mock).mockRejectedValue(new Error("DB error"));

        await expect(ticketService.getTicketsByUser(mockTicket.User_idUser)).rejects.toThrow("Error al obtener los tickets");
    });

    test("should cancel a ticket", async () => {
        const cancelledTicket = { ...mockTicket, isActive: false };
        (TicketModel.findById as jest.Mock).mockResolvedValue(mockTicket);
        (mockTicket.save as jest.Mock).mockResolvedValue(cancelledTicket);

        const ticket = await ticketService.cancelTicket("any");
        expect(ticket?.isActive).toBe(false);
    });

    test("should return null if trying to cancel a non-existing ticket", async () => {
        (TicketModel.findById as jest.Mock).mockResolvedValue(null);

        const ticket = await ticketService.cancelTicket("nonexistentId");
        expect(ticket).toBeNull();
    });

    test("should throw error when cancelling a ticket fails", async () => {
        (TicketModel.findById as jest.Mock).mockRejectedValue(new Error("DB error"));

        await expect(ticketService.cancelTicket("noaticker")).rejects.toThrow("Error al cancelar el boleto");
    });
});