"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Symbol } from '@/lib/redis-schema'

// Color palette for chart
const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', 
  '#4CAF50', '#F44336', '#9C27B0', '#673AB7', '#3F51B5'
]

interface SymbolsChartProps {
  symbols: Symbol[];
}

export default function SymbolsChart({ symbols }: SymbolsChartProps) {
  // Prepare chart data
  const chartData = symbols
    .filter(symbol => symbol.trades && symbol.trades > 0)
    .sort((a, b) => (b.trades || 0) - (a.trades || 0)) // Sort by most trades first
  
  // Calculate total trades
  const totalTrades = chartData.reduce((sum, item) => sum + (item.trades || 0), 0)
  
  // Calculate percentages
  const chartDataWithPercentage = chartData.map((item, index) => ({
    ...item,
    percentage: Math.round(((item.trades || 0) / totalTrades) * 100),
    color: COLORS[index % COLORS.length]
  }))
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Symbols Distribution</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        {chartDataWithPercentage.length > 0 ? (
          <div className="h-[400px] flex flex-col">
            {/* Bar Chart Implementation */}
            <div className="flex-grow">
              {chartDataWithPercentage.map((item, index) => (
                <div key={item.name} className="flex items-center mb-4">
                  <div className="w-20 font-medium">{item.name}</div>
                  <div className="flex-1 h-8 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
                    <div 
                      className="h-full flex items-center justify-end px-2 text-white text-xs font-bold"
                      style={{ 
                        width: `${item.percentage}%`, 
                        backgroundColor: item.color,
                        minWidth: '24px'
                      }}
                    >
                      {item.percentage}%
                    </div>
                  </div>
                  <div className="ml-2 w-14 text-sm text-muted-foreground">
                    ({item.trades})
                  </div>
                </div>
              ))}
            </div>
            
            {/* Legend */}
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Total: {totalTrades} trades across {chartDataWithPercentage.length} symbols
            </div>
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