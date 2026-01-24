import { useNavigate, useParams } from "react-router-dom";
import { HiOutlineArrowSmallLeft } from "react-icons/hi2";

import UserUpdatePasswordForm from "../features/users/UserUpdatePasswordForm";
import UserUpdateUserDataForm from "../features/users/UserUpdateUserDataForm";
import { useUser } from "../features/users/useUser";

import ButtonText from "../ui/ButtonText";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import Spinner from "../ui/Spinner";

function Account() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { user: currentUser } = useUser(); // Current authenticated user

  // If no userId in URL, use current user's ID
  const targetUserId = userId || currentUser?.id;

  // Fetch the user data for the target user
  const { user: targetUser, isLoading } = useUser(targetUserId);

  // Determine if current user can edit this account
  const canEdit =
    currentUser?.user_metadata?.isAdmin || currentUser?.id === targetUserId;

  if (isLoading) return <Spinner />;

  if (!canEdit) {
    return (
      <Row>
        <Heading as="h1">Access Denied</Heading>
        <p>You don't have permission to edit this account.</p>
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
