import { useState, useEffect } from "react";
import type { FormEvent } from "react";

import Button from "../../ui/Button";
import InputFile from "../../ui/InputFile";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";

import { useUpdateUser } from "./useUpdateUser";
import { useUser } from "./useUser";

interface UserUpdateUserDataFormProps {
  userId?: string;
}

function UserUpdateUserDataForm({ userId }: UserUpdateUserDataFormProps) {
  const { user: targetUser, isLoading: isLoadingUser } = useUser(userId);

  const email = targetUser?.email || "";
  const currentFullName = targetUser?.user_metadata?.fullName || "";

  const { updateUser, isUpdating } = useUpdateUser();

  const [fullName, setFullName] = useState(currentFullName);
  const [avatar, setAvatar] = useState<File | null>(null);

  useEffect(() => {
    if (targetUser?.user_metadata?.fullName) {
      setFullName(targetUser.user_metadata.fullName);
    }
  }, [targetUser]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!fullName || !userId) return;

    updateUser(
      {
        id: userId,
        fullName,
        avatar: avatar || undefined,
      },
      {
        onSuccess: () => {
          setAvatar(null);
          e.currentTarget.reset();
        },
      }
    );
  }

  function handleCancel() {
    setFullName(currentFullName);
    setAvatar(null);
  }

  if (isLoadingUser) return <div>Loading user data...</div>;

  return (
    <Form onSubmit={handleSubmit}>
      <FormRow label="Email address">
        <Input value={email} disabled />
      </FormRow>

      <FormRow label="Full name">
        <Input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          id="fullName"
          disabled={isUpdating}
        />
      </FormRow>

      <FormRow label="Avatar image">
        <InputFile
          type="file"
          id="avatar"
          accept="image/*"
          onChange={(e) => setAvatar(e.target.files?.[0] || null)}
          disabled={isUpdating}
        />
      </FormRow>

      <FormRow>
        <Button
          type="reset"
          variation="secondary"
          disabled={isUpdating}
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button disabled={isUpdating}>Update account</Button>
      </FormRow>
    </Form>
  );
}

export default UserUpdateUserDataForm;
