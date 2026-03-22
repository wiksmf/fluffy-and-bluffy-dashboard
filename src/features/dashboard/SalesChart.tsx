import styled from "styled-components";
import { eachDayOfInterval, format, isSameDay, subDays } from "date-fns";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

import { useDarkMode } from "../../context/DarkModeContext";

import DashboardBox from "./DashboardBox";

import Heading from "../../ui/Heading";

const StyledBookingsChart = styled(DashboardBox)`
  grid-column: 1 / -1;

  & .recharts-cartesian-grid-horizontal line,
  & .recharts-cartesian-grid-vertical line {
    stroke: var(--color-grey-300);
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

interface BookingsChartProps {
  bookings: Booking[];
  numDays: number;
}

function BookingsChart({ bookings, numDays }: BookingsChartProps) {
  const { isDarkMode } = useDarkMode();

  const allDates = eachDayOfInterval({
    start: subDays(new Date(), numDays - 1),
    end: new Date(),
  });

  const data = allDates.map((date) => {
    const dayBookings =
      bookings?.filter((booking: Booking) =>
        isSameDay(date, new Date(booking.date))
      ) || [];

    return {
      label: format(date, "MMM dd"),
      totalBookings: dayBookings.length,
      confirmedBookings: dayBookings.filter(
        (booking: Booking) =>
          booking.status === "confirmed" || booking.status === "completed"
      ).length,
    };
  });

  const colors = isDarkMode
    ? {
        totalBookings: { stroke: "#537cf7", fill: "#a2b3e4" },
        confirmedBookings: { stroke: "#03C988", fill: "#91f2d2" },
        text: "#e5e7eb",
        background: "#101828",
      }
    : {
        totalBookings: { stroke: "#1447e6", fill: "#dbeafe" },
        confirmedBookings: { stroke: "#107b70", fill: "#ccf9ea" },
        text: "#374151",
        background: "#fff",
      };

  return (
    <StyledBookingsChart>
      <Heading as="h2">
        Booking trends from {format(allDates[0] || new Date(), "dd MMM yyyy")} -{" "}
        {format(allDates[allDates.length - 1] || new Date(), "dd MMM yyyy")}{" "}
      </Heading>

      <ResponsiveContainer height={300} width="100%">
        <AreaChart data={data}>
          <Legend
            verticalAlign="top"
            height={80}
            wrapperStyle={{ color: colors.text }}
          />
          <XAxis
            dataKey="label"
            tick={{ fill: colors.text }}
            tickLine={{ stroke: colors.text }}
          />
          <YAxis
            tick={{ fill: colors.text }}
            tickLine={{ stroke: colors.text }}
          />
          <CartesianGrid strokeDasharray="4" />
          <Tooltip contentStyle={{ backgroundColor: colors.background }} />
          <Area
            dataKey="totalBookings"
            type="monotone"
            stroke={colors.totalBookings.stroke}
            fill={colors.totalBookings.fill}
            strokeWidth={1}
            name="Total bookings"
          />
          <Area
            dataKey="confirmedBookings"
            type="monotone"
            stroke={colors.confirmedBookings.stroke}
            fill={colors.confirmedBookings.fill}
            strokeWidth={1}
            name="Confirmed bookings"
          />
        </AreaChart>
      </ResponsiveContainer>
    </StyledBookingsChart>
  );
}

export default BookingsChart;
