import Modal from "../../ui/Modal";
import Button from "../../ui/Button";
import PlanForm from "./PlanForm";

function AddPlan() {
  return (
    <Modal>
      <Modal.Open opens="plan-form">
        <Button>Add new plan</Button>
      </Modal.Open>
      <Modal.Window name="plan-form">
        <PlanForm />
      </Modal.Window>
    </Modal>
  );
}

export default AddPlan;
