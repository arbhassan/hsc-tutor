import type React from "react"
import {
  AreaChart as RechartsAreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface ChartProps {
  data: any[]
  index: string
  categories: string[]
  colors: string[]
  valueFormatter?: (value: number) => string
  yAxisWidth?: number
}

const colorMap: Record<string, string> = {
  blue: "#3b82f6",
  green: "#10b981",
  violet: "#8b5cf6",
  amber: "#f59e0b",
  gray: "#6b7280",
  red: "#ef4444",
  indigo: "#6366f1",
  purple: "#a855f7",
  emerald: "#059669",
  orange: "#f97316",
}

const getColor = (colorName: string): string => {
  return colorMap[colorName] || colorName
}

export const AreaChart: React.FC<ChartProps> = ({ 
  data, 
  index, 
  categories, 
  colors, 
  valueFormatter = (value) => value.toString(),
  yAxisWidth = 60 
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No data available
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsAreaChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis 
          dataKey={index} 
          className="text-xs fill-muted-foreground"
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          width={yAxisWidth}
          className="text-xs fill-muted-foreground"
          tick={{ fontSize: 12 }}
          tickFormatter={valueFormatter}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
          }}
          labelStyle={{ color: 'hsl(var(--foreground))' }}
          formatter={(value: any) => [valueFormatter(Number(value)), '']}
        />
        {categories.map((category, idx) => (
          <Area
            key={category}
            type="monotone"
            dataKey={category}
            stackId="1"
            stroke={getColor(colors[idx] || colors[0])}
            fill={getColor(colors[idx] || colors[0])}
            fillOpacity={0.6}
          />
        ))}
      </RechartsAreaChart>
    </ResponsiveContainer>
  )
}

export const BarChart: React.FC<ChartProps> = ({ 
  data, 
  index, 
  categories, 
  colors, 
  valueFormatter = (value) => value.toString(),
  yAxisWidth = 60 
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No data available
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis 
          dataKey={index} 
          className="text-xs fill-muted-foreground"
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          width={yAxisWidth}
          className="text-xs fill-muted-foreground"
          tick={{ fontSize: 12 }}
          tickFormatter={valueFormatter}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
          }}
          labelStyle={{ color: 'hsl(var(--foreground))' }}
          formatter={(value: any) => [valueFormatter(Number(value)), '']}
        />
        {categories.map((category, idx) => (
          <Bar
            key={category}
            dataKey={category}
            fill={getColor(colors[idx] || colors[0])}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}

export const LineChart: React.FC<ChartProps> = ({ 
  data, 
  index, 
  categories, 
  colors, 
  valueFormatter = (value) => value.toString(),
  yAxisWidth = 60 
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No data available
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis 
          dataKey={index} 
          className="text-xs fill-muted-foreground"
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          width={yAxisWidth}
          className="text-xs fill-muted-foreground"
          tick={{ fontSize: 12 }}
          tickFormatter={valueFormatter}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
          }}
          labelStyle={{ color: 'hsl(var(--foreground))' }}
          formatter={(value: any) => [valueFormatter(Number(value)), '']}
        />
        {categories.map((category, idx) => (
          <Line
            key={category}
            type="monotone"
            dataKey={category}
            stroke={getColor(colors[idx] || colors[0])}
            strokeWidth={2}
            dot={{ fill: getColor(colors[idx] || colors[0]), strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}

interface PieChartProps {
  data: any[]
  index: string
  categories?: string[]
  category?: string
  colors: string[]
  valueFormatter?: (value: number) => string
}

export const PieChart: React.FC<PieChartProps> = ({ 
  data, 
  index, 
  categories, 
  category, 
  colors, 
  valueFormatter = (value) => value.toString() 
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No data available
      </div>
    )
  }

  const dataKey = category || categories?.[0] || "value"

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey={dataKey}
        >
          {data.map((entry, idx) => (
            <Cell key={`cell-${idx}`} fill={getColor(colors[idx % colors.length])} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
          }}
          formatter={(value: any) => [valueFormatter(Number(value)), '']}
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}
