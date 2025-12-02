"use client";

import { Bar, BarChart as RechartsBarChart, XAxis, YAxis } from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";

interface ProductsBarChartProps {
    data: Array<{ name: string; value: number }>;
    xKey?: string;
    yKey?: string;
    title?: string;
    className?: string;
}

const chartConfig = {
    value: {
        label: "Stock Level",
        color: "#3b82f6", // Blue for products
    },
} satisfies ChartConfig;

export default function ProductsBarChart({
    data,
    xKey = "name",
    yKey = "value",
    title,
    className,
}: ProductsBarChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-48 text-muted-foreground">
                No products data available
            </div>
        );
    }

    return (
        <div className={className}>
            {title && (
                <h3 className="text-sm font-semibold mb-3 text-blue-900">
                    {title}
                </h3>
            )}
            <ChartContainer config={chartConfig} className="h-48">
                <RechartsBarChart
                    data={data}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                    <XAxis
                        dataKey={xKey}
                        tick={{ fontSize: 11, fill: "#374151" }}
                        tickLine={{ stroke: "#d1d5db" }}
                        axisLine={{ stroke: "#d1d5db" }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                    />
                    <YAxis
                        tick={{ fontSize: 11, fill: "#374151" }}
                        tickLine={{ stroke: "#d1d5db" }}
                        axisLine={{ stroke: "#d1d5db" }}
                    />
                    <ChartTooltip
                        content={<ChartTooltipContent />}
                        cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
                    />
                    <Bar
                        dataKey={yKey}
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                        stroke="#1d4ed8"
                        strokeWidth={1}
                    />
                </RechartsBarChart>
            </ChartContainer>
        </div>
    );
}
