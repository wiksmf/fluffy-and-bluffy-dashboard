import styled from "styled-components";

import BookingTable from "../features/bookings/BookingTable";
import BookingTableOperations from "../features/bookings/BookingTableOperations";

import Heading from "../ui/Heading";
import Row from "../ui/Row";

const OpRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

function Bookings() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">All bookings</Heading>

        <OpRow>
          <BookingTableOperations />
        </OpRow>
      </Row>

      <BookingTable />
    </>
  );
}

export default Bookings;
