import {
  HiOutlineCurrencyDollar,
  HiOutlineCalendarDays,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
} from "react-icons/hi2";
import Stat from "./Stat";
import { formatCurrency } from "../../utils/helpers";

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
  paid_amount: number;
}

interface Service {
  id: number;
  name: string;
  description: string;
  short_description?: string;
  show_home?: boolean;
  icon?: string;
}

interface StatsProps {
  bookings: Booking[];
  services: Service[];
  numDays: number;
}

function Stats({ bookings }: StatsProps) {
  const numBookings = bookings?.length || 0;

  const confirmedBookings =
    bookings?.filter((booking: Booking) => booking.status === "confirmed")
      .length || 0;

  const unconfirmedBookings =
    bookings?.filter((booking: Booking) => booking.status === "unconfirmed")
      .length || 0;

  const salesAmount = bookings?.reduce((acc, cur) => acc + cur.paid_amount, 0);

  return (
    <>
      <Stat
        title="Total Bookings"
        color="blue"
        icon={<HiOutlineCalendarDays />}
        value={numBookings}
      />
      <Stat
        title="Confirmed Bookings"
        color="green"
        icon={<HiOutlineCheckCircle />}
        value={confirmedBookings}
      />
      <Stat
        title="Unconfirmed Bookings"
        color="red"
        icon={<HiOutlineExclamationCircle />}
        value={unconfirmedBookings}
      />
      <Stat
        title="Sales"
        color="slate"
        icon={<HiOutlineCurrencyDollar />}
        value={formatCurrency(salesAmount)}
      />
    </>
  );
}

export default Stats;
