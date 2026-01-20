import { getContacts, updateContact } from "./apiContact";

// Mock supabase
jest.mock("./supabase", () => ({
  __esModule: true,
  default: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        single: jest.fn(),
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
    })),
  },
}));

const mockSupabase = require("./supabase").default;

describe("apiContact", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getContacts", () => {
    it("fetches contact data successfully", async () => {
      const mockContactData = {
        id: 1,
        phone: "123-456-7890",
        email: "test@example.com",
        address: "123 Main St",
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({
            data: mockContactData,
            error: null,
          }),
        })),
      });

      const result = await getContacts();

      expect(mockSupabase.from).toHaveBeenCalledWith("contact");
      expect(result).toEqual(mockContactData);
    });

    it("throws error when fetch fails", async () => {
      const mockError = new Error("Database error");

      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({
            data: null,
            error: mockError,
          }),
        })),
      });

      await expect(getContacts()).rejects.toThrow(
        "Contact could not be loaded"
      );
    });

    it("logs error to console when fetch fails", async () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const mockError = new Error("Database error");

      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({
            data: null,
            error: mockError,
          }),
        })),
      });

      try {
        await getContacts();
      } catch (error) {
        // Expected to throw
      }

      expect(consoleSpy).toHaveBeenCalledWith(mockError);
      consoleSpy.mockRestore();
    });
  });

  describe("updateContact", () => {
    it("updates contact data successfully", async () => {
      const newContactData = {
        phone: "555-123-4567",
        email: "newemail@example.com",
        address: "456 New Street",
      };

      const updatedContact = { id: 1, ...newContactData };

      const mockChain = {
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({
            data: updatedContact,
            error: null,
          }),
        })),
      };

      mockSupabase.from.mockReturnValue({
        update: jest.fn(() => mockChain),
      });

      const result = await updateContact(newContactData);

      expect(mockSupabase.from).toHaveBeenCalledWith("contact");
      expect(mockChain.eq).toHaveBeenCalledWith("id", 1);
      expect(result).toEqual(updatedContact);
    });

    it("throws error when update fails", async () => {
      const newContactData = {
        phone: "555-123-4567",
        email: "newemail@example.com",
      };

      const mockError = new Error("Update failed");

      const mockChain = {
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({
            data: null,
            error: mockError,
          }),
        })),
      };

      mockSupabase.from.mockReturnValue({
        update: jest.fn(() => mockChain),
      });

      await expect(updateContact(newContactData)).rejects.toThrow(
        "Contact could not be updated"
      );
    });

    it("logs error to console when update fails", async () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const newContactData = { phone: "555-123-4567" };
      const mockError = new Error("Update failed");

      const mockChain = {
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({
            data: null,
            error: mockError,
          }),
        })),
      };

      mockSupabase.from.mockReturnValue({
        update: jest.fn(() => mockChain),
      });

      try {
        await updateContact(newContactData);
      } catch (error) {
        // Expected to throw
      }

      expect(consoleSpy).toHaveBeenCalledWith(mockError);
      consoleSpy.mockRestore();
    });

    it("updates contact with partial data", async () => {
      const partialData = { phone: "555-999-8888" };
      const updatedContact = { id: 1, ...partialData };

      const mockChain = {
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({
            data: updatedContact,
            error: null,
          }),
        })),
      };

      mockSupabase.from.mockReturnValue({
        update: jest.fn(() => mockChain),
      });

      const result = await updateContact(partialData);

      expect(result).toEqual(updatedContact);
    });

    it("always updates contact with id 1", async () => {
      const contactData = { email: "test@test.com" };

      const mockChain = {
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({
            data: { id: 1, ...contactData },
            error: null,
          }),
        })),
      };

      mockSupabase.from.mockReturnValue({
        update: jest.fn(() => mockChain),
      });

      await updateContact(contactData);

      expect(mockChain.eq).toHaveBeenCalledWith("id", 1);
    });
  });
});
