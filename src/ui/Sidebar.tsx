import styled from "styled-components";

import Logo from "./Logo";
import MainNav from "./MainNav";

import {
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
} from "react-icons/hi2";

const StyledSidebar = styled.aside<{ collapsed?: boolean }>`
  grid-row: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
  padding: 1.5rem 2rem;
  background-color: var(--color-grey-100);
  border-right: 1px solid var(--color-grey-200);

  &[data-collapsed="true"] {
    gap: 1.2rem;
    align-items: center;
    padding: 1.2rem 0.8rem;
  }

  &[data-collapsed="true"] nav span {
    display: none;
  }

  &[data-collapsed="true"] .logo img {
    height: 4rem;
  }
`;

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: fit-content;
  margin-top: auto;
  padding: 0.8rem 1.2rem;
  background: none;
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-sm);
  color: var(--color-grey-800);
  cursor: pointer;

  &:hover {
    background-color: var(--color-grey-50);
  }
`;

type Props = {
  collapsed?: boolean;
  onToggle?: () => void;
};

function Sidebar({ collapsed = false, onToggle }: Props) {
  return (
    <StyledSidebar data-collapsed={collapsed} collapsed={collapsed}>
      <Logo />
      <MainNav />

      <ToggleButton
        onClick={onToggle}
        aria-pressed={collapsed}
        aria-label="Toggle sidebar"
      >
        {collapsed ? (
          <HiOutlineChevronDoubleRight />
        ) : (
          <HiOutlineChevronDoubleLeft />
        )}

        <span>{collapsed ? "" : "Hide"}</span>
      </ToggleButton>
    </StyledSidebar>
  );
}

export default Sidebar;
