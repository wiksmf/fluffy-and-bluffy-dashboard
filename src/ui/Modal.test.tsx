import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import userEvent from "@testing-library/user-event";
import Modal from "./Modal";

const mockTheme = {};

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={mockTheme}>{component}</ThemeProvider>);
};

// Mock the useOutsideClick hook to avoid complex portal interactions
jest.mock("../hooks/useOutsideClick", () => ({
  useOutsideClick: jest.fn(() => ({ current: null })),
}));

describe("Modal", () => {
  afterEach(() => {
    // Clean up any portals
    const portals = document.querySelectorAll('[data-testid="modal-portal"]');
    portals.forEach((portal) => portal.remove());
  });

  it("renders trigger button", () => {
    renderWithTheme(
      <Modal>
        <Modal.Open opens="test-modal">
          <button>Open Modal</button>
        </Modal.Open>
        <Modal.Window name="test-modal">
          <div>Modal Content</div>
        </Modal.Window>
      </Modal>
    );

    expect(
      screen.getByRole("button", { name: "Open Modal" })
    ).toBeInTheDocument();
  });

  it("opens modal when trigger is clicked", async () => {
    const user = userEvent.setup();

    renderWithTheme(
      <Modal>
        <Modal.Open opens="test-modal">
          <button>Open Modal</button>
        </Modal.Open>
        <Modal.Window name="test-modal">
          <div>Modal Content</div>
        </Modal.Window>
      </Modal>
    );

    const openButton = screen.getByRole("button", { name: "Open Modal" });
    await user.click(openButton);

    expect(screen.getByText("Modal Content")).toBeInTheDocument();
  });

  it("renders close button in modal when opened", async () => {
    const user = userEvent.setup();

    renderWithTheme(
      <Modal>
        <Modal.Open opens="test-modal">
          <button>Open Modal</button>
        </Modal.Open>
        <Modal.Window name="test-modal">
          <div>Modal Content</div>
        </Modal.Window>
      </Modal>
    );

    await user.click(screen.getByRole("button", { name: "Open Modal" }));

    // The close button should be rendered
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(1); // Open button + close button
  });

  it("passes onCloseModal prop to modal content", async () => {
    const user = userEvent.setup();
    const MockContent = ({ onCloseModal }: { onCloseModal?: () => void }) => (
      <div>
        <div>Modal Content</div>
        <button onClick={onCloseModal}>Custom Close</button>
      </div>
    );

    renderWithTheme(
      <Modal>
        <Modal.Open opens="test-modal">
          <button>Open Modal</button>
        </Modal.Open>
        <Modal.Window name="test-modal">
          <MockContent />
        </Modal.Window>
      </Modal>
    );

    // Open modal
    await user.click(screen.getByRole("button", { name: "Open Modal" }));
    expect(screen.getByText("Modal Content")).toBeInTheDocument();

    // Use custom close button
    const customCloseButton = screen.getByRole("button", {
      name: "Custom Close",
    });
    await user.click(customCloseButton);

    // Modal should close (content should disappear)
    expect(screen.queryByText("Modal Content")).not.toBeInTheDocument();
  });

  it("only renders modal with matching name", async () => {
    const user = userEvent.setup();

    renderWithTheme(
      <Modal>
        <Modal.Open opens="modal-1">
          <button>Open Modal 1</button>
        </Modal.Open>
        <Modal.Open opens="modal-2">
          <button>Open Modal 2</button>
        </Modal.Open>
        <Modal.Window name="modal-1">
          <div>Modal 1 Content</div>
        </Modal.Window>
        <Modal.Window name="modal-2">
          <div>Modal 2 Content</div>
        </Modal.Window>
      </Modal>
    );

    // Open first modal
    await user.click(screen.getByRole("button", { name: "Open Modal 1" }));

    expect(screen.getByText("Modal 1 Content")).toBeInTheDocument();
    expect(screen.queryByText("Modal 2 Content")).not.toBeInTheDocument();
  });

  it("handles modal state correctly", async () => {
    const user = userEvent.setup();

    renderWithTheme(
      <Modal>
        <Modal.Open opens="test-modal">
          <button>Open Modal</button>
        </Modal.Open>
        <Modal.Window name="test-modal">
          <div data-testid="modal-content">Modal Content</div>
        </Modal.Window>
      </Modal>
    );

    // Initially modal should not be visible
    expect(screen.queryByTestId("modal-content")).not.toBeInTheDocument();

    // Open modal
    await user.click(screen.getByRole("button", { name: "Open Modal" }));
    expect(screen.getByTestId("modal-content")).toBeInTheDocument();
  });
});
