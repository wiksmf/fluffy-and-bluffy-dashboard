import styled from "styled-components";
import { useEffect, useState } from "react";
import { HiOutlineArrowSmallLeft } from "react-icons/hi2";

import { useMoveBack } from "../../hooks/useMoveBack";
import { useBooking } from "../bookings/useBooking";
import { useCheckout } from "./useCheckout";
import BookingDataBox from "../bookings/BookingDataBox";

import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";
import Spinner from "../../ui/Spinner";
import Input from "../../ui/Input";
import FormRow from "../../ui/FormRow";

const Box = styled.div`
  padding: 2rem 0;
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-md);
  background-color: var(--color-grey-50);
`;

function ConfirmBooking() {
  const [paidAmount, setPaidAmount] = useState("");
  const { booking, isLoading } = useBooking();

  useEffect(() => {
    if (booking?.paid_amount) {
      setPaidAmount(booking.paid_amount.toString());
    }
  }, [booking]);

  const moveBack = useMoveBack();
  const { checkout, isCheckingOut } = useCheckout();

  if (isLoading) return <Spinner />;

  const { id: bookingId, first_name, last_name } = booking || {};

  function handleConfirm() {
    const amount = parseFloat(paidAmount);
    if (amount > 0) {
      checkout({ bookingId, paidAmount: amount });
    }
  }

  const isValidAmount = paidAmount && parseFloat(paidAmount) > 0;

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Closing booking #{bookingId}</Heading>
        <ButtonText onClick={moveBack}>
          <HiOutlineArrowSmallLeft /> Back
        </ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      <Box>
        <FormRow label={`Paid amount for ${first_name} ${last_name}:`}>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={paidAmount}
            onChange={(e) => setPaidAmount(e.target.value)}
            placeholder="Enter paid amount"
          />
        </FormRow>
      </Box>

      <ButtonGroup>
        <Button
          onClick={handleConfirm}
          disabled={!isValidAmount || isCheckingOut}
        >
          Close appointment
        </Button>
        <Button variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default ConfirmBooking;
