"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useTheme } from 'next-themes'

const data = [
  { date: 'Jan 1', pnl: 0 },
  { date: 'Jan 8', pnl: 432 },
  { date: 'Jan 15', pnl: 1234 },
  { date: 'Jan 22', pnl: 897 },
  { date: 'Jan 29', pnl: 1567 },
  { date: 'Feb 5', pnl: 2134 },
  { date: 'Feb 12', pnl: 1876 },
  { date: 'Feb 19', pnl: 2456 },
  { date: 'Feb 26', pnl: 3234 },
  { date: 'Mar 5', pnl: 2987 },
  { date: 'Mar 12', pnl: 3567 },
  { date: 'Mar 19', pnl: 4123 },
  { date: 'Mar 26', pnl: 3896 },
  { date: 'Apr 2', pnl: 4567 },
  { date: 'Apr 9', pnl: 5234 },
  { date: 'Apr 16', pnl: 4876 },
  { date: 'Apr 23', pnl: 5678 },
  { date: 'Apr 30', pnl: 6234 },
  { date: 'May 7', pnl: 5987 },
  { date: 'May 14', pnl: 6756 },
  { date: 'May 21', pnl: 7234 },
  { date: 'May 28', pnl: 8123 },
  { date: 'Jun 4', pnl: 7896 },
  { date: 'Jun 11', pnl: 8567 },
  { date: 'Jun 18', pnl: 9234 },
  { date: 'Jun 25', pnl: 8976 },
  { date: 'Jul 2', pnl: 9876 },
  { date: 'Jul 9', pnl: 10234 },
  { date: 'Jul 16', pnl: 11567 },
  { date: 'Jul 23', pnl: 12847 },
]

export default function PerformanceChart() {
  const { theme } = useTheme()
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Performance Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: theme === 'dark' ? '#374151' : '#d1d5db' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: theme === 'dark' ? '#374151' : '#d1d5db' }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                formatter={(value) => [`$${value}`, 'P/L']}
                labelStyle={{ 
                  color: theme === 'dark' ? '#fff' : '#000',
                  backgroundColor: theme === 'dark' ? '#1f2937' : '#fff'
                }}
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#1f2937' : '#fff',
                  border: `1px solid ${theme === 'dark' ? '#374151' : '#d1d5db'}`,
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="pnl" 
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}