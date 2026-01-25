import styled from "styled-components";
import Heading from "../../ui/Heading";
import Row from "../../ui/Row";
import { format, isToday, parse } from "date-fns";
import Tag from "../../ui/Tag";
import { NavLink } from "react-router-dom";
import { HiOutlineArrowSmallRight } from "react-icons/hi2";

const StyledToday = styled.div`
  grid-column: 1 / span 2;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  padding: 2.4rem 3.2rem 0;
  background-color: var(--color-grey-50);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
`;

const TodayList = styled.ul`
  overflow: scroll;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 0 !important;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

const StyledTodayItem = styled.li`
  display: grid;
  grid-template-columns: 10rem 1fr 5rem 11rem;
  align-items: center;
  gap: 1.2rem;
  font-size: 1.2rem;
  padding: 0.8rem 0;
  border-bottom: 1px solid var(--color-grey-100);

  &:first-child {
    border-top: 1px solid var(--color-grey-100);
  }
`;

const Service = styled.div`
  font-size: 1.4rem;
  font-weight: 600;
`;

const Guest = styled.div`
  font-weight: 500;
`;

const Time = styled.div`
  font-weight: 500;
`;

const NoActivity = styled.p`
  text-align: center;
  font-size: 1.8rem;
  font-weight: 500;
  margin-top: 0.8rem;
`;

const StyledNavLink = styled(NavLink)`
  &:link,
  &:visited {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    font-size: 1.6rem;
    font-weight: 500;
    color: var(--color-grey-800);
    padding: 1.5rem 0;
    transition: all 0.3s;
    margin-left: auto;
  }

  &:hover,
  &:active,
  &.active:link,
  &.active:visited {
    color: var(--color-tertiary);
    background-color: var(--color-grey-50);
    border-radius: var(--border-radius-sm);
  }

  & svg {
    width: 2.3rem;
    height: 2.3rem;
    color: var(--color-grey-500);
    transition: all 0.3s;
  }

  &:hover svg,
  &:active svg,
  &.active:link svg,
  &.active:visited svg {
    color: var(--color-tertiary);
  }
`;

interface Booking {
  id: number;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  date: string;
  hour: string;
  status: string;
}

interface TodayActivityProps {
  bookings: Booking[];
}

function TodayActivity({ bookings }: TodayActivityProps) {
  const todayBookings =
    bookings?.filter((booking) => isToday(new Date(booking.date))) || [];

  return (
    <StyledToday>
      <Row type="horizontal">
        <Heading as="h2">Today&apos;s appointments</Heading>
      </Row>

      {todayBookings.length === 0 ? (
        <NoActivity>No appointments scheduled for today</NoActivity>
      ) : (
        <>
          <TodayList>
            {todayBookings.map((booking) => (
              <StyledTodayItem key={booking.id}>
                <Service>{booking.service}</Service>
                <Guest>
                  {booking.first_name} {booking.last_name}
                </Guest>

                <Time>
                  {format(
                    new Date(parse(booking.hour, "HH:mm:ss", new Date())),
                    "HH:mm"
                  )}
                </Time>

                {booking.status === "unconfirmed" && (
                  <Tag type="blue">Unconfirmed</Tag>
                )}
                {booking.status === "confirmed" && (
                  <Tag type="green">Confirmed</Tag>
                )}
                {booking.status === "done" && <Tag type="slate">Done</Tag>}
              </StyledTodayItem>
            ))}
          </TodayList>

          <StyledNavLink to="/bookings">
            Bookings
            <HiOutlineArrowSmallRight />
          </StyledNavLink>
        </>
      )}
    </StyledToday>
  );
}

export default TodayActivity;
