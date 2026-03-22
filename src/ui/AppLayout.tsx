import { useState } from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";

import Sidebar from "./Sidebar";
import Header from "./Header";
import Main from "./Main";
import Container from "./Container";
import { HiOutlineNoSymbol } from "react-icons/hi2";

const StyledAppLayout = styled.div<{ collapsed?: boolean }>`
  display: grid;
  grid-template-columns: ${(props) =>
    props.collapsed ? "6rem 1fr" : "25rem 1fr"};
  grid-template-rows: auto auto 1fr;
  height: 100vh;
  background-color: var(--color-grey-50);
`;

const DemoBanner = styled.div`
  position: fixed;
  top: 0.5rem;
  left: 50%;
  transform: translate(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.2rem 4rem;
  font-size: 1.5rem;
  font-weight: 500;
  letter-spacing: 0.05rem;
  color: var(--banner-main);
  background-color: var(--banner-bg);
  border: 1px solid var(--banner-main);
  border-radius: var(--border-radius-sm);
`;

function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setCollapsed((c) => !c);

  return (
    <>
      <DemoBanner>
        <HiOutlineNoSymbol size={20} />
        Data modifications (creation, updates, and deletions) are disabled.
      </DemoBanner>

      <StyledAppLayout collapsed={collapsed}>
        <Header />
        <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />

        <Main>
          <Container>
            <Outlet />
          </Container>
        </Main>
      </StyledAppLayout>
    </>
  );
}

export default AppLayout;
