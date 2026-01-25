import { useUsers } from "./useUsers";
import { useUser } from "./useUser";

import UserRow from "./UserRow";

import Spinner from "../../ui/Spinner";
import Table from "../../ui/Table";
import Empty from "../../ui/Empty";
import Menus from "../../ui/Menus";

function UserTable() {
  const { isPending, users } = useUsers();
  const { isAdmin } = useUser();

  if (isPending) return <Spinner />;

  if (!users || !users.length) return <Empty resourceName="users" />;

  return (
    <Menus>
      <Table columns="15rem 20rem 25rem 14rem  1fr">
        <Table.Header>
          <div>Avatar</div>
          <div>Full Name</div>
          <div>E-mail</div>
          <div>Admin</div>
          <div></div>
        </Table.Header>

        <Table.Body
          data={users || []}
          render={(user: any) => (
            <UserRow user={user} key={user.id} canModify={isAdmin} />
          )}
        />
      </Table>
    </Menus>
  );
}

export default UserTable;
