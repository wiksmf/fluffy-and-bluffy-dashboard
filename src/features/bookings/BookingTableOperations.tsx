import SortBy from "../../ui/SortBy";
import Filter from "../../ui/Filter";
import TableOperations from "../../ui/TableOperations";

function BookingTableOperations() {
  return (
    <TableOperations>
      <Filter
        filterField="status"
        options={[
          { value: "all", label: "All" },
          { value: "confirmed", label: "Confirmed" },
          { value: "unconfirmed", label: "Unconfirmed" },
          { value: "done", label: "Done" },
        ]}
      />

      <SortBy
        options={[
          { value: "created_at-asc", label: "Sort by booking date" },
          { value: "date-asc", label: "Sort by date (earlier bookings)" },
          { value: "date-desc", label: "Sort by date (last bookings)" },
          { value: "hour-asc", label: "Sort by hour (ascending)" },
          { value: "hour-desc", label: "Sort by hour (descending)" },
          { value: "service-asc", label: "Sort by service (A to Z)" },
          { value: "service-desc", label: "Sort by service (Z to A)" },
        ]}
      />
    </TableOperations>
  );
}

export default BookingTableOperations;
