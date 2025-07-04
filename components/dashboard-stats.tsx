"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Target, DollarSign, BarChart3 } from 'lucide-react'
import { Trade } from '@/lib/redis-schema'

interface StatCardProps {
  title: string
  value: string
  change?: string
  trend?: 'up' | 'down'
  icon: React.ReactNode
}

function StatCard({ title, value, change, trend, icon }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <div className="flex items-center space-x-1 mt-1">
            {trend === 'up' ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={`text-xs ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
              {change}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface DashboardStatsProps {
  trades: Trade[];
}

export default function DashboardStats({ trades }: DashboardStatsProps) {
  // Calculate stats from trades
  const calculateStats = () => {
    if (trades.length === 0) {
      return {
        winRate: '0.0%',
        totalPL: '$0.00',
        totalTrades: '0',
        avgProfit: '$0.00'
      };
    }
    
    // Total number of trades
    const totalTrades = trades.length;
    
    // Calculate total P/L and win count
    const { totalPL, winCount } = trades.reduce(
      (acc, trade) => ({
        totalPL: acc.totalPL + trade.pnl,
        winCount: trade.pnl > 0 ? acc.winCount + 1 : acc.winCount
      }),
      { totalPL: 0, winCount: 0 }
    );
    
    // Calculate win rate
    const winRate = (winCount / totalTrades) * 100;
    
    // Calculate average profit per trade
    const avgProfit = totalPL / totalTrades;
    
    return {
      winRate: `${winRate.toFixed(1)}%`,
      totalPL: `$${totalPL.toFixed(2)}`,
      totalTrades: `${totalTrades}`,
      avgProfit: `$${avgProfit.toFixed(2)}`
    };
  };
  
  const stats = calculateStats();
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Win Rate"
        value={stats.winRate}
        icon={<Target className="h-4 w-4 text-muted-foreground" />}
      />
      <StatCard
        title="Total P/L"
        value={stats.totalPL}
        trend={parseFloat(stats.totalPL.replace('$', '')) >= 0 ? 'up' : 'down'}
        icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
      />
      <StatCard
        title="Total Trades"
        value={stats.totalTrades}
        icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
      />
      <StatCard
        title="Avg Profit/Trade"
        value={stats.avgProfit}
        trend={parseFloat(stats.avgProfit.replace('$', '')) >= 0 ? 'up' : 'down'}
        icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
      />
    </div>
  )
}