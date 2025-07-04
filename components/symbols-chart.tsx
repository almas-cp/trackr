"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { useTheme } from 'next-themes'
import { Symbol } from '@/lib/redis-schema'

// Color palette for pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#4CAF50', '#F44336', '#9C27B0', '#673AB7', '#3F51B5']

interface SymbolsChartProps {
  symbols: Symbol[];
}

export default function SymbolsChart({ symbols }: SymbolsChartProps) {
  const { theme } = useTheme()
  
  // Prepare chart data
  const chartData = symbols
    .filter(symbol => symbol.trades && symbol.trades > 0)
    .map(symbol => ({
      name: symbol.name,
      value: symbol.trades || 0
    }))
  
  // Calculate total trades
  const totalTrades = chartData.reduce((sum, item) => sum + item.value, 0)
  
  // Calculate percentages for display
  const chartDataWithPercentage = chartData.map(item => ({
    ...item,
    percentage: Math.round((item.value / totalTrades) * 100)
  }))
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Symbols Distribution</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        {chartDataWithPercentage.length > 0 ? (
          <div className="h-[400px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartDataWithPercentage}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                  outerRadius={90}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={2}
                >
                  {chartDataWithPercentage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => {
                    const item = props.payload;
                    return [`${item.percentage}% (${value} trades)`, name];
                  }}
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1f2937' : '#fff',
                    border: `1px solid ${theme === 'dark' ? '#374151' : '#d1d5db'}`,
                    borderRadius: '8px',
                    padding: '8px 12px'
                  }}
                />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[400px] flex items-center justify-center text-center">
            <div>
              <p className="text-muted-foreground mb-2">No trade data available.</p>
              <p className="text-sm text-muted-foreground">Add trades to see symbol distribution.</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}