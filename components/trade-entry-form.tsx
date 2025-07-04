"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { PlusCircle, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Symbol, addTrade, addSymbol } from '@/lib/redis-schema'
import { cn } from '@/lib/utils'

interface TradeEntryFormProps {
  symbols: Symbol[];
}

export default function TradeEntryForm({ symbols }: TradeEntryFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAddingSymbol, setIsAddingSymbol] = useState(false)
  const [newSymbol, setNewSymbol] = useState('')
  const [symbolsList, setSymbolsList] = useState<Symbol[]>(symbols)
  const [formData, setFormData] = useState({
    symbol: '',
    lotSize: '',
    action: '',
    profitLoss: '',
    notes: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.symbol || !formData.action || !formData.lotSize) {
      toast.error('Please fill in all required fields')
      return
    }
    
    try {
      setIsSubmitting(true)
      
      const newTrade = await addTrade({
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        symbol: formData.symbol,
        action: formData.action as 'buy' | 'sell',
        size: parseFloat(formData.lotSize),
        pnl: parseFloat(formData.profitLoss) || 0,
        notes: formData.notes
      })
      
      toast.success('Trade added successfully')
      
      // Reset form
      setFormData({
        symbol: '',
        lotSize: '',
        action: '',
        profitLoss: '',
        notes: ''
      })
      
      router.refresh() // Refresh page data
    } catch (error) {
      toast.error('Failed to add trade')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  const setLotSize = (size: string) => {
    setFormData(prev => ({
      ...prev,
      lotSize: size
    }))
  }
  
  const setAction = (action: string) => {
    setFormData(prev => ({
      ...prev,
      action: action
    }))
  }

  const handleAddSymbol = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newSymbol.trim()) return
    
    const symbolName = newSymbol.trim().toUpperCase()
    
    try {
      setIsAddingSymbol(true)
      const result = await addSymbol(symbolName)
      
      if (result) {
        // Update local state
        const updatedSymbols = [...symbolsList, { name: symbolName, trades: 0 }]
        setSymbolsList(updatedSymbols)
        setNewSymbol('')
        setFormData(prev => ({ ...prev, symbol: symbolName })) // Auto-select the new symbol
        toast.success('Symbol added successfully')
      } else {
        toast.error('Symbol already exists')
      }
    } catch (error) {
      toast.error('Failed to add symbol')
      console.error(error)
    } finally {
      setIsAddingSymbol(false)
      router.refresh() // Refresh page data
    }
  }

  return (
    <Card className="sticky top-20 h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlusCircle className="h-5 w-5" />
          Add New Trade
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="symbol">Symbol *</Label>
            
            {/* Symbol Selector */}
            {symbolsList.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {symbolsList.map((symbol) => (
                  <Button
                    key={symbol.name}
                    type="button"
                    size="sm"
                    variant={formData.symbol === symbol.name ? "default" : "outline"}
                    onClick={() => handleInputChange('symbol', symbol.name)}
                    className="flex-grow-0"
                  >
                    {symbol.name}
                  </Button>
                ))}
              </div>
            )}
            
            {/* Add New Symbol */}
            <div className="flex gap-2 mt-1">
              <Input
                placeholder="Add new symbol (e.g., EURUSD)"
                value={newSymbol}
                onChange={(e) => setNewSymbol(e.target.value)}
                className="uppercase"
              />
              <Button 
                type="button" 
                size="sm"
                disabled={!newSymbol.trim() || isAddingSymbol}
                onClick={handleAddSymbol}
              >
                <PlusCircle className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
            
            {symbolsList.length === 0 && !newSymbol && (
              <div className="text-sm text-muted-foreground mt-2">
                No symbols available. Please add a symbol above.
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lotSize">Lot Size *</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              <Button 
                type="button" 
                size="sm" 
                variant={formData.lotSize === "0.005" ? "default" : "outline"}
                onClick={() => setLotSize("0.005")}
              >
                0.005
              </Button>
              <Button 
                type="button" 
                size="sm" 
                variant={formData.lotSize === "0.01" ? "default" : "outline"}
                onClick={() => setLotSize("0.01")}
              >
                0.01
              </Button>
              <Button 
                type="button" 
                size="sm" 
                variant={formData.lotSize === "0.05" ? "default" : "outline"}
                onClick={() => setLotSize("0.05")}
              >
                0.05
              </Button>
              <Button 
                type="button" 
                size="sm" 
                variant={formData.lotSize === "0.1" ? "default" : "outline"}
                onClick={() => setLotSize("0.1")}
              >
                0.1
              </Button>
            </div>
            <Input
              id="lotSize"
              type="number"
              step="0.001"
              placeholder="Custom lot size"
              value={formData.lotSize}
              onChange={(e) => handleInputChange('lotSize', e.target.value)}
              className="mt-2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="action">Action *</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                onClick={() => setAction('buy')}
                className={cn(
                  "w-full h-10 text-white",
                  formData.action === 'buy' ? "bg-green-600 hover:bg-green-700" : "bg-green-600/70 hover:bg-green-600"
                )}
              >
                BUY
              </Button>
              <Button
                type="button"
                onClick={() => setAction('sell')}
                className={cn(
                  "w-full h-10 text-white",
                  formData.action === 'sell' ? "bg-red-600 hover:bg-red-700" : "bg-red-600/70 hover:bg-red-600"
                )}
              >
                SELL
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="profitLoss">Profit/Loss ($)</Label>
            <Input
              id="profitLoss"
              type="number"
              step="0.01"
              placeholder="e.g., 125.50"
              value={formData.profitLoss}
              onChange={(e) => handleInputChange('profitLoss', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Trade notes..."
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={!formData.symbol || !formData.action || !formData.lotSize || isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Trade'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}