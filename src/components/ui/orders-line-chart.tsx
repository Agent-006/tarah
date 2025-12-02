"use client"

import { Line, LineChart as RechartsLineChart, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

interface OrdersLineChartProps {
  data: Array<{ name: string; value: number }>
  xKey?: string
  yKey?: string
  title?: string
  className?: string
}

const chartConfig = {
  value: {
    label: "Order Value",
    color: "#10b981", // Green for orders
  },
} satisfies ChartConfig

export default function OrdersLineChart({ 
  data, 
  xKey = "name", 
  yKey = "value", 
  title,
  className 
}: OrdersLineChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground">
        No orders data available
      </div>
    )
  }

  return (
    <div className={className}>
      {title && <h3 className="text-sm font-semibold mb-3 text-green-900">{title}</h3>}
      <ChartContainer config={chartConfig} className="h-48">
        <RechartsLineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <XAxis 
            dataKey={xKey}
            tick={{ fontSize: 11, fill: '#374151' }}
            tickLine={{ stroke: '#d1d5db' }}
            axisLine={{ stroke: '#d1d5db' }}
          />
          <YAxis 
            tick={{ fontSize: 11, fill: '#374151' }}
            tickLine={{ stroke: '#d1d5db' }}
            axisLine={{ stroke: '#d1d5db' }}
            tickFormatter={(value) => `₹${value}`}
          />
          <ChartTooltip 
            content={<ChartTooltipContent />}
            cursor={{ stroke: '#10b981', strokeWidth: 1 }}
          />
          <Line 
            type="monotone"
            dataKey={yKey} 
            stroke="#10b981"
            strokeWidth={3}
            dot={{ fill: "#10b981", strokeWidth: 2, r: 5, stroke: '#059669' }}
            activeDot={{ r: 7, fill: "#059669", stroke: '#047857', strokeWidth: 2 }}
          />
        </RechartsLineChart>
      </ChartContainer>
    </div>
  )
}
