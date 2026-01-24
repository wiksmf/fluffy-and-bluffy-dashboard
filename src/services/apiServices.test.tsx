import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "./apiServices";

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
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn(),
        getPublicUrl: jest.fn(() => ({
          data: { publicUrl: "https://example.com/test-icon.png" },
        })),
      })),
    },
  },
}));

const mockSupabase = require("./supabase").default;

describe("apiServices", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset console.error mock
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getServices", () => {
    it("fetches services successfully", async () => {
      const mockServices = [
        {
          id: 1,
          name: "Service 1",
          description: "Description 1",
          short_description: "Short 1",
          show_home: true,
          icon: "/icon1.png",
        },
        {
          id: 2,
          name: "Service 2",
          description: "Description 2",
          short_description: "Short 2",
          show_home: false,
          icon: "/icon2.png",
        },
      ];

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          data: mockServices,
          error: null,
        }),
      });

      const result = await getServices();

      expect(mockSupabase.from).toHaveBeenCalledWith("services");
      expect(result).toEqual(mockServices);
    });

    it("throws error when fetch fails", async () => {
      const mockError = new Error("Database error");

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      });

      await expect(getServices()).rejects.toThrow("Error fetching services");
      expect(console.error).toHaveBeenCalledWith(mockError);
    });
  });

  describe("createService", () => {
    const mockNewService = {
      name: "New Service",
      description: "New description",
      short_description: "Short desc",
      show_home: true,
      icon: [
        new File(["test"], "test.png", { type: "image/png" }),
      ] as any as FileList,
    };

    it("creates service successfully with file upload", async () => {
      const createdService = {
        id: 3,
        name: "New Service",
        description: "New description",
        short_description: "Short desc",
        show_home: true,
      };

      const updatedService = {
        ...createdService,
        icon: "https://example.com/test-icon.png",
      };

      // Mock database insert
      const mockInsertChain = {
        select: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({
            data: createdService,
            error: null,
          }),
        })),
      };

      mockSupabase.from.mockReturnValue({
        insert: jest.fn(() => mockInsertChain),
        update: jest.fn(() => ({
          eq: jest.fn(() => ({
            select: jest.fn(() => ({
              single: jest.fn().mockResolvedValue({
                data: updatedService,
                error: null,
              }),
            })),
          })),
        })),
        delete: jest.fn(() => ({
          eq: jest.fn(),
        })),
      });

      // Mock storage upload
      mockSupabase.storage.from.mockReturnValue({
        upload: jest.fn().mockResolvedValue({ error: null }),
        getPublicUrl: jest.fn(() => ({
          data: { publicUrl: "https://example.com/test-icon.png" },
        })),
      });

      const result = await createService(mockNewService);

      expect(mockSupabase.from).toHaveBeenCalledWith("services");
      expect(mockSupabase.storage.from).toHaveBeenCalledWith("services-icons");
      expect(result).toEqual(updatedService);
    });

    it("throws error when service creation fails", async () => {
      const mockError = new Error("Creation failed");

      const mockInsertChain = {
        select: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({
            data: null,
            error: mockError,
          }),
        })),
      };

      mockSupabase.from.mockReturnValue({
        insert: jest.fn(() => mockInsertChain),
      });

      await expect(createService(mockNewService)).rejects.toThrow(
        "Error adding service"
      );
      expect(console.error).toHaveBeenCalledWith(mockError);
    });

    it("throws error when storage upload fails", async () => {
      const createdService = {
        id: 3,
        name: "New Service",
        description: "New description",
      };

      const mockInsertChain = {
        select: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({
            data: createdService,
            error: null,
          }),
        })),
      };

      mockSupabase.from.mockReturnValue({
        insert: jest.fn(() => mockInsertChain),
        delete: jest.fn(() => ({
          eq: jest.fn(),
        })),
      });

      const storageError = new Error("Storage upload failed");
      mockSupabase.storage.from.mockReturnValue({
        upload: jest.fn().mockResolvedValue({ error: storageError }),
      });

      await expect(createService(mockNewService)).rejects.toThrow(
        "Service image could not be uploaded and the service was not created"
      );
    });
  });

  describe("updateService", () => {
    const mockUpdateService = {
      name: "Updated Service",
      description: "Updated description",
      short_description: "Updated short desc",
      show_home: false,
    };

    it("updates service without new icon", async () => {
      const currentService = { icon: "/existing-icon.png" };
      const updatedService = {
        id: 1,
        ...mockUpdateService,
        icon: "/existing-icon.png",
      };

      // Mock fetch current service
      const mockSelectChain = {
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({
            data: currentService,
            error: null,
          }),
        })),
      };

      // Mock update service
      const mockUpdateChain = {
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: updatedService,
              error: null,
            }),
          })),
        })),
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => mockSelectChain),
        update: jest.fn(() => mockUpdateChain),
      });

      const result = await updateService(mockUpdateService, 1);

      expect(result).toEqual(updatedService);
    });

    it("updates service with new icon", async () => {
      const serviceWithIcon = {
        ...mockUpdateService,
        icon: [
          new File(["new test"], "new-test.png", { type: "image/png" }),
        ] as any as FileList,
      };

      const currentService = { icon: "/existing-icon.png" };
      const updatedService = {
        id: 1,
        ...mockUpdateService,
        icon: "https://example.com/new-test-icon.png",
      };

      // Mock fetch current service
      const mockSelectChain = {
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({
            data: currentService,
            error: null,
          }),
        })),
      };

      // Mock update service
      const mockUpdateChain = {
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: updatedService,
              error: null,
            }),
          })),
        })),
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => mockSelectChain),
        update: jest.fn(() => mockUpdateChain),
      });

      mockSupabase.storage.from.mockReturnValue({
        upload: jest.fn().mockResolvedValue({ error: null }),
        getPublicUrl: jest.fn(() => ({
          data: { publicUrl: "https://example.com/new-test-icon.png" },
        })),
      });

      const result = await updateService(serviceWithIcon, 1);

      expect(result).toEqual(updatedService);
    });

    it("throws error when fetching current service fails", async () => {
      const fetchError = new Error("Fetch failed");

      const mockSelectChain = {
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({
            data: null,
            error: fetchError,
          }),
        })),
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => mockSelectChain),
      });

      await expect(updateService(mockUpdateService, 1)).rejects.toThrow(
        "Error fetching current service data"
      );
    });

    it("throws error when update fails", async () => {
      const currentService = { icon: "/existing-icon.png" };
      const updateError = new Error("Update failed");

      const mockSelectChain = {
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({
            data: currentService,
            error: null,
          }),
        })),
      };

      const mockUpdateChain = {
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: updateError,
            }),
          })),
        })),
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => mockSelectChain),
        update: jest.fn(() => mockUpdateChain),
      });

      await expect(updateService(mockUpdateService, 1)).rejects.toThrow(
        "Error updating service"
      );
    });
  });

  describe("deleteService", () => {
    it("deletes service successfully", async () => {
      const mockDeleteChain = {
        eq: jest.fn().mockResolvedValue({
          error: null,
        }),
      };

      mockSupabase.from.mockReturnValue({
        delete: jest.fn(() => mockDeleteChain),
      });

      await deleteService(1);

      expect(mockSupabase.from).toHaveBeenCalledWith("services");
      expect(mockDeleteChain.eq).toHaveBeenCalledWith("id", 1);
    });

    it("throws error when deletion fails", async () => {
      const mockError = new Error("Deletion failed");

      const mockDeleteChain = {
        eq: jest.fn().mockResolvedValue({
          error: mockError,
        }),
      };

      mockSupabase.from.mockReturnValue({
        delete: jest.fn(() => mockDeleteChain),
      });

      await expect(deleteService(1)).rejects.toThrow("Error deleting service");
      expect(console.error).toHaveBeenCalledWith(mockError);
    });
  });
});
