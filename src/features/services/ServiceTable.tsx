import { useServices } from "./useService";

import Spinner from "../../ui/Spinner";
import ServiceRow from "./ServiceRow";
import Table from "../../ui/Table";

type Service = {
  id: number;
  title: string;
  description: string;
  short_description?: string;
  show_home?: boolean;
  icon?: string;
};

function ServiceTable() {
  const { isLoading, services } = useServices();
  if (isLoading) return <Spinner />;

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
        data={services || []}
        render={(service: Service) => (
          <ServiceRow service={service} key={service.id} />
        )}
      />
    </Table>
  );
}

export default ServiceTable;
