import { useState } from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";

import Sidebar from "./Sidebar";
import Header from "./Header";
import Main from "./Main";
import Container from "./Container";

const StyledAppLayout = styled.div<{ collapsed?: boolean }>`
  display: grid;
  grid-template-columns: ${(props) =>
    props.collapsed ? "6rem 1fr" : "30rem 1fr"};
  grid-template-rows: auto 1fr;
  height: 100vh;
`;

function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setCollapsed((c) => !c);

  return (
    <StyledAppLayout collapsed={collapsed}>
      <Header />
      <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />

      <Main>
        <Container>
          <Outlet />
        </Container>
      </Main>
    </StyledAppLayout>
  );
}

export default AppLayout;
