import { useNavigate, useParams } from "react-router-dom";
import { HiOutlineArrowSmallLeft } from "react-icons/hi2";

import UserUpdatePasswordForm from "../features/users/UserUpdatePasswordForm";
import UserUpdateUserDataForm from "../features/users/UserUpdateUserDataForm";
import { useUser } from "../features/users/useUser";

import ButtonText from "../ui/ButtonText";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import Spinner from "../ui/Spinner";
import Empty from "../ui/Empty";

function Account() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { user: currentUser } = useUser();

  const targetUserId = userId || currentUser?.id;

  const { user: targetUser, isLoading } = useUser(targetUserId);

  if (!targetUser) return <Empty resourceName="user" />;

  const canEdit =
    currentUser?.user_metadata?.isAdmin || currentUser?.id === targetUserId;

  if (isLoading) return <Spinner />;

  if (!canEdit) {
    return (
      <Row>
        <Heading as="h1">Access Denied</Heading>
        <p>You don&apos;t have permission to edit this account.</p>
      </Row>
    );
  }

  const isOwnAccount = currentUser?.id === targetUserId;
  const userName =
    targetUser?.user_metadata?.fullName || targetUser?.email || "User";

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">
          {isOwnAccount
            ? "Update your account"
            : `Update ${userName}'s account`}
        </Heading>
        <ButtonText onClick={() => navigate("/users")}>
          <HiOutlineArrowSmallLeft /> Back
        </ButtonText>
      </Row>

      <Row>
        <Heading as="h3">Update user data</Heading>
        <UserUpdateUserDataForm userId={targetUserId} />
      </Row>

      <Row>
        <Heading as="h3">Update password</Heading>
        <UserUpdatePasswordForm userId={targetUserId} />
      </Row>
    </>
  );
}

export default Account;
