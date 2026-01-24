import styled from "styled-components";
import { format, isToday, parse } from "date-fns";
import {
  HiOutlineAtSymbol,
  HiOutlineBookmark,
  HiOutlineChatBubbleLeftEllipsis,
  HiOutlineCurrencyDollar,
  HiOutlinePhone,
} from "react-icons/hi2";

import DataItem from "../../ui/DataItem";
import { formatCurrency } from "../../utils/helpers";

const StyledBookingDataBox = styled.section`
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-md);
  background-color: var(--color-grey-50);
  overflow: hidden;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 4rem;
  font-size: 1.8rem;
  font-weight: 500;
  color: var(--color-grey-50);
  background-color: var(--color-primary);

  svg {
    height: 3.2rem;
    width: 3.2rem;
  }

  & div:first-child {
    display: flex;
    align-items: center;
    gap: 1.6rem;
    font-weight: 600;
    font-size: 1.8rem;
  }

  & span {
    font-size: 2rem;
    margin-left: 4px;
  }
`;

const Section = styled.section`
  padding: 3.2rem 4rem 1.2rem;
`;

const Footer = styled.footer`
  padding: 1.6rem 4rem;
  font-size: 1.4rem;
  color: var(--color-grey-600);
  text-align: right;
  border-top: 1px solid var(--color-grey-200);
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
  paid_amount: number;
}

interface BookingDataBoxProps {
  booking: Booking;
}

function BookingDataBox({ booking }: BookingDataBoxProps) {
  const {
    created_at,
    first_name,
    last_name,
    email,
    phone,
    service,
    message,
    date,
    hour,
    paid_amount,
  } = booking;

  const dateReference = parse(hour, "HH:mm:ss", new Date());

  return (
    <StyledBookingDataBox>
      <Header>
        <div>
          <HiOutlineBookmark />
          <p>
            {first_name} {last_name}
          </p>

          <span>&bull;</span>

          <p>{service}</p>
        </div>

        <div>
          <p>
            {isToday(new Date(date))
              ? "Today"
              : format(new Date(date), "EEE, MMM dd yyyy")}{" "}
            at {format(new Date(dateReference), "HH:mm")}
          </p>
        </div>
      </Header>

      <Section>
        <DataItem icon={<HiOutlineAtSymbol />} label="E-mail">
          {email}
        </DataItem>

        <DataItem icon={<HiOutlinePhone />} label="Phone">
          {phone}
        </DataItem>

        {message && (
          <DataItem icon={<HiOutlineChatBubbleLeftEllipsis />} label="Message">
            {message}
          </DataItem>
        )}

        {paid_amount && (
          <DataItem icon={<HiOutlineCurrencyDollar />} label="Paid amount">
            {formatCurrency(paid_amount)}
          </DataItem>
        )}
      </Section>

      <Footer>
        <p>
          Booked on: {format(new Date(created_at), "EEE, MMM dd yyyy, HH:mm")}
        </p>
      </Footer>
    </StyledBookingDataBox>
  );
}

export default BookingDataBox;
