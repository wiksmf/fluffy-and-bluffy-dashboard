import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import type { ReactNode } from "react";
import * as React from "react";

import { useBooking } from "./useBooking";
import * as apiBookings from "../../services/apiBookings";

// Mock the API module
jest.mock("../../services/apiBookings", () => ({
  getBooking: jest.fn(),
}));

// Mock react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ bookingId: "123" }),
}));

const mockedGetBooking = apiBookings.getBooking as jest.MockedFunction<
  typeof apiBookings.getBooking
>;

describe("useBooking", () => {
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
  });

  it("should fetch booking data successfully", async () => {
    const mockBooking = {
      id: "123",
      status: "confirmed",
      customer_name: "John Doe",
      service: "Grooming",
    };

    mockedGetBooking.mockResolvedValueOnce(mockBooking);

    const { result } = renderHook(() => useBooking(), {
      wrapper: createWrapper,
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.booking).toBeUndefined();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.booking).toEqual(mockBooking);
    expect(result.current.error).toBeNull();
    expect(mockedGetBooking).toHaveBeenCalledWith("123");
  });

  it("should handle booking fetch error", async () => {
    const mockError = new Error("Failed to fetch booking");
    mockedGetBooking.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useBooking(), {
      wrapper: createWrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.booking).toBeUndefined();
    expect(result.current.error).toEqual(mockError);
  });

  it("should use correct query key", async () => {
    mockedGetBooking.mockResolvedValueOnce({ id: "123" });

    renderHook(() => useBooking(), {
      wrapper: createWrapper,
    });

    await waitFor(() => {
      expect(mockedGetBooking).toHaveBeenCalledWith("123");
    });

    const queries = queryClient.getQueryCache().getAll();
    expect(queries).toHaveLength(1);
    expect(queries[0].queryKey).toEqual(["bookings", "123"]);
  });
});
