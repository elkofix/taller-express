/* import mongoose from "mongoose";
import { TicketDocument, TicketModel } from "../../models/ticket.model";
import { ticketService } from "../../services/ticket.service";
import { EventModel } from "../../models";

jest.mock("../../models/ticket.model");
jest.mock("../../models/event.model");


describe("TicketService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockEvent = {
        _id: new mongoose.Types.ObjectId(), // ID único para el evento
        name: "Mock Event", // Nombre del evento
        bannerPhotoUrl: "http://mockurl.com/banner.jpg", // URL de la foto de banner
        isPublic: true, // Indicador de si el evento es público
        userId: "1", // ID del event manager, que es quien gestiona este evento
    };
    

    const mockTicket: TicketDocument = {
        _id: new mongoose.Types.ObjectId(),
        buyDate: new Date(),
        Presentation_idPresentation: 123,
        User_idUser: 456,
        isRedeemed: false,
        isActive: true,
        save: jest.fn(), // Simula el método save de Mongoose
    } as unknown as TicketDocument;

    const mockPresentation = {
        _id: new mongoose.Types.ObjectId().toString(), // Convertido a string
        eventId: new mongoose.Types.ObjectId().toString(), // Convertido a string
    };


    const mockTickets: TicketDocument[] = [
        {
            _id: new mongoose.Types.ObjectId(),
            buyDate: new Date(),
            Presentation_idPresentation: 123,
            User_idUser: 456,
            isRedeemed: false,
            isActive: true,
            save: jest.fn(), // Simula el método save de Mongoose
            // Añadir las propiedades necesarias de Mongoose Document
            $assertPopulated: jest.fn(),
            $clearModifiedPaths: jest.fn(),
            $clone: jest.fn(),
            $createModifiedPathsSnapshot: jest.fn(),
            // Añadir más métodos necesarios si es necesario
        } as unknown as TicketDocument,
        {
            _id: new mongoose.Types.ObjectId(),
            buyDate: new Date(),
            Presentation_idPresentation: 124,
            User_idUser: 457,
            isRedeemed: true,
            isActive: false,
            save: jest.fn(),
            $assertPopulated: jest.fn(),
            $clearModifiedPaths: jest.fn(),
            $clone: jest.fn(),
            $createModifiedPathsSnapshot: jest.fn(),
        } as unknown as TicketDocument,
    ];

    test("should buy a ticket", async () => {
        (TicketModel.create as jest.Mock).mockResolvedValue(mockTicket);

        const ticket = await ticketService.buyTicket(mockTicket);
        expect(TicketModel.create).toHaveBeenCalledWith(mockTicket);
        expect(ticket).toEqual(mockTicket);
    });

    test("should throw error when buying a ticket fails", async () => {
        (TicketModel.create as jest.Mock).mockRejectedValue(new Error("DB error"));

        await expect(ticketService.buyTicket(mockTicket)).rejects.toThrow("Error al comprar el boleto");
    });

    // Consolidación de pruebas duplicadas de `findById`
    test("should find a ticket by ID or return null if not found", async () => {
        // Caso cuando el ticket es encontrado
        (TicketModel.findById as jest.Mock).mockResolvedValue(mockTicket);

        const ticket = await ticketService.findById("anyid");
        expect(TicketModel.findById).toHaveBeenCalledWith("anyid");
        expect(ticket).toEqual(mockTicket);

        // Caso cuando el ticket no es encontrado
        (TicketModel.findById as jest.Mock).mockResolvedValue(null);
        const ticketNotFound = await ticketService.findById("nonexistentId");
        expect(ticketNotFound).toBeNull();
    });

    test("should throw error when database fails in findById", async () => {
        (TicketModel.findById as jest.Mock).mockRejectedValue(new Error("DB error"));

        await expect(ticketService.findById("anyid")).rejects.toThrow("Error al obtener el boleto");
    });

    test("should return null when trying to find a ticket with invalid id", async () => {
        const invalidId = "invalidid";
        (TicketModel.findById as jest.Mock).mockResolvedValue(null);

        const ticket = await ticketService.findById(invalidId);
        expect(ticket).toBeNull();
    });

    test("should get tickets by user or return empty array if no tickets exist", async () => {
        // Caso cuando el usuario tiene tickets
        (TicketModel.find as jest.Mock).mockResolvedValue([mockTicket]);

        const tickets = await ticketService.getTicketsByUser(mockTicket.User_idUser);
        expect(TicketModel.find).toHaveBeenCalledWith({ User_idUser: mockTicket.User_idUser });
        expect(tickets).toEqual([mockTicket]);

        // Caso cuando el usuario no tiene tickets
        (TicketModel.find as jest.Mock).mockResolvedValue([]);
        const noTickets = await ticketService.getTicketsByUser(999);
        expect(noTickets).toEqual([]);
    });

    test("should throw error when database fails in getTicketsByUser", async () => {
        (TicketModel.find as jest.Mock).mockRejectedValue(new Error("DB error"));

        await expect(ticketService.getTicketsByUser(123)).rejects.toThrow("Error al obtener los tickets");
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

    test("should return ticket unchanged if already cancelled", async () => {
        const inactiveTicket = { ...mockTicket, isActive: false };
        (TicketModel.findById as jest.Mock).mockResolvedValue(inactiveTicket);

        const ticket = await ticketService.cancelTicket("alreadyCancelled");
        expect(ticket?.isActive).toBe(false);
        expect(mockTicket.save).not.toHaveBeenCalled(); // No debería llamar a save en un ticket ya cancelado
    });

    test("should throw error when cancelling a ticket fails", async () => {
        (TicketModel.findById as jest.Mock).mockRejectedValue(new Error("DB error"));

        await expect(ticketService.cancelTicket("noTicket")).rejects.toThrow("Error al cancelar el boleto");
    });

    test("should return all tickets successfully", async () => {
        // Simulamos que la llamada a TicketModel.find() devuelve los tickets mockeados
        (TicketModel.find as jest.Mock).mockResolvedValue(mockTickets);

        const tickets = await ticketService.findAll();
        
        // Comprobamos que el método find fue llamado
        expect(TicketModel.find).toHaveBeenCalled();
        
        // Verificamos que los tickets devueltos coinciden con los mockeados
        expect(tickets).toEqual(mockTickets);
        expect(tickets.length).toBe(2);  // Verifica que se devuelven los dos tickets mockeados
    });

    test("should throw error when finding all tickets fails", async () => {
        // Simulamos que ocurre un error al intentar obtener los tickets
        (TicketModel.find as jest.Mock).mockRejectedValue(new Error("DB error"));

        // Verificamos que se lanza el error correcto
        await expect(ticketService.findAll()).rejects.toThrow("Error al obtener todos los tickets");
    });

    test("should get tickets by event manager", async () => {
        // Mock de EventModel.find para devolver eventos gestionados por el eventManagerId
        (EventModel.find as jest.Mock).mockResolvedValue([mockEvent]);

        // Mock de TicketModel.aggregate para devolver los tickets asociados al evento
        (TicketModel.aggregate as jest.Mock).mockResolvedValue(mockTickets);

        const tickets = await ticketService.getTicketsByEventManager(1);

        // Verificamos que la llamada a find y aggregate fue hecha correctamente
        expect(EventModel.find).toHaveBeenCalledWith({ userId: "1" });
        expect(TicketModel.aggregate).toHaveBeenCalledWith([
            {
                $lookup: {
                    from: "presentations",
                    localField: "Presentation_idPresentation",
                    foreignField: "_id",
                    as: "presentation",
                },
            },
            {
                $match: {
                    "presentation.eventId": {
                        $in: [mockEvent._id],
                    },
                },
            },
        ]);

        expect(tickets).toEqual(mockTickets); // Verificamos que los tickets devueltos son los esperados
        expect(tickets.length).toBe(2); // Verificamos que el número de tickets es correcto
    });

    test("should throw error when getting tickets fails", async () => {
        // Simulamos que ocurre un error en la consulta
        (EventModel.find as jest.Mock).mockRejectedValue(new Error("DB error"));

        // Verificamos que se lanza el error correctamente
        await expect(ticketService.getTicketsByEventManager(1)).rejects.toThrow(
            "Error al obtener los tickets asociados al gestor de eventos"
        );
    });

    test("should update a ticket successfully", async () => {
        const updateData = { isRedeemed: true };
        const updatedTicket = { ...mockTicket, ...updateData };

        (TicketModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedTicket);

        const result = await ticketService.updateTicket((mockTicket._id as mongoose.Types.ObjectId).toString(), updateData);

        expect(TicketModel.findByIdAndUpdate).toHaveBeenCalledWith(
            (mockTicket._id as mongoose.Types.ObjectId).toString(),
            updateData,
            { new: true, runValidators: true }
        );
        expect(result).toEqual(updatedTicket);
    });
    test("should return null if ticket is not found", async () => {
        (TicketModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

        const result = await ticketService.updateTicket((mockTicket._id as mongoose.Types.ObjectId).toString(), { isRedeemed: true });

        expect(TicketModel.findByIdAndUpdate).toHaveBeenCalled();
        expect(result).toBeNull();
    });


});
 */