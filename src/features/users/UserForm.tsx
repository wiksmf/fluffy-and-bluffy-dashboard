import { useForm, Controller } from "react-hook-form";

import { useCreateUser } from "./useCreateUser";

import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import InputCheckbox from "../../ui/InputCheckbox";

interface UserFormData {
  fullName: string;
  email: string;
  password: string;
  passwordConfirm: string;
  isAdmin: boolean;
}

type UserProps = {
  id: string;
  email?: string;
  user_metadata: {
    fullName?: string;
    isAdmin?: boolean;
    avatar?: string;
  };
  created_at: string;
};

function UserForm({
  userToEdit,
  onCloseModal,
}: {
  userToEdit?: UserProps;
  onCloseModal?: () => void;
}) {
  const { createUser, isPending: isCreating } = useCreateUser();
  const isPending = isCreating;

  const isEditSession = Boolean(userToEdit?.id);

  const { register, formState, getValues, handleSubmit, reset, control } =
    useForm<UserFormData>({
      defaultValues: isEditSession
        ? {
            fullName: userToEdit?.user_metadata?.fullName || "",
            email: userToEdit?.email || "",
            password: "",
            passwordConfirm: "",
            isAdmin: userToEdit?.user_metadata?.isAdmin || false,
          }
        : {},
    });
  const { errors } = formState;

  function onSubmit({ fullName, email, password, isAdmin }: UserFormData) {
    createUser(
      { fullName, email, password, isAdmin },
      {
        onSuccess: () => {
          reset();
          onCloseModal?.();
        },
      }
    );
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} type="modal">
      <FormRow label="Full name" error={errors?.fullName?.message}>
        <Input
          type="text"
          id="fullName"
          disabled={isPending}
          {...register("fullName", { required: "This field is required" })}
        />
      </FormRow>

      <FormRow label="E-mail address" error={errors?.email?.message}>
        <Input
          type="email"
          id="email"
          disabled={isPending || isEditSession}
          {...register("email", {
            required: "This field is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Please provide a valid email address",
            },
          })}
        />
      </FormRow>

      <FormRow
        label={`Password ${
          isEditSession ? "(leave empty to keep current)" : "(min 8 characters)"
        }`}
        error={errors?.password?.message}
      >
        <Input
          type="password"
          id="password"
          disabled={isPending}
          {...register("password", {
            required: isEditSession ? false : "This field is required",
            minLength: {
              value: 8,
              message: "Password needs a minimum of 8 characters",
            },
          })}
        />
      </FormRow>

      {!isEditSession && (
        <FormRow
          label="Repeat password"
          error={errors?.passwordConfirm?.message}
        >
          <Input
            type="password"
            id="passwordConfirm"
            disabled={isPending}
            {...register("passwordConfirm", {
              required: "This field is required",
              validate: (value) =>
                value === getValues().password || "Passwords need to match",
            })}
          />
        </FormRow>
      )}

      <FormRow label="Admin user">
        <Controller
          name="isAdmin"
          control={control}
          render={({ field: { value, onChange } }) => (
            <InputCheckbox
              id="isAdmin"
              disabled={isPending}
              checked={value}
              onChange={() => onChange(!value)}
            />
          )}
        />
      </FormRow>

      <FormRow>
        <Button
          variation="secondary"
          type="reset"
          disabled={isPending}
          onClick={() => {
            reset();
            onCloseModal?.();
          }}
        >
          Cancel
        </Button>
        <Button disabled={isPending}>
          {isEditSession ? "Update user" : "Create new user"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default UserForm;
