import Heading from "../ui/Heading";
import Row from "../ui/Row";
import UpdateContactForm from "../features/contact/UpdateContactForm";

function Contacts() {
  return (
    <Row>
      <Heading as="h1">Update contact information</Heading>

      <UpdateContactForm />
    </Row>
  );
}

export default Contacts;
