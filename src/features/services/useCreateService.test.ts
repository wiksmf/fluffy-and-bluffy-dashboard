import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { type ReactNode } from "react";
import { useCreateService } from "./useCreateService";
import toast from "react-hot-toast";

// Mock the API function
jest.mock("../../services/apiServices", () => ({
  createService: jest.fn(),
}));

// Mock react-hot-toast
jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

const mockCreateServiceApi =
  require("../../services/apiServices").createService;

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

describe("useCreateService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns initial state correctly", () => {
    const { result } = renderHook(() => useCreateService(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isCreating).toBe(false);
    expect(result.current.createService).toBeInstanceOf(Function);
  });

  it("creates service successfully", async () => {
    const mockServiceData = {
      name: "New Service",
      description: "New description",
      short_description: "Short desc",
      show_home: true,
      icon: [
        new File(["test"], "test.png", { type: "image/png" }),
      ] as any as FileList,
    };

    const mockCreatedService = {
      id: 1,
      ...mockServiceData,
      icon: "https://example.com/test-icon.png",
    };

    mockCreateServiceApi.mockResolvedValue(mockCreatedService);

    const { result } = renderHook(() => useCreateService(), {
      wrapper: createWrapper(),
    });

    result.current.createService(mockServiceData);

    await waitFor(() => {
      expect(result.current.isCreating).toBe(false);
    });

    // API is called with just the service data, no additional context
    expect(mockCreateServiceApi).toHaveBeenCalledWith(mockServiceData);
    expect(toast.success).toHaveBeenCalledWith(
      "New service created successfully!"
    );
  });

  it("handles creation error", async () => {
    const mockServiceData = {
      name: "New Service",
      description: "New description",
      short_description: "Short desc",
      show_home: true,
      icon: [
        new File(["test"], "test.png", { type: "image/png" }),
      ] as any as FileList,
    };

    const mockError = new Error("Creation failed");
    mockCreateServiceApi.mockRejectedValue(mockError);

    const { result } = renderHook(() => useCreateService(), {
      wrapper: createWrapper(),
    });

    result.current.createService(mockServiceData);

    await waitFor(() => {
      expect(result.current.isCreating).toBe(false);
    });

    expect(toast.error).toHaveBeenCalledWith("Creation failed");
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
      name: "New Service",
      description: "New description",
      short_description: "Short desc",
      show_home: true,
      icon: [
        new File(["test"], "test.png", { type: "image/png" }),
      ] as any as FileList,
    };

    mockCreateServiceApi.mockResolvedValue({ id: 1, ...mockServiceData });

    const wrapper = ({ children }: { children: ReactNode }) =>
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        children
      );

    const { result } = renderHook(() => useCreateService(), { wrapper });

    result.current.createService(mockServiceData);

    await waitFor(() => {
      expect(result.current.isCreating).toBe(false);
    });

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ["services"],
    });
  });

  it("calls onSuccess callback when provided", async () => {
    const mockServiceData = {
      name: "New Service",
      description: "New description",
      short_description: "Short desc",
      show_home: true,
      icon: [
        new File(["test"], "test.png", { type: "image/png" }),
      ] as any as FileList,
    };

    const onSuccessCallback = jest.fn();
    mockCreateServiceApi.mockResolvedValue({ id: 1, ...mockServiceData });

    const { result } = renderHook(() => useCreateService(), {
      wrapper: createWrapper(),
    });

    result.current.createService(mockServiceData, {
      onSuccess: onSuccessCallback,
    });

    await waitFor(() => {
      expect(result.current.isCreating).toBe(false);
    });

    expect(onSuccessCallback).toHaveBeenCalled();
  });

  it("calls onError callback when provided", async () => {
    const mockServiceData = {
      name: "New Service",
      description: "New description",
      short_description: "Short desc",
      show_home: true,
      icon: [
        new File(["test"], "test.png", { type: "image/png" }),
      ] as any as FileList,
    };

    const onErrorCallback = jest.fn();
    const mockError = new Error("Creation failed");
    mockCreateServiceApi.mockRejectedValue(mockError);

    const { result } = renderHook(() => useCreateService(), {
      wrapper: createWrapper(),
    });

    result.current.createService(mockServiceData, {
      onError: onErrorCallback,
    });

    await waitFor(() => {
      expect(result.current.isCreating).toBe(false);
    });

    // React Query passes error, variables, context, and mutation context
    expect(onErrorCallback).toHaveBeenCalledWith(
      mockError,
      mockServiceData, // mutation variables
      undefined, // context
      expect.any(Object) // mutation meta
    );
  });

  it("maintains loading state during creation", async () => {
    const mockServiceData = {
      name: "New Service",
      description: "New description",
      short_description: "Short desc",
      show_home: true,
      icon: [
        new File(["test"], "test.png", { type: "image/png" }),
      ] as any as FileList,
    };

    // Create a promise that resolves after a delay
    const pendingPromise = new Promise((resolve) => {
      // Resolve after a small delay to allow loading state to be observed
      setTimeout(() => resolve({ id: 1, ...mockServiceData }), 10);
    });

    mockCreateServiceApi.mockReturnValue(pendingPromise);

    const { result } = renderHook(() => useCreateService(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isCreating).toBe(false);

    result.current.createService(mockServiceData);

    // Wait for the mutation to complete
    await waitFor(() => {
      expect(result.current.isCreating).toBe(false);
    });

    // Verify the API was called
    expect(mockCreateServiceApi).toHaveBeenCalled();
  });
});
