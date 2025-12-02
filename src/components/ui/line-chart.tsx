"use client";

import { Line, LineChart as RechartsLineChart, XAxis, YAxis } from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";

interface LineChartProps {
    data: Array<{ name: string; value: number }>;
    xKey?: string;
    yKey?: string;
    title?: string;
    className?: string;
}

const chartConfig = {
    value: {
        label: "Value",
        color: "#10b981", // Green
    },
} satisfies ChartConfig;

export default function LineChart({
    data,
    xKey = "name",
    yKey = "value",
    title,
    className,
}: LineChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-48 text-muted-foreground">
                No data available
            </div>
        );
    }

    return (
        <div className={className}>
            {title && <h3 className="text-sm font-medium mb-2">{title}</h3>}
            <ChartContainer config={chartConfig} className="h-48">
                <RechartsLineChart data={data}>
                    <XAxis
                        dataKey={xKey}
                        tick={{ fontSize: 12, fill: "#374151" }}
                        tickLine={{ stroke: "#d1d5db" }}
                        axisLine={{ stroke: "#d1d5db" }}
                    />
                    <YAxis
                        tick={{ fontSize: 12, fill: "#374151" }}
                        tickLine={{ stroke: "#d1d5db" }}
                        axisLine={{ stroke: "#d1d5db" }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                        type="monotone"
                        dataKey={yKey}
                        stroke="#10b981"
                        strokeWidth={3}
                        dot={{ fill: "#10b981", strokeWidth: 2, r: 5 }}
                        activeDot={{ r: 7, fill: "#059669" }}
                    />
                </RechartsLineChart>
            </ChartContainer>
        </div>
    );
}
