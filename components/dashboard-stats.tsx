"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Target, DollarSign, BarChart3 } from 'lucide-react'

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

export default function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Win Rate"
        value="68.4%"
        change="+2.1%"
        trend="up"
        icon={<Target className="h-4 w-4 text-muted-foreground" />}
      />
      <StatCard
        title="Total P/L"
        value="$12,847.32"
        change="+$1,234.50"
        trend="up"
        icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
      />
      <StatCard
        title="Total Trades"
        value="156"
        change="+12"
        trend="up"
        icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
      />
      <StatCard
        title="Avg Profit/Trade"
        value="$82.36"
        change="-$5.23"
        trend="down"
        icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
      />
    </div>
  )
}