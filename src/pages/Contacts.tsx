import Heading from "../ui/Heading";
import Row from "../ui/Row";
import UpdateSettingsForm from "../features/contact/UpdateContactForm";

function Contacts() {
  return (
    <Row>
      <Heading as="h1">Update contact information</Heading>

      <UpdateSettingsForm />
    </Row>
  );
}

export default Contacts;
