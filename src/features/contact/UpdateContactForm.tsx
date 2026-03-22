import { useEffect, useState } from "react";

import { useContact } from "./useContact";
import { useUpdateContact } from "./useUpdateContact";

import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Spinner from "../../ui/Spinner";

type ContactFormData = {
  phone: string;
  email: string;
  address: string;
};

function UpdateContactForm() {
  const { isLoading, contacts: { phone, email, address } = {} } = useContact();
  const { isUpdating, updateContact } = useUpdateContact();
  const [formData, setFormData] = useState<ContactFormData>({
    phone: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    setFormData({
      phone: phone ?? "",
      email: email ?? "",
      address: address ?? "",
    });
  }, [phone, email, address]);

  if (isLoading) return <Spinner />;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setFormData((current) => ({ ...current, [id]: value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    updateContact(formData);
  }

  function handleReset() {
    setFormData({
      phone: phone ?? "",
      email: email ?? "",
      address: address ?? "",
    });
  }

  return (
    <>
      <Form id="update-contact-form" type="form" onSubmit={handleSubmit}>
        <FormRow label="Phone" id="phone" type="form">
          <Input
            type="text"
            id="phone"
            value={formData.phone}
            disabled={isUpdating}
            onChange={handleChange}
          />
        </FormRow>

        <FormRow label="E-mail" id="email" type="form">
          <Input
            type="text"
            id="email"
            value={formData.email}
            disabled={isUpdating}
            onChange={handleChange}
          />
        </FormRow>

        <FormRow label="Address" id="address" type="form">
          <Input
            type="text"
            id="address"
            value={formData.address}
            disabled={isUpdating}
            onChange={handleChange}
          />
        </FormRow>
      </Form>

      <FormRow type="form">
        <Button type="button" variation="secondary" onClick={handleReset}>
          Undo
        </Button>
        <Button form="update-contact-form" type="submit" disabled={isUpdating}>
          Save
        </Button>
      </FormRow>
    </>
  );
}

export default UpdateContactForm;
