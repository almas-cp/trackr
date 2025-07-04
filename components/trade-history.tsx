"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Download, ChevronLeft, ChevronRight, Trash2, Pencil } from 'lucide-react'
import { Trade, deleteTrade, Symbol } from '@/lib/redis-schema'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { TradeEditDialog } from './trade-edit-dialog'

interface TradeHistoryProps {
  trades: Trade[];
  symbols: Symbol[];
}

export default function TradeHistory({ trades, symbols }: TradeHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null)
  const router = useRouter()
  const tradesPerPage = 5

  const filteredTrades = trades.filter(trade =>
    trade.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trade.notes.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredTrades.length / tradesPerPage)
  const startIndex = (currentPage - 1) * tradesPerPage
  const endIndex = startIndex + tradesPerPage
  const currentTrades = filteredTrades.slice(startIndex, endIndex)

  const handleExport = () => {
    // Create CSV content
    const headers = ['Date', 'Symbol', 'Action', 'Size', 'P/L', 'Notes']
    const csvRows = [
      headers.join(','),
      ...filteredTrades.map(trade => [
        trade.date,
        trade.symbol,
        trade.action.toUpperCase(),
        trade.size,
        trade.pnl,
        `"${trade.notes.replace(/"/g, '""')}"`
      ].join(','))
    ]
    
    const csvContent = csvRows.join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    
    // Create download link
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `trades_export_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast.success('Trades exported successfully')
  }
  
  const handleDeleteTrade = async (id: string) => {
    if (confirm('Are you sure you want to delete this trade?')) {
      try {
        await deleteTrade(id)
        toast.success('Trade deleted successfully')
        router.refresh()
      } catch (error) {
        toast.error('Failed to delete trade')
        console.error(error)
      }
    }
  }
  
  const handleEditTrade = (trade: Trade) => {
    setSelectedTrade(trade)
    setIsEditDialogOpen(true)
  }
  
  const closeEditDialog = () => {
    setIsEditDialogOpen(false)
    setSelectedTrade(null)
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-xl">Trade History</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search trades..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleExport} variant="outline" className="flex-shrink-0">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {trades.length > 0 ? (
            <>
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
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentTrades.map((trade) => (
                      <TableRow key={trade.id}>
                        <TableCell className="font-medium">{trade.date}</TableCell>
                        <TableCell>{trade.symbol}</TableCell>
                        <TableCell>
                          <Badge variant={trade.action === 'buy' ? "default" : "destructive"}>
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
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditTrade(trade)}
                              className="h-8 w-8 p-0"
                              title="Edit trade"
                            >
                              <Pencil className="h-4 w-4 text-muted-foreground hover:text-blue-500" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTrade(trade.id)}
                              className="h-8 w-8 p-0"
                              title="Delete trade"
                            >
                              <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-2">
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
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-2">No trades recorded yet.</p>
              <p className="text-sm text-muted-foreground">Use the "Add New Trade" form to record your first trade.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Edit Dialog */}
      <TradeEditDialog 
        isOpen={isEditDialogOpen}
        onClose={closeEditDialog}
        trade={selectedTrade}
        symbols={symbols}
      />
    </>
  )
}