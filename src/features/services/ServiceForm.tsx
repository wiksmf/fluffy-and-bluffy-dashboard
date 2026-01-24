import { useForm, type FieldErrors } from "react-hook-form";

import { useCreateService } from "./useCreateService";
import { useUpdateService } from "./useUpdateService";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";
import InputFile from "../../ui/InputFile";
import InputCheckbox from "../../ui/InputCheckbox";

type FormData = {
  name: string;
  description: string;
  short_description: string;
  show_home: boolean;
  icon: FileList;
};

type ServiceToEdit = {
  id: number;
  name: string;
  description: string;
  short_description?: string;
  show_home?: boolean;
  icon?: string;
};

function ServiceForm({
  serviceToEdit,
  onCloseModal,
}: {
  serviceToEdit?: ServiceToEdit;
  onCloseModal?: () => void;
}) {
  const { isCreating, createService } = useCreateService();
  const { isEditing, editService } = useUpdateService();
  const isWorking = isCreating || isEditing;

  const { id: editId, ...editValue } = serviceToEdit || {};
  const isEditMode = Boolean(editId);

  const { register, handleSubmit, reset, formState } = useForm<FormData>({
    defaultValues: isEditMode ? editValue : {},
  });
  const { errors } = formState;

  function onSubmit(data: FormData) {
    if (isEditMode && editId) {
      const updateData: {
        name: string;
        description: string;
        short_description: string;
        show_home: boolean;
        icon?: FileList;
        preserveExistingIcon?: boolean;
      } = {
        name: data.name,
        description: data.description,
        short_description: data.short_description,
        show_home: data.show_home,
      };

      const hasNewFile =
        data.icon && data.icon instanceof FileList && data.icon.length > 0;

      if (hasNewFile) {
        updateData.icon = data.icon;
      } else {
        updateData.preserveExistingIcon = true;
      }

      editService(
        { serviceData: updateData, id: editId },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        }
      );
    } else {
      createService(data, {
        onSuccess: () => {
          reset();
          onCloseModal?.();
        },
      });
    }
  }

  function onError(errors: FieldErrors<FormData>) {
    console.error(errors);
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormRow id="name" label="name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isWorking}
          {...register("name", {
            required: "name is required",
            minLength: {
              value: 5,
              message: "name must be at least 5 characters",
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

      <FormRow
        id="short_description"
        label="Short description"
        error={errors?.short_description?.message}
      >
        <Textarea
          id="short_description"
          disabled={isWorking}
          {...register("short_description")}
        />
      </FormRow>

      <FormRow
        id="show_home"
        label="Show on home page"
        error={errors?.show_home?.message}
      >
        <InputCheckbox
          type="checkbox"
          id="show_home"
          disabled={isWorking}
          {...register("show_home")}
        />
      </FormRow>

      <FormRow id="icon" label="Icon" error={errors?.icon?.message}>
        <InputFile
          type="file"
          id="icon"
          accept="image/*"
          {...register("icon", {
            required: isEditMode ? false : "This field is required",
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
          {isEditMode ? "Edit service" : "Add service"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default ServiceForm;
