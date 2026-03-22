import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import SortBy from "../../ui/SortBy";
import Filter from "../../ui/Filter";
import TableOperations from "../../ui/TableOperations";

function BookingTableOperations() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const hasStatus = searchParams.get("status");
    const hasSortBy = searchParams.get("sort-by");

    if (!hasStatus || !hasSortBy) {
      const newParams = new URLSearchParams(searchParams.toString());

      if (!hasStatus) newParams.set("status", "confirmed");
      if (!hasSortBy) newParams.set("sort-by", "date-asc");
      setSearchParams(newParams);
    }
  }, [searchParams, setSearchParams]);

  return (
    <TableOperations>
      <Filter
        filterField="status"
        options={[
          { value: "confirmed", label: "Confirmed" },
          { value: "unconfirmed", label: "Unconfirmed" },
          { value: "done", label: "Done" },
          { value: "all", label: "All" },
        ]}
      />

      <SortBy
        options={[
          { value: "date-asc", label: "Sort by date (earlier bookings)" },
          { value: "date-desc", label: "Sort by date (last bookings)" },
          { value: "service-asc", label: "Sort by service (A to Z)" },
          { value: "service-desc", label: "Sort by service (Z to A)" },
        ]}
      />
    </TableOperations>
  );
}

export default BookingTableOperations;
