import Modal from "../../ui/Modal";
import Button from "../../ui/Button";
import UserForm from "./UserForm";

function AddUser() {
  return (
    <Modal>
      <Modal.Open opens="plan-form">
        <Button>Add new user</Button>
      </Modal.Open>
      <Modal.Window name="plan-form">
        <UserForm />
      </Modal.Window>
    </Modal>
  );
}

export default AddUser;
