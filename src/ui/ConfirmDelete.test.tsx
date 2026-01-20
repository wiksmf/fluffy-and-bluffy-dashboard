import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "styled-components";
import ConfirmDelete from "./ConfirmDelete";

const mockTheme = {};

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={mockTheme}>{component}</ThemeProvider>);
};

describe("ConfirmDelete", () => {
  const defaultProps = {
    resourceName: "plan",
    onConfirm: jest.fn(),
    disabled: false,
    onCloseModal: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with correct heading and message", () => {
    renderWithTheme(<ConfirmDelete {...defaultProps} />);

    expect(screen.getByText("Delete plan")).toBeInTheDocument();
    expect(
      screen.getByText(/Are you sure you want to delete this plan permanently/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/This action cannot be undone/)
    ).toBeInTheDocument();
  });

  it("renders Cancel and Delete buttons", () => {
    renderWithTheme(<ConfirmDelete {...defaultProps} />);

    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  it("calls onCloseModal when Cancel button is clicked", async () => {
    const user = userEvent.setup();
    renderWithTheme(<ConfirmDelete {...defaultProps} />);

    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    await user.click(cancelButton);

    expect(defaultProps.onCloseModal).toHaveBeenCalledTimes(1);
  });

  it("calls onConfirm when Delete button is clicked", async () => {
    const user = userEvent.setup();
    renderWithTheme(<ConfirmDelete {...defaultProps} />);

    const deleteButton = screen.getByRole("button", { name: "Delete" });
    await user.click(deleteButton);

    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it("disables buttons when disabled prop is true", () => {
    renderWithTheme(<ConfirmDelete {...defaultProps} disabled={true} />);

    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Delete" })).toBeDisabled();
  });

  it("uses different resource names correctly", () => {
    renderWithTheme(<ConfirmDelete {...defaultProps} resourceName="user" />);

    expect(screen.getByText("Delete user")).toBeInTheDocument();
    expect(
      screen.getByText(/Are you sure you want to delete this user permanently/)
    ).toBeInTheDocument();
  });

  it("works without onCloseModal prop", async () => {
    const user = userEvent.setup();
    const { onCloseModal, ...propsWithoutClose } = defaultProps;

    renderWithTheme(<ConfirmDelete {...propsWithoutClose} />);

    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    await user.click(cancelButton);

    // Should not throw an error
    expect(cancelButton).toBeInTheDocument();
  });
});
