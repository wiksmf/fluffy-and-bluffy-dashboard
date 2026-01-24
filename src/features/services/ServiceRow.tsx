import styled from "styled-components";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi2";

import { useDeleteService } from "./useDeleteService";

import ServiceForm from "./ServiceForm";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Table from "../../ui/Table";

type ServiceProps = {
  id: number;
  name: string;
  description: string;
  short_description?: string;
  show_home?: boolean;
  icon?: string;
};

const Service = styled.div`
  font-size: 1.4rem;
  font-weight: 600;
`;

const Description = styled.div`
  font-size: 1.4rem;
`;

const ShortDescription = styled.div`
  font-size: 1.4rem;
  color: var(--color-grey-600);
`;

const ShowHome = styled.div`
  font-size: 1.2rem;
  font-weight: 500;
  color: ${(props) =>
    props.color === "true" ? "var(--color-tertiary)" : "var(--color-grey-500)"};
`;

const Img = styled.img`
  display: block;
  width: 8rem;
  aspect-ratio: 3 / 2;
  object-fit: contain;
  object-position: center;
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

function ServiceRow({ service }: { service: ServiceProps }) {
  const {
    id: serviceId,
    name,
    description,
    short_description,
    show_home,
    icon,
  } = service;
  const { isDeleting, deleteService } = useDeleteService();

  return (
    <>
      <Table.Row>
        <Img src={icon} />
        <Service>{name}</Service>
        <Description>{description}</Description>
        <ShortDescription>{short_description}</ShortDescription>
        <ShowHome color={show_home ? "true" : "false"}>
          {show_home ? "Yes" : "No"}
        </ShowHome>

        <OpRow>
          <Modal>
            <Modal.Open opens="update">
              <StyledButton disabled={isDeleting} aria-label="Edit service">
                <HiOutlinePencil />
              </StyledButton>
            </Modal.Open>
            <Modal.Window name="update">
              <ServiceForm serviceToEdit={service} />
            </Modal.Window>

            <Modal.Open opens="delete">
              <StyledButton aria-label="Delete service">
                <HiOutlineTrash />
              </StyledButton>
            </Modal.Open>

            <Modal.Window name="delete">
              <ConfirmDelete
                resourceName="services"
                onConfirm={() => deleteService(serviceId)}
                disabled={isDeleting}
              />
            </Modal.Window>
          </Modal>
        </OpRow>
      </Table.Row>
    </>
  );
}

export default ServiceRow;
