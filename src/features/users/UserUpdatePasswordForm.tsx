import { useForm } from "react-hook-form";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import { useUpdateUser } from "./useUpdateUser";

interface PasswordFormData {
  password: string;
  passwordConfirm: string;
}

interface UserUpdatePasswordFormProps {
  userId?: string;
}

function UserUpdatePasswordForm({ userId }: UserUpdatePasswordFormProps) {
  const { updateUser, isUpdating } = useUpdateUser();

  const { register, handleSubmit, formState, reset, getValues } =
    useForm<PasswordFormData>();
  const { errors } = formState;

  function onSubmit({ password }: PasswordFormData) {
    if (!userId) return;

    updateUser(
      {
        id: userId,
        password,
      },
      { onSuccess: () => reset() }
    );
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow
        label="New password (min 8 characters)"
        error={errors?.password?.message}
      >
        <Input
          type="password"
          id="password"
          autoComplete="current-password"
          disabled={isUpdating}
          {...register("password", {
            required: "This field is required",
            minLength: {
              value: 8,
              message: "Password needs a minimum of 8 characters",
            },
          })}
        />
      </FormRow>

      <FormRow
        label="Confirm password"
        error={errors?.passwordConfirm?.message}
      >
        <Input
          type="password"
          id="passwordConfirm"
          autoComplete="new-password"
          disabled={isUpdating}
          {...register("passwordConfirm", {
            required: "This field is required",
            validate: (value) =>
              getValues().password === value || "Passwords need to match",
          })}
        />
      </FormRow>

      <FormRow>
        <Button onClick={() => reset()} type="reset" variation="secondary">
          Cancel
        </Button>
        <Button disabled={isUpdating}>Update password</Button>
      </FormRow>
    </Form>
  );
}

export default UserUpdatePasswordForm;
