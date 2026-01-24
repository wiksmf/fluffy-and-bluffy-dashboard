import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import * as React from "react";
import { toast } from "react-hot-toast";

import { useDeleteBooking } from "./useDeleteBooking";
import * as apiBookings from "../../services/apiBookings";

// Mock the API module
jest.mock("../../services/apiBookings", () => ({
  deleteBooking: jest.fn(),
}));

// Mock react-hot-toast
jest.mock("react-hot-toast", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockedDeleteBooking = apiBookings.deleteBooking as jest.MockedFunction<
  typeof apiBookings.deleteBooking
>;
const mockedToast = toast as jest.Mocked<typeof toast>;

describe("useDeleteBooking", () => {
  let queryClient: QueryClient;

  const createWrapper = ({ children }: { children: ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);

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

  it("should delete booking successfully", async () => {
    const bookingId = "123";
    mockedDeleteBooking.mockResolvedValueOnce(null);

    const { result } = renderHook(() => useDeleteBooking(), {
      wrapper: createWrapper,
    });

    expect(result.current.isDeleting).toBe(false);

    // Use act to ensure the mutation is called within React's execution context
    await act(async () => {
      result.current.deleteBooking(bookingId);
    });

    await waitFor(() => {
      expect(result.current.isDeleting).toBe(false);
    });

    expect(mockedDeleteBooking).toHaveBeenCalledWith(
      bookingId,
      expect.anything()
    );
    expect(mockedToast.success).toHaveBeenCalledWith(
      "Booking successfully deleted"
    );
  });

  it("should handle delete booking error", async () => {
    const bookingId = "123";
    const mockError = new Error("Failed to delete booking");
    mockedDeleteBooking.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useDeleteBooking(), {
      wrapper: createWrapper,
    });

    await act(async () => {
      result.current.deleteBooking(bookingId);
    });

    await waitFor(() => {
      expect(result.current.isDeleting).toBe(false);
    });

    expect(mockedDeleteBooking).toHaveBeenCalledWith(
      bookingId,
      expect.anything()
    );
    expect(mockedToast.error).toHaveBeenCalledWith(mockError.message);
    expect(mockedToast.success).not.toHaveBeenCalled();
  });

  it("should invalidate bookings queries on success", async () => {
    const bookingId = "123";
    const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");
    mockedDeleteBooking.mockResolvedValueOnce(null);

    const { result } = renderHook(() => useDeleteBooking(), {
      wrapper: createWrapper,
    });

    result.current.deleteBooking(bookingId);

    await waitFor(() => {
      expect(result.current.isDeleting).toBe(false);
    });

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ["bookings"],
    });
  });

  it("should not invalidate queries on error", async () => {
    const bookingId = "123";
    const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");
    const mockError = new Error("Failed to delete booking");
    mockedDeleteBooking.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useDeleteBooking(), {
      wrapper: createWrapper,
    });

    result.current.deleteBooking(bookingId);

    await waitFor(() => {
      expect(result.current.isDeleting).toBe(false);
    });

    expect(invalidateQueriesSpy).not.toHaveBeenCalled();
  });
});
