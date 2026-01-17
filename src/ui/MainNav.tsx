import { NavLink } from "react-router-dom";
import styled from "styled-components";

import {
  HiOutlineHome,
  HiOutlineCalendarDays,
  HiOutlineUser,
  HiOutlineCog6Tooth,
  HiOutlineSparkles,
} from "react-icons/hi2";

const NavList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StyledNavLink = styled(NavLink)`
  &:link,
  &:visited {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    font-size: 1.6rem;
    font-weight: 500;
    color: var(--color-gray-800);
    padding: 1.5rem 2.5rem;
    transition: all 0.3s;
  }

  &:hover,
  &:active,
  &.active:link,
  &.active:visited {
    color: var(--color-grey-900);
    background-color: var(--color-grey-50);
    border-radius: var(--border-radius-sm);
  }

  & svg {
    width: 2.3rem;
    height: 2.3rem;
    color: var(--color-grey-500);
    transition: all 0.3s;
  }

  &:hover svg,
  &:active svg,
  &.active:link svg,
  &.active:visited svg {
    color: var(--color-tertiary);
  }
`;

function MainNav() {
  return (
    <nav>
      <NavList>
        <li>
          <StyledNavLink to="/dashboard">
            <HiOutlineHome />
            <span>Home</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/bookings">
            <HiOutlineCalendarDays />
            <span>Bookings</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/services">
            <HiOutlineSparkles />
            <span>Services</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/users">
            <HiOutlineUser />
            <span>Users</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/settings">
            <HiOutlineCog6Tooth />
            <span>Settings</span>
          </StyledNavLink>
        </li>
      </NavList>
    </nav>
  );
}

export default MainNav;
