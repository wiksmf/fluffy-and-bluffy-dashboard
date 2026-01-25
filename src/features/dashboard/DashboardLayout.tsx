import styled from "styled-components";
import { useSearchParams } from "react-router-dom";

import { useRecentBookings } from "./useRecentBookings";
import { useServices } from "./useServices";

import Stats from "./Stats";
import TodayActivity from "./TodayActivity";
import PlanPopularityChart from "./PlanPopularityChart";
import BookingsChart from "./SalesChart";

import Spinner from "../../ui/Spinner";

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 34rem auto;
  gap: 2.4rem;
`;

function DashboardLayout() {
  const { bookings, isLoading: isLoading1 } = useRecentBookings();
  const { services, isLoading: isLoading2 } = useServices();
  const [searchParams] = useSearchParams();

  const numDays = !searchParams.get("last")
    ? 7
    : Number(searchParams.get("last"));

  if (isLoading1 || isLoading2) return <Spinner />;

  const safeBookings = bookings || [];
  const safeServices = services || [];

  return (
    <StyledDashboardLayout>
      <Stats
        bookings={safeBookings}
        services={safeServices}
        numDays={numDays}
      />
      <TodayActivity bookings={safeBookings} />
      <PlanPopularityChart bookings={safeBookings} />
      <BookingsChart bookings={safeBookings} numDays={numDays} />
    </StyledDashboardLayout>
  );
}

export default DashboardLayout;
