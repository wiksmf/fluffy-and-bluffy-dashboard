import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PlanTable from "./PlanTable";

const mockTheme = {};

// Mock the usePlans hook
jest.mock("./usePlans", () => ({
  usePlans: jest.fn(() => ({
    isLoading: false,
    plans: [],
  })),
}));

// Mock the Spinner component
jest.mock("../../ui/Spinner", () => {
  return function MockSpinner() {
    return <div data-testid="spinner">Loading...</div>;
  };
});

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={mockTheme}>{children}</ThemeProvider>
    </QueryClientProvider>
  );
};

describe("PlanTable", () => {
  const usePlans = require("./usePlans").usePlans;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading spinner when data is loading", () => {
    usePlans.mockReturnValue({
      isLoading: true,
      plans: undefined,
    });

    render(<PlanTable />, { wrapper: createWrapper() });

    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("renders table headers correctly", () => {
    usePlans.mockReturnValue({
      isLoading: false,
      plans: [],
    });

    render(<PlanTable />, { wrapper: createWrapper() });

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Price")).toBeInTheDocument();
  });

  it("renders empty table when no plans", () => {
    usePlans.mockReturnValue({
      isLoading: false,
      plans: [],
    });

    render(<PlanTable />, { wrapper: createWrapper() });

    expect(screen.getByText("No data available.")).toBeInTheDocument();
  });

  it("renders plans when data is available", () => {
    const mockPlans = [
      {
        id: 1,
        name: "Basic Plan",
        description: "Basic description",
        price: 10,
      },
      {
        id: 2,
        name: "Premium Plan",
        description: "Premium description",
        price: 20,
      },
    ];

    usePlans.mockReturnValue({
      isLoading: false,
      plans: mockPlans,
    });

    render(<PlanTable />, { wrapper: createWrapper() });

    expect(screen.getByText("Basic Plan")).toBeInTheDocument();
    expect(screen.getByText("Premium Plan")).toBeInTheDocument();
    expect(screen.getByText("Basic description")).toBeInTheDocument();
    expect(screen.getByText("Premium description")).toBeInTheDocument();
  });

  it("renders table with correct grid columns", () => {
    usePlans.mockReturnValue({
      isLoading: false,
      plans: [],
    });

    render(<PlanTable />, { wrapper: createWrapper() });

    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();
  });

  it("handles undefined plans gracefully", () => {
    usePlans.mockReturnValue({
      isLoading: false,
      plans: undefined,
    });

    render(<PlanTable />, { wrapper: createWrapper() });

    expect(screen.getByText("No data available.")).toBeInTheDocument();
  });

  it("renders multiple plans correctly", () => {
    const mockPlans = [
      { id: 1, name: "Plan 1", description: "Description 1", price: 100 },
      { id: 2, name: "Plan 2", description: "Description 2", price: 200 },
      { id: 3, name: "Plan 3", description: "Description 3", price: 300 },
    ];

    usePlans.mockReturnValue({
      isLoading: false,
      plans: mockPlans,
    });

    render(<PlanTable />, { wrapper: createWrapper() });

    mockPlans.forEach((plan) => {
      expect(screen.getByText(plan.name)).toBeInTheDocument();
      expect(screen.getByText(plan.description)).toBeInTheDocument();
    });
  });
});
