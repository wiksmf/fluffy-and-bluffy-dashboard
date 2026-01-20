import styled from "styled-components";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi2";

import { useDeletePlan } from "./useDeletePlan";
import { formatCurrency } from "../../utils/helpers";

import PlanForm from "./PlanForm";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Table from "../../ui/Table";

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

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  text-align: left;
  background: none;
  border: none;
  border-radius: 100%;
  padding: 1rem;
  background-color: var(--color-grey-100);
  transition: all 0.3s;

  & svg {
    width: 1.7rem;
    height: 1.7rem;
    color: var(--color-grey-600);
    transition: all 0.3s;
  }

  &:hover {
    background-color: var(--color-primary);
  }

  &:hover svg {
    color: var(--color-grey-50);
  }
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
              <StyledButton disabled={isDeleting} aria-label="Edit plan">
                <HiOutlinePencil />
              </StyledButton>
            </Modal.Open>
            <Modal.Window name="update">
              <PlanForm planToEdit={plan} />
            </Modal.Window>

            <Modal.Open opens="delete">
              <StyledButton aria-label="Delete plan">
                <HiOutlineTrash />
              </StyledButton>
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
