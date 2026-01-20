import styled from "styled-components";
import AddPlan from "../features/plans/AddPlan";
import ServiceTable from "../features/plans/PlanTable";

import Heading from "../ui/Heading";
import Row from "../ui/Row";

const OpRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

function Plans() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Update plans information</Heading>
        <OpRow>
          <AddPlan />
        </OpRow>
      </Row>

      <Row>
        <ServiceTable />
      </Row>
    </>
  );
}

export default Plans;
