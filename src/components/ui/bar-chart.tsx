"use client";

import { Bar, BarChart as RechartsBarChart, XAxis, YAxis } from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";

interface BarChartProps {
    data: Array<{ name: string; value: number }>;
    xKey?: string;
    yKey?: string;
    title?: string;
    className?: string;
}

const chartConfig = {
    value: {
        label: "Value",
        color: "#3b82f6", // Bright blue
    },
} satisfies ChartConfig;

export default function BarChart({
    data,
    xKey = "name",
    yKey = "value",
    title,
    className,
}: BarChartProps) {
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
                <RechartsBarChart data={data}>
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
                    <Bar dataKey={yKey} fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </RechartsBarChart>
            </ChartContainer>
        </div>
    );
}
