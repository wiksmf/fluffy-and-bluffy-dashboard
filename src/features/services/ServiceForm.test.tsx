import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ServiceForm from "./ServiceForm";

const mockTheme = {};

// Create proper mocks that can be overridden
const mockCreateService = jest.fn();
const mockEditService = jest.fn();

jest.mock("./useCreateService", () => ({
  useCreateService: jest.fn(() => ({
    isCreating: false,
    createService: mockCreateService,
  })),
}));

jest.mock("./useUpdateService", () => ({
  useUpdateService: jest.fn(() => ({
    isEditing: false,
    editService: mockEditService,
  })),
}));

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

describe("ServiceForm", () => {
  const useCreateService = require("./useCreateService").useCreateService;
  const useUpdateService = require("./useUpdateService").useUpdateService;

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mocks to default state
    useCreateService.mockReturnValue({
      isCreating: false,
      createService: mockCreateService,
    });
    useUpdateService.mockReturnValue({
      isEditing: false,
      editService: mockEditService,
    });
  });

  it("renders form fields for creating new service", () => {
    render(<ServiceForm />, { wrapper: createWrapper() });

    expect(screen.getByLabelText("name")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByLabelText("Short description")).toBeInTheDocument();
    expect(screen.getByLabelText("Show on home page")).toBeInTheDocument();
    expect(screen.getByLabelText("Icon")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add service" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("renders form fields for editing existing service", () => {
    const serviceToEdit = {
      id: 1,
      name: "Test Service",
      description: "Test Description",
      short_description: "Short desc",
      show_home: true,
      icon: "/test-icon.png",
    };

    render(<ServiceForm serviceToEdit={serviceToEdit} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByDisplayValue("Test Service")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test Description")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Short desc")).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toBeChecked();
    expect(
      screen.getByRole("button", { name: "Edit service" })
    ).toBeInTheDocument();
  });

  it("shows validation errors for required fields", async () => {
    const user = userEvent.setup();
    render(<ServiceForm />, { wrapper: createWrapper() });

    const submitButton = screen.getByRole("button", { name: "Add service" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("name is required")).toBeInTheDocument();
      expect(screen.getByText("Description is required")).toBeInTheDocument();
      expect(screen.getByText("This field is required")).toBeInTheDocument();
    });
  });

  it("shows validation errors for minimum length", async () => {
    const user = userEvent.setup();
    render(<ServiceForm />, { wrapper: createWrapper() });

    const titleInput = screen.getByLabelText("name");
    const descriptionInput = screen.getByLabelText("Description");

    await user.type(titleInput, "abc"); // Less than 5 characters
    await user.type(descriptionInput, "short"); // Less than 10 characters

    const submitButton = screen.getByRole("button", { name: "Add service" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("name must be at least 5 characters")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Description must be at least 10 characters")
      ).toBeInTheDocument();
    });
  });

  it("calls createService with form data when creating new service", async () => {
    const user = userEvent.setup();
    render(<ServiceForm />, { wrapper: createWrapper() });

    await user.type(screen.getByLabelText("name"), "New Service");
    await user.type(
      screen.getByLabelText("Description"),
      "New Description for service"
    );
    await user.type(
      screen.getByLabelText("Short description"),
      "Short description"
    );
    await user.click(screen.getByLabelText("Show on home page"));

    // Mock file input
    const file = new File(["test"], "test.png", { type: "image/png" });
    const fileInput = screen.getByLabelText("Icon");
    await user.upload(fileInput, file);

    const submitButton = screen.getByRole("button", { name: "Add service" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockCreateService).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "New Service",
          description: "New Description for service",
          short_description: "Short description",
          show_home: true,
        }),
        expect.any(Object)
      );
    });
  });

  it("calls editService with form data when editing existing service", async () => {
    const serviceToEdit = {
      id: 1,
      name: "Existing Service",
      description: "Existing Description",
      short_description: "Existing short desc",
      show_home: false,
      icon: "/existing-icon.png",
    };

    const user = userEvent.setup();
    render(<ServiceForm serviceToEdit={serviceToEdit} />, {
      wrapper: createWrapper(),
    });

    const titleInput = screen.getByDisplayValue("Existing Service");
    await user.clear(titleInput);
    await user.type(titleInput, "Updated Service");

    const submitButton = screen.getByRole("button", { name: "Edit service" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockEditService).toHaveBeenCalledWith(
        {
          serviceData: expect.objectContaining({
            name: "Updated Service",
            description: "Existing Description",
            short_description: "Existing short desc",
            show_home: false,
            preserveExistingIcon: true,
          }),
          id: 1,
        },
        expect.any(Object)
      );
    });
  });

  it("handles file upload when editing service", async () => {
    const serviceToEdit = {
      id: 1,
      name: "Existing Service",
      description: "Existing Description",
      short_description: "Short desc",
      show_home: true,
      icon: "/existing-icon.png",
    };

    const user = userEvent.setup();
    render(<ServiceForm serviceToEdit={serviceToEdit} />, {
      wrapper: createWrapper(),
    });

    const file = new File(["new test"], "new-test.png", { type: "image/png" });
    const fileInput = screen.getByLabelText("Icon");
    await user.upload(fileInput, file);

    const submitButton = screen.getByRole("button", { name: "Edit service" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockEditService).toHaveBeenCalledWith(
        {
          serviceData: expect.objectContaining({
            icon: expect.any(FileList),
          }),
          id: 1,
        },
        expect.any(Object)
      );
    });
  });

  it("calls onCloseModal when Cancel button is clicked", async () => {
    const mockOnCloseModal = jest.fn();
    const user = userEvent.setup();

    render(<ServiceForm onCloseModal={mockOnCloseModal} />, {
      wrapper: createWrapper(),
    });

    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    await user.click(cancelButton);

    expect(mockOnCloseModal).toHaveBeenCalledTimes(1);
  });

  it("disables form when isWorking is true", () => {
    useCreateService.mockReturnValue({
      isCreating: true,
      createService: mockCreateService,
    });

    render(<ServiceForm />, { wrapper: createWrapper() });

    expect(screen.getByLabelText("name")).toBeDisabled();
    expect(screen.getByLabelText("Description")).toBeDisabled();
    expect(screen.getByLabelText("Short description")).toBeDisabled();
    expect(screen.getByLabelText("Show on home page")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Add service" })).toBeDisabled();
  });

  it("renders with modal form type when onCloseModal is provided", () => {
    const mockOnCloseModal = jest.fn();
    render(<ServiceForm onCloseModal={mockOnCloseModal} />, {
      wrapper: createWrapper(),
    });

    expect(
      screen.getByRole("button", { name: "Add service" })
    ).toBeInTheDocument();
  });

  it("handles checkbox state correctly", async () => {
    const user = userEvent.setup();
    render(<ServiceForm />, { wrapper: createWrapper() });

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it("does not require icon for editing existing service", async () => {
    const serviceToEdit = {
      id: 1,
      name: "Existing Service",
      description: "Existing Description with enough characters",
      short_description: "Short desc",
      show_home: true,
      icon: "/existing-icon.png",
    };

    const user = userEvent.setup();
    render(<ServiceForm serviceToEdit={serviceToEdit} />, {
      wrapper: createWrapper(),
    });

    const submitButton = screen.getByRole("button", { name: "Edit service" });
    await user.click(submitButton);

    // Should not show validation error for icon
    await waitFor(() => {
      expect(mockEditService).toHaveBeenCalled();
    });
  });
});
