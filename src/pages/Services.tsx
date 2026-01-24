import styled from "styled-components";

import AddService from "../features/services/AddService";
import ServiceTable from "../features/services/ServiceTable";
import ServiceTableOperations from "../features/services/ServiceTableOperations";

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
        <Heading as="h1">Update services information</Heading>
        <OpRow>
          <ServiceTableOperations />
          <AddService />
        </OpRow>
      </Row>

      <Row>
        <ServiceTable />
      </Row>
    </>
  );
}

export default Plans;
