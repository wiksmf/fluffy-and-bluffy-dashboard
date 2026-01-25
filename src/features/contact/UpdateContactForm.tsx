import { useContact } from "./useContact";
import { useUpdateContact } from "./useUpdateContact";

import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Spinner from "../../ui/Spinner";

function UpdateContactForm() {
  const { isLoading, contacts: { phone, email, address } = {} } = useContact();
  const { isUpdating, updateContact } = useUpdateContact();

  if (isLoading) return <Spinner />;

  function handleUpdate(e: React.FocusEvent<HTMLInputElement>, field: string) {
    const { value } = e.target;

    if (!value) return;
    updateContact({ [field]: value });
  }

  return (
    <Form>
      <FormRow label="Phone">
        <Input
          type="text"
          id="phone"
          defaultValue={phone}
          disabled={isUpdating}
          onBlur={(e) => handleUpdate(e, "phone")}
        />
      </FormRow>

      <FormRow label="E-mail">
        <Input
          type="text"
          id="email"
          defaultValue={email}
          disabled={isUpdating}
          onBlur={(e) => handleUpdate(e, "email")}
        />
      </FormRow>

      <FormRow label="Address">
        <Input
          type="text"
          id="address"
          defaultValue={address}
          disabled={isUpdating}
          onBlur={(e) => handleUpdate(e, "address")}
        />
      </FormRow>
    </Form>
  );
}

export default UpdateContactForm;
