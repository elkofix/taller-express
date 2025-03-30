import mongoose from "mongoose";
//import { TicketModel, TicketDocument } from "../../models";
import { ticketService } from "../../services/ticket.service";
import { TicketDocument, TicketModel } from "../../models/ticket.model";


jest.mock("../../models/ticket.model");

describe("TicketService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockTicket: TicketDocument = {
    _id: new mongoose.Types.ObjectId(),
    buyDate: new Date(),
    Presentation_idPresentation: 10,
    User_idUser: 1,
    isRedeemed: false,
    isActive: true,
  } as TicketDocument;

  describe("buyTicket", () => {
    it("debería comprar un ticket exitosamente", async () => {
        (TicketModel.create as jest.Mock).mockResolvedValue(mockTicket);

        const newTicket = {
            Presentation_idPresentation: 10,
            User_idUser: 1,
            buyDate: new Date(), // Propiedad requerida
            isRedeemed: false,    // Propiedad requerida
            isActive: true        // Propiedad requerida
        };

        const ticket = await ticketService.buyTicket(newTicket);

        expect(TicketModel.create).toHaveBeenCalledWith(newTicket);
        expect(ticket).toEqual(mockTicket);
    });

    it("debería lanzar un error si la compra falla", async () => {
        (TicketModel.create as jest.Mock).mockRejectedValue(new Error("DB error"));

        const newTicket = {
            Presentation_idPresentation: 10,
            User_idUser: 1,
            buyDate: new Date(), // Propiedad requerida
            isRedeemed: false,    // Propiedad requerida
            isActive: true        // Propiedad requerida
        };

        await expect(ticketService.buyTicket(newTicket))
            .rejects.toThrow("DB error");

        expect(TicketModel.create).toHaveBeenCalledWith(newTicket);
    });
    });


    describe("cancelTicket", () => {
        const mockTicket = {
            _id: new mongoose.Types.ObjectId(), // Asegura que el ID sea un ObjectId válido
            Presentation_idPresentation: 10,
            User_idUser: 1,
            buyDate: new Date(),
            isRedeemed: false,
            isActive: true
        };
    
        it("debería cancelar un ticket exitosamente", async () => {
            (TicketModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({ ...mockTicket, isActive: false });
    
            const result = await ticketService.cancelTicket(mockTicket._id.toString());
    
            expect(TicketModel.findByIdAndUpdate).toHaveBeenCalledWith(
                mockTicket._id.toString(),
                { isActive: false },
                { new: true }
            );
    
            // Verifica que result no sea null antes de acceder a sus propiedades
            expect(result).not.toBeNull();
            expect(result!.isActive).toBe(false);
        });
    
        it("debería lanzar un error si el ticket no existe", async () => {
            (TicketModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);
    
            await expect(ticketService.cancelTicket("invalidId")).rejects.toThrow("Ticket not found");
    
            expect(TicketModel.findByIdAndUpdate).toHaveBeenCalledWith(
                "invalidId",
                { isActive: false },
                { new: true }
            );
        });
    
        it("debería lanzar un error si la cancelación falla", async () => {
            (TicketModel.findByIdAndUpdate as jest.Mock).mockRejectedValue(new Error("DB error"));
    
            await expect(ticketService.cancelTicket(mockTicket._id.toString())).rejects.toThrow("DB error");
    
            expect(TicketModel.findByIdAndUpdate).toHaveBeenCalledWith(
                mockTicket._id.toString(),
                { isActive: false },
                { new: true }
            );
        });
    });
    

  describe("getTicketsByUser", () => {
    it("debería retornar los tickets de un usuario", async () => {
      (TicketModel.find as jest.Mock).mockResolvedValue([mockTicket]);

      const tickets = await ticketService.getTicketsByUser(mockTicket.User_idUser);

      expect(TicketModel.find).toHaveBeenCalledWith({ User_idUser: mockTicket.User_idUser });
      expect(tickets).toEqual([mockTicket]);
    });

    it("debería retornar un array vacío si el usuario no tiene tickets", async () => {
      (TicketModel.find as jest.Mock).mockResolvedValue([]);

      const tickets = await ticketService.getTicketsByUser(mockTicket.User_idUser);

      expect(TicketModel.find).toHaveBeenCalledWith({ User_idUser: mockTicket.User_idUser });
      expect(tickets).toEqual([]);
    });

    it("debería lanzar un error si la consulta falla", async () => {
      (TicketModel.find as jest.Mock).mockRejectedValue(new Error("DB error"));

      await expect(ticketService.getTicketsByUser(mockTicket.User_idUser)).rejects.toThrow("DB error");

      expect(TicketModel.find).toHaveBeenCalledWith({ User_idUser: mockTicket.User_idUser });
    });
  });
});
