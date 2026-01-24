import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import type { ReactNode } from "react";
import * as React from "react";
import { toast } from "react-hot-toast";

import { useCheckout } from "./useCheckout";
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

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const mockedUpdateBooking = apiBookings.updateBooking as jest.MockedFunction<
  typeof apiBookings.updateBooking
>;
const mockedToast = toast as jest.Mocked<typeof toast>;

describe("useCheckout", () => {
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

  it("should checkout booking successfully with string ID", async () => {
    const bookingId = "123";
    const paidAmount = 150.5;
    const mockBooking = { id: "123", status: "done", paid_amount: paidAmount };
    mockedUpdateBooking.mockResolvedValueOnce(mockBooking);

    const { result } = renderHook(() => useCheckout(), {
      wrapper: createWrapper,
    });

    expect(result.current.isCheckingOut).toBe(false);

    await act(async () => {
      result.current.checkout({ bookingId, paidAmount });
    });

    await waitFor(() => {
      expect(result.current.isCheckingOut).toBe(false);
    });

    expect(mockedUpdateBooking).toHaveBeenCalledWith(bookingId, {
      status: "done",
      paid_amount: paidAmount,
    });
    expect(mockedToast.success).toHaveBeenCalledWith(
      "Booking #123 successfully closed!"
    );
    expect(mockNavigate).toHaveBeenCalledWith("/booking/123");
  });

  it("should checkout booking successfully with numeric ID", async () => {
    const bookingId = 456;
    const paidAmount = 200;
    const mockBooking = { id: 456, status: "done", paid_amount: paidAmount };
    mockedUpdateBooking.mockResolvedValueOnce(mockBooking);

    const { result } = renderHook(() => useCheckout(), {
      wrapper: createWrapper,
    });

    await act(async () => {
      result.current.checkout({ bookingId, paidAmount });
    });

    await waitFor(() => {
      expect(result.current.isCheckingOut).toBe(false);
    });

    expect(mockedUpdateBooking).toHaveBeenCalledWith(bookingId, {
      status: "done",
      paid_amount: paidAmount,
    });
    expect(mockedToast.success).toHaveBeenCalledWith(
      "Booking #456 successfully closed!"
    );
    expect(mockNavigate).toHaveBeenCalledWith("/booking/456");
  });

  it("should handle zero paid amount", async () => {
    const bookingId = "123";
    const paidAmount = 0;
    const mockBooking = { id: "123", status: "done", paid_amount: paidAmount };
    mockedUpdateBooking.mockResolvedValueOnce(mockBooking);

    const { result } = renderHook(() => useCheckout(), {
      wrapper: createWrapper,
    });

    result.current.checkout({ bookingId, paidAmount });

    await waitFor(() => {
      expect(result.current.isCheckingOut).toBe(false);
    });

    expect(mockedUpdateBooking).toHaveBeenCalledWith(bookingId, {
      status: "done",
      paid_amount: 0,
    });
  });

  it("should handle checkout error", async () => {
    const bookingId = "123";
    const paidAmount = 150.5;
    const mockError = new Error("Failed to checkout booking");
    mockedUpdateBooking.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useCheckout(), {
      wrapper: createWrapper,
    });

    await act(async () => {
      result.current.checkout({ bookingId, paidAmount });
    });

    await waitFor(() => {
      expect(result.current.isCheckingOut).toBe(false);
    });

    expect(mockedUpdateBooking).toHaveBeenCalledWith(bookingId, {
      status: "done",
      paid_amount: paidAmount,
    });
    expect(mockedToast.error).toHaveBeenCalledWith(
      "There was an error while closing the booking."
    );
    expect(mockedToast.success).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("should invalidate active queries on success", async () => {
    const bookingId = "123";
    const paidAmount = 150.5;
    const mockBooking = { id: "123", status: "done", paid_amount: paidAmount };
    const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");
    mockedUpdateBooking.mockResolvedValueOnce(mockBooking);

    const { result } = renderHook(() => useCheckout(), {
      wrapper: createWrapper,
    });

    result.current.checkout({ bookingId, paidAmount });

    await waitFor(() => {
      expect(result.current.isCheckingOut).toBe(false);
    });

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ["bookings"],
    });
  });

  it("should not invalidate queries on error", async () => {
    const bookingId = "123";
    const paidAmount = 150.5;
    const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");
    const mockError = new Error("Failed to checkout booking");
    mockedUpdateBooking.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useCheckout(), {
      wrapper: createWrapper,
    });

    result.current.checkout({ bookingId, paidAmount });

    await waitFor(() => {
      expect(result.current.isCheckingOut).toBe(false);
    });

    expect(invalidateQueriesSpy).not.toHaveBeenCalled();
  });

  it("should handle decimal paid amounts correctly", async () => {
    const bookingId = "123";
    const paidAmount = 99.99;
    const mockBooking = { id: "123", status: "done", paid_amount: paidAmount };
    mockedUpdateBooking.mockResolvedValueOnce(mockBooking);

    const { result } = renderHook(() => useCheckout(), {
      wrapper: createWrapper,
    });

    result.current.checkout({ bookingId, paidAmount });

    await waitFor(() => {
      expect(result.current.isCheckingOut).toBe(false);
    });

    expect(mockedUpdateBooking).toHaveBeenCalledWith(bookingId, {
      status: "done",
      paid_amount: 99.99,
    });
  });
});
