import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import Table from "./Table";

const mockTheme = {};

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={mockTheme}>{component}</ThemeProvider>);
};

describe("Table", () => {
  const mockData = [
    { id: 1, name: "Item 1", value: 100 },
    { id: 2, name: "Item 2", value: 200 },
  ];

  it("renders table with correct structure", () => {
    renderWithTheme(
      <Table columns="1fr 1fr 1fr">
        <Table.Header>
          <div>Name</div>
          <div>Value</div>
          <div>Actions</div>
        </Table.Header>
        <Table.Body
          data={mockData}
          render={(item) => (
            <Table.Row key={item.id}>
              <div>{item.name}</div>
              <div>{item.value}</div>
              <div>Edit</div>
            </Table.Row>
          )}
        />
      </Table>
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Value")).toBeInTheDocument();
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });

  it("renders empty state when no data", () => {
    renderWithTheme(
      <Table columns="1fr 1fr">
        <Table.Header>
          <div>Name</div>
          <div>Value</div>
        </Table.Header>
        <Table.Body
          data={[]}
          render={(item: any) => (
            <Table.Row key={item.id}>
              <div>{item.name}</div>
            </Table.Row>
          )}
        />
      </Table>
    );

    expect(screen.getByText("No data available.")).toBeInTheDocument();
  });

  it("renders header with correct role", () => {
    renderWithTheme(
      <Table columns="1fr 1fr">
        <Table.Header>
          <div>Column 1</div>
          <div>Column 2</div>
        </Table.Header>
      </Table>
    );

    const headers = screen.getAllByRole("row");
    expect(headers).toHaveLength(1);
  });

  it("renders rows with correct role", () => {
    renderWithTheme(
      <Table columns="1fr 1fr">
        <Table.Body
          data={mockData}
          render={(item) => (
            <Table.Row key={item.id}>
              <div>{item.name}</div>
              <div>{item.value}</div>
            </Table.Row>
          )}
        />
      </Table>
    );

    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(2); // One for each data item
  });

  it("renders footer when provided", () => {
    renderWithTheme(
      <Table columns="1fr 1fr">
        <Table.Header>
          <div>Name</div>
          <div>Value</div>
        </Table.Header>
        <Table.Body
          data={mockData}
          render={(item) => (
            <Table.Row key={item.id}>
              <div>{item.name}</div>
            </Table.Row>
          )}
        />
        <Table.Footer>
          <div>Footer content</div>
        </Table.Footer>
      </Table>
    );

    expect(screen.getByText("Footer content")).toBeInTheDocument();
  });

  it("provides columns context to child components", () => {
    const TestComponent = () => {
      return (
        <Table columns="100px 200px 1fr">
          <Table.Header>
            <div>Col 1</div>
            <div>Col 2</div>
            <div>Col 3</div>
          </Table.Header>
        </Table>
      );
    };

    renderWithTheme(<TestComponent />);

    // The context should be provided to header and it should render
    expect(screen.getByText("Col 1")).toBeInTheDocument();
  });

  it("handles complex data structures in render function", () => {
    const complexData = [
      {
        id: 1,
        user: { name: "John Doe", email: "john@example.com" },
        stats: { views: 100, clicks: 10 },
      },
    ];

    renderWithTheme(
      <Table columns="1fr 1fr 1fr">
        <Table.Body
          data={complexData}
          render={(item) => (
            <Table.Row key={item.id}>
              <div>{item.user.name}</div>
              <div>{item.user.email}</div>
              <div>{item.stats.views}</div>
            </Table.Row>
          )}
        />
      </Table>
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("can render multiple rows and headers together", () => {
    renderWithTheme(
      <Table columns="1fr 1fr">
        <Table.Header>
          <div>Header 1</div>
          <div>Header 2</div>
        </Table.Header>
        <Table.Body
          data={mockData}
          render={(item) => (
            <Table.Row key={item.id}>
              <div>{item.name}</div>
              <div>{item.value}</div>
            </Table.Row>
          )}
        />
        <Table.Footer>
          <div>Total: 2 items</div>
        </Table.Footer>
      </Table>
    );

    expect(screen.getByText("Header 1")).toBeInTheDocument();
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    expect(screen.getByText("Total: 2 items")).toBeInTheDocument();
  });
});
