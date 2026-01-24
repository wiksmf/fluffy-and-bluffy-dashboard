import { useServices } from "./useService";

import Spinner from "../../ui/Spinner";
import ServiceRow from "./ServiceRow";
import Table from "../../ui/Table";
import { useSearchParams } from "react-router-dom";

type Service = {
  id: number;
  name: string;
  description: string;
  short_description?: string;
  show_home?: boolean;
  icon?: string;
};

function ServiceTable() {
  const { isPending, services } = useServices();
  const [searchParams] = useSearchParams();

  if (isPending) return <Spinner />;

  if (!services || !services.length) return <Empty resourceName="services" />;

  const filterValue = searchParams.get("show-home") || "all";

  let filteredServices;

  if (filterValue === "all") filteredServices = services;
  else if (filterValue === "true")
    filteredServices = services?.filter((service) => service.show_home);

  // SORT
  const sortBy = searchParams.get("sort-by") || "name-asc";
  const [field, direction] = sortBy.split("-");

  const modifier = direction === "asc" ? 1 : -1;
  const sortedServices = filteredServices?.sort((a, b) => {
    const aValue = String(a[field as keyof Service] || "");
    const bValue = String(b[field as keyof Service] || "");

    return aValue.localeCompare(bValue) * modifier;
  });

  return (
    <Table columns="8rem 20rem 40rem 20rem 5rem 5rem">
      <Table.Header>
        <div>Icon</div>
        <div>Name</div>
        <div>Description</div>
        <div>Short Description</div>
        <div>Show Home</div>
        <div></div>
      </Table.Header>

      <Table.Body
        data={sortedServices || []}
        render={(service: Service) => (
          <ServiceRow service={service} key={service.id} />
        )}
      />
    </Table>
  );
}

export default ServiceTable;
