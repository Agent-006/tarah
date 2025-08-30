"use client"

import { Bar, BarChart as RechartsBarChart, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

interface BlogsBarChartProps {
  data: Array<{ name: string; value: number }>
  xKey?: string
  yKey?: string
  title?: string
  className?: string
}

const chartConfig = {
  value: {
    label: "Views",
    color: "#8b5cf6", // Purple for blogs
  },
} satisfies ChartConfig

export default function BlogsBarChart({ 
  data, 
  xKey = "name", 
  yKey = "value", 
  title,
  className 
}: BlogsBarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground">
        No blogs data available
      </div>
    )
  }

  return (
    <div className={className}>
      {title && <h3 className="text-sm font-semibold mb-3 text-purple-900">{title}</h3>}
      <ChartContainer config={chartConfig} className="h-48">
        <RechartsBarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <XAxis 
            dataKey={xKey}
            tick={{ fontSize: 11, fill: '#374151' }}
            tickLine={{ stroke: '#d1d5db' }}
            axisLine={{ stroke: '#d1d5db' }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            tick={{ fontSize: 11, fill: '#374151' }}
            tickLine={{ stroke: '#d1d5db' }}
            axisLine={{ stroke: '#d1d5db' }}
          />
          <ChartTooltip 
            content={<ChartTooltipContent />}
            cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
          />
          <Bar 
            dataKey={yKey} 
            fill="#8b5cf6"
            radius={[4, 4, 0, 0]}
            stroke="#7c3aed"
            strokeWidth={1}
          />
        </RechartsBarChart>
      </ChartContainer>
    </div>
  )
}
