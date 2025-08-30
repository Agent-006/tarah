"use client";

import { PieChart as RechartsPieChart, Pie, Cell } from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
    type ChartConfig,
} from "@/components/ui/chart";

interface PieChartProps {
    data: Array<{ name: string; value: number }>;
    dataKey?: string;
    nameKey?: string;
    title?: string;
    className?: string;
}

const COLORS = [
    "#3b82f6", // Blue
    "#ef4444", // Red
    "#10b981", // Green
    "#f59e0b", // Yellow
    "#8b5cf6", // Purple
    "#ec4899", // Pink
    "#06b6d4", // Cyan
    "#84cc16", // Lime
];

const chartConfig = {
    value: {
        label: "Value",
        color: "#3b82f6",
    },
} satisfies ChartConfig;

export default function PieChart({
    data,
    dataKey = "value",
    nameKey = "name",
    title,
    className,
}: PieChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-48 text-muted-foreground">
                No data available
            </div>
        );
    }

    return (
        <div className={className}>
            {title && (
                <h3 className="text-sm font-semibold mb-3 text-gray-900">
                    {title}
                </h3>
            )}
            <ChartContainer config={chartConfig} className="h-48">
                <RechartsPieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        fill="#3b82f6"
                        dataKey={dataKey}
                        nameKey={nameKey}
                        stroke="#ffffff"
                        strokeWidth={2}
                        label={({ name, value }) => `${name}: ${value}%`}
                        labelLine={false}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                                stroke="#ffffff"
                                strokeWidth={2}
                            />
                        ))}
                    </Pie>
                    <ChartTooltip
                        content={<ChartTooltipContent />}
                        cursor={{ fill: "transparent" }}
                    />
                    <ChartLegend
                        content={<ChartLegendContent />}
                        verticalAlign="bottom"
                        height={36}
                    />
                </RechartsPieChart>
            </ChartContainer>
        </div>
    );
}
