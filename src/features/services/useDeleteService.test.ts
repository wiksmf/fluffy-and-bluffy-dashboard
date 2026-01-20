import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactNode } from "react";
import { useDeleteService } from "./useDeleteService";
import toast from "react-hot-toast";

// Mock the API function
jest.mock("../../services/apiServices", () => ({
  deleteService: jest.fn(),
}));

// Mock react-hot-toast
jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

const mockDeleteServiceApi =
  require("../../services/apiServices").deleteService;

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

describe("useDeleteService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns initial state correctly", () => {
    const { result } = renderHook(() => useDeleteService(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isDeleting).toBe(false);
    expect(result.current.deleteService).toBeInstanceOf(Function);
  });

  it("deletes service successfully", async () => {
    mockDeleteServiceApi.mockResolvedValue(undefined);

    const { result } = renderHook(() => useDeleteService(), {
      wrapper: createWrapper(),
    });

    result.current.deleteService(1);

    // React Query mutations may not immediately show loading state
    await waitFor(() => {
      expect(result.current.isDeleting).toBe(false);
    });

    expect(mockDeleteServiceApi).toHaveBeenCalledWith(
      1,
      expect.any(Object) // React Query passes mutation context
    );
    expect(toast.success).toHaveBeenCalledWith("Service deleted successfully");
  });

  it("handles deletion error", async () => {
    const mockError = new Error("Deletion failed");
    mockDeleteServiceApi.mockRejectedValue(mockError);

    const { result } = renderHook(() => useDeleteService(), {
      wrapper: createWrapper(),
    });

    result.current.deleteService(1);

    await waitFor(() => {
      expect(result.current.isDeleting).toBe(false);
    });

    expect(toast.error).toHaveBeenCalledWith("Deletion failed");
  });

  it("invalidates services query on success", async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

    mockDeleteServiceApi.mockResolvedValue(undefined);

    const wrapper = ({ children }: { children: ReactNode }) =>
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        children
      );

    const { result } = renderHook(() => useDeleteService(), { wrapper });

    result.current.deleteService(1);

    await waitFor(() => {
      expect(result.current.isDeleting).toBe(false);
    });

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ["services"],
    });
  });

  it("calls onSuccess callback when provided", async () => {
    const onSuccessCallback = jest.fn();
    mockDeleteServiceApi.mockResolvedValue(undefined);

    const { result } = renderHook(() => useDeleteService(), {
      wrapper: createWrapper(),
    });

    result.current.deleteService(1, {
      onSuccess: onSuccessCallback,
    });

    await waitFor(() => {
      expect(result.current.isDeleting).toBe(false);
    });

    expect(onSuccessCallback).toHaveBeenCalled();
  });

  it("calls onError callback when provided", async () => {
    const onErrorCallback = jest.fn();
    const mockError = new Error("Deletion failed");
    mockDeleteServiceApi.mockRejectedValue(mockError);

    const { result } = renderHook(() => useDeleteService(), {
      wrapper: createWrapper(),
    });

    result.current.deleteService(1, {
      onError: onErrorCallback,
    });

    await waitFor(() => {
      expect(result.current.isDeleting).toBe(false);
    });

    // React Query passes error, variables, context, and mutation meta
    expect(onErrorCallback).toHaveBeenCalledWith(
      mockError,
      1, // mutation variables (the service ID)
      undefined, // context
      expect.any(Object) // mutation meta
    );
  });

  it("maintains loading state during deletion", async () => {
    // Create a promise that resolves after a delay
    let resolvePromise: (value: any) => void;
    const pendingPromise = new Promise((resolve) => {
      resolvePromise = resolve;
      setTimeout(() => resolve(undefined), 10);
    });

    mockDeleteServiceApi.mockReturnValue(pendingPromise);

    const { result } = renderHook(() => useDeleteService(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isDeleting).toBe(false);

    result.current.deleteService(1);

    // Wait for the mutation to complete
    await waitFor(() => {
      expect(result.current.isDeleting).toBe(false);
    });

    // Verify the API was called
    expect(mockDeleteServiceApi).toHaveBeenCalled();
  });

  it("handles multiple deletion requests", async () => {
    mockDeleteServiceApi.mockResolvedValue(undefined);

    const { result } = renderHook(() => useDeleteService(), {
      wrapper: createWrapper(),
    });

    // Delete first service
    result.current.deleteService(1);

    await waitFor(() => {
      expect(result.current.isDeleting).toBe(false);
    });

    // Clear the mock call count before second deletion to avoid interference
    jest.clearAllMocks();

    // Delete second service
    result.current.deleteService(2);

    await waitFor(() => {
      expect(result.current.isDeleting).toBe(false);
    });

    expect(mockDeleteServiceApi).toHaveBeenCalledTimes(1); // Only counting the second call after clear
    expect(mockDeleteServiceApi).toHaveBeenCalledWith(2, expect.any(Object));
    expect(toast.success).toHaveBeenCalledTimes(1); // Only counting the second call after clear
  });

  it("handles network error gracefully", async () => {
    const networkError = new Error("Network error");
    networkError.name = "NetworkError";
    mockDeleteServiceApi.mockRejectedValue(networkError);

    const { result } = renderHook(() => useDeleteService(), {
      wrapper: createWrapper(),
    });

    result.current.deleteService(1);

    await waitFor(() => {
      expect(result.current.isDeleting).toBe(false);
    });

    expect(toast.error).toHaveBeenCalledWith("Network error");
  });

  it("handles different service IDs correctly", async () => {
    mockDeleteServiceApi.mockResolvedValue(undefined);

    const { result } = renderHook(() => useDeleteService(), {
      wrapper: createWrapper(),
    });

    // Test with different ID types
    result.current.deleteService(999);

    await waitFor(() => {
      expect(result.current.isDeleting).toBe(false);
    });

    expect(mockDeleteServiceApi).toHaveBeenCalledWith(999, expect.any(Object));
  });
});
