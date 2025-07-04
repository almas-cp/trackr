"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Download, ChevronLeft, ChevronRight } from 'lucide-react'

interface Trade {
  id: string
  date: string
  symbol: string
  action: 'buy' | 'sell'
  size: number
  pnl: number
  notes: string
}

const mockTrades: Trade[] = [
  { id: '1', date: '2024-01-15', symbol: 'EURUSD', action: 'buy', size: 0.10, pnl: 125.50, notes: 'Strong bullish momentum' },
  { id: '2', date: '2024-01-14', symbol: 'GBPUSD', action: 'sell', size: 0.05, pnl: -45.20, notes: 'Hit stop loss' },
  { id: '3', date: '2024-01-13', symbol: 'USDJPY', action: 'buy', size: 0.08, pnl: 89.75, notes: 'Breakout confirmed' },
  { id: '4', date: '2024-01-12', symbol: 'AUDUSD', action: 'sell', size: 0.12, pnl: 67.30, notes: 'Resistance rejection' },
  { id: '5', date: '2024-01-11', symbol: 'USDCAD', action: 'buy', size: 0.06, pnl: -23.80, notes: 'False breakout' },
  { id: '6', date: '2024-01-10', symbol: 'EURUSD', action: 'sell', size: 0.15, pnl: 234.60, notes: 'Perfect entry at resistance' },
  { id: '7', date: '2024-01-09', symbol: 'GBPUSD', action: 'buy', size: 0.09, pnl: 156.45, notes: 'Trend continuation' },
  { id: '8', date: '2024-01-08', symbol: 'USDJPY', action: 'sell', size: 0.07, pnl: -78.90, notes: 'Unexpected news impact' },
]

export default function TradeHistory() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const tradesPerPage = 5

  const filteredTrades = mockTrades.filter(trade =>
    trade.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trade.notes.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredTrades.length / tradesPerPage)
  const startIndex = (currentPage - 1) * tradesPerPage
  const endIndex = startIndex + tradesPerPage
  const currentTrades = filteredTrades.slice(startIndex, endIndex)

  const handleExport = () => {
    console.log('Exporting trades...')
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <CardTitle>Trade History</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search trades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            <Button onClick={handleExport} variant="outline" className="w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>P/L</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentTrades.map((trade) => (
                <TableRow key={trade.id}>
                  <TableCell className="font-medium">{trade.date}</TableCell>
                  <TableCell>{trade.symbol}</TableCell>
                  <TableCell>
                    <Badge variant={trade.action === 'buy' ? 'default' : 'secondary'}>
                      {trade.action.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{trade.size}</TableCell>
                  <TableCell>
                    <span className={trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'}>
                      ${trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{trade.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredTrades.length)} of {filteredTrades.length} trades
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}