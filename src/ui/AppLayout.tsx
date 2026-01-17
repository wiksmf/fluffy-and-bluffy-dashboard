import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";
import Main from "./Main";
import styled from "styled-components";

const StyledAppLayout = styled.div`
  display: grid;
  grid-template-columns: 24rem 1fr;
  grid-template-rows: auto 1fr;
  height: 100vh;
`;

function AppLayout() {
  return (
    <StyledAppLayout>
      <Header />
      <Sidebar />

      <Main>
        <Outlet />
      </Main>
    </StyledAppLayout>
  );
}

export default AppLayout;
