import { format } from "date-fns";
import {
  CartesianGrid,
  Tooltip,
  YAxis,
  ResponsiveContainer,
  Legend,
  Bar,
  BarChart,
  XAxis,
} from "recharts";
import { Order } from "@/store/admin/adminOrderStore";

interface OverviewChartProps {
  orders: Order[];
}

export function OverviewChart({ orders }: OverviewChartProps) {
  // group orders by month for the chart data
  const getChartData = () => {
    const monthlyData: Record<string, { name: string; total: number }> = {};

    orders.forEach((order) => {
      const month = format(new Date(order.createdAt), "MMM");
      if (!monthlyData[month]) {
        monthlyData[month] = { name: month, total: 0 };
      }

      monthlyData[month].total += Number(order.totalAmount);
    });

    // get all months in the data and sort them
    const months = Object.keys(monthlyData).sort((a, b) => {
      return (
        new Date(`2023-${a}-01`).getMonth() -
        new Date(`2023-${b}-01`).getMonth()
      );
    });

    // Return data in the correct order
    return months.map((month) => monthlyData[month]);
  };

  const data = getChartData();

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="name"
          stroke="#6b7280"
          fontSize={12}
          tickLine={{ stroke: '#d1d5db' }}
          axisLine={{ stroke: '#d1d5db' }}
        />
        <YAxis
          stroke="#6b7280"
          fontSize={12}
          tickLine={{ stroke: '#d1d5db' }}
          axisLine={{ stroke: '#d1d5db' }}
          tickFormatter={(value) => `₹${value}`}
        />
        <Tooltip
          formatter={(value) => [`₹${value}`, "Total Sales"]}
          labelFormatter={(label) => `Month: ${label}`}
        />
        <Legend />
        <Bar
          dataKey="total"
          fill="#3b82f6"
          radius={[4, 4, 0, 0]}
          stroke="#1d4ed8"
          strokeWidth={1}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
