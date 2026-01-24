import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import type { ReactNode } from "react";
import * as React from "react";

import { useBookings } from "./useBookings";
import * as apiBookings from "../../services/apiBookings";
import { PAGE_SIZE } from "../../utils/constants";

// Mock the API module
jest.mock("../../services/apiBookings", () => ({
  getBookings: jest.fn(),
}));

// Mock react-router-dom
const mockSearchParams = new URLSearchParams();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useSearchParams: () => [mockSearchParams],
}));

const mockedGetBookings = apiBookings.getBookings as jest.MockedFunction<
  typeof apiBookings.getBookings
>;

describe("useBookings", () => {
  let queryClient: QueryClient;

  const createWrapper = ({ children }: { children: ReactNode }) =>
    React.createElement(
      QueryClientProvider,
      { client: queryClient },
      React.createElement(MemoryRouter, null, children)
    );

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    jest.clearAllMocks();
    mockSearchParams.delete("status");
    mockSearchParams.delete("sort-by");
    mockSearchParams.delete("page");
  });

  it("should fetch bookings data successfully with default parameters", async () => {
    const mockBookings = [
      {
        id: "1",
        created_at: "2024-01-01",
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        phone: "123-456-7890",
        service: "Grooming",
        message: "Test message",
        date: "2024-01-02",
        hour: "10:00",
        status: "confirmed",
      },
      {
        id: "2",
        created_at: "2024-01-01",
        first_name: "Jane",
        last_name: "Smith",
        email: "jane@example.com",
        phone: "123-456-7891",
        service: "Grooming",
        message: "Test message",
        date: "2024-01-03",
        hour: "11:00",
        status: "pending",
      },
    ];
    const mockResponse = { data: mockBookings, count: 2 };

    mockedGetBookings.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useBookings(), {
      wrapper: createWrapper,
    });

    expect(result.current.isPending).toBe(true);

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.bookings).toEqual(mockBookings);
    expect(result.current.count).toBe(2);
    expect(mockedGetBookings).toHaveBeenCalledWith({
      filter: undefined,
      sortBy: { field: "date", direction: "asc" },
      page: 1,
    });
  });

  it("should handle status filter", async () => {
    mockSearchParams.set("status", "confirmed");

    const mockResponse = { data: [], count: 0 };
    mockedGetBookings.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useBookings(), {
      wrapper: createWrapper,
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(mockedGetBookings).toHaveBeenCalledWith({
      filter: { field: "status", value: "confirmed" },
      sortBy: { field: "date", direction: "asc" },
      page: 1,
    });
  });

  it("should handle sort by parameter", async () => {
    mockSearchParams.set("sort-by", "first_name-desc");

    const mockResponse = { data: [], count: 0 };
    mockedGetBookings.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useBookings(), {
      wrapper: createWrapper,
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(mockedGetBookings).toHaveBeenCalledWith({
      filter: undefined,
      sortBy: { field: "first_name", direction: "desc" },
      page: 1,
    });
  });

  it("should handle pagination", async () => {
    mockSearchParams.set("page", "2");

    const mockResponse = { data: [], count: 0 };
    mockedGetBookings.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useBookings(), {
      wrapper: createWrapper,
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(mockedGetBookings).toHaveBeenCalledWith({
      filter: undefined,
      sortBy: { field: "date", direction: "asc" },
      page: 2,
    });
  });

  it('should handle "all" status filter as undefined', async () => {
    mockSearchParams.set("status", "all");

    const mockResponse = { data: [], count: 0 };
    mockedGetBookings.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useBookings(), {
      wrapper: createWrapper,
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(mockedGetBookings).toHaveBeenCalledWith({
      filter: undefined,
      sortBy: { field: "date", direction: "asc" },
      page: 1,
    });
  });

  it("should handle error state", async () => {
    const mockError = new Error("Failed to fetch bookings");
    mockedGetBookings.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useBookings(), {
      wrapper: createWrapper,
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.error).toEqual(mockError);
    expect(result.current.bookings).toBeUndefined();
  });

  it("should prefetch next page when not on last page", async () => {
    const mockResponse = { data: [], count: PAGE_SIZE * 2 }; // 2 pages total
    mockedGetBookings.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useBookings(), {
      wrapper: createWrapper,
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    // Should call for current page and prefetch next page
    expect(mockedGetBookings).toHaveBeenCalledTimes(2);
    expect(mockedGetBookings).toHaveBeenCalledWith({
      filter: undefined,
      sortBy: { field: "date", direction: "asc" },
      page: 1,
    });
    expect(mockedGetBookings).toHaveBeenCalledWith({
      filter: undefined,
      sortBy: { field: "date", direction: "asc" },
      page: 2,
    });
  });

  it("should prefetch previous page when not on first page", async () => {
    mockSearchParams.set("page", "2");
    const mockResponse = { data: [], count: PAGE_SIZE * 3 }; // 3 pages total
    mockedGetBookings.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useBookings(), {
      wrapper: createWrapper,
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    // Should call for current page, prefetch previous and next pages
    // Note: React Query may call the function multiple times due to prefetching
    expect(mockedGetBookings).toHaveBeenCalledWith({
      filter: undefined,
      sortBy: { field: "date", direction: "asc" },
      page: 2,
    });
    expect(mockedGetBookings).toHaveBeenCalledWith({
      filter: undefined,
      sortBy: { field: "date", direction: "asc" },
      page: 1,
    });
    expect(mockedGetBookings).toHaveBeenCalledWith({
      filter: undefined,
      sortBy: { field: "date", direction: "asc" },
      page: 3,
    });
  });
});
