import styled from "styled-components";
import { Legend, Pie, PieChart, ResponsiveContainer } from "recharts";

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

const planColors = ["#41cb86", "#ee475a", "#7f53d6"];
const planColorsDark = ["#7ef690", "#fa9290", "#80bff9"];

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
  fill?: string;
  stroke?: string;
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
      fill: colors[index % colors.length],
      stroke: colors[index % colors.length],
    }))
    .sort((a, b) => (b.value as number) - (a.value as number));

  return (
    <ChartBox>
      <Heading as="h2">Plan popularity</Heading>
      {data.length === 0 ? (
        <p>No booking data available</p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={data}
                nameKey="plan"
                dataKey="value"
                innerRadius={85}
                outerRadius={110}
                cx="45%"
                cy="50%"
                paddingAngle={3}
                label={(entry: { percent?: number }) =>
                  `${Math.round((entry.percent ?? 0) * 100)}%`
                }
                labelLine={false}
              />
              <Legend
                verticalAlign="middle"
                align="right"
                width="27%"
                layout="vertical"
                iconSize={12}
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
