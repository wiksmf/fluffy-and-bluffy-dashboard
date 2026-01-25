import { createContext, useContext } from "react";
import styled from "styled-components";

const StyledTable = styled.div`
  border: 1px solid var(--color-grey-200);

  font-size: 1.4rem;
  background-color: var(--color-grey-50);
  border-radius: var(--border-radius-md);
  overflow: visible;
`;

const CommonRow = styled.div<StyledRowProps>`
  display: grid;
  grid-template-columns: ${(props) => props.columns};
  column-gap: 2.4rem;
  align-items: center;
  transition: none;
`;

const StyledHeader = styled(CommonRow)`
  padding: 1.6rem 2.4rem;
  font-weight: 600;
  letter-spacing: 0.4px;
  color: var(--color-grey-600);
  background-color: var(--color-grey-50);
  border-top-left-radius: var(--border-radius-md);
  border-top-right-radius: var(--border-radius-md);
  border-bottom: 1px solid var(--color-grey-100);
  text-transform: uppercase;
`;

const StyledRow = styled(CommonRow)`
  padding: 1.2rem 2.4rem;

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }
`;

const StyledBody = styled.section`
  margin: 0.4rem 0;
`;

const Footer = styled.footer`
  background-color: var(--color-grey-50);
  display: flex;
  justify-content: center;
  padding: 1.2rem;
  border-top: 1px solid var(--color-grey-100);

  &:not(:has(*)) {
    display: none;
  }
`;

const Empty = styled.p`
  font-size: 1.6rem;
  font-weight: 500;
  text-align: center;
  margin: 2.4rem;
`;

interface StyledRowProps {
  columns: string;
}

interface TableContextType {
  columns: string;
}

interface TableProps {
  columns: string;
  children: React.ReactNode;
}

interface TableComponentProps {
  children: React.ReactNode;
}

interface BodyProps<T = Record<string, unknown>> {
  data: T[];
  render: (item: T) => React.ReactNode;
}

const TableContext = createContext<TableContextType>({
  columns: "",
});

function Table({ columns, children }: TableProps) {
  return (
    <TableContext.Provider value={{ columns }}>
      <StyledTable role="table">{children}</StyledTable>
    </TableContext.Provider>
  );
}

function Header({ children }: TableComponentProps) {
  const { columns } = useContext(TableContext);

  return (
    <StyledHeader role="row" columns={columns}>
      {children}
    </StyledHeader>
  );
}

function Row({ children }: TableComponentProps) {
  const { columns } = useContext(TableContext);

  return (
    <StyledRow role="row" columns={columns}>
      {children}
    </StyledRow>
  );
}

function Body<T = Record<string, unknown>>({ data, render }: BodyProps<T>) {
  if (!data.length) return <Empty>No data available.</Empty>;

  return <StyledBody>{data.map(render)}</StyledBody>;
}

Table.Header = Header;
Table.Row = Row;
Table.Body = Body;
Table.Footer = Footer;

export default Table;
