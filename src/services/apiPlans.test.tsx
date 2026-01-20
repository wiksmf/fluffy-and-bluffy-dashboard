import { getPlans, createPlan, updatePlan, deletePlan } from "./apiPlans";

// Mock supabase
jest.mock("./supabase", () => ({
  __esModule: true,
  default: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        single: jest.fn(),
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(),
          })),
        })),
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(),
      })),
    })),
  },
}));

const mockSupabase = require("./supabase").default;

describe("apiPlans", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getPlans", () => {
    it("fetches plans successfully", async () => {
      const mockPlans = [
        {
          id: 1,
          name: "Basic Plan",
          description: "Basic description",
          price: 10,
        },
        {
          id: 2,
          name: "Premium Plan",
          description: "Premium description",
          price: 20,
        },
      ];

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          data: mockPlans,
          error: null,
        }),
      });

      const result = await getPlans();

      expect(mockSupabase.from).toHaveBeenCalledWith("plans");
      expect(result).toEqual(mockPlans);
    });

    it("throws error when fetch fails", async () => {
      const mockError = new Error("Database error");

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      });

      await expect(getPlans()).rejects.toThrow("Error fetching plans");
    });
  });

  describe("createPlan", () => {
    it("creates plan successfully", async () => {
      const newPlan = {
        name: "New Plan",
        description: "New description",
        price: 15,
      };
      const createdPlan = { id: 3, ...newPlan };

      const mockChain = {
        select: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({
            data: createdPlan,
            error: null,
          }),
        })),
      };

      mockSupabase.from.mockReturnValue({
        insert: jest.fn(() => mockChain),
      });

      const result = await createPlan(newPlan);

      expect(mockSupabase.from).toHaveBeenCalledWith("plans");
      expect(result).toEqual(createdPlan);
    });

    it("throws error when creation fails", async () => {
      const newPlan = {
        name: "New Plan",
        description: "New description",
        price: 15,
      };
      const mockError = new Error("Creation failed");

      const mockChain = {
        select: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({
            data: null,
            error: mockError,
          }),
        })),
      };

      mockSupabase.from.mockReturnValue({
        insert: jest.fn(() => mockChain),
      });

      await expect(createPlan(newPlan)).rejects.toThrow("Error adding plan");
    });
  });

  describe("updatePlan", () => {
    it("updates plan successfully", async () => {
      const planData = {
        name: "Updated Plan",
        description: "Updated description",
        price: 25,
      };
      const updatedPlan = { id: 1, ...planData };

      const mockChain = {
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: updatedPlan,
              error: null,
            }),
          })),
        })),
      };

      mockSupabase.from.mockReturnValue({
        update: jest.fn(() => mockChain),
      });

      const result = await updatePlan(planData, 1);

      expect(mockSupabase.from).toHaveBeenCalledWith("plans");
      expect(result).toEqual(updatedPlan);
    });

    it("throws error when update fails", async () => {
      const planData = {
        name: "Updated Plan",
        description: "Updated description",
        price: 25,
      };
      const mockError = new Error("Update failed");

      const mockChain = {
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: mockError,
            }),
          })),
        })),
      };

      mockSupabase.from.mockReturnValue({
        update: jest.fn(() => mockChain),
      });

      await expect(updatePlan(planData, 1)).rejects.toThrow(
        "Error editing plan"
      );
    });
  });

  describe("deletePlan", () => {
    it("deletes plan successfully", async () => {
      const mockChain = {
        eq: jest.fn().mockResolvedValue({
          error: null,
        }),
      };

      mockSupabase.from.mockReturnValue({
        delete: jest.fn(() => mockChain),
      });

      await deletePlan(1);

      expect(mockSupabase.from).toHaveBeenCalledWith("plans");
    });

    it("throws error when deletion fails", async () => {
      const mockError = new Error("Deletion failed");

      const mockChain = {
        eq: jest.fn().mockResolvedValue({
          error: mockError,
        }),
      };

      mockSupabase.from.mockReturnValue({
        delete: jest.fn(() => mockChain),
      });

      await expect(deletePlan(1)).rejects.toThrow("Error deleting plan");
    });
  });
});
