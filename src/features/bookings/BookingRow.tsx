import { useNavigate } from "react-router-dom";
import { format, parse } from "date-fns";
import styled from "styled-components";
import {
  HiOutlineEye,
  HiOutlineArrowRightOnRectangle,
  HiOutlineArrowRightEndOnRectangle,
  HiOutlineTrash,
} from "react-icons/hi2";

import { useDeleteBooking } from "./useDeleteBooking";
import { useConfirm } from "../confirm/useConfirm";

import Tag from "../../ui/Tag";
import Table from "../../ui/Table";
import Modal from "../../ui/Modal";
import Menus from "../../ui/Menus";
import ConfirmDelete from "../../ui/ConfirmDelete";

const Service = styled.div`
  font-size: 1.4rem;
  font-weight: 600;
`;

const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  & span:first-child {
    font-weight: 500;
  }

  & span:not(:first-child) {
    color: var(--color-grey-500);
    font-size: 1.2rem;
  }
`;

interface Booking {
  id: number;
  created_at?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  date: string;
  hour: string;
  status: "unconfirmed" | "confirmed" | "done";
}

interface BookingRowProps {
  booking: Booking;
}

function BookingRow({
  booking: {
    id: bookingId,
    first_name,
    last_name,
    email,
    phone,
    service,
    date,
    hour,
    status,
  },
}: BookingRowProps) {
  const navigate = useNavigate();
  const { confirm } = useConfirm();
  const { deleteBooking, isDeleting } = useDeleteBooking();

  const dateReference = parse(hour, "HH:mm:ss", new Date());

  const statusToTagName: Record<Booking["status"], string> = {
    unconfirmed: "blue",
    confirmed: "green",
    done: "slate",
  };

  return (
    <Table.Row>
      <Service>{service}</Service>

      <Stacked>
        <span>
          {first_name} {last_name}
        </span>
        <span>e-mail: {email}</span>
        <span>phone: {phone}</span>
      </Stacked>

      <span>{format(new Date(date), "EEE, MMM dd yyyy")}</span>
      <span>{format(new Date(dateReference), "HH:mm")}</span>

      <Tag type={statusToTagName[status]}>{status}</Tag>

      <Modal>
        <Menus.Menu>
          <Menus.Toggle id={bookingId} />
          <Menus.List id={bookingId}>
            <Menus.Button
              icon={<HiOutlineEye />}
              onClick={() => navigate(`/booking/${bookingId}`)}
            >
              See details
            </Menus.Button>

            {status === "unconfirmed" && (
              <Menus.Button
                icon={<HiOutlineArrowRightEndOnRectangle />}
                onClick={() => confirm(bookingId)}
              >
                Confirm
              </Menus.Button>
            )}

            {status === "confirmed" && (
              <Menus.Button
                icon={<HiOutlineArrowRightOnRectangle />}
                onClick={() => navigate(`/confirm/${bookingId}`)}
              >
                Close appointment
              </Menus.Button>
            )}

            <Modal.Open opens="delete">
              <Menus.Button icon={<HiOutlineTrash />}>
                Delete booking
              </Menus.Button>
            </Modal.Open>
          </Menus.List>
        </Menus.Menu>

        <Modal.Window name="delete">
          <ConfirmDelete
            resourceName="booking"
            disabled={isDeleting}
            onConfirm={() => deleteBooking(bookingId)}
          />
        </Modal.Window>
      </Modal>
    </Table.Row>
  );
}

export default BookingRow;
