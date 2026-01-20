import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import Button from "./Button";

// Mock theme for styled-components
const mockTheme = {};

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={mockTheme}>{component}</ThemeProvider>);
};

describe("Button", () => {
  it("renders button with default props", () => {
    renderWithTheme(<Button>Click me</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Click me");
  });

  it("renders with different sizes", () => {
    const { rerender } = renderWithTheme(<Button size="small">Small</Button>);
    let button = screen.getByRole("button");
    expect(button).toBeInTheDocument();

    rerender(
      <ThemeProvider theme={mockTheme}>
        <Button size="medium">Medium</Button>
      </ThemeProvider>
    );
    button = screen.getByRole("button");
    expect(button).toBeInTheDocument();

    rerender(
      <ThemeProvider theme={mockTheme}>
        <Button size="large">Large</Button>
      </ThemeProvider>
    );
    button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("renders with different variations", () => {
    const { rerender } = renderWithTheme(
      <Button variation="primary">Primary</Button>
    );
    let button = screen.getByRole("button");
    expect(button).toBeInTheDocument();

    rerender(
      <ThemeProvider theme={mockTheme}>
        <Button variation="secondary">Secondary</Button>
      </ThemeProvider>
    );
    button = screen.getByRole("button");
    expect(button).toBeInTheDocument();

    rerender(
      <ThemeProvider theme={mockTheme}>
        <Button variation="danger">Danger</Button>
      </ThemeProvider>
    );
    button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("handles disabled state", () => {
    renderWithTheme(<Button disabled>Disabled</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("handles click events", () => {
    const handleClick = jest.fn();
    renderWithTheme(<Button onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole("button");

    button.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("passes through HTML button attributes", () => {
    renderWithTheme(
      <Button type="submit" id="test-button" className="custom-class">
        Submit
      </Button>
    );
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("type", "submit");
    expect(button).toHaveAttribute("id", "test-button");
  });

  it("renders with both size and variation props", () => {
    renderWithTheme(
      <Button size="large" variation="danger">
        Large Danger
      </Button>
    );
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Large Danger");
  });
});
