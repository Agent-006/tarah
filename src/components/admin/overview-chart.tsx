import { Order } from "@/store/admin/adminOrderStore";
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
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip
                    formatter={(value) => [`₹${value}`, "Total Sales"]}
                    labelFormatter={(label) => `Month: ${label}`}
                />
                <Legend />
                <Bar
                    dataKey="total"
                    fill="currentColor"
                    radius={[4, 4, 0, 0]}
                    className="fill-primary"
                />
            </BarChart>
        </ResponsiveContainer>
    );
}
