import styled from "styled-components";

import UserAvatar from "../features/users/UserAvatar";

import HeaderMenu from "./HeaderMenu";

const StyledHeader = styled.header`
  display: flex;
  gap: 2.4rem;
  align-items: center;
  justify-content: flex-end;
  padding: 1.5rem 4rem;
  background-color: var(--color-grey-100);
  border-bottom: 1px solid var(--color-grey-200);
`;

function Header() {
  return (
    <StyledHeader>
      <UserAvatar />
      <HeaderMenu />
    </StyledHeader>
  );
}

export default Header;
