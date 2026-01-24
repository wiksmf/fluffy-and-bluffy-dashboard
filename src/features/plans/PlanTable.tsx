import { usePlans } from "./usePlans";

import Spinner from "../../ui/Spinner";
import PlanRow from "./PlanRow";
import Table from "../../ui/Table";
import Empty from "../../ui/Empty";

type Plan = {
  id: number;
  name: string;
  description: string;
  price: number;
};

function PlanTable() {
  const { isPending, plans } = usePlans();

  if (isPending) return <Spinner />;

  if (!plans || !plans.length) return <Empty resourceName="plans" />;

  return (
    <Table columns="0.5fr minmax(20rem, 1fr) 0.5fr 0.2fr">
      <Table.Header>
        <div>Name</div>
        <div>Description</div>
        <div>Price</div>
        <div></div>
      </Table.Header>

      <Table.Body
        data={plans || []}
        render={(plan: Plan) => <PlanRow plan={plan} key={plan.id} />}
      />
    </Table>
  );
}

export default PlanTable;
