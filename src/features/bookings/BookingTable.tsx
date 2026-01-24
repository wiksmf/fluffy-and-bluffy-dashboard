import { useBookings } from "./useBookings";

import BookingRow from "./BookingRow";

import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Empty from "../../ui/Empty";
import Spinner from "../../ui/Spinner";
import Pagination from "../../ui/Pagination";

function BookingTable() {
  const { bookings, isPending, count } = useBookings();

  if (isPending) return <Spinner />;

  if (!bookings || !bookings.length) return <Empty resourceName="bookings" />;

  return (
    <Menus>
      <Table columns="20rem 1fr 15rem 15rem 15rem 8rem">
        <Table.Header>
          <div>Service</div>
          <div>Customer</div>
          <div>Date</div>
          <div>Hour</div>
          <div>Status</div>
          <div></div>
        </Table.Header>

        <Table.Body
          data={bookings}
          render={(booking) => (
            <BookingRow key={booking.id} booking={booking} />
          )}
        />

        <Table.Footer>
          <Pagination count={count} />
        </Table.Footer>
      </Table>
    </Menus>
  );
}

export default BookingTable;
