"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { useTheme } from 'next-themes'

const data = [
  { name: 'EURUSD', value: 35, trades: 42 },
  { name: 'GBPUSD', value: 25, trades: 28 },
  { name: 'USDJPY', value: 20, trades: 31 },
  { name: 'AUDUSD', value: 12, trades: 18 },
  { name: 'USDCAD', value: 8, trades: 12 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function SymbolsChart() {
  const { theme } = useTheme()
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Trading Symbols Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [`${value} trades`, name]}
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#1f2937' : '#fff',
                  border: `1px solid ${theme === 'dark' ? '#374151' : '#d1d5db'}`,
                  borderRadius: '8px'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}