import Modal from "../../ui/Modal";
import Button from "../../ui/Button";
import ServiceForm from "./ServiceForm";

function AddService() {
  return (
    <Modal>
      <Modal.Open opens="service-form">
        <Button size="small">Add new service</Button>
      </Modal.Open>
      <Modal.Window name="service-form">
        <ServiceForm />
      </Modal.Window>
    </Modal>
  );
}

export default AddService;
