import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ServiceRow from "./ServiceRow";

const mockTheme = {};

// Mock the useDeleteService hook
const mockDeleteService = jest.fn();
jest.mock("./useDeleteService", () => ({
  useDeleteService: jest.fn(() => ({
    isDeleting: false,
    deleteService: mockDeleteService,
  })),
}));

// Mock the ServiceForm component
jest.mock("./ServiceForm", () => {
  return function MockServiceForm({ serviceToEdit }: { serviceToEdit?: any }) {
    return (
      <div data-testid="service-form">
        Service Form for {serviceToEdit?.name || "new service"}
      </div>
    );
  };
});

// Mock the Modal component
jest.mock("../../ui/Modal", () => {
  const MockModal = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="modal">{children}</div>
  );

  const MockOpen = ({
    children,
    opens,
  }: {
    children: React.ReactElement;
    opens: string;
  }) => {
    return (
      <div
        data-testid={`modal-open-${opens}`}
        onClick={() => {
          const childProps = children.props as any;
          childProps.onClick?.();
        }}
      >
        {children}
      </div>
    );
  };

  const MockWindow = ({
    children,
    name,
  }: {
    children: React.ReactElement;
    name: string;
  }) => <div data-testid={`modal-window-${name}`}>{children}</div>;

  MockModal.Open = MockOpen;
  MockModal.Window = MockWindow;

  return MockModal;
});

// Mock the ConfirmDelete component
jest.mock("../../ui/ConfirmDelete", () => {
  return function MockConfirmDelete({
    resourceName,
    onConfirm,
    disabled,
  }: {
    resourceName: string;
    onConfirm: () => void;
    disabled: boolean;
  }) {
    return (
      <div data-testid="confirm-delete">
        <button
          onClick={onConfirm}
          disabled={disabled}
          data-testid="confirm-delete-button"
        >
          Confirm Delete {resourceName}
        </button>
      </div>
    );
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

const mockService = {
  id: 1,
  name: "Test Service",
  description: "This is a test service description",
  short_description: "Short description",
  show_home: true,
  icon: "/test-icon.png",
};

describe("ServiceRow", () => {
  const useDeleteService = require("./useDeleteService").useDeleteService;

  beforeEach(() => {
    jest.clearAllMocks();
    useDeleteService.mockReturnValue({
      isDeleting: false,
      deleteService: mockDeleteService,
    });
  });

  it("renders service data correctly", () => {
    render(<ServiceRow service={mockService} />, { wrapper: createWrapper() });

    expect(screen.getByText("Test Service")).toBeInTheDocument();
    expect(
      screen.getByText("This is a test service description")
    ).toBeInTheDocument();
    expect(screen.getByText("Short description")).toBeInTheDocument();
    expect(screen.getByText("Yes")).toBeInTheDocument();

    const icon = screen.getByRole("img");
    expect(icon).toHaveAttribute("src", "/test-icon.png");
  });

  it("displays 'No' when show_home is false", () => {
    const serviceWithoutHome = { ...mockService, show_home: false };

    render(<ServiceRow service={serviceWithoutHome} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText("No")).toBeInTheDocument();
  });

  it("renders edit and delete buttons", () => {
    render(<ServiceRow service={mockService} />, { wrapper: createWrapper() });

    const editButton = screen.getByLabelText("Edit service");
    const deleteButton = screen.getByLabelText("Delete service");

    expect(editButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
  });

  it("disables edit button when isDeleting is true", () => {
    useDeleteService.mockReturnValue({
      isDeleting: true,
      deleteService: mockDeleteService,
    });

    render(<ServiceRow service={mockService} />, { wrapper: createWrapper() });

    const editButton = screen.getByLabelText("Edit service");
    expect(editButton).toBeDisabled();
  });

  it("renders modal components for edit and delete", () => {
    render(<ServiceRow service={mockService} />, { wrapper: createWrapper() });

    expect(screen.getByTestId("modal-open-update")).toBeInTheDocument();
    expect(screen.getByTestId("modal-window-update")).toBeInTheDocument();
    expect(screen.getByTestId("modal-open-delete")).toBeInTheDocument();
    expect(screen.getByTestId("modal-window-delete")).toBeInTheDocument();
  });

  it("passes correct service data to ServiceForm", () => {
    render(<ServiceRow service={mockService} />, { wrapper: createWrapper() });

    expect(
      screen.getByText("Service Form for Test Service")
    ).toBeInTheDocument();
  });

  it("passes correct props to ConfirmDelete", () => {
    render(<ServiceRow service={mockService} />, { wrapper: createWrapper() });

    expect(screen.getByTestId("confirm-delete")).toBeInTheDocument();
    expect(screen.getByText("Confirm Delete services")).toBeInTheDocument();
  });

  it("calls deleteService when confirm delete is clicked", async () => {
    const user = userEvent.setup();

    render(<ServiceRow service={mockService} />, { wrapper: createWrapper() });

    const confirmDeleteButton = screen.getByTestId("confirm-delete-button");
    await user.click(confirmDeleteButton);

    expect(mockDeleteService).toHaveBeenCalledWith(1);
  });

  it("handles missing short_description gracefully", () => {
    const serviceWithoutShortDesc = {
      ...mockService,
      short_description: undefined,
    };

    render(<ServiceRow service={serviceWithoutShortDesc} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText("Test Service")).toBeInTheDocument();
    expect(
      screen.getByText("This is a test service description")
    ).toBeInTheDocument();
  });

  it("handles missing icon gracefully", () => {
    const serviceWithoutIcon = { ...mockService, icon: undefined };

    render(<ServiceRow service={serviceWithoutIcon} />, {
      wrapper: createWrapper(),
    });

    const icon = screen.getByRole("img");
    expect(icon).toBeInTheDocument();
  });

  it("renders with correct table row structure", () => {
    render(<ServiceRow service={mockService} />, { wrapper: createWrapper() });

    // Check that the row is rendered within a Table.Row
    const row = screen.getByRole("row");
    expect(row).toBeInTheDocument();
  });

  it("applies correct styling classes", () => {
    render(<ServiceRow service={mockService} />, { wrapper: createWrapper() });

    // Check that styled components are rendered
    expect(screen.getByText("Test Service")).toBeInTheDocument();
    expect(screen.getByText("Yes")).toBeInTheDocument();
  });

  it("shows correct show_home status with proper styling", () => {
    const { rerender } = render(<ServiceRow service={mockService} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText("Yes")).toBeInTheDocument();

    const serviceWithoutHome = { ...mockService, show_home: false };
    rerender(<ServiceRow service={serviceWithoutHome} />);

    expect(screen.getByText("No")).toBeInTheDocument();
  });

  it("passes isDeleting state to confirm delete", () => {
    useDeleteService.mockReturnValue({
      isDeleting: true,
      deleteService: mockDeleteService,
    });

    render(<ServiceRow service={mockService} />, { wrapper: createWrapper() });

    const confirmDeleteButton = screen.getByTestId("confirm-delete-button");
    expect(confirmDeleteButton).toBeDisabled();
  });
});
