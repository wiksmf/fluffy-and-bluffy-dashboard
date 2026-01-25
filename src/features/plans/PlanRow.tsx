import styled from "styled-components";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi2";

import { useDeletePlan } from "./useDeletePlan";
import { formatCurrency } from "../../utils/helpers";

import PlanForm from "./PlanForm";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Table from "../../ui/Table";
import ButtonIcon from "../../ui/ButtonIcon";
import Menus from "../../ui/Menus";

type PlanProps = {
  id: number;
  name: string;
  description: string;
  price: number;
};

const Plan = styled.div`
  font-size: 1.4rem;
  font-weight: 600;
`;

const Description = styled.div`
  font-size: 1.4rem;
`;

const Price = styled.div`
  font-size: 1.4rem;
  font-weight: 600;
`;

function PlanRow({ plan }: { plan: PlanProps }) {
  const { id: planId, name, description, price } = plan;

  const { isDeleting, deletePlan } = useDeletePlan();

  return (
    <>
      <Table.Row>
        <Plan>{name}</Plan>
        <Description>{description}</Description>
        <Price>{formatCurrency(price)}</Price>

        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={planId} />
            <Menus.List id={planId}>
              <Modal.Open opens="update">
                <Menus.Button icon={<HiOutlinePencil />}>
                  Edit plan
                </Menus.Button>
              </Modal.Open>

              <Modal.Open opens="delete">
                <Menus.Button icon={<HiOutlineTrash />}>
                  Delete plan
                </Menus.Button>
              </Modal.Open>
            </Menus.List>
          </Menus.Menu>

          <Modal.Window name="update">
            <PlanForm planToEdit={plan} />
          </Modal.Window>

          <Modal.Window name="delete">
            <ConfirmDelete
              resourceName="plans"
              onConfirm={() => deletePlan(planId)}
              disabled={isDeleting}
            />
          </Modal.Window>
        </Modal>
      </Table.Row>
    </>
  );
}

export default PlanRow;
