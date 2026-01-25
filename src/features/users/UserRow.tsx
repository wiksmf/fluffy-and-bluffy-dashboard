import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi2";

import { useUser } from "./useUser";
import { useDeleteUser } from "./useDeleteUser";
import type { User } from "../../services/apiUsers";

import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Table from "../../ui/Table";
import AvatarPlaceholder from "../../ui/AvatarPlaceholder";
import Avatar from "../../ui/Avatar";
import Menus from "../../ui/Menus";

const UserName = styled.div`
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--color-primary);
`;

const UserEmail = styled.div`
  font-size: 1.4rem;
`;

const UserRole = styled.div`
  font-size: 1.4rem;
  font-weight: 600;
`;

function UserRow({ user, canModify }: { user: User; canModify: boolean }) {
  const { id: userId, email, user_metadata } = user;
  const { fullName, isAdmin, avatar } = user_metadata || {};

  const navigate = useNavigate();
  const { isDeleting, deleteUser } = useDeleteUser();
  const { user: currentUser } = useUser();

  const isCurrentUser = currentUser?.id === userId;

  return (
    <Table.Row>
      <div>
        {avatar ? (
          <Avatar src={avatar} alt={`${fullName || "User"} avatar`} />
        ) : (
          <AvatarPlaceholder>
            {(fullName || "U").charAt(0).toUpperCase()}
          </AvatarPlaceholder>
        )}
      </div>

      <UserName>{fullName || "No name"}</UserName>
      <UserEmail>{email || "No email"}</UserEmail>
      <UserRole>{isAdmin ? "Yes" : "No"}</UserRole>

      {isCurrentUser && !isAdmin && (
        <Menus.Menu>
          <Menus.Toggle id={userId} />
          <Menus.List id={userId}>
            <Menus.Button
              icon={<HiOutlinePencil />}
              onClick={() => navigate(`/account/${userId}`)}
            >
              Update user
            </Menus.Button>
          </Menus.List>
        </Menus.Menu>
      )}

      {canModify && !isAdmin && (
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={userId} />
            <Menus.List id={userId}>
              <Menus.Button
                icon={<HiOutlinePencil />}
                onClick={() => navigate(`/account/${userId}`)}
              >
                Update user
              </Menus.Button>

              <Modal.Open opens="delete">
                <Menus.Button icon={<HiOutlineTrash />}>
                  Delete user
                </Menus.Button>
              </Modal.Open>
            </Menus.List>
          </Menus.Menu>

          <Modal.Window name="delete">
            <ConfirmDelete
              resourceName="users"
              onConfirm={() => deleteUser(userId)}
              disabled={isDeleting}
            />
          </Modal.Window>
        </Modal>
      )}
    </Table.Row>
  );
}

export default UserRow;
