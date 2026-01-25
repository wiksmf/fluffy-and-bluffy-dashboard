import styled from "styled-components";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { useDarkMode } from "../../context/DarkModeContext";

import Heading from "../../ui/Heading";

const ChartBox = styled.div`
  grid-column: 3 / span 2;
  padding: 2.4rem 3.2rem;
  background-color: var(--color-grey-50);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);

  & > *:first-child {
    margin-bottom: 1.6rem;
  }

  & .recharts-pie-label-text {
    font-weight: 600;
  }
`;

const planColors = ["#1ad426", "#ef4444", "#3b82f6"];
const planColorsDark = ["#36b349", "#be4543", "#5689b9"];

interface Booking {
  id: number;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  service: string;
  plan?: string;
  message: string;
  date: string;
  hour: string;
  status: string;
}

interface ChartData {
  plan: string;
  value: number;
  color: string;
}

interface PlanPopularityChartProps {
  bookings: Booking[];
}

function PlanPopularityChart({ bookings }: PlanPopularityChartProps) {
  const { isDarkMode } = useDarkMode();
  const colors = isDarkMode ? planColorsDark : planColors;

  const planCount =
    bookings?.reduce((acc: Record<string, number>, booking: Booking) => {
      const plan = booking.service;

      acc[plan] = (acc[plan] || 0) + 1;
      return acc;
    }, {}) || {};

  const data: ChartData[] = Object.entries(planCount)
    .map(([plan, count], index) => ({
      plan,
      value: count as number,
      color: colors[index % colors.length],
    }))
    .sort((a, b) => (b.value as number) - (a.value as number));

  return (
    <ChartBox>
      <Heading as="h2">Plan popularity</Heading>
      {data.length === 0 ? (
        <p>No booking data available</p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={data}
                nameKey="plan"
                dataKey="value"
                innerRadius={85}
                outerRadius={110}
                cx="40%"
                cy="50%"
                paddingAngle={3}
              >
                {data.map((entry) => (
                  <Cell
                    fill={entry.color}
                    stroke={entry.color}
                    key={entry.plan}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                verticalAlign="middle"
                align="right"
                width="30%"
                layout="vertical"
                iconSize={15}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </>
      )}
    </ChartBox>
  );
}

export default PlanPopularityChart;
