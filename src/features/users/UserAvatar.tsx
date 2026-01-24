import styled from "styled-components";

import { useUser } from "./useUser";

import AvatarPlaceholder from "../../ui/AvatarPlaceholder";
import Avatar from "../../ui/Avatar";

const StyledUserAvatar = styled.div`
  display: flex;
  gap: 1.2rem;
  align-items: center;
  font-weight: 500;
  font-size: 1.4rem;
  color: var(--color-grey-600);
`;

function UserAvatar() {
  const { user } = useUser();

  if (!user) return null;

  const { fullName, avatar } = user.user_metadata || {};

  return (
    <StyledUserAvatar>
      {avatar ? (
        <Avatar src={avatar} alt={`${fullName || "User"} avatar`} />
      ) : (
        <AvatarPlaceholder>
          {(fullName || "U").charAt(0).toUpperCase()}
        </AvatarPlaceholder>
      )}
      <span>{fullName}</span>
    </StyledUserAvatar>
  );
}

export default UserAvatar;
