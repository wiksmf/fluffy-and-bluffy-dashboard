import Filter from "../../ui/Filter";
import SortBy from "../../ui/SortBy";
import TableOperations from "../../ui/TableOperations";

function ServiceTableOperations() {
  return (
    <TableOperations>
      <Filter
        filterField="show-home"
        options={[
          { value: "all", label: "All" },
          { value: "true", label: "Show on homepage" },
        ]}
      />

      <SortBy
        options={[
          { value: "name-asc", label: "Sort by name (A-Z)" },
          { value: "name-desc", label: "Sort by name (Z-A)" },
        ]}
      />
    </TableOperations>
  );
}

export default ServiceTableOperations;
