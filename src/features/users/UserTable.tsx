import { useUsers } from "./useUsers";
import { useUser } from "./useUser";

import UserRow from "./UserRow";

import Spinner from "../../ui/Spinner";
import Table from "../../ui/Table";
import Empty from "../../ui/Empty";

type SupabaseUser = {
  id: string;
  email?: string;
  user_metadata: {
    fullName?: string;
    isAdmin?: boolean;
    avatar?: string;
  };
  created_at: string;
};

function UserTable() {
  const { isPending, users } = useUsers();
  const { isAdmin } = useUser();

  if (isPending) return <Spinner />;

  if (!users || !users.length) return <Empty resourceName="users" />;

  return (
    <Table columns="15rem 20rem 25rem 14rem  0.2fr">
      <Table.Header>
        <div>Avatar</div>
        <div>Full Name</div>
        <div>E-mail</div>
        <div>Admin</div>
        <div></div>
      </Table.Header>

      <Table.Body
        data={users || []}
        render={(user: SupabaseUser) => (
          <UserRow user={user} key={user.id} canModify={isAdmin} />
        )}
      />
    </Table>
  );
}

export default UserTable;
