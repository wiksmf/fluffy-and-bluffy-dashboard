import styled from "styled-components";

import AddUser from "../features/users/AddUser";
import UserTable from "../features/users/UserTable";
import { useUser } from "../features/users/useUser";

import Heading from "../ui/Heading";
import Row from "../ui/Row";

const OpRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

function Users() {
  const { isAdmin } = useUser();

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Update users information</Heading>
        <OpRow>{isAdmin && <AddUser />}</OpRow>
      </Row>

      <Row>
        <UserTable />
      </Row>
    </>
  );
}

export default Users;
