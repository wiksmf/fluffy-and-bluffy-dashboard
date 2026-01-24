import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import * as React from "react";
import { toast } from "react-hot-toast";

import { useConfirm } from "./useConfirm";
import * as apiBookings from "../../services/apiBookings";

// Mock the API module
jest.mock("../../services/apiBookings", () => ({
  updateBooking: jest.fn(),
}));

// Mock react-hot-toast
jest.mock("react-hot-toast", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockedUpdateBooking = apiBookings.updateBooking as jest.MockedFunction<
  typeof apiBookings.updateBooking
>;
const mockedToast = toast as jest.Mocked<typeof toast>;

describe("useConfirm", () => {
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

  it("should confirm booking successfully", async () => {
    const bookingId = "123";
    const mockBooking = { id: "123", status: "confirmed" };
    mockedUpdateBooking.mockResolvedValueOnce(mockBooking);

    const { result } = renderHook(() => useConfirm(), {
      wrapper: createWrapper,
    });

    expect(result.current.isPending).toBe(false);

    await act(async () => {
      result.current.confirm(bookingId);
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(mockedUpdateBooking).toHaveBeenCalledWith(bookingId, {
      status: "confirmed",
    });
    expect(mockedToast.success).toHaveBeenCalledWith(
      "Booking #123 successfully confirmed!"
    );
  });

  it("should handle string booking ID", async () => {
    const bookingId = "abc-123";
    const mockBooking = { id: "abc-123", status: "confirmed" };
    mockedUpdateBooking.mockResolvedValueOnce(mockBooking);

    const { result } = renderHook(() => useConfirm(), {
      wrapper: createWrapper,
    });

    await act(async () => {
      result.current.confirm(bookingId);
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(mockedUpdateBooking).toHaveBeenCalledWith(bookingId, {
      status: "confirmed",
    });
    expect(mockedToast.success).toHaveBeenCalledWith(
      "Booking #abc-123 successfully confirmed!"
    );
  });

  it("should handle numeric booking ID", async () => {
    const bookingId = 456;
    const mockBooking = { id: 456, status: "confirmed" };
    mockedUpdateBooking.mockResolvedValueOnce(mockBooking);

    const { result } = renderHook(() => useConfirm(), {
      wrapper: createWrapper,
    });

    await act(async () => {
      result.current.confirm(bookingId);
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(mockedUpdateBooking).toHaveBeenCalledWith(bookingId, {
      status: "confirmed",
    });
    expect(mockedToast.success).toHaveBeenCalledWith(
      "Booking #456 successfully confirmed!"
    );
  });

  it("should handle confirm booking error", async () => {
    const bookingId = "123";
    const mockError = new Error("Failed to confirm booking");
    mockedUpdateBooking.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useConfirm(), {
      wrapper: createWrapper,
    });

    await act(async () => {
      result.current.confirm(bookingId);
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(mockedUpdateBooking).toHaveBeenCalledWith(bookingId, {
      status: "confirmed",
    });
    expect(mockedToast.error).toHaveBeenCalledWith(
      "There was an error while confirming the booking."
    );
    expect(mockedToast.success).not.toHaveBeenCalled();
  });

  it("should invalidate bookings queries on success", async () => {
    const bookingId = "123";
    const mockBooking = { id: "123", status: "confirmed" };
    const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");
    mockedUpdateBooking.mockResolvedValueOnce(mockBooking);

    const { result } = renderHook(() => useConfirm(), {
      wrapper: createWrapper,
    });

    await act(async () => {
      result.current.confirm(bookingId);
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ["bookings"],
    });
  });

  it("should not invalidate queries on error", async () => {
    const bookingId = "123";
    const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");
    const mockError = new Error("Failed to confirm booking");
    mockedUpdateBooking.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useConfirm(), {
      wrapper: createWrapper,
    });

    await act(async () => {
      result.current.confirm(bookingId);
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(invalidateQueriesSpy).not.toHaveBeenCalled();
  });
});
