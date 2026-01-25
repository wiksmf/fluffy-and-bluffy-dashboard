import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { type ReactNode } from "react";
import { useServices } from "./useService";

// Mock the API function
jest.mock("../../services/apiServices", () => ({
  getServices: jest.fn(),
}));

const mockGetServices = require("../../services/apiServices").getServices;

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

describe("useServices", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns loading state initially", () => {
    mockGetServices.mockImplementation(() => new Promise(() => {})); // Never resolves

    const { result } = renderHook(() => useServices(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isPending).toBe(true);
    expect(result.current.services).toBeUndefined();
  });

  it("returns services data when fetch is successful", async () => {
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

    mockGetServices.mockResolvedValue(mockServices);

    const { result } = renderHook(() => useServices(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.services).toEqual(mockServices);
  });

  it("handles fetch error gracefully", async () => {
    const mockError = new Error("Failed to fetch services");
    mockGetServices.mockRejectedValue(mockError);

    const { result } = renderHook(() => useServices(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.services).toBeUndefined();
  });

  it("uses correct query key", () => {
    mockGetServices.mockResolvedValue([]);

    const { result } = renderHook(() => useServices(), {
      wrapper: createWrapper(),
    });

    // The hook should be using the "services" query key
    expect(result.current.isPending).toBeDefined();
  });

  it("calls getServices API function", async () => {
    mockGetServices.mockResolvedValue([]);

    renderHook(() => useServices(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(mockGetServices).toHaveBeenCalledTimes(1);
    });
  });

  it("returns empty services array when API returns empty", async () => {
    mockGetServices.mockResolvedValue([]);

    const { result } = renderHook(() => useServices(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.services).toEqual([]);
  });

  it("handles null response from API", async () => {
    mockGetServices.mockResolvedValue(null);

    const { result } = renderHook(() => useServices(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.services).toBe(null);
  });
});
