import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PlanForm from "./PlanForm";

const mockTheme = {};

// Create proper mocks that can be overridden
const mockCreatePlan = jest.fn();
const mockEditPlan = jest.fn();

jest.mock("./useCreatePlan", () => ({
  useCreatePlan: jest.fn(() => ({
    isCreating: false,
    createPlan: mockCreatePlan,
  })),
}));

jest.mock("./useUpdatePlan", () => ({
  useUpdatePlan: jest.fn(() => ({
    isEditing: false,
    editPlan: mockEditPlan,
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

describe("PlanForm", () => {
  const useCreatePlan = require("./useCreatePlan").useCreatePlan;
  const useUpdatePlan = require("./useUpdatePlan").useUpdatePlan;

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mocks to default state
    useCreatePlan.mockReturnValue({
      isCreating: false,
      createPlan: mockCreatePlan,
    });
    useUpdatePlan.mockReturnValue({
      isEditing: false,
      editPlan: mockEditPlan,
    });
  });

  it("renders form fields for creating new plan", () => {
    render(<PlanForm />, { wrapper: createWrapper() });

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByLabelText("Price")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add plan" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("renders form fields for editing existing plan", () => {
    const planToEdit = {
      id: 1,
      name: "Test Plan",
      description: "Test Description",
      price: 100,
    };

    render(<PlanForm planToEdit={planToEdit} />, { wrapper: createWrapper() });

    expect(screen.getByDisplayValue("Test Plan")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test Description")).toBeInTheDocument();
    expect(screen.getByDisplayValue("100")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Edit plan" })
    ).toBeInTheDocument();
  });

  it("shows validation errors for required fields", async () => {
    const user = userEvent.setup();
    render(<PlanForm />, { wrapper: createWrapper() });

    const submitButton = screen.getByRole("button", { name: "Add plan" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
      expect(screen.getByText("Description is required")).toBeInTheDocument();
      expect(screen.getByText("Price is required")).toBeInTheDocument();
    });
  });

  it("shows validation errors for minimum length", async () => {
    const user = userEvent.setup();
    render(<PlanForm />, { wrapper: createWrapper() });

    const nameInput = screen.getByLabelText("Name");
    const descriptionInput = screen.getByLabelText("Description");

    await user.type(nameInput, "abc"); // Less than 5 characters
    await user.type(descriptionInput, "short"); // Less than 10 characters

    const submitButton = screen.getByRole("button", { name: "Add plan" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Name must be at least 5 characters")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Description must be at least 10 characters")
      ).toBeInTheDocument();
    });
  });

  it("shows validation error for minimum price", async () => {
    const user = userEvent.setup();
    render(<PlanForm />, { wrapper: createWrapper() });

    const priceInput = screen.getByLabelText("Price");
    await user.type(priceInput, "0");

    const submitButton = screen.getByRole("button", { name: "Add plan" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Price must be at least 1")).toBeInTheDocument();
    });
  });

  it("calls createPlan with form data when creating new plan", async () => {
    const user = userEvent.setup();
    render(<PlanForm />, { wrapper: createWrapper() });

    await user.type(screen.getByLabelText("Name"), "New Plan");
    await user.type(
      screen.getByLabelText("Description"),
      "New Description for plan"
    );
    await user.type(screen.getByLabelText("Price"), "150");

    const submitButton = screen.getByRole("button", { name: "Add plan" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockCreatePlan).toHaveBeenCalledWith(
        {
          name: "New Plan",
          description: "New Description for plan",
          price: 150,
        },
        expect.any(Object)
      );
    });
  });

  it("calls editPlan with form data when editing existing plan", async () => {
    const planToEdit = {
      id: 1,
      name: "Existing Plan",
      description: "Existing Description",
      price: 100,
    };

    const user = userEvent.setup();
    render(<PlanForm planToEdit={planToEdit} />, { wrapper: createWrapper() });

    const nameInput = screen.getByDisplayValue("Existing Plan");
    await user.clear(nameInput);
    await user.type(nameInput, "Updated Plan");

    const submitButton = screen.getByRole("button", { name: "Edit plan" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockEditPlan).toHaveBeenCalledWith(
        {
          planData: {
            name: "Updated Plan",
            description: "Existing Description",
            price: 100,
          },
          id: 1,
        },
        expect.any(Object)
      );
    });
  });

  it("calls onCloseModal when Cancel button is clicked", async () => {
    const mockOnCloseModal = jest.fn();
    const user = userEvent.setup();

    render(<PlanForm onCloseModal={mockOnCloseModal} />, {
      wrapper: createWrapper(),
    });

    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    await user.click(cancelButton);

    expect(mockOnCloseModal).toHaveBeenCalledTimes(1);
  });

  it("disables form when isWorking is true", () => {
    useCreatePlan.mockReturnValue({
      isCreating: true,
      createPlan: mockCreatePlan,
    });

    render(<PlanForm />, { wrapper: createWrapper() });

    expect(screen.getByLabelText("Name")).toBeDisabled();
    expect(screen.getByLabelText("Description")).toBeDisabled();
    expect(screen.getByLabelText("Price")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Add plan" })).toBeDisabled();
  });

  it("renders with modal form type when onCloseModal is provided", () => {
    const mockOnCloseModal = jest.fn();
    render(<PlanForm onCloseModal={mockOnCloseModal} />, {
      wrapper: createWrapper(),
    });

    // The form should render (we can't easily test the styled-component prop)
    expect(
      screen.getByRole("button", { name: "Add plan" })
    ).toBeInTheDocument();
  });

  it("handles number input for price correctly", async () => {
    const user = userEvent.setup();
    render(<PlanForm />, { wrapper: createWrapper() });

    const priceInput = screen.getByLabelText("Price");
    await user.type(priceInput, "99.99");

    expect(priceInput).toHaveValue(99.99);
  });

  it("handles successful form submission", async () => {
    const user = userEvent.setup();
    render(<PlanForm />, { wrapper: createWrapper() });

    await user.type(screen.getByLabelText("Name"), "Test Plan");
    await user.type(screen.getByLabelText("Description"), "Test Description");
    await user.type(screen.getByLabelText("Price"), "100");

    const submitButton = screen.getByRole("button", { name: "Add plan" });
    await user.click(submitButton);

    // Verify the form submission was called
    expect(mockCreatePlan).toHaveBeenCalledWith(
      {
        name: "Test Plan",
        description: "Test Description",
        price: 100,
      },
      expect.any(Object)
    );
  });
});
