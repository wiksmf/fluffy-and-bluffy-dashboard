import styled from "styled-components";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi2";

import { useDeleteService } from "./useDeleteService";

import ServiceForm from "./ServiceForm";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";

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

        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={serviceId} />
            <Menus.List id={serviceId}>
              <Modal.Open opens="update">
                <Menus.Button icon={<HiOutlinePencil />}>
                  Edit service
                </Menus.Button>
              </Modal.Open>

              <Modal.Open opens="delete">
                <Menus.Button icon={<HiOutlineTrash />}>
                  Delete service
                </Menus.Button>
              </Modal.Open>
            </Menus.List>
          </Menus.Menu>

          <Modal.Window name="update">
            <ServiceForm serviceToEdit={service} />
          </Modal.Window>

          <Modal.Window name="delete">
            <ConfirmDelete
              resourceName="services"
              onConfirm={() => deleteService(serviceId)}
              disabled={isDeleting}
            />
          </Modal.Window>
        </Modal>
      </Table.Row>
    </>
  );
}

export default ServiceRow;
