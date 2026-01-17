import styled from "styled-components";

const StyledHeader = styled.header`
  padding: 1.5rem 4rem;
  background-color: var(--color-grey-100);
  border-bottom: 1px solid var(--color-grey-200);
`;

function Header() {
  return <StyledHeader>Header</StyledHeader>;
}

export default Header;
