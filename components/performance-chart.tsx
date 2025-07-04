"use client"

import React, { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useTheme } from 'next-themes'
import { Trade } from '@/lib/redis-schema'

interface PerformanceChartProps {
  trades: Trade[];
}

export default function PerformanceChart({ trades }: PerformanceChartProps) {
  const { theme } = useTheme()
  
  // Process trades to create chart data
  const chartData = useMemo(() => {
    if (!trades.length) return [];
    
    // Sort trades by date (oldest first)
    const sortedTrades = [...trades].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    
    // Calculate cumulative P/L for each trade
    let cumulativePnL = 0;
    
    return sortedTrades.map((trade, index) => {
      cumulativePnL += trade.pnl;
      
      return {
        tradeNumber: index + 1,
        symbol: trade.symbol,
        date: trade.date,
        action: trade.action,
        pnl: Number(cumulativePnL.toFixed(2))
      };
    });
  }, [trades]);

  // If no data, show message
  if (chartData.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Performance Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">No trade data available.</p>
              <p className="text-sm text-muted-foreground">Add trades to see your performance over time.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Performance Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          {/* @ts-ignore recharts typing issue with React 18 */}
          <ResponsiveContainer width="100%" height="100%">
            {/* @ts-ignore recharts typing issue with React 18 */}
            <LineChart data={chartData}>
              {/* @ts-ignore recharts typing issue with React 18 */}
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              {/* @ts-ignore recharts typing issue with React 18 */}
              <XAxis 
                dataKey="tradeNumber"
                label={{ value: 'Trade Number', position: 'insideBottomRight', offset: -5 }}
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: theme === 'dark' ? '#374151' : '#d1d5db' }}
              />
              {/* @ts-ignore recharts typing issue with React 18 */}
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: theme === 'dark' ? '#374151' : '#d1d5db' }}
                tickFormatter={(value) => `$${value}`}
              />
              {/* @ts-ignore recharts typing issue with React 18 */}
              <Tooltip 
                formatter={(value) => [`$${value}`, 'Cumulative P/L']}
                labelFormatter={(label) => `Trade #${label}`}
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#1f2937' : '#fff',
                  border: `1px solid ${theme === 'dark' ? '#374151' : '#d1d5db'}`,
                  borderRadius: '8px',
                  padding: '8px'
                }}
              />
              {/* @ts-ignore recharts typing issue with React 18 */}
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