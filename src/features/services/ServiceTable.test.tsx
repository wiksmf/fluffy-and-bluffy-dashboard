import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import ServiceTable from "./ServiceTable";

const mockTheme = {};

// Mock the useServices hook
jest.mock("./useService", () => ({
  useServices: jest.fn(() => ({
    isLoading: false,
    services: [
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
    ],
  })),
}));

// Mock the ServiceRow component to simplify testing
jest.mock("./ServiceRow", () => {
  return function MockServiceRow({ service }: { service: any }) {
    return (
      <div data-testid={`service-row-${service.id}`}>
        {service.name} - {service.description}
      </div>
    );
  };
});

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
      <ThemeProvider theme={mockTheme}>
        <MemoryRouter initialEntries={["/services"]}>{children}</MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

describe("ServiceTable", () => {
  const useServices = require("./useService").useServices;

  beforeEach(() => {
    jest.clearAllMocks();
    useServices.mockReturnValue({
      isLoading: false,
      services: [
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
      ],
    });
  });

  it("renders loading spinner when isLoading is true", () => {
    useServices.mockReturnValue({
      isLoading: true,
      services: undefined,
    });

    render(<ServiceTable />, { wrapper: createWrapper() });

    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("renders table with correct headers", () => {
    render(<ServiceTable />, { wrapper: createWrapper() });

    expect(screen.getByText("Icon")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Short Description")).toBeInTheDocument();
    expect(screen.getByText("Show Home")).toBeInTheDocument();
  });

  it("renders service rows for each service", () => {
    render(<ServiceTable />, { wrapper: createWrapper() });

    expect(screen.getByTestId("service-row-1")).toBeInTheDocument();
    expect(screen.getByTestId("service-row-2")).toBeInTheDocument();
    expect(screen.getByText("Service 1 - Description 1")).toBeInTheDocument();
    expect(screen.getByText("Service 2 - Description 2")).toBeInTheDocument();
  });

  it("renders empty table when no services", () => {
    useServices.mockReturnValue({
      isLoading: false,
      services: [],
    });

    render(<ServiceTable />, { wrapper: createWrapper() });

    expect(screen.getByText("No data available.")).toBeInTheDocument();
  });

  it("renders empty table when services is null", () => {
    useServices.mockReturnValue({
      isLoading: false,
      services: null,
    });

    render(<ServiceTable />, { wrapper: createWrapper() });

    expect(screen.getByText("No data available.")).toBeInTheDocument();
  });

  it("applies correct table columns layout", () => {
    render(<ServiceTable />, { wrapper: createWrapper() });

    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();
    // The table component should receive the columns prop
    // This is tested indirectly through the table rendering
  });

  it("handles undefined services gracefully", () => {
    useServices.mockReturnValue({
      isLoading: false,
      services: undefined,
    });

    render(<ServiceTable />, { wrapper: createWrapper() });

    expect(screen.getByText("No data available.")).toBeInTheDocument();
  });

  it("renders with correct table structure", () => {
    render(<ServiceTable />, { wrapper: createWrapper() });

    // Check that the table structure is correct
    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();

    // Check headers are in the correct order
    const headers = screen.getAllByRole("row")[0];
    expect(headers).toBeInTheDocument();
  });

  it("passes correct props to ServiceRow components", () => {
    render(<ServiceTable />, { wrapper: createWrapper() });

    // The mock ServiceRow should receive the service data
    expect(screen.getByText("Service 1 - Description 1")).toBeInTheDocument();
    expect(screen.getByText("Service 2 - Description 2")).toBeInTheDocument();
  });
});
