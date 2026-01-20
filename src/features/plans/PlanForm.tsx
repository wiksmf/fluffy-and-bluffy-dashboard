import { useForm, type FieldErrors } from "react-hook-form";

import { useCreatePlan } from "./useCreatePlan";
import { useUpdatePlan } from "./useUpdatePlan";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";

type FormData = {
  name: string;
  description: string;
  price: number;
};

type PlanToEdit = {
  id: number;
  name?: string;
  description?: string;
  price?: number;
};

function PlanForm({
  planToEdit,
  onCloseModal,
}: {
  planToEdit?: PlanToEdit;
  onCloseModal?: () => void;
}) {
  const { isCreating, createPlan } = useCreatePlan();
  const { isEditing, editPlan } = useUpdatePlan();
  const isWorking = isCreating || isEditing;

  const { id: editId, ...editValue } = planToEdit || {};
  const isEditMode = Boolean(editId);

  const { register, handleSubmit, reset, formState } = useForm<FormData>({
    defaultValues: isEditMode ? editValue : {},
  });
  const { errors } = formState;

  function onSubmit(data: FormData) {
    if (isEditMode && editId)
      editPlan(
        { planData: data, id: editId },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        }
      );
    else
      createPlan(data, {
        onSuccess: () => {
          reset();
          onCloseModal?.();
        },
      });
  }

  function onError(errors: FieldErrors<FormData>) {
    console.error(errors);
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormRow id="name" label="Name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isWorking}
          {...register("name", {
            required: "Name is required",
            minLength: {
              value: 5,
              message: "Name must be at least 5 characters",
            },
          })}
        />
      </FormRow>

      <FormRow
        id="description"
        label="Description"
        error={errors?.description?.message}
      >
        <Textarea
          id="description"
          disabled={isWorking}
          {...register("description", {
            required: "Description is required",
            minLength: {
              value: 10,
              message: "Description must be at least 10 characters",
            },
          })}
        />
      </FormRow>

      <FormRow id="price" label="Price" error={errors?.price?.message}>
        <Input
          type="number"
          id="price"
          disabled={isWorking}
          {...register("price", {
            required: "Price is required",
            min: {
              value: 1,
              message: "Price must be at least 1",
            },
            valueAsNumber: true,
          })}
        />
      </FormRow>

      <FormRow>
        <Button
          variation="secondary"
          type="reset"
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button disabled={isWorking}>
          {isEditMode ? "Edit plan" : "Add plan"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default PlanForm;
