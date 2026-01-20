import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactNode } from "react";
import { useUpdateService } from "./useUpdateService";
import toast from "react-hot-toast";

// Mock the API function
jest.mock("../../services/apiServices", () => ({
  updateService: jest.fn(),
}));

// Mock react-hot-toast
jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

const mockUpdateServiceApi =
  require("../../services/apiServices").updateService;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe("useUpdateService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns initial state correctly", () => {
    const { result } = renderHook(() => useUpdateService(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isEditing).toBe(false);
    expect(result.current.editService).toBeInstanceOf(Function);
  });

  it("updates service successfully", async () => {
    const mockServiceData = {
      title: "Updated Service",
      description: "Updated description",
      short_description: "Updated short desc",
      show_home: false,
      preserveExistingIcon: true,
    };

    const mockUpdatedService = {
      id: 1,
      ...mockServiceData,
      icon: "https://example.com/existing-icon.png",
    };

    mockUpdateServiceApi.mockResolvedValue(mockUpdatedService);

    const { result } = renderHook(() => useUpdateService(), {
      wrapper: createWrapper(),
    });

    result.current.editService({ serviceData: mockServiceData, id: 1 });

    await waitFor(() => {
      expect(result.current.isEditing).toBe(false);
    });

    // API is called with just the service data and ID, no additional context
    expect(mockUpdateServiceApi).toHaveBeenCalledWith(mockServiceData, 1);
    expect(toast.success).toHaveBeenCalledWith("Service updated successfully!");
  });

  it("updates service with new icon", async () => {
    const mockServiceData = {
      title: "Updated Service",
      description: "Updated description",
      short_description: "Updated short desc",
      show_home: true,
      icon: [
        new File(["new test"], "new-test.png", { type: "image/png" }),
      ] as any as FileList,
    };

    const mockUpdatedService = {
      id: 1,
      ...mockServiceData,
      icon: "https://example.com/new-icon.png",
    };

    mockUpdateServiceApi.mockResolvedValue(mockUpdatedService);

    const { result } = renderHook(() => useUpdateService(), {
      wrapper: createWrapper(),
    });

    result.current.editService({ serviceData: mockServiceData, id: 1 });

    await waitFor(() => {
      expect(result.current.isEditing).toBe(false);
    });

    expect(mockUpdateServiceApi).toHaveBeenCalledWith(mockServiceData, 1);
    expect(toast.success).toHaveBeenCalledWith("Service updated successfully!");
  });

  it("handles update error", async () => {
    const mockServiceData = {
      title: "Updated Service",
      description: "Updated description",
      short_description: "Updated short desc",
      show_home: false,
    };

    const mockError = new Error("Update failed");
    mockUpdateServiceApi.mockRejectedValue(mockError);

    const { result } = renderHook(() => useUpdateService(), {
      wrapper: createWrapper(),
    });

    result.current.editService({ serviceData: mockServiceData, id: 1 });

    await waitFor(() => {
      expect(result.current.isEditing).toBe(false);
    });

    expect(toast.error).toHaveBeenCalledWith("Update failed");
  });

  it("invalidates services query on success", async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");
    const mockServiceData = {
      title: "Updated Service",
      description: "Updated description",
      short_description: "Updated short desc",
      show_home: true,
    };

    mockUpdateServiceApi.mockResolvedValue({ id: 1, ...mockServiceData });

    const wrapper = ({ children }: { children: ReactNode }) =>
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        children
      );

    const { result } = renderHook(() => useUpdateService(), { wrapper });

    result.current.editService({ serviceData: mockServiceData, id: 1 });

    await waitFor(() => {
      expect(result.current.isEditing).toBe(false);
    });

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ["services"],
    });
  });

  it("calls onSuccess callback when provided", async () => {
    const mockServiceData = {
      title: "Updated Service",
      description: "Updated description",
      short_description: "Updated short desc",
      show_home: false,
    };

    const onSuccessCallback = jest.fn();
    mockUpdateServiceApi.mockResolvedValue({ id: 1, ...mockServiceData });

    const { result } = renderHook(() => useUpdateService(), {
      wrapper: createWrapper(),
    });

    result.current.editService(
      { serviceData: mockServiceData, id: 1 },
      { onSuccess: onSuccessCallback }
    );

    await waitFor(() => {
      expect(result.current.isEditing).toBe(false);
    });

    expect(onSuccessCallback).toHaveBeenCalled();
  });

  it("calls onError callback when provided", async () => {
    const mockServiceData = {
      title: "Updated Service",
      description: "Updated description",
      short_description: "Updated short desc",
      show_home: false,
    };

    const onErrorCallback = jest.fn();
    const mockError = new Error("Update failed");
    mockUpdateServiceApi.mockRejectedValue(mockError);

    const { result } = renderHook(() => useUpdateService(), {
      wrapper: createWrapper(),
    });

    result.current.editService(
      { serviceData: mockServiceData, id: 1 },
      { onError: onErrorCallback }
    );

    await waitFor(() => {
      expect(result.current.isEditing).toBe(false);
    });

    // React Query passes error, variables, context, and mutation meta
    expect(onErrorCallback).toHaveBeenCalledWith(
      mockError,
      { serviceData: mockServiceData, id: 1 }, // mutation variables
      undefined, // context
      expect.any(Object) // mutation meta
    );
  });

  it("maintains loading state during update", async () => {
    const mockServiceData = {
      title: "Updated Service",
      description: "Updated description",
      short_description: "Updated short desc",
      show_home: false,
    };

    // Create a promise that resolves after a delay
    let resolvePromise: (value: any) => void;
    const pendingPromise = new Promise((resolve) => {
      resolvePromise = resolve;
      setTimeout(() => resolve({ id: 1, ...mockServiceData }), 10);
    });

    mockUpdateServiceApi.mockReturnValue(pendingPromise);

    const { result } = renderHook(() => useUpdateService(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isEditing).toBe(false);

    result.current.editService({ serviceData: mockServiceData, id: 1 });

    // Wait for the mutation to complete
    await waitFor(() => {
      expect(result.current.isEditing).toBe(false);
    });

    // Verify the API was called
    expect(mockUpdateServiceApi).toHaveBeenCalled();
  });

  it("handles undefined optional fields", async () => {
    const mockServiceData = {
      title: "Updated Service",
      description: "Updated description",
      // short_description and show_home are optional
    };

    mockUpdateServiceApi.mockResolvedValue({ id: 1, ...mockServiceData });

    const { result } = renderHook(() => useUpdateService(), {
      wrapper: createWrapper(),
    });

    result.current.editService({ serviceData: mockServiceData, id: 1 });

    await waitFor(() => {
      expect(result.current.isEditing).toBe(false);
    });

    expect(mockUpdateServiceApi).toHaveBeenCalledWith(mockServiceData, 1);
  });
});
