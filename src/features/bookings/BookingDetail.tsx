import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { HiOutlineArrowSmallLeft } from "react-icons/hi2";

import { useBooking } from "./useBooking";
import { useDeleteBooking } from "./useDeleteBooking";
import { useConfirm } from "../confirm/useConfirm";

import BookingDataBox from "./BookingDataBox";

import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import Tag from "../../ui/Tag";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";
import Spinner from "../../ui/Spinner";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

interface Booking {
  id: string | number;
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

function BookingDetail() {
  const { booking, isLoading } = useBooking();
  const { confirm } = useConfirm();
  const { deleteBooking, isDeleting } = useDeleteBooking();
  const navigate = useNavigate();

  if (isLoading) return <Spinner />;

  const { status, id: bookingId } = booking || {};

  const statusToTagName: Record<Booking["status"], string> = {
    unconfirmed: "blue",
    confirmed: "green",
    done: "slate",
  };

  return (
    <>
      <Row type="horizontal">
        <HeadingGroup>
          <Heading as="h1">Booking #{bookingId}</Heading>
          <Tag type={statusToTagName[status as Booking["status"]]}>
            {status}
          </Tag>
        </HeadingGroup>

        <ButtonText onClick={() => navigate("/bookings")}>
          <HiOutlineArrowSmallLeft /> Back
        </ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      <ButtonGroup>
        {status === "unconfirmed" && (
          <Button onClick={() => confirm(bookingId)}>Confirm</Button>
        )}

        {status === "confirmed" && (
          <Button onClick={() => navigate(`/confirm/${bookingId}`)}>
            Close appointment
          </Button>
        )}

        <Modal>
          <Modal.Open opens="delete">
            <Button variation="danger">Delete booking</Button>
          </Modal.Open>

          <Modal.Window name="delete">
            <ConfirmDelete
              resourceName="booking"
              disabled={isDeleting}
              onConfirm={() =>
                deleteBooking(bookingId, {
                  onSettled: () => navigate("/bookings"),
                })
              }
            />
          </Modal.Window>
        </Modal>

        <Button variation="secondary" onClick={() => navigate("/bookings")}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default BookingDetail;
