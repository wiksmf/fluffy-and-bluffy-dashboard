import styled from "styled-components";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi2";

import { useDeletePlan } from "./useDeletePlan";
import { formatCurrency } from "../../utils/helpers";

import PlanForm from "./PlanForm";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Table from "../../ui/Table";
import ButtonIcon from "../../ui/ButtonIcon";

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

const OpRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
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

        <OpRow>
          <Modal>
            <Modal.Open opens="update">
              <ButtonIcon disabled={isDeleting} aria-label="Edit plan">
                <HiOutlinePencil />
              </ButtonIcon>
            </Modal.Open>
            <Modal.Window name="update">
              <PlanForm planToEdit={plan} />
            </Modal.Window>

            <Modal.Open opens="delete">
              <ButtonIcon aria-label="Delete plan">
                <HiOutlineTrash />
              </ButtonIcon>
            </Modal.Open>

            <Modal.Window name="delete">
              <ConfirmDelete
                resourceName="plans"
                onConfirm={() => deletePlan(planId)}
                disabled={isDeleting}
              />
            </Modal.Window>
          </Modal>
        </OpRow>
      </Table.Row>
    </>
  );
}

export default PlanRow;
